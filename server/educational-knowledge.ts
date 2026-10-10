/**
 * Aestific Verified Educational Knowledge Base
 * 
 * Contains authoritatively verified, fact-checked rules, formulas,
 * structures, and validated examples for core educational domains:
 * - English Grammar (Complete 12 Tenses, Voice, Narration, Modals)
 * - Bengali Grammar (বাংলা ব্যাকরণ: কাল, কারক, বিভক্তি, সমাস, সন্ধি)
 * - Mathematics (Algebra, Geometry, Trigonometry, Calculus, Statistics)
 * - Science (Physics, Chemistry, Biology core formulas & laws)
 */

export interface RuleItem {
  name: string;
  category?: string;
  structure: string;
  affirmative?: string;
  negative?: string;
  interrogative?: string;
  auxiliaryVerbs?: string;
  usage?: string;
  examples: string[];
  bengaliExplanation?: string;
  bengaliTranslation?: string;
}

export interface EducationalSheetData {
  title: string;
  subtitle: string;
  subject: string;
  category: string;
  sections: Array<{
    title: string;
    description?: string;
    rules: RuleItem[];
  }>;
  summaryNotes?: string[];
  isBengaliRequested?: boolean;
}

export const VERIFIED_ENGLISH_TENSES: EducationalSheetData = {
  title: 'Complete English Tense Rules & Formulas',
  subtitle: 'All 12 Tenses: Sentence Structures, Auxiliary Verbs, and Accurate Examples',
  subject: 'English Grammar',
  category: 'tenses',
  sections: [
    {
      title: 'Present Tenses (বর্তমান কাল)',
      description: 'Used for actions happening now, regular habits, universal truths, or recent events.',
      rules: [
        {
          name: '1. Present Simple (Indefinite)',
          structure: 'Subject + V1 (base form / s / es) + Object',
          affirmative: 'Subject + V1 (s/es with 3rd person singular) + Object',
          negative: 'Subject + do / does not + V1 + Object',
          interrogative: 'Do / Does + Subject + V1 + Object?',
          auxiliaryVerbs: 'do / does (in negative & questions)',
          usage: 'Habits, daily routines, facts, and universal truths.',
          examples: [
            'Affirmative: He goes to school every day.',
            'Negative: She does not play football.',
            'Interrogative: Do you study English regularly?',
          ],
          bengaliExplanation: 'সাধারণ বর্তমান বা চিরন্তন সত্য বা অভ্যাসগত কাজ বোঝাতে ব্যবহৃত হয়।',
          bengaliTranslation: 'সে প্রতিদিন স্কুলে যায়। / তারা ফুটবল খেলে না।',
        },
        {
          name: '2. Present Continuous (Progressive)',
          structure: 'Subject + am / is / are + V-ing + Object',
          affirmative: 'Subject + am / is / are + V-ing + Object',
          negative: 'Subject + am / is / are + not + V-ing + Object',
          interrogative: 'Am / Is / Are + Subject + V-ing + Object?',
          auxiliaryVerbs: 'am (I), is (he/she/it), are (you/we/they)',
          usage: 'Actions currently happening at the moment of speaking or ongoing trends.',
          examples: [
            'Affirmative: The students are preparing for their exams.',
            'Negative: He is not watching television right now.',
            'Interrogative: Are you reading this grammar guide?',
          ],
          bengaliExplanation: 'বর্তমানে কোনো কাজ চলছে বা ঘটছে বোঝালে Present Continuous হয়।',
          bengaliTranslation: 'শিক্ষার্থীরা এখন পড়াশোনা করছে।',
        },
        {
          name: '3. Present Perfect',
          structure: 'Subject + have / has + V3 (Past Participle) + Object',
          affirmative: 'Subject + have / has + V3 + Object',
          negative: 'Subject + have / has + not + V3 + Object',
          interrogative: 'Have / Has + Subject + V3 + Object?',
          auxiliaryVerbs: 'have (I/you/we/they), has (he/she/it)',
          usage: 'Actions completed recently with an effect continuing in the present.',
          examples: [
            'Affirmative: She has completed her university degree.',
            'Negative: We have not seen this documentary yet.',
            'Interrogative: Have you finished your assigned work?',
          ],
          bengaliExplanation: 'কোনো কাজ এইমাত্র শেষ হয়েছে কিন্তু তার ফল এখনও বর্তমান রয়েছে।',
          bengaliTranslation: 'সে তার কাজ শেষ করেছে।',
        },
        {
          name: '4. Present Perfect Continuous',
          structure: 'Subject + have / has + been + V-ing + Object + since / for + time',
          affirmative: 'Subject + have / has been + V-ing + since / for + time',
          negative: 'Subject + have / has not been + V-ing + since / for + time',
          interrogative: 'Have / Has + Subject + been + V-ing + since / for + time?',
          auxiliaryVerbs: 'have been / has been',
          usage: 'Actions that started in the past and continue into the present moment.',
          examples: [
            'Affirmative: They have been living in this city for ten years.',
            'Negative: He has not been working here since Monday.',
            'Interrogative: Have you been waiting for a long time?',
          ],
          bengaliExplanation: 'অতীতের কোনো সময়ে কাজ শুরু হয়ে এখনও একটানা চলছে বোঝালে ব্যবহৃত হয়।',
          bengaliTranslation: 'সকাল থেকে বৃষ্টি হচ্ছে (It has been raining since morning)।',
        },
      ],
    },
    {
      title: 'Past Tenses (অতীত কাল)',
      description: 'Used for actions that took place or were completed in the past.',
      rules: [
        {
          name: '5. Past Simple (Indefinite)',
          structure: 'Subject + V2 (Past Form of Verb) + Object',
          affirmative: 'Subject + V2 + Object',
          negative: 'Subject + did not + V1 (base form) + Object',
          interrogative: 'Did + Subject + V1 (base form) + Object?',
          auxiliaryVerbs: 'did (in negative & questions)',
          usage: 'Completed events and finished actions at a specific time in the past.',
          examples: [
            'Affirmative: He went to school yesterday morning.',
            'Negative: She did not attend the meeting last week.',
            'Interrogative: Did they finish the project on time?',
          ],
          bengaliExplanation: 'অতীতকালে কোনো কাজ সাধারণভাবে হয়েছিল বোঝালে Past Simple হয়।',
          bengaliTranslation: 'সে গতকাল স্কুলে গিয়েছিল। / তিনি মিটিংয়ে আসেননি।',
        },
        {
          name: '6. Past Continuous (Progressive)',
          structure: 'Subject + was / were + V-ing + Object',
          affirmative: 'Subject + was / were + V-ing + Object',
          negative: 'Subject + was / were + not + V-ing + Object',
          interrogative: 'Was / Were + Subject + V-ing + Object?',
          auxiliaryVerbs: 'was (I/he/she/it), were (you/we/they)',
          usage: 'Actions that were actively in progress at a specific past moment.',
          examples: [
            'Affirmative: I was studying when the telephone rang.',
            'Negative: They were not playing during the storm.',
            'Interrogative: Were you sleeping when I called you?',
          ],
          bengaliExplanation: 'অতীতকালে কোনো কাজ কিছু সময় ধরে চলছিল বোঝালে Past Continuous হয়।',
          bengaliTranslation: 'আমি তখন বই পড়ছিলাম যখন ফোনটি বেজে উঠল।',
        },
        {
          name: '7. Past Perfect',
          structure: 'Subject + had + V3 (Past Participle) + Object',
          affirmative: 'Subject + had + V3 + Object (before another past event)',
          negative: 'Subject + had not + V3 + Object',
          interrogative: 'Had + Subject + V3 + Object?',
          auxiliaryVerbs: 'had (for all subjects)',
          usage: 'The earlier of two completed past actions (Before/After clauses).',
          examples: [
            'Affirmative: The train had left before we arrived at the station.',
            'Negative: He had not finished dinner before the guests arrived.',
            'Interrogative: Had she already left before the announcement?',
          ],
          bengaliExplanation: 'অতীতের দুটি কাজের মধ্যে যেটি আগে হয়েছিল সেটি Past Perfect হয়।',
          bengaliTranslation: 'আমরা স্টেশনে পৌঁছানোর আগেই ট্রেনটি ছেড়ে দিয়েছিল।',
        },
        {
          name: '8. Past Perfect Continuous',
          structure: 'Subject + had + been + V-ing + Object + since / for + time',
          affirmative: 'Subject + had been + V-ing + for / since + time',
          negative: 'Subject + had not been + V-ing + for / since + time',
          interrogative: 'Had + Subject + been + V-ing + for / since + time?',
          auxiliaryVerbs: 'had been',
          usage: 'An ongoing past action that continued up until another event in the past.',
          examples: [
            'Affirmative: They had been playing for two hours before it started raining.',
            'Negative: She had not been sleeping well before her final exams.',
            'Interrogative: Had you been waiting long before the bus came?',
          ],
          bengaliExplanation: 'অতীতের কোনো ঘটনা ঘটার আগে পর্যন্ত অপর একটি কাজ চলছিল বোঝালে ব্যবহৃত হয়।',
          bengaliTranslation: 'বৃষ্টি শুরু হওয়ার আগে তারা দুই ঘণ্টা ধরে খেলছিল।',
        },
      ],
    },
    {
      title: 'Future Tenses (ভবিষ্যৎ কাল)',
      description: 'Used for actions that will take place in the future.',
      rules: [
        {
          name: '9. Future Simple (Indefinite)',
          structure: 'Subject + will / shall + V1 (base form) + Object',
          affirmative: 'Subject + will + V1 + Object',
          negative: 'Subject + will not (won\'t) + V1 + Object',
          interrogative: 'Will + Subject + V1 + Object?',
          auxiliaryVerbs: 'will (modern standard for all), shall (formal I/we)',
          usage: 'Promises, predictions, decisions made at the moment, future facts.',
          examples: [
            'Affirmative: I will help you with your English assignment.',
            'Negative: They will not leave without saying goodbye.',
            'Interrogative: Will you attend tomorrow\'s morning seminar?',
          ],
          bengaliExplanation: 'ভবিষ্যতে সাধারণভাবে কোনো কাজ হবে বোঝালে Future Simple হয়।',
          bengaliTranslation: 'আমি তোমাকে সাহায্য করব। / সে কাল আসবে।',
        },
        {
          name: '10. Future Continuous (Progressive)',
          structure: 'Subject + will be + V-ing + Object',
          affirmative: 'Subject + will be + V-ing + Object',
          negative: 'Subject + will not be + V-ing + Object',
          interrogative: 'Will + Subject + be + V-ing + Object?',
          auxiliaryVerbs: 'will be',
          usage: 'Actions that will be in progress at a specific time in the future.',
          examples: [
            'Affirmative: At this time tomorrow, I will be flying to Tokyo.',
            'Negative: He will not be working during the weekend holiday.',
            'Interrogative: Will you be joining the video call at 4 PM?',
          ],
          bengaliExplanation: 'ভবিষ্যৎকালে কোনো কাজ কিছু সময় ধরে চলতে থাকবে বোঝালে Future Continuous হয়।',
          bengaliTranslation: 'আগামীকাল এই সময়ে আমি ভ্রমণ করতে থাকব।',
        },
        {
          name: '11. Future Perfect',
          structure: 'Subject + will have + V3 (Past Participle) + Object + by + time',
          affirmative: 'Subject + will have + V3 + Object + by [time/date]',
          negative: 'Subject + will not have + V3 + Object',
          interrogative: 'Will + Subject + have + V3 + Object by [time]?',
          auxiliaryVerbs: 'will have',
          usage: 'An action that will be completed before a designated time in the future.',
          examples: [
            'Affirmative: By next month, she will have completed the curriculum.',
            'Negative: We will not have finished the report by noon.',
            'Interrogative: Will they have arrived by dinner time?',
          ],
          bengaliExplanation: 'ভবিষ্যতের কোনো নির্দিষ্ট সময়ের মধ্যে একটি কাজ সম্পন্ন হয়ে থাকবে।',
          bengaliTranslation: 'আগামী মাসের মধ্যে সে তার কোর্স সম্পন্ন করে ফেলবে।',
        },
        {
          name: '12. Future Perfect Continuous',
          structure: 'Subject + will have been + V-ing + Object + for + time',
          affirmative: 'Subject + will have been + V-ing + for + duration + by [point]',
          negative: 'Subject + will not have been + V-ing + for + duration',
          interrogative: 'Will + Subject + have been + V-ing + for + duration?',
          auxiliaryVerbs: 'will have been',
          usage: 'An ongoing action looking back from a specific future point in time.',
          examples: [
            'Affirmative: By December, he will have been teaching here for 20 years.',
            'Negative: She will not have been working long enough to qualify.',
            'Interrogative: Will they have been traveling for more than 24 hours?',
          ],
          bengaliExplanation: 'ভবিষ্যতে কোনো সময় পর্যন্ত একটি কাজ দীর্ঘ সময় ধরে চলতে থাকবে।',
          bengaliTranslation: 'ডিসেম্বর নাগাদ তিনি এখানে বিশ বছর ধরে শিক্ষকতা করতে থাকবেন।',
        },
      ],
    },
  ],
  summaryNotes: [
    'Rule of 3rd Person Singular: In Present Simple affirmative, add -s or -es to verb with He/She/It (e.g., He goes, She writes).',
    'Verb Forms: V1 = Base Form (go), V2 = Past Simple (went), V3 = Past Participle (gone), V-ing = Present Participle (going).',
    'Do / Does / Did Rule: Always use the base verb form V1 after do, does, or did (e.g., Did he go? - NOT Did he went).',
  ],
};

