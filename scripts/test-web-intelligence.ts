/**
 * Aestific Web Intelligence Decision Verification Suite
 *
 * Comprehensive audit tests verifying that shouldPerformWebSearch() and
 * the Smart Router correctly distinguish between queries requiring live web
 * intelligence vs. stable offline/internal knowledge.
 *
 * Verifies all required categories:
 * 1. Explicit web-search requests
 * 2. Latest/current information
 * 3. Recent news/events
 * 4. Current people/companies
 * 5. Current products/pricing
 * 6. Shopping research
 * 7. Current recommendations
 * 8. Local/current information
 * 9. Financial/market data
 * 10. Travel/schedules
 * 11. Weather
 * 12. Sports
 * 13. Current laws/policies
 * 14. Current software/API documentation
 * 15. Specific URLs/websites/articles/repositories
 * 16. Time-sensitive facts
 *
 * Verifies negative guards (must NOT trigger web search):
 * - Normal conversation
 * - Mathematics
 * - Creative writing
 * - Translation
 * - Rewriting
 * - Stable educational explanations
 * - Basic programming questions
 */

import { shouldPerformWebSearch } from '../server/exa.js';
import { analyzeAndRouteRequest } from '../server/smart-router.js';

// Ensure test environment simulates active search capability
process.env.EXA_API_KEY = process.env.EXA_API_KEY || 'test-exa-key-active';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
  }
}

interface WebTestCase {
  category: string;
  query: string;
  expectedSearch: boolean;
  notes?: string;
}

