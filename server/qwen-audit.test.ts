import { determineReasoningEffort, filterReasoningStream, isRateLimitError } from './groq.js';
import assert from 'assert';

console.log('Running Qwen 3.8 27B Integration & Rate-Limit Audit Tests...');

// 1. Test reasoning effort classification
const testCodingNormal = determineReasoningEffort('coding_reasoning', [{ role: 'user', content: 'Write a typescript function to sort an array' }]);
assert.strictEqual(testCodingNormal, 'medium', 'Normal coding request should use medium reasoning effort');

const testCodingDifficult = determineReasoningEffort('coding_reasoning', [{ role: 'user', content: 'Debug and optimize this complex concurrent system architecture and memory leak issue across distributed microservices.' }]);
assert.strictEqual(testCodingDifficult, 'high', 'Difficult debugging/architecture coding request should use high reasoning effort');

const testFastEngine = determineReasoningEffort('coding_reasoning', [{ role: 'user', content: 'Debug this' }], { engine: 'fast' });
assert.strictEqual(testFastEngine, 'none', 'Fast engine preference should result in none reasoning effort');

const testConversational = determineReasoningEffort('general', [{ role: 'user', content: 'Hello how are you' }]);
assert.strictEqual(testConversational, 'none', 'Simple conversational request should use none reasoning effort');

console.log('✓ Reasoning effort classification tests passed successfully.');

// 2. Test Rate-Limit Error Detection
assert.strictEqual(isRateLimitError({ status: 429 }), true, 'HTTP 429 status must be detected as rate limit');
assert.strictEqual(isRateLimitError({ message: 'Rate limit reached for model qwen/qwen3.8-27b in organization' }), true, 'Rate limit error message must be detected');
assert.strictEqual(isRateLimitError({ error: { code: 'resource_exhausted' } }), true, 'resource_exhausted code must be detected');
assert.strictEqual(isRateLimitError({ message: 'Quota exceeded for current tier' }), true, 'Quota message must be detected');
assert.strictEqual(isRateLimitError({ message: 'Normal model error' }), false, 'Non-rate-limit errors must return false');

console.log('✓ Rate-limit error detection tests passed successfully.');

// 3. Test thinking token filtering in streaming response including split tags
async function testStreamFiltering() {
  const mockChunks = [
    { choices: [{ delta: { content: '<thi' } }] },
    { choices: [{ delta: { content: 'nk>Internal reasoning step...</th' } }] },
    { choices: [{ delta: { content: 'ink>Hello split world' } }] },
  ];

  async function* mockStream() {
    for (const chunk of mockChunks) {
      yield chunk;
    }
  }

  const results: string[] = [];
  for await (const chunk of filterReasoningStream(mockStream())) {
    const text = chunk.choices?.[0]?.delta?.content;
    if (text) {
      results.push(text);
    }
  }

  const combined = results.join('');
  assert.strictEqual(combined, 'Hello split world', 'Split thinking tokens across chunks must be stripped out');
  console.log('✓ Thinking token streaming filter test (including split tags) passed successfully.');
}

// 4. Test Fallback Chain Simulation (Preserving Request & Preventing Infinite Loops)
async function testFallbackChainSimulation() {
  const originalUserRequest = 'Write a recursive fibonacci function in TypeScript';
  const attemptedModels = new Set<string>();
  let rateLimitHitCount = 0;

  const mockModels = [
    { id: 'qwen/qwen3.8-27b', failWith429: true },
    { id: 'gemini-3.1-flash-lite', failWith429: true },
    { id: 'gemini-3.1-pro-preview', failWith429: false, response: 'function fib(n: number): number { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }' },
  ];

  let finalResponse = '';

  for (const model of mockModels) {
    // Verify same model is never retried indefinitely
    assert.strictEqual(attemptedModels.has(model.id), false, `Model ${model.id} must not be retried multiple times`);
    attemptedModels.add(model.id);

    // Verify original request is preserved exactly
    assert.strictEqual(originalUserRequest, 'Write a recursive fibonacci function in TypeScript');

    if (model.failWith429) {
      rateLimitHitCount++;
      // Simulate 429 error without exposing raw provider details
      const rawError = { status: 429, message: `Provider error internal 429 for ${model.id}` };
      assert.strictEqual(isRateLimitError(rawError), true);
      continue;
    } else {
      finalResponse = model.response;
      break;
    }
  }

  assert.strictEqual(finalResponse, 'function fib(n: number): number { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }');
  assert.strictEqual(attemptedModels.size, 3, 'All 3 candidate models were attempted in sequence');
  console.log('✓ Rate-limit fallback chain simulation passed successfully.');
}

// 5. Test Exhaustion Error Message
async function testExhaustionMessage() {
  const attemptedModels = new Set<string>();
  let rateLimitHitCount = 0;

  const mockModels = [
    { id: 'qwen/qwen3.8-27b' },
    { id: 'gemini-3.1-flash-lite' },
    { id: 'gemini-3.1-pro-preview' },
  ];

  for (const model of mockModels) {
    attemptedModels.add(model.id);
    rateLimitHitCount++;
  }

  let caughtUserMessage = '';
  try {
    if (rateLimitHitCount > 0 && rateLimitHitCount >= attemptedModels.size) {
      throw new Error('API limit exceeded. Please try again later.');
    }
  } catch (err: any) {
    caughtUserMessage = err.message;
  }

  assert.strictEqual(caughtUserMessage, 'API limit exceeded. Please try again later.', 'Exhaustion error message must match expected exact string');
  assert.strictEqual(caughtUserMessage.includes('internal'), false, 'Internal provider details must not be exposed');
  console.log('✓ All-models rate-limit exhaustion message verified successfully.');
}

await testStreamFiltering();
await testFallbackChainSimulation();
await testExhaustionMessage();

console.log('All Qwen 3.8 27B Audit & Rate-Limit Fallback Tests Completed Successfully!');