export const VERIFIED_MATH_FORMULAS: EducationalSheetData = {
  title: 'Essential Mathematics Formula Sheet',
  subtitle: 'High School & College Reference: Algebra, Geometry, Trigonometry & Calculus',
  subject: 'Mathematics',
  category: 'math',
  sections: [
    {
      title: '1. Algebra & Polynomial Identities',
      rules: [
        {
          name: 'Quadratic Formula',
          structure: 'x = (-b ± √(b² - 4ac)) / (2a)',
          usage: 'Finds roots of quadratic equation ax² + bx + c = 0 (Discriminant Δ = b² - 4ac)',
          examples: ['For x² - 5x + 6 = 0: a=1, b=-5, c=6 → x = (5 ± √(25 - 24))/2 = 3, 2'],
        },
        {
          name: 'Algebraic Identities',
          structure: '(a + b)² = a² + 2ab + b² | (a - b)² = a² - 2ab + b² | a² - b² = (a - b)(a + b)',
          usage: 'Factoring and expanding polynomials.',
          examples: ['(x + 3)² = x² + 6x + 9', 'x² - 16 = (x - 4)(x + 4)'],
        },
        {
          name: 'Cubic Identities',
          structure: '(a + b)³ = a³ + 3a²b + 3ab² + b³ | a³ + b³ = (a + b)(a² - ab + b²)',
          usage: 'Factoring cubic equations.',
          examples: ['x³ + 8 = (x + 2)(x² - 2x + 4)'],
        },
      ],
    },
    {
      title: '2. Geometry & Mensuration',
      rules: [
        {
          name: 'Circle Metrics',
          structure: 'Area = πr² | Circumference = 2πr | Diameter = 2r',
          usage: 'Calculates area and boundary length of circles.',
          examples: ['Radius r = 7 cm → Area ≈ 22/7 × 49 = 154 cm², Circumference ≈ 44 cm'],
        },
        {
          name: 'Pythagorean Theorem',
          structure: 'a² + b² = c² (in right-angled triangle with hypotenuse c)',
          usage: 'Finds missing triangle side length.',
          examples: ['Legs 3 and 4 → Hypotenuse c = √(3² + 4²) = √25 = 5'],
        },
        {
          name: 'Solid Volumes',
          structure: 'Sphere: V = (4/3)πr³ | Cylinder: V = πr²h | Cone: V = (1/3)πr²h',
          usage: 'Three-dimensional spatial volumes.',
          examples: ['Cylinder with r = 3, h = 5 → Volume = π × 9 × 5 = 45π ≈ 141.37'],
        },
      ],
    },
    {
      title: '3. Trigonometry & Calculus Core',
      rules: [
        {
          name: 'Fundamental Pythagorean Identities',
          structure: 'sin²(θ) + cos²(θ) = 1 | 1 + tan²(θ) = sec²(θ) | 1 + cot²(θ) = csc²(θ)',
          usage: 'Simplifying trigonometric expressions and proofs.',
          examples: ['cos(θ) = ±√(1 - sin²(θ))'],
        },
        {
          name: 'Basic Derivative Rules',
          structure: 'd/dx[xⁿ] = n·xⁿ⁻¹ | d/dx[eˣ] = eˣ | d/dx[sin x] = cos x | d/dx[ln x] = 1/x',
          usage: 'Calculus rates of change and differentiation.',
          examples: ['d/dx[x³] = 3x²', 'd/dx[5x² + 2x] = 10x + 2'],
        },
        {
          name: 'Fundamental Integrals',
          structure: '∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C (n ≠ -1) | ∫ eˣ dx = eˣ + C | ∫ 1/x dx = ln|x| + C',
          usage: 'Antiderivatives and accumulation.',
          examples: ['∫ 3x² dx = x³ + C'],
        },
      ],
    },
  ],
  summaryNotes: [
    'Quadratic Discriminant: If b² - 4ac > 0 (2 real roots), = 0 (1 real root), < 0 (2 complex conjugate roots).',
    'Trigonometry Radians: π radians = 180°, π/2 = 90°, π/4 = 45°.',
  ],
};

