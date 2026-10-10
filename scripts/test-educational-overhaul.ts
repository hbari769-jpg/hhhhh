import { detectEducationalIntent, generateEducationalContent, validateEducationalContent } from '../server/educational-generator.js';
import { renderEducationalSheetToPng } from '../server/educational-renderer.js';
import { imageProviderManager } from '../server/image-generator.js';
import { db } from '../server/db.js';

async function runTests() {
  console.log('======================================================');
  console.log('TESTING AESTIFIC EDUCATIONAL PIPELINE OVERHAUL');
  console.log('======================================================');

  const testPrompts = [
    'Create a complete English tense rules sheet with all rules',
    'Make a table of all 12 tenses with formulas and examples',
    'Create a Bengali grammar revision poster',
    'Make a mathematics formula sheet',
    'Create a study infographic with exact supplied text'
  ];

  let passed = 0;
  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    const intent = detectEducationalIntent(prompt);
    console.log(`\nTest Case ${i + 1}: "${prompt}"`);
    console.log(`  -> Detected Educational Intent: ${intent.isEducational}, Topic: ${intent.topic}, Bengali: ${intent.isBengaliRequested}`);

    if (!intent.isEducational) {
      console.error(`  ❌ [FAIL] Educational intent not detected for prompt: "${prompt}"`);
      continue;
    }

    const content = await generateEducationalContent(intent, prompt);
    const validation = validateEducationalContent(content);
    console.log(`  -> Content Title: "${content.title}"`);
    console.log(`  -> Sections Count: ${content.sections.length}`);
    console.log(`  -> Validation Success: ${validation.isValid}, Errors:`, validation.errors);

    if (!validation.isValid) {
      console.error(`  ❌ [FAIL] Validation failed for prompt: "${prompt}"`);
      continue;
    }

    const { buffer, pageCount } = await renderEducationalSheetToPng(content, { aspectRatio: '16:9' });
    console.log(`  -> Rendered PNG Buffer Length: ${buffer.length} bytes, Page Count: ${pageCount}`);

    if (buffer.length < 1000) {
      console.error(`  ❌ [FAIL] Rendered PNG buffer is too small.`);
      continue;
    }

    // Test through imageProviderManager integration
    const testUser = await db.createUser({
      name: 'Edu Test User',
      email: `edutester${Date.now()}@gmail.com`,
      passwordHash: 'hash',
      isEmailVerified: true,
    });

    const genRes = await imageProviderManager.generateImage({
      prompt,
      userId: String(testUser.id),
      aspectRatio: '16:9',
    });

    console.log(`  -> imageProviderManager Provider Name: ${genRes.providerName}`);
    console.log(`  -> Generated Image Buffer Length: ${genRes.result.imageBuffer.length} bytes`);

    if (genRes.result.imageBuffer.length > 1000 && genRes.providerName.includes('Educational')) {
      console.log(`  ✅ [PASS] Test Case ${i + 1} passed successfully!`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] imageProviderManager did not route to Educational Engine.`);
    }
  }

  console.log('\n======================================================');
  console.log(`RESULTS: PASSED ${passed}/${testPrompts.length} EDUCATIONAL TESTS`);
  console.log('======================================================');
  if (passed === testPrompts.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
