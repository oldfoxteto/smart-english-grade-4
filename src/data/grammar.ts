// Comprehensive Grammar Rules and Exercises
export const grammarRules = [
  {
    id: 1,
    title: "Verb 'to be' in Present Simple",
    arabicTitle: "فعل 'to be' في المضارع البسيط",
    level: "A1",
    category: "verbs",
    explanation: "نستخدم فعل 'to be' للتعبير عن الحالة والهوية والانتماء في الحاضر",
    formula: {
      positive: "I am / You are / He is / She is / It is / We are / They are",
      negative: "I am not / You are not / He is not / She is not / It is not / We are not / They are not",
      question: "Am I? / Are you? / Is he? / Is she? / Is it? / Are we? / Are they?"
    },
    examples: [
      { english: "I am a student", arabic: "أنا طالب", type: "positive" },
      { english: "She is from Saudi Arabia", arabic: "هي من السعودية", type: "positive" },
      { english: "They are happy", arabic: "هم سعداء", type: "positive" },
      { english: "I am not tired", arabic: "أنا لست متعباً", type: "negative" },
      { english: "He is not here", arabic: "هو ليس هنا", type: "negative" },
      { english: "Are you busy?", arabic: "هل أنت مشغول؟", type: "question" },
      { english: "Is she a doctor?", arabic: "هل هي طبيبة؟", type: "question" }
    ],
    commonMistakes: [
      { mistake: "I is a student", correction: "I am a student", explanation: "مع 'I' نستخدم 'am' وليس 'is'" },
      { mistake: "He are happy", correction: "He is happy", explanation: "مع 'He' نستخدم 'is' وليس 'are'" },
      { mistake: "They is here", correction: "They are here", explanation: "مع 'They' نستخدم 'are' وليس 'is'" }
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "I ___ a teacher.",
        answer: "am",
        options: ["am", "is", "are"],
        explanation: "مع 'I' نستخدم 'am'"
      },
      {
        type: "fill_blank",
        question: "She ___ 25 years old.",
        answer: "is",
        options: ["am", "is", "are"],
        explanation: "مع 'She' نستخدم 'is'"
      },
      {
        type: "correction",
        question: "Correct: They is students.",
        answer: "They are students",
        explanation: "مع 'They' نستخدم 'are'"
      }
    ]
  },
  {
    id: 2,
    title: "Articles (a/an/the)",
    arabicTitle: "أدوات التعريف (a/an/the)",
    level: "A1",
    category: "determiners",
    explanation: "نستخدم a/an للشيء غير المحدد، و the للشيء المحدد أو المذكور سابقاً",
    formula: {
      a: "a + consonant sound (a book, a car)",
      an: "an + vowel sound (an apple, an hour)",
      the: "the + specific noun (the book, the sun)"
    },
    examples: [
      { english: "I have a car", arabic: "عندي سيارة", type: "indefinite" },
      { english: "She is an excellent teacher", arabic: "هي معلمة ممتازة", type: "indefinite" },
      { english: "The car is red", arabic: "السيارة حمراء", type: "definite" },
      { english: "The sun is hot", arabic: "الشمس حارة", type: "definite" }
    ],
    commonMistakes: [
      { mistake: "I have apple", correction: "I have an apple", explanation: "نحتاج 'an' قبل كلمة 'apple' لأنها تبدأ بحرف متحرك" },
      { mistake: "She is a excellent teacher", correction: "She is an excellent teacher", explanation: "نستخدم 'an' لأن 'excellent' تبدأ بحرف متحرك" },
      { mistake: "I like a dogs", correction: "I like dogs", explanation: "لا نستخدم a/an مع الجمع" }
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "I saw ___ elephant yesterday.",
        answer: "an",
        options: ["a", "an", "the"],
        explanation: "نستخدم 'an' لأن 'elephant' تبدأ بحرف متحرك"
      },
      {
        type: "fill_blank",
        question: "___ moon is bright tonight.",
        answer: "The",
        options: ["A", "An", "The"],
        explanation: "نستخدم 'the' لأن القمر شيء محدد ومعروف"
      }
    ]
  },
  {
    id: 3,
    title: "Present Simple Tense",
    arabicTitle: "المضارع البسيط",
    level: "A1",
    category: "verbs",
    explanation: "نستخدم المضارع البسيط للحديث عن العادات والروتين والحقائق العامة",
    formula: {
      positive: "I/You/We/They + verb | He/She/It + verb + s/es",
      negative: "I/You/We/They + don't + verb | He/She/It + doesn't + verb",
      question: "Do/Does + subject + verb?"
    },
    examples: [
      { english: "I work every day", arabic: "أعمل كل يوم", type: "positive" },
      { english: "She studies English", arabic: "هي تدرس الإنجليزية", type: "positive" },
      { english: "They play football", arabic: "هم يلعبون كرة القدم", type: "positive" },
      { english: "He doesn't like coffee", arabic: "هو لا يحب القهوة", type: "negative" },
      { english: "Do you speak Arabic?", arabic: "هل تتحدث العربية؟", type: "question" },
      { english: "Does she live in Riyadh?", arabic: "هل تعيش في الرياض؟", type: "question" }
    ],
    commonMistakes: [
      { mistake: "He work hard", correction: "He works hard", explanation: "نضيف 's' للفعل مع he/she/it" },
      { mistake: "She don't like milk", correction: "She doesn't like milk", explanation: "نستخدم 'doesn't' مع she/he/it" },
      { mistake: "Do he speak English?", correction: "Does he speak English?", explanation: "نستخدم 'Does' في السؤال مع he/she/it" }
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "She ___ to school every day.",
        answer: "goes",
        options: ["go", "goes", "going"],
        explanation: "نضيف 'es' مع 'go' لأنها تنتهي بـ 'o'"
      },
      {
        type: "fill_blank",
        question: "They ___ like spicy food.",
        answer: "don't",
        options: ["don't", "doesn't", "doesn't"],
        explanation: "نستخدم 'don't' مع 'they'"
      }
    ]
  },
  {
    id: 4,
    title: "Prepositions of Time",
    arabicTitle: "حروف الجر للزمن",
    level: "A1",
    category: "prepositions",
    explanation: "نستخدم حروف جر مختلفة للتعبير عن الوقت",
    formula: {
      on: "on + days/dates (on Monday, on May 5th)",
      in: "in + months/years/seasons (in June, in 2024, in summer)",
      at: "at + specific times (at 3 PM, at noon, at night)"
    },
    examples: [
      { english: "I have class on Monday", arabic: "عندي حصة يوم الإثنين", type: "on" },
      { english: "My birthday is in July", arabic: "عيد ميلادي في يوليو", type: "in" },
      { english: "We meet at 5 PM", arabic: "نلتقي الساعة 5 مساءً", type: "at" },
      { english: "The party is on Friday", arabic: "الحفلة يوم الجمعة", type: "on" },
      { english: "He was born in 1995", arabic: "ولد عام 1995", type: "in" },
      { english: "Breakfast is at 7 AM", arabic: "الفطور الساعة 7 صباحاً", type: "at" }
    ],
    commonMistakes: [
      { mistake: "I go to school on Monday morning", correction: "I go to school on Monday", explanation: "لا نستخدم 'on' مع 'morning'" },
      { mistake: "My birthday is at July", correction: "My birthday is in July", explanation: "نستخدم 'in' مع الشهور" },
      { mistake: "We meet in 5 PM", correction: "We meet at 5 PM", explanation: "نستخدم 'at' مع الساعات المحددة" }
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "The meeting is ___ Friday.",
        answer: "on",
        options: ["on", "in", "at"],
        explanation: "نستخدم 'on' مع الأيام"
      },
      {
        type: "fill_blank",
        question: "I was born ___ 2000.",
        answer: "in",
        options: ["on", "in", "at"],
        explanation: "نستخدم 'in' مع السنوات"
      }
    ]
  },
  {
    id: 5,
    title: "Possessive Adjectives",
    arabicTitle: "ضمائر الملكية",
    level: "A1",
    category: "determiners",
    explanation: "نستخدم ضمائر الملكية للإشارة إلى ملكية الأشياء",
    formula: {
      list: "my (أنا) / your (أنت) / his (هو) / her (هي) / its (هو/هي لغير العاقل) / our (نحن) / their (هم)"
    },
    examples: [
      { english: "This is my book", arabic: "هذا كتابي", type: "my" },
      { english: "What is your name?", arabic: "ما اسمك؟", type: "your" },
      { english: "His car is new", arabic: "سيارته جديدة", type: "his" },
      { english: "Her dress is beautiful", arabic: "فستانها جميل", type: "her" },
      { english: "Our teacher is kind", arabic: "معلمنا لطيف", type: "our" },
      { english: "Their children are smart", arabic: "أطفالهم أذكياء", type: "their" }
    ],
    commonMistakes: [
      { mistake: "This is I book", correction: "This is my book", explanation: "نستخدم 'my' وليس 'I'" },
      { mistake: "He name is Ahmed", correction: "His name is Ahmed", explanation: "نستخدم 'his' مع الذكر" },
      { mistake: "She is my sister. Her is 10 years old", correction: "She is my sister. She is 10 years old", explanation: "نستخدم 'her' قبل الاسم، و 'she' كضمير فاعل" }
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "What is ___ name?",
        answer: "your",
        options: ["you", "your", "yours"],
        explanation: "نستخدم 'your' للسؤال عن اسم الشخص المخاطب"
      },
      {
        type: "fill_blank",
        question: "___ dog is very friendly.",
        answer: "Their",
        options: ["They", "Their", "Theirs"],
        explanation: "نستخدم 'Their' للإشارة إلى ملكية الكلب لـ 'they'"
      }
    ]
  }
];