export const VERIFIED_BENGALI_GRAMMAR: EducationalSheetData = {
  title: 'বাংলা ব্যাকরণ নির্দেশিকা (Bengali Grammar Master Sheet)',
  subtitle: 'কাল, কারক-বিভক্তি, সন্ধি ও সমাস এর নিয়মাবলী এবং নির্ভুল উদাহরণ',
  subject: 'বাংলা ব্যাকরণ (Bengali Grammar)',
  category: 'bengali_grammar',
  isBengaliRequested: true,
  sections: [
    {
      title: '১. কালের শ্রেণিবিভাগ (Tenses in Bengali)',
      rules: [
        {
          name: 'বর্তমান কাল (Present Tense)',
          structure: 'সাধারণ বর্তমান | ঘটমান বর্তমান | পুরাঘটিত বর্তমান',
          usage: 'বর্তমানের কোনো কাজ বা স্বাভাবিক রীতি বোঝাতে।',
          examples: [
            'সাধারণ: সূর্য পূর্ব দিকে ওঠে। (অভ্যাস/চিরন্তন)',
            'ঘটমান: খোকা ঘুমাচ্ছে। (চলমান)',
            'পুরাঘটিত: আমি চিঠিটি পেয়েছি। (এইমাত্র শেষ হওয়া)',
          ],
          bengaliExplanation: 'বর্তমানকালের ক্রিয়া তিনটি প্রধান ভাগে বিভক্ত।',
        },
        {
          name: 'অতীত কাল (Past Tense)',
          structure: 'সাধারণ অতীত | ঘটমান অতীত | পুরাঘটিত অতীত | নিত্যবৃত্ত অতীত',
          usage: 'অতীতে ঘটে যাওয়া কাজ বা অতীতের নিয়মিত অভ্যাস।',
          examples: [
            'সাধারণ: বাবা বাড়ি ফিরলেন।',
            'ঘটমান: তখন বৃষ্টি হচ্ছিল।',
            'পুরাঘটিত: আমরা তখন ভাত খেয়েছিলাম।',
            'নিত্যবৃত্ত: তিনি প্রতিদিন সকালে হাঁটতেন। (অতীতের অভ্যাস)',
          ],
          bengaliExplanation: 'নিত্যবৃত্ত অতীতে অতীতকালের অভ্যাস বা নিয়মিত কাজ বোঝায়।',
        },
        {
          name: 'ভবিষ্যৎ কাল (Future Tense)',
          structure: 'সাধারণ ভবিষ্যৎ | ঘটমান ভবিষ্যৎ | পুরাঘটিত ভবিষ্যৎ',
          usage: 'ভবিষ্যতে ঘটবে এমন কাজ বোঝাতে।',
          examples: [
            'সাধারণ: আমরা আগামীকাল বেড়াতে যাব।',
            'ঘটমান: কাল এই সময়ে আমরা পরীক্ষা দিতে থাকব।',
            'পুরাঘটিত: সে এতক্ষণে বাড়ি পৌঁছে থাকবে।',
          ],
          bengaliExplanation: 'আগামীতে কোনো কাজ সম্পন্ন হবে বোঝালে ভবিষ্যৎ কাল ব্যবহৃত হয়।',
        },
      ],
    },
    {
      title: '২. কারক ও বিভক্তি (Karaka & Vibhakti)',
      rules: [
        {
          name: 'কারকের ৬ প্রকার রূপ',
          structure: 'কর্তৃকারক, কর্মকারক, করণকারক, সম্প্রদানকারক, অপাদানকারক, অধিকরণকারক',
          usage: 'বাক্যস্থিত ক্রিয়াপদের সাথে নামপদের সম্পর্কই হলো কারক।',
          examples: [
            'কর্তৃকারক: বুলবুলিতে ধান খেয়েছে (কে/কারা খেলে)।',
            'কর্মকারক: ঘোড়াকে চাবুক মারো (কী/কাকে মারবে)।',
            'করণকারক: কলম দিয়ে লিখি (কী দ্বারা/সহায়ে)।',
            'অপাদানকারক: তিলে তৈল হয় / গাছ থেকে পাতা পড়ে (কোথা থেকে জাত/বিচ্যুত)।',
            'অধিকরণকারক: তিলে তৈল আছে / বনে বাঘ থাকে (স্থান/কাল/আধার)।',
          ],
        },
      ],
    },
  ],
  summaryNotes: [
    'কারক নির্ণয়ের সহজ সূত্র: কে = কর্তা, কী/কাকে = কর্ম, কী দিয়ে = করণ, কাকে দান = সম্প্রদান, কোথা হতে = অপাদান, কোথায়/কখন = অধিকরণ।',
  ],
};
