import { analyzeAndRouteRequest } from '../server/smart-router.js';
import { shouldPerformWebSearch } from '../server/exa.js';
import { AVAILABLE_MODELS, GEMINI_MODELS, IMAGE_MODELS, DEFAULT_MODEL_ID, normalizeAndValidateModel } from '../server/models.js';

// Ensure Exa and Groq testability
process.env.EXA_API_KEY = process.env.EXA_API_KEY || 'test-exa-key-active';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'test-groq-key-active';

console.log('Testing Aestific Smart Router intent classification and model mapping...\n');

interface TestCase {
  id: number;
  input: string;
  options?: {
    explicitModelPreference?: string;
  };
  expectedCategory: string;
  expectedModelId: string;
  expectedProvider?: string;
  expectedWebSearch?: boolean;
  expectedImage?: boolean;
}

const testCases: TestCase[] = [
  // TEST 1
  {
    id: 1,
    input: 'Hello, how are you?',
    expectedCategory: 'default_simple',
    expectedModelId: 'gemini-3.1-flash-lite',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 2
  {
    id: 2,
    input: 'কেমন আছো?',
    expectedCategory: 'default_simple',
    expectedModelId: 'gemini-3.1-flash-lite',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 3
  {
    id: 3,
    input: 'Write a Python binary search implementation and explain its complexity.',
    expectedCategory: 'coding_reasoning',
    expectedModelId: 'qwen/qwen3.8-27b',
    expectedProvider: 'groq',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 4
  {
    id: 4,
    input: 'Debug this TypeScript error: Cannot read properties of undefined.',
    expectedCategory: 'coding_reasoning',
    expectedModelId: 'qwen/qwen3.8-27b',
    expectedProvider: 'groq',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 5
  {
    id: 5,
    input: 'Prove that sqrt(2) is irrational using a formal proof by contradiction.',
    expectedCategory: 'hard_reasoning',
    expectedModelId: 'gemini-3.1-pro-preview',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 6
  {
    id: 6,
    input: 'What is the latest stock price of NVIDIA today?',
    expectedCategory: 'web_research',
    expectedModelId: 'gemini-3.1-flash-lite', // Synthesized with Gemini 3.1 Flash-Lite
    expectedProvider: 'exa',
    expectedWebSearch: true,
    expectedImage: false,
  },
  // TEST 7
  {
    id: 7,
    input: 'Draw a futuristic cyberpunk city in neon lights.',
    expectedCategory: 'image_generation',
    expectedModelId: 'gemini-3.1-flash-lite-image',
    expectedProvider: 'image',
    expectedWebSearch: false,
    expectedImage: true,
  },
  // TEST 8
  {
    id: 8,
    input: 'একটি সুন্দর বিড়ালের ছবি আঁকো।',
    expectedCategory: 'image_generation',
    expectedModelId: 'gemini-3.1-flash-lite-image',
    expectedProvider: 'image',
    expectedWebSearch: false,
    expectedImage: true,
  },
  // TEST 9
  {
    id: 9,
    input: 'Write a very long normal essay about climate change.',
    expectedCategory: 'default_simple',
    expectedModelId: 'gemini-3.1-flash-lite',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 10
  {
    id: 10,
    input: 'Explain what a Python function is.',
    expectedCategory: 'default_simple',
    expectedModelId: 'gemini-3.1-flash-lite',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 11
  {
    id: 11,
    input: 'Hello',
    options: { explicitModelPreference: 'qwen/qwen3.8-27b' },
    expectedCategory: 'coding_reasoning',
    expectedModelId: 'qwen/qwen3.8-27b',
    expectedProvider: 'groq',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 12
  {
    id: 12,
    input: 'Hello',
    options: { explicitModelPreference: 'qwen3.8-27b' },
    expectedCategory: 'coding_reasoning',
    expectedModelId: 'qwen/qwen3.8-27b',
    expectedProvider: 'groq',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 13
  {
    id: 13,
    input: 'Tell me a story',
    options: { explicitModelPreference: 'aestific-core' },
    expectedCategory: 'default_simple',
    expectedModelId: 'gemini-3.1-flash-lite',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 14
  {
    id: 14,
    input: 'Solve this riddle',
    options: { explicitModelPreference: 'aestific-ultra' },
    expectedCategory: 'hard_reasoning',
    expectedModelId: 'gemini-3.1-pro-preview',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 15
  {
    id: 15,
    input: 'Explain thermodynamics',
    options: { explicitModelPreference: 'gemini-3.1-pro-preview' },
    expectedCategory: 'hard_reasoning',
    expectedModelId: 'gemini-3.1-pro-preview',
    expectedProvider: 'gemini',
    expectedWebSearch: false,
    expectedImage: false,
  },
  // TEST 16
  {
    id: 16,
    input: 'Review this architecture',
    options: { explicitModelPreference: 'aestific-reason' },
    expectedCategory: 'coding_reasoning',
    expectedModelId: 'qwen/qwen3.8-27b',
    expectedProvider: 'groq',
    expectedWebSearch: false,
    expectedImage: false,
  },
];

let passed = 0;
for (const tc of testCases) {
  const result = analyzeAndRouteRequest(tc.input, tc.options);
  const categoryMatch = result.category === tc.expectedCategory;
  const modelMatch = result.modelId === tc.expectedModelId;
  const providerMatch = tc.expectedProvider ? result.primaryProvider === tc.expectedProvider : true;
  const webMatch = tc.expectedWebSearch !== undefined ? result.requiresWebSearch === tc.expectedWebSearch : true;
  const imgMatch = tc.expectedImage !== undefined ? result.isImageRequest === tc.expectedImage : true;

  if (categoryMatch && modelMatch && providerMatch && webMatch && imgMatch) {
    console.log(`✅ TEST ${tc.id} PASS: "${tc.input}" -> [${result.category}] Model: ${result.modelId} (${result.displayName})`);
    passed++;
  } else {
    console.error(`❌ TEST ${tc.id} FAIL: "${tc.input}"`);
    console.error(`   Expected: category=${tc.expectedCategory}, modelId=${tc.expectedModelId}, provider=${tc.expectedProvider}`);
    console.error(`   Received: category=${result.category}, modelId=${result.modelId}, provider=${result.primaryProvider}`);
  }
}

console.log(`\nSmart Router Intent Test Results: ${passed}/${testCases.length} passed.`);

// Model Registry Consistency Verifications
console.log('\nVerifying Central Model Registry Consistency...');
let registryPassed = 0;
const registryChecks: Array<{ name: string; condition: boolean }> = [
  {
    name: 'GEMINI_MODELS.MAIN matches production default (gemini-3.1-flash-lite)',
    condition: GEMINI_MODELS.MAIN === 'gemini-3.1-flash-lite',
  },
  {
    name: 'GEMINI_MODELS.PRO matches production ultra model (gemini-3.1-pro-preview)',
    condition: GEMINI_MODELS.PRO === 'gemini-3.1-pro-preview',
  },
  {
    name: 'IMAGE_MODELS.DEFAULT matches production image generator (gemini-3.1-flash-lite-image)',
    condition: IMAGE_MODELS.DEFAULT === 'gemini-3.1-flash-lite-image',
  },
  {
    name: 'IMAGE_MODELS.HIGH_QUALITY matches production HQ image generator (gemini-3.1-flash-image)',
    condition: IMAGE_MODELS.HIGH_QUALITY === 'gemini-3.1-flash-image',
  },
  {
    name: 'AVAILABLE_MODELS has aestific-core backed by gemini-3.1-flash-lite',
    condition: AVAILABLE_MODELS.find((m) => m.id === 'aestific-core')?.underlyingModel === 'gemini-3.1-flash-lite',
  },
  {
    name: 'AVAILABLE_MODELS has aestific-reason backed by qwen/qwen3.8-27b',
    condition: AVAILABLE_MODELS.find((m) => m.id === 'aestific-reason')?.underlyingModel === 'qwen/qwen3.8-27b',
  },
  {
    name: 'AVAILABLE_MODELS has aestific-ultra backed by gemini-3.1-pro-preview',
    condition: AVAILABLE_MODELS.find((m) => m.id === 'aestific-ultra')?.underlyingModel === 'gemini-3.1-pro-preview',
  },
  {
    name: 'AVAILABLE_MODELS has aestific-visual backed by gemini-3.1-flash-lite-image',
    condition: AVAILABLE_MODELS.find((m) => m.id === 'aestific-visual')?.underlyingModel === 'gemini-3.1-flash-lite-image',
  },
  {
    name: 'normalizeAndValidateModel resolves "default" to gemini-3.1-flash-lite',
    condition: normalizeAndValidateModel('default') === 'gemini-3.1-flash-lite',
  },
  {
    name: 'normalizeAndValidateModel resolves "aestific-ultra" to gemini-3.1-pro-preview',
    condition: normalizeAndValidateModel('aestific-ultra') === 'gemini-3.1-pro-preview',
  },
  {
    name: 'normalizeAndValidateModel resolves "aestific-reason" to qwen/qwen3.8-27b',
    condition: normalizeAndValidateModel('aestific-reason') === 'qwen/qwen3.8-27b',
  },
];

for (const check of registryChecks) {
  if (check.condition) {
    console.log(`✅ [PASS] ${check.name}`);
    registryPassed++;
  } else {
    console.error(`❌ [FAIL] ${check.name}`);
  }
}

console.log(`\nRegistry Consistency Results: ${registryPassed}/${registryChecks.length} passed.`);

// Web Intelligence Decision Verifications
console.log('\nVerifying Web Intelligence Decision System (shouldPerformWebSearch)...');
let webPassed = 0;
const webTestCases = [
  // Positive Triggers (16 Required Categories)
  { cat: 'explicit web-search requests', q: 'Search the web for recent advances in nuclear fusion power in 2026', expected: true },
  { cat: 'explicit web-search requests', q: 'Google this online: global semiconductor supply', expected: true },
  { cat: 'latest/current information', q: 'What are the latest updates on the James Webb Space Telescope discoveries?', expected: true },
  { cat: 'latest/current information', q: 'What is happening right now in the Middle East peace negotiations?', expected: true },
  { cat: 'recent news/events', q: 'What is the breaking news in Bangladesh today?', expected: true },
  { cat: 'recent news/events', q: 'Major world news headlines from Reuters today', expected: true },
  { cat: 'current people/companies', q: 'Who is the current CEO of Microsoft?', expected: true },
  { cat: 'current people/companies', q: 'Latest product announcement from OpenAI this week', expected: true },
  { cat: 'current products/pricing', q: 'When was the iPhone 16 released and what is its current pricing?', expected: true },
  { cat: 'current products/pricing', q: 'Current official pricing and plans of Claude 3.7 Sonnet', expected: true },
  { cat: 'shopping research', q: 'Where can I buy the best budget laptop in 2026 under $800?', expected: true },
  { cat: 'shopping research', q: 'Compare Sony WH-1000XM5 vs Bose QuietComfort Ultra current deals and prices', expected: true },
  { cat: 'current recommendations', q: 'What are the top rated restaurants in Gulshan Dhaka open right now?', expected: true },
  { cat: 'current recommendations', q: 'Best software tools for AI video generation in 2026', expected: true },
  { cat: 'local/current information', q: 'Are supermarkets near me open today?', expected: true },
  { cat: 'local/current information', q: 'Current traffic conditions in Dhaka city today', expected: true },
  { cat: 'financial/market data', q: 'What is the Bitcoin price today in USD?', expected: true },
  { cat: 'financial/market data', q: 'Current USD to BDT exchange rate and gold price per vori', expected: true },
  { cat: 'travel/schedules', q: 'Flight schedule and status from Dhaka to London Heathrow today', expected: true },
  { cat: 'travel/schedules', q: 'Subway train schedule and delay alerts in NYC right now', expected: true },
  { cat: 'weather', q: 'What is the current weather forecast for Tokyo tomorrow?', expected: true },
  { cat: 'sports', q: 'Live cricket score between Bangladesh and Sri Lanka today', expected: true },
  { cat: 'sports', q: 'Champions League match results and current standings', expected: true },
  { cat: 'current laws/policies', q: 'What are the new tax rules and income slabs in 2026?', expected: true },
  { cat: 'current laws/policies', q: 'New official government circular on student visa requirements', expected: true },
  { cat: 'current software/API documentation', q: 'What are the new features in Next.js 15?', expected: true },
  { cat: 'current software/API documentation', q: 'Documentation for Gemini API 2026 supported models and pricing', expected: true },
  { cat: 'specific URLs/websites/articles/repositories', q: 'Summarize the key findings in this article: https://www.bbc.com/news/technology-681234', expected: true },
  { cat: 'specific URLs/websites/articles/repositories', q: 'Check out the github.com/facebook/react repository and summarize its recent releases', expected: true },
  { cat: 'time-sensitive facts', q: 'Who won the recent presidential election in 2026?', expected: true },
  { cat: 'time-sensitive facts', q: 'What was the magnitude and casualties of the earthquake yesterday?', expected: true },

  // Negative Guards (Stable Offline Queries - Must NOT Search)
  { cat: 'normal conversation', q: 'Hello, how are you today?', expected: false },
  { cat: 'normal conversation', q: 'Good morning! How is your day going?', expected: false },
  { cat: 'mathematics', q: 'Calculate 24 * 15 + 350 / 5', expected: false },
  { cat: 'mathematics', q: 'Find the derivative of f(x) = 3x^3 - 5x^2 + 12', expected: false },
  { cat: 'mathematics', q: 'Prove that sqrt(2) is irrational using a formal proof by contradiction', expected: false },
  { cat: 'creative writing', q: 'Write a short poem about a quiet winter evening with falling snow', expected: false },
  { cat: 'creative writing', q: 'Draft a formal cover letter applying for a Senior TypeScript Engineer position', expected: false },
  { cat: 'translation', q: 'Translate this paragraph into Bengali: Natural language processing has revolutionized communication.', expected: false },
  { cat: 'rewriting', q: 'Rewrite this sentence to make it more professional: I need this right now ASAP.', expected: false },
  { cat: 'stable educational explanations', q: 'Explain the biological process of photosynthesis in green plants', expected: false },
  { cat: 'stable educational explanations', q: 'How does an airplane wing generate aerodynamic lift using Bernoulli principle?', expected: false },
  { cat: 'stable educational explanations', q: 'What is the difference between mitosis and meiosis in cell division?', expected: false },
  { cat: 'basic programming questions', q: 'How to reverse a singly linked list in Python?', expected: false },
  { cat: 'basic programming questions', q: 'Explain the time and space complexity of quicksort and merge sort', expected: false },
  { cat: 'basic programming questions', q: 'Debug this TypeScript error: Cannot read properties of undefined (reading "id")', expected: false },
  { cat: 'basic programming questions', q: 'Write a binary search algorithm in C++ with test cases', expected: false },
];

for (const wt of webTestCases) {
  const result = shouldPerformWebSearch(wt.q);
  const route = analyzeAndRouteRequest(wt.q);
  const ok = result === wt.expected && (wt.expected ? route.requiresWebSearch === true : route.requiresWebSearch === false);
  if (ok) {
    console.log(`✅ [PASS] [${wt.cat}] "${wt.q.slice(0, 50)}..." -> search=${result}`);
    webPassed++;
  } else {
    console.error(`❌ [FAIL] [${wt.cat}] "${wt.q.slice(0, 50)}..." -> expected=${wt.expected}, got=${result}, routeRequires=${route.requiresWebSearch}`);
  }
}

console.log(`\nWeb Intelligence Results: ${webPassed}/${webTestCases.length} passed.`);

if (passed === testCases.length && registryPassed === registryChecks.length && webPassed === webTestCases.length) {
  console.log('🎉 ALL SMART ROUTER, MODEL REGISTRY & WEB INTELLIGENCE TESTS PASSED!');
  process.exit(0);
} else {
  process.exit(1);
}
