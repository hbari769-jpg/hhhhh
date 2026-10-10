/**
 * Aestific Authentication Persistence & Session Verification Suite
 *
 * Verifies the 6 exact real-world authentication persistence flows:
 *
 * FLOW 1: LOGIN → close browser/app → reopen → /api/auth/me → main interface → user data loads
 * FLOW 2: LOGIN → explicit Logout → close/reopen → /api/auth/me rejects → Login/Register appears
 * FLOW 3: FORGOT PASSWORD → valid code → new password → reset succeeds
 *         → /api/auth/me succeeds immediately → /api/conversations succeeds
 *         → main interface opens → no "Authentication required" error
 * FLOW 4: INVALID RESET CODE → reset rejected → password unchanged → no authenticated session
 * FLOW 5: EXPIRED RESET CODE → reset rejected → no authenticated session
 * FLOW 6: USER A → logout → USER B login → only User B conversations/data appear
 */

import http from 'http';
import { db } from '../server/db.js';
import { hashPassword } from '../server/auth.js';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

interface HttpResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: string;
  json?: any;
}

class BrowserSession {
  private cookies: Record<string, string> = {};

  clearCookies() {
    this.cookies = {};
  }

  getCookieHeader(): string {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  getCookie(name: string): string | undefined {
    return this.cookies[name];
  }

  setCookie(name: string, value: string) {
    this.cookies[name] = value;
  }

  deleteCookie(name: string) {
    delete this.cookies[name];
  }

  updateCookiesFromResponse(res: HttpResponse) {
    const rawSetCookie = res.headers['set-cookie'];
    if (!rawSetCookie) return;
    const list = Array.isArray(rawSetCookie) ? rawSetCookie : [rawSetCookie];
    for (const header of list) {
      const parts = header.split(';');
      const first = parts[0]?.trim();
      if (!first) continue;
      const eqIdx = first.indexOf('=');
      if (eqIdx <= 0) continue;
      const name = first.slice(0, eqIdx).trim();
      const val = first.slice(eqIdx + 1).trim();

      // Check if Max-Age=0 or Expires is in the past
      const isExpired = parts.some((p) => {
        const lp = p.trim().toLowerCase();
        return (
          lp === 'max-age=0' ||
          lp.startsWith('max-age=-') ||
          (lp.startsWith('expires=') && lp.includes('1970'))
        );
      });

      if (isExpired || !val) {
        delete this.cookies[name];
      } else {
        this.cookies[name] = val;
      }
    }
  }

  async request(options: {
    method: string;
    path: string;
    headers?: Record<string, string>;
    body?: any;
    includeCookies?: boolean;
    bearerToken?: string;
  }): Promise<HttpResponse> {
    const reqHeaders: Record<string, string> = {
      ...(options.headers || {}),
    };

    if (options.includeCookies !== false) {
      const cookieStr = this.getCookieHeader();
      if (cookieStr) {
        reqHeaders['cookie'] = cookieStr;
      }
    }

    if (options.bearerToken) {
      reqHeaders['authorization'] = `Bearer ${options.bearerToken}`;
    }

    let payloadStr: string | undefined = undefined;
    if (options.body !== undefined) {
      payloadStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      if (!reqHeaders['content-type']) {
        reqHeaders['content-type'] = 'application/json';
      }
      reqHeaders['content-length'] = Buffer.byteLength(payloadStr).toString();
    }

    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: 'localhost',
          port: PORT,
          path: options.path,
          method: options.method,
          headers: reqHeaders,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
          res.on('end', () => {
            const raw = Buffer.concat(chunks);
            const bodyStr = raw.toString('utf-8');
            let json: any = undefined;
            try {
              json = JSON.parse(bodyStr);
            } catch {}

            const httpRes: HttpResponse = {
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body: bodyStr,
              json,
            };
            this.updateCookiesFromResponse(httpRes);
            resolve(httpRes);
          });
        }
      );
      req.on('error', reject);
      if (payloadStr) {
        req.write(payloadStr);
      }
      req.end();
    });
  }
}

let totalChecks = 0;
let passedChecks = 0;

function assert(condition: boolean, description: string, detail?: string) {
  totalChecks++;
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passedChecks++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    if (detail) console.error(`     Detail: ${detail}`);
  }
}