// Generate more grammar rules
export const generateMoreGrammarRules = () => {
  const rules = [...grammarRules];
  const categories = ["verbs", "nouns", "adjectives", "adverbs", "prepositions", "conjunctions", "determiners", "pronouns"];
  const levels = ["A1", "A2", "B1", "B2"];
  
  // Generate rules 6-50
  for (let i = 6; i <= 50; i++) {
    const category = categories[i % categories.length];
    const level = levels[Math.floor(i / 12.5) % levels.length];
    
    rules.push({
      id: i,
      title: `Grammar Rule ${i}`,
      arabicTitle: `قاعدة نحوية ${i}`,
      level,
      category,
      explanation: "شرح مفصل للقاعدة النحوية",
      formula: {
        positive: "الصيغة الإيجابية",
        negative: "الصيغة السلبية",
        question: "الصيغة الاستفهامية"
      },
      examples: [
        { english: "Example 1", arabic: "مثال 1", type: "positive" },
        { english: "Example 2", arabic: "مثال 2", type: "negative" },
        { english: "Example 3", arabic: "مثال 3", type: "question" }
      ],
      commonMistakes: [
        { mistake: "Common mistake", correction: "Correct form", explanation: "Explanation" }
      ],
      exercises: [
        {
          type: "fill_blank",
          question: "Sample question",
          answer: "answer",
          options: ["option1", "option2", "option3"],
          explanation: "Explanation"
        }
      ]
    });
  }
  
  return rules;
};