const positiveCases: WebTestCase[] = [
  // 1. Explicit web-search requests
  {
    category: 'explicit web-search requests',
    query: 'Search the web for recent advances in nuclear fusion power in 2026',
    expectedSearch: true,
  },
  {
    category: 'explicit web-search requests',
    query: 'Google this online and find credible sources: global semiconductor supply',
    expectedSearch: true,
  },
  {
    category: 'explicit web-search requests',
    query: 'অনলাইনে সার্চ করে বলো বাংলাদেশের বর্তমান জিডিপি কত',
    expectedSearch: true,
  },

  // 2. Latest/current information
  {
    category: 'latest/current information',
    query: 'What are the latest updates on the James Webb Space Telescope discoveries?',
    expectedSearch: true,
  },
  {
    category: 'latest/current information',
    query: 'What is happening right now in the Middle East peace negotiations?',
    expectedSearch: true,
  },
  {
    category: 'latest/current information',
    query: 'আজকের সর্বশেষ আপডেট কী?',
    expectedSearch: true,
  },

  // 3. Recent news/events
  {
    category: 'recent news/events',
    query: 'What is the breaking news in Bangladesh today?',
    expectedSearch: true,
  },
  {
    category: 'recent news/events',
    query: 'Major world news headlines from Reuters today',
    expectedSearch: true,
  },
  {
    category: 'recent news/events',
    query: 'আজকের তাজা খবর কি?',
    expectedSearch: true,
  },

  // 4. Current people/companies
  {
    category: 'current people/companies',
    query: 'Who is the current CEO of Microsoft?',
    expectedSearch: true,
  },
  {
    category: 'current people/companies',
    query: 'Latest product announcement from OpenAI this week',
    expectedSearch: true,
  },
  {
    category: 'current people/companies',
    query: 'বর্তমান প্রধান উপদেষ্টার সাম্প্রতিক কার্যক্রম',
    expectedSearch: true,
  },

  // 5. Current products/pricing
  {
    category: 'current products/pricing',
    query: 'When was the iPhone 16 released and what is its current pricing?',
    expectedSearch: true,
  },
  {
    category: 'current products/pricing',
    query: 'Current official pricing and plans of Claude 3.7 Sonnet',
    expectedSearch: true,
  },

  // 6. Shopping research
  {
    category: 'shopping research',
    query: 'Where can I buy the best budget laptop in 2026 under $800?',
    expectedSearch: true,
  },
  {
    category: 'shopping research',
    query: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra current deals and prices',
    expectedSearch: true,
  },

  // 7. Current recommendations
  {
    category: 'current recommendations',
    query: 'What are the top rated restaurants in Gulshan Dhaka open right now?',
    expectedSearch: true,
  },
  {
    category: 'current recommendations',
    query: 'Best software tools for AI video generation in 2026',
    expectedSearch: true,
  },

  // 8. Local/current information
  {
    category: 'local/current information',
    query: 'Are supermarkets near me open today?',
    expectedSearch: true,
  },
  {
    category: 'local/current information',
    query: 'Current traffic conditions in Dhaka city today',
    expectedSearch: true,
  },

  // 9. Financial/market data
  {
    category: 'financial/market data',
    query: 'What is the Bitcoin price today in USD?',
    expectedSearch: true,
  },
  {
    category: 'financial/market data',
    query: 'Current USD to BDT exchange rate and gold price per vori',
    expectedSearch: true,
  },
  {
    category: 'financial/market data',
    query: 'NVIDIA stock price today and market cap',
    expectedSearch: true,
  },

  // 10. Travel/schedules
  {
    category: 'travel/schedules',
    query: 'Flight schedule and status from Dhaka to London Heathrow today',
    expectedSearch: true,
  },
  {
    category: 'travel/schedules',
    query: 'Subway train schedule and delay alerts in NYC right now',
    expectedSearch: true,
  },

  // 11. Weather
  {
    category: 'weather',
    query: 'What is the current weather forecast for Tokyo tomorrow?',
    expectedSearch: true,
  },
  {
    category: 'weather',
    query: 'আজকের ঢাকার তাপমাত্রা ও বৃষ্টির সম্ভাবনা কত?',
    expectedSearch: true,
  },

  // 12. Sports
  {
    category: 'sports',
    query: 'Live cricket score between Bangladesh and Sri Lanka today',
    expectedSearch: true,
  },
  {
    category: 'sports',
    query: 'Champions League match results and current standings',
    expectedSearch: true,
  },

  // 13. Current laws/policies
  {
    category: 'current laws/policies',
    query: 'What are the new tax rules and income slabs in 2026?',
    expectedSearch: true,
  },
  {
    category: 'current laws/policies',
    query: 'New official government circular on student visa requirements',
    expectedSearch: true,
  },

  // 14. Current software/API documentation
  {
    category: 'current software/API documentation',
    query: 'What are the new features in Next.js 15?',
    expectedSearch: true,
  },
  {
    category: 'current software/API documentation',
    query: 'Documentation for Gemini API 2026 supported models and pricing',
    expectedSearch: true,
  },

  // 15. Specific URLs/websites/articles/repositories
  {
    category: 'specific URLs/websites/articles/repositories',
    query: 'Summarize the key findings in this article: https://www.bbc.com/news/technology-681234',
    expectedSearch: true,
  },
  {
    category: 'specific URLs/websites/articles/repositories',
    query: 'Check out the github.com/facebook/react repository and summarize its recent releases',
    expectedSearch: true,
  },
  {
    category: 'specific URLs/websites/articles/repositories',
    query: 'Read the latest announcement on prothomalo.com',
    expectedSearch: true,
  },

  // 16. Time-sensitive facts
  {
    category: 'time-sensitive facts',
    query: 'Who won the recent presidential election in 2026?',
    expectedSearch: true,
  },
  {
    category: 'time-sensitive facts',
    query: 'What was the magnitude and casualties of the earthquake yesterday?',
    expectedSearch: true,
  },
];