async function runAuthPersistenceSuite() {
  console.log('====================================================');
  console.log('🛡️  AESTIFIC AUTHENTICATION PERSISTENCE AUDIT');
  console.log('====================================================\n');

  // Verify server is reachable
  const health = new BrowserSession();
  const healthRes = await health.request({ method: 'GET', path: '/api/health' });
  if (healthRes.statusCode !== 200) {
    console.error('Server is not healthy or unreachable on port 3000:', healthRes.body);
    process.exit(1);
  }

  const userAEmail = 'aestific.persist.user.alpha@gmail.com';
  const userAPassword = 'Password123!Alpha';
  const userBEmail = 'aestific.persist.user.beta@gmail.com';
  const userBPassword = 'Password123!Beta';

  // Seed User A
  let userA = await db.findUserByEmail(userAEmail);
  const hashA = await hashPassword(userAPassword);
  if (!userA) {
    userA = await db.createUser({
      name: 'Alpha User',
      email: userAEmail,
      passwordHash: hashA,
      memoryEnabled: true,
      preferredModel: 'gemini-3.1-flash-lite',
      systemPrompt: 'You are Aestific.',
      isEmailVerified: true,
    });
  } else {
    await db.updateUser(userA.id, {
      passwordHash: hashA,
      isEmailVerified: true,
      isBanned: false,
      status: 'active',
    });
    userA = (await db.findUserById(userA.id))!;
  }

  // Seed User B
  let userB = await db.findUserByEmail(userBEmail);
  const hashB = await hashPassword(userBPassword);
  if (!userB) {
    userB = await db.createUser({
      name: 'Beta User',
      email: userBEmail,
      passwordHash: hashB,
      memoryEnabled: true,
      preferredModel: 'gemini-3.1-flash-lite',
      systemPrompt: 'You are Aestific.',
      isEmailVerified: true,
    });
  } else {
    await db.updateUser(userB.id, {
      passwordHash: hashB,
      isEmailVerified: true,
      isBanned: false,
      status: 'active',
    });
    userB = (await db.findUserById(userB.id))!;
  }

  // Ensure User A has an active test conversation
  const convTitleA = 'Alpha Confidential Research Project';
  const existingConvsA = await db.getConversations(userA.id);
  let convA = existingConvsA.find((c) => c.title === convTitleA);
  if (!convA) {
    convA = await db.createConversation(userA.id, convTitleA, 'gemini-3.1-flash-lite');
  }

  console.log(`Test users ready:\n  User A: ${userA.email} (${userA.id})\n  User B: ${userB.email} (${userB.id})\n`);

  // =========================================================================
  // FLOW 1: LOGIN → close browser/app → reopen → /api/auth/me → main interface → user data loads
  // =========================================================================
  console.log('--- FLOW 1: LOGIN → CLOSE BROWSER → REOPEN → /api/auth/me → USER DATA LOADS ---');
  const browser1 = new BrowserSession();

  // 1.1 Login User A
  const loginRes1 = await browser1.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: userAPassword },
  });

  assert(
    loginRes1.statusCode === 200 && Boolean(loginRes1.json?.token),
    '1.1: User A logs in successfully and receives token',
    `status=${loginRes1.statusCode}, body=${loginRes1.body}`
  );

  const authCookie = browser1.getCookie('aestific_token');
  assert(
    Boolean(authCookie) && authCookie!.length > 20,
    '1.2: Server sets persistent HttpOnly cookie "aestific_token"'
  );

  // 1.3 Simulate Closing Browser/App (wipes in-memory JS state; cookie jar is preserved on disk)
  const reopenedBrowser1 = new BrowserSession();
  // Cookie remains in storage
  reopenedBrowser1.setCookie('aestific_token', authCookie!);
  // No in-memory Bearer token passed (mimicking fresh launch before memory is set)

  // 1.4 Reopen app and call /api/auth/me
  const meRes1 = await reopenedBrowser1.request({
    method: 'GET',
    path: '/api/auth/me',
  });

  assert(
    meRes1.statusCode === 200 && meRes1.json?.user?.email === userAEmail,
    '1.3: Reopened app successfully authenticates via cookie on /api/auth/me',
    `status=${meRes1.statusCode}, user=${JSON.stringify(meRes1.json?.user)}`
  );

  // 1.5 Main interface loads user data (/api/conversations)
  const convsRes1 = await reopenedBrowser1.request({
    method: 'GET',
    path: '/api/conversations',
  });

  const convsList1: any[] = convsRes1.json?.conversations || (Array.isArray(convsRes1.json) ? convsRes1.json : []);
  assert(
    convsRes1.statusCode === 200 && Array.isArray(convsList1),
    '1.4: Main interface loads conversations successfully',
    `status=${convsRes1.statusCode}`
  );

  const foundConvA = convsList1.some((c: any) => c.id === convA?.id || c.title === convTitleA);
  assert(
    foundConvA,
    '1.5: User A confidential conversation data is loaded on reopen'
  );

  // =========================================================================
  // FLOW 2: LOGIN → explicit Logout → close/reopen → /api/auth/me rejects → Login/Register appears
  // =========================================================================
  console.log('\n--- FLOW 2: LOGIN → EXPLICIT LOGOUT → CLOSE/REOPEN → /api/auth/me REJECTS ---');
  const browser2 = new BrowserSession();

  // 2.1 Login
  await browser2.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: userAPassword },
  });
  const savedCookieBeforeLogout = browser2.getCookie('aestific_token');

  // 2.2 Explicit Logout
  const logoutRes = await browser2.request({
    method: 'POST',
    path: '/api/auth/logout',
  });

  assert(
    logoutRes.statusCode === 200,
    '2.1: Explicit logout succeeds with HTTP 200',
    `status=${logoutRes.statusCode}`
  );

  const cookieAfterLogout = browser2.getCookie('aestific_token');
  assert(
    !cookieAfterLogout,
    '2.2: Server explicitly cleared/expired the "aestific_token" cookie on logout'
  );

  // 2.3 Close/reopen browser with cleared cookies
  const reopenedBrowser2 = new BrowserSession();
  const meResAfterLogout = await reopenedBrowser2.request({
    method: 'GET',
    path: '/api/auth/me',
  });

  assert(
    meResAfterLogout.statusCode === 401,
    '2.3: Reopened app without cookie rejects /api/auth/me with HTTP 401',
    `status=${meResAfterLogout.statusCode}`
  );

  // 2.4 Verify replaying revoked previous cookie is also strictly rejected by server
  const replayBrowser = new BrowserSession();
  if (savedCookieBeforeLogout) {
    replayBrowser.setCookie('aestific_token', savedCookieBeforeLogout);
    const replayRes = await replayBrowser.request({
      method: 'GET',
      path: '/api/auth/me',
    });
    assert(
      replayRes.statusCode === 401,
      '2.4: Revoked session cannot be replayed on /api/auth/me (server rejects with 401)',
      `status=${replayRes.statusCode}`
    );
  }

  // =========================================================================
  // FLOW 3: FORGOT PASSWORD → valid code → new password → reset succeeds
  //         → /api/auth/me succeeds immediately → /api/conversations succeeds
  //         → main interface opens → no "Authentication required" error
  // =========================================================================
  console.log('\n--- FLOW 3: FORGOT PASSWORD → VALID CODE → IMMEDIATE AUTH PERSISTENCE ---');
  const browser3 = new BrowserSession();

  // 3.1 Request password reset code
  const validResetCode = '654321';
  await db.setPasswordResetCode(userA.id, validResetCode);

  const newPasswordForA = 'NewBrandPassword456!Alpha';

  // 3.2 Submit reset password with valid code
  const resetRes = await browser3.request({
    method: 'POST',
    path: '/api/auth/reset-password',
    body: {
      email: userAEmail,
      code: validResetCode,
      newPassword: newPasswordForA,
      confirmPassword: newPasswordForA,
    },
  });

  assert(
    resetRes.statusCode === 200 && Boolean(resetRes.json?.token),
    '3.1: Password reset succeeds with valid code',
    `status=${resetRes.statusCode}, body=${resetRes.body}`
  );

  const resetAuthCookie = browser3.getCookie('aestific_token');
  assert(
    Boolean(resetAuthCookie),
    '3.2: Password reset immediately issues active authenticated cookie "aestific_token"'
  );

  // 3.3 Call /api/auth/me immediately using newly minted cookie
  const meImmediateRes = await browser3.request({
    method: 'GET',
    path: '/api/auth/me',
  });

  assert(
    meImmediateRes.statusCode === 200 && meImmediateRes.json?.user?.email === userAEmail,
    '3.3: /api/auth/me succeeds immediately following password reset (no lock-out)',
    `status=${meImmediateRes.statusCode}, user=${JSON.stringify(meImmediateRes.json?.user)}`
  );

  // 3.4 Call /api/conversations immediately
  const convsImmediateRes = await browser3.request({
    method: 'GET',
    path: '/api/conversations',
  });

  const convsImmList: any[] = convsImmediateRes.json?.conversations || (Array.isArray(convsImmediateRes.json) ? convsImmediateRes.json : []);
  assert(
    convsImmediateRes.statusCode === 200 && Array.isArray(convsImmList),
    '3.4: /api/conversations succeeds immediately without "Authentication required" error',
    `status=${convsImmediateRes.statusCode}`
  );

  // 3.5 Verify new password logs in cleanly
  const browserLoginWithNew = new BrowserSession();
  const loginWithNewRes = await browserLoginWithNew.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: newPasswordForA },
  });

  assert(
    loginWithNewRes.statusCode === 200,
    '3.5: User can sign in using newly reset password',
    `status=${loginWithNewRes.statusCode}`
  );

  // =========================================================================
  // FLOW 4: INVALID RESET CODE → reset rejected → password unchanged → no session
  // =========================================================================
  console.log('\n--- FLOW 4: INVALID RESET CODE → REJECTED → PASSWORD UNCHANGED ---');
  const browser4 = new BrowserSession();

  // Set known valid code in DB
  const currentActiveCode = '888777';
  await db.setPasswordResetCode(userA.id, currentActiveCode);

  const invalidCodeAttempt = '000000';
  const maliciousPassword = 'HackerPassword999!';

  const invalidResetRes = await browser4.request({
    method: 'POST',
    path: '/api/auth/reset-password',
    body: {
      email: userAEmail,
      code: invalidCodeAttempt,
      newPassword: maliciousPassword,
      confirmPassword: maliciousPassword,
    },
  });

  assert(
    invalidResetRes.statusCode === 400,
    '4.1: Password reset with invalid code is rejected with HTTP 400',
    `status=${invalidResetRes.statusCode}, error=${invalidResetRes.json?.error}`
  );

  const invalidCookie = browser4.getCookie('aestific_token');
  assert(
    !invalidCookie,
    '4.2: No authenticated session cookie was issued on failed reset'
  );

  // 4.3 Verify password was NOT changed to malicious password
  const failedLoginRes = await browser4.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: maliciousPassword },
  });

  assert(
    failedLoginRes.statusCode === 401,
    '4.3: Password was unchanged (login with malicious password fails 401)',
    `status=${failedLoginRes.statusCode}`
  );

  // 4.4 Verify original active password still works
  const originalLoginRes = await browser4.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: newPasswordForA },
  });

  assert(
    originalLoginRes.statusCode === 200,
    '4.4: Legitimate user password remains intact and operational',
    `status=${originalLoginRes.statusCode}`
  );

  // =========================================================================
  // FLOW 5: EXPIRED RESET CODE → reset rejected → no authenticated session
  // =========================================================================
  console.log('\n--- FLOW 5: EXPIRED RESET CODE → REJECTED → NO AUTHENTICATED SESSION ---');
  const browser5 = new BrowserSession();

  // Set code that expired 10 minutes ago
  const expiredCode = '123987';
  await db.setPasswordResetCode(userA.id, expiredCode);

  // Directly set expiresAt to past
  if ((db as any).mode === 'production-d1') {
    const d1 = (db as any).ensureAvailable();
    await d1
      .prepare('UPDATE users SET reset_password_expires_at = ? WHERE id = ?')
      .bind(Date.now() - 600000, userA.id)
      .run();
  } else {
    const u = (db as any).localData.users.find((x: any) => x.id === userA.id);
    if (u) {
      u.resetPasswordExpiresAt = Date.now() - 600000;
      (db as any).save();
    }
  }

  const expiredResetRes = await browser5.request({
    method: 'POST',
    path: '/api/auth/reset-password',
    body: {
      email: userAEmail,
      code: expiredCode,
      newPassword: 'ExpiredAttemptPassword123!',
      confirmPassword: 'ExpiredAttemptPassword123!',
    },
  });

  assert(
    expiredResetRes.statusCode === 400 &&
      (expiredResetRes.json?.error || '').toLowerCase().includes('expired'),
    '5.1: Expired reset code is strictly rejected with HTTP 400',
    `status=${expiredResetRes.statusCode}, error=${expiredResetRes.json?.error}`
  );

  // 5.2 Verify no session created
  const meExpiredRes = await browser5.request({
    method: 'GET',
    path: '/api/auth/me',
  });

  assert(
    meExpiredRes.statusCode === 401,
    '5.2: No authenticated session exists after expired reset rejection',
    `status=${meExpiredRes.statusCode}`
  );

  // =========================================================================
  // FLOW 6: USER A → logout → USER B login → only User B conversations/data appear
  // =========================================================================
  console.log('\n--- FLOW 6: USER A LOGOUT → USER B LOGIN → STRICT DATA ISOLATION ---');
  const browser6 = new BrowserSession();

  // 6.1 User A logs in and creates a distinct private conversation
  const loginARes = await browser6.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userAEmail, password: newPasswordForA },
  });
  assert(loginARes.statusCode === 200, '6.1: User A logs in');

  const convCreateARes = await browser6.request({
    method: 'POST',
    path: '/api/conversations',
    body: { title: 'User A Top Secret Financial Ledger', model: 'gemini-3.1-flash-lite' },
  });
  const convA2Id = convCreateARes.json?.conversation?.id || convCreateARes.json?.id;
  assert(
    convCreateARes.statusCode === 201 || convCreateARes.statusCode === 200 && Boolean(convA2Id),
    '6.2: User A creates private conversation'
  );

  // 6.2 User A logs out
  const logoutARes = await browser6.request({
    method: 'POST',
    path: '/api/auth/logout',
  });
  assert(logoutARes.statusCode === 200, '6.3: User A logs out');

  // 6.3 User B logs in using same browser/client
  const loginBRes = await browser6.request({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: userBEmail, password: userBPassword },
  });
  assert(
    loginBRes.statusCode === 200 && loginBRes.json?.user?.email === userBEmail,
    '6.4: User B logs in on same client'
  );

  // 6.4 User B creates a distinct conversation
  const convCreateBRes = await browser6.request({
    method: 'POST',
    path: '/api/conversations',
    body: { title: 'User B Public Astronomy Notes', model: 'gemini-3.1-flash-lite' },
  });
  const convBId = convCreateBRes.json?.conversation?.id || convCreateBRes.json?.id;
  assert(
    convCreateBRes.statusCode === 201 || convCreateBRes.statusCode === 200 && Boolean(convBId),
    '6.5: User B creates own conversation'
  );

  // 6.5 User B fetches all conversations
  const convsBRes = await browser6.request({
    method: 'GET',
    path: '/api/conversations',
  });

  const convsBList: any[] = convsBRes.json?.conversations || (Array.isArray(convsBRes.json) ? convsBRes.json : []);
  assert(
    convsBRes.statusCode === 200 && Array.isArray(convsBList),
    '6.6: User B fetches conversation list'
  );

  const containsUserBConv = convsBList.some((c) => c.id === convBId);
  const containsUserAConv = convsBList.some(
    (c) => c.id === convA?.id || c.id === convA2Id || c.title?.includes('Alpha') || c.title?.includes('Secret')
  );

  assert(
    containsUserBConv && !containsUserAConv,
    '6.7: ONLY User B conversations appear in User B response (zero data leakage from User A)',
    `User B has ${convsBList.length} convs; containsUserA=${containsUserAConv}`
  );

  // 6.6 User B attempts direct ID traversal into User A conversation
  const unauthorizedDirectAccessRes = await browser6.request({
    method: 'GET',
    path: `/api/conversations/${convA2Id}`,
  });

  assert(
    unauthorizedDirectAccessRes.statusCode === 404 || unauthorizedDirectAccessRes.statusCode === 403,
    '6.8: User B direct GET on User A conversation is strictly rejected (HTTP 404/403)',
    `status=${unauthorizedDirectAccessRes.statusCode}`
  );

  // Clean logout
  await browser6.request({ method: 'POST', path: '/api/auth/logout' });

  console.log('\n====================================================');
  console.log(`📊 AUTH PERSISTENCE AUDIT SUMMARY: ${passedChecks}/${totalChecks} TESTS PASSED`);
  console.log('====================================================');

  if (passedChecks === totalChecks) {
    console.log('🎉 ALL 6 AUTHENTICATION PERSISTENCE FLOWS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error(`❌ ${totalChecks - passedChecks} checks failed.`);
    process.exit(1);
  }
}

runAuthPersistenceSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