export const allGrammarRules = generateMoreGrammarRules();

// Grammar Categories
export const grammarCategories = {
  verbs: { name: "الأفعال", icon: "🏃", color: "#4CAF50" },
  nouns: { name: "الأسماء", icon: "📦", color: "#2196F3" },
  adjectives: { name: "الصفات", icon: "🎨", color: "#FF9800" },
  adverbs: { name: "الظروف", icon: "⚡", color: "#9C27B0" },
  prepositions: { name: "حروف الجر", icon: "📍", color: "#F44336" },
  conjunctions: { name: "حروف العطف", icon: "🔗", color: "#795548" },
  determiners: { name: "أدوات التحديد", icon: "🎯", color: "#607D8B" },
  pronouns: { name: "الضمائر", icon: "👤", color: "#E91E63" }
};

// Get grammar rules by category
export const getGrammarByCategory = (category: string) => {
  return allGrammarRules.filter(rule => rule.category === category);
};

// Get grammar rules by level
export const getGrammarByLevel = (level: string) => {
  return allGrammarRules.filter(rule => rule.level === level);
};

// Search grammar rules
export const searchGrammar = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return allGrammarRules.filter(rule => 
    rule.title.toLowerCase().includes(lowercaseQuery) ||
    rule.arabicTitle.includes(query) ||
    rule.explanation.toLowerCase().includes(lowercaseQuery)
  );
};