const negativeCases: WebTestCase[] = [
  // 1. Normal conversation
  {
    category: 'normal conversation',
    query: 'Hello, how are you today?',
    expectedSearch: false,
  },
  {
    category: 'normal conversation',
    query: 'Good morning! How is your day going?',
    expectedSearch: false,
  },
  {
    category: 'normal conversation',
    query: 'কেমন আছো? তোমার দিন কেমন কাটছে?',
    expectedSearch: false,
  },

  // 2. Mathematics
  {
    category: 'mathematics',
    query: 'Calculate 24 * 15 + 350 / 5',
    expectedSearch: false,
  },
  {
    category: 'mathematics',
    query: 'Find the derivative of f(x) = 3x^3 - 5x^2 + 12',
    expectedSearch: false,
  },
  {
    category: 'mathematics',
    query: 'Prove that sqrt(2) is irrational using a formal proof by contradiction',
    expectedSearch: false,
  },

  // 3. Creative writing
  {
    category: 'creative writing',
    query: 'Write a short poem about a quiet winter evening with falling snow',
    expectedSearch: false,
  },
  {
    category: 'creative writing',
    query: 'Draft a formal cover letter applying for a Senior TypeScript Engineer position',
    expectedSearch: false,
  },
  {
    category: 'creative writing',
    query: 'একটি ছোট রূপকথার গল্প লেখো যেখানে একটি ম্যাজিক পাখি রয়েছে',
    expectedSearch: false,
  },

  // 4. Translation
  {
    category: 'translation',
    query: 'Translate this paragraph into Bengali: Natural language processing has revolutionized communication.',
    expectedSearch: false,
  },
  {
    category: 'translation',
    query: 'Translate "Where is the nearest railway station?" into French',
    expectedSearch: false,
  },

  // 5. Rewriting
  {
    category: 'rewriting',
    query: 'Rewrite this sentence to make it more professional: I need this right now ASAP.',
    expectedSearch: false,
  },
  {
    category: 'rewriting',
    query: 'Paraphrase this paragraph to improve clarity and flow without changing the meaning',
    expectedSearch: false,
  },

  // 6. Stable educational explanations
  {
    category: 'stable educational explanations',
    query: 'Explain the biological process of photosynthesis in green plants',
    expectedSearch: false,
  },
  {
    category: 'stable educational explanations',
    query: 'How does an airplane wing generate aerodynamic lift using Bernoulli principle?',
    expectedSearch: false,
  },
  {
    category: 'stable educational explanations',
    query: 'What is the difference between mitosis and meiosis in cell division?',
    expectedSearch: false,
  },
  {
    category: 'stable educational explanations',
    query: 'মহাকর্ষ বল ও আইনস্টাইনের সাধারণ আপেক্ষিকতা তত্ত্ব ব্যাখ্যা করো',
    expectedSearch: false,
  },

  // 7. Basic programming questions
  {
    category: 'basic programming questions',
    query: 'How to reverse a singly linked list in Python?',
    expectedSearch: false,
  },
  {
    category: 'basic programming questions',
    query: 'Explain the time and space complexity of quicksort and merge sort',
    expectedSearch: false,
  },
  {
    category: 'basic programming questions',
    query: 'Debug this TypeScript error: Cannot read properties of undefined (reading "id")',
    expectedSearch: false,
  },
  {
    category: 'basic programming questions',
    query: 'Write a binary search algorithm in C++ with test cases',
    expectedSearch: false,
  },
];

async function runWebIntelligenceAudit() {
  console.log('====================================================');
  console.log('🌐 AESTIFIC WEB INTELLIGENCE DECISION AUDIT SUITE');
  console.log('====================================================\n');

  console.log('--- PART 1: POSITIVE WEB SEARCH TRIGGERS (16 MANDATORY CATEGORIES) ---');
  for (const tc of positiveCases) {
    const directResult = shouldPerformWebSearch(tc.query);
    const routeResult = analyzeAndRouteRequest(tc.query);

    const matchesDecision = directResult === true;
    const matchesRoute = routeResult.category === 'web_research' && routeResult.requiresWebSearch === true;

    assert(
      matchesDecision && matchesRoute,
      `[${tc.category}] "${tc.query.slice(0, 60)}..." triggers web search`,
      `direct=${directResult}, routeCategory=${routeResult.category}, requiresWebSearch=${routeResult.requiresWebSearch}`
    );
  }

  console.log('\n--- PART 2: STABLE REQUESTS (MUST NOT TRIGGER WEB SEARCH) ---');
  for (const tc of negativeCases) {
    const directResult = shouldPerformWebSearch(tc.query);
    const routeResult = analyzeAndRouteRequest(tc.query);

    const correctlyBypassed = directResult === false;
    const routeBypassed = routeResult.requiresWebSearch === false && routeResult.category !== 'web_research';

    assert(
      correctlyBypassed && routeBypassed,
      `[${tc.category}] "${tc.query.slice(0, 60)}..." does NOT trigger web search`,
      `direct=${directResult}, routeCategory=${routeResult.category}, requiresWebSearch=${routeResult.requiresWebSearch}`
    );
  }

  console.log('\n====================================================');
  console.log(`📊 WEB INTELLIGENCE AUDIT SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    console.log('🎉 ALL WEB INTELLIGENCE DECISION TESTS PASSED WITH 100% ACCURACY!');
    process.exit(0);
  } else {
    console.error(`❌ ${totalTests - passedTests} tests failed.`);
    process.exit(1);
  }
}

runWebIntelligenceAudit().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
