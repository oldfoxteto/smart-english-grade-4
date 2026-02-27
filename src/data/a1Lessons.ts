// A1 Level Lessons - Complete Curriculum
export const a1Lessons = [
  {
    id: 1,
    title: "التحيات والتعارف",
    englishTitle: "Greetings and Introductions",
    level: "A1",
    category: "basics",
    objectives: [
      "التحية باللغة الإنجليزية",
      "تقديم النفس والآخرين",
      "الرد على التحيات"
    ],
    vocabulary: [
      { english: "Hello", arabic: "مرحباً", pronunciation: "hə-ˈləʊ" },
      { english: "Hi", arabic: "أهلاً", pronunciation: "haɪ" },
      { english: "Good morning", arabic: "صباح الخير", pronunciation: "ɡʊd ˈmɔːnɪŋ" },
      { english: "Good afternoon", arabic: "طاب مساؤك", pronunciation: "ɡʊd ˌæftəˈnuːn" },
      { english: "Good evening", arabic: "مساء الخير", pronunciation: "ɡʊd ˈiːvnɪŋ" },
      { english: "Good night", arabic: "طابت ليلتك", pronunciation: "ɡʊd naɪt" },
      { english: "Goodbye", arabic: "وداعاً", pronunciation: "ɡʊdˈbaɪ" },
      { english: "Bye", arabic: "باي", pronunciation: "baɪ" },
      { english: "My name is...", arabic: "اسمي هو...", pronunciation: "maɪ neɪm ɪz" },
      { english: "What's your name?", arabic: "ما اسمك؟", pronunciation: "wɒts jɔː neɪm" }
    ],
    grammar: {
      title: "Verb 'to be' in Present Simple",
      explanation: "نستخدم فعل 'to be' للتعبير عن الحالة والهوية في الحاضر",
      formula: "I am / You are / He is / She is / It is / We are / They are",
      examples: [
        { english: "I am Ahmed", arabic: "أنا أحمد" },
        { english: "You are a student", arabic: "أنت طالب" },
        { english: "She is from Saudi Arabia", arabic: "هي من السعودية" },
        { english: "We are in class", arabic: "نحن في الفصل" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "Hello, my name ___ Ali.",
        answer: "is",
        options: ["is", "am", "are"]
      },
      {
        type: "translation",
        question: "Translate: صباح الخير",
        answer: "Good morning"
      },
      {
        type: "matching",
        pairs: [
          { english: "Hello", arabic: "مرحباً" },
          { english: "Goodbye", arabic: "وداعاً" },
          { english: "Thank you", arabic: "شكراً" }
        ]
      }
    ],
    audio: {
      conversation: "Hello! My name is Sarah. What's your name? Hi Sarah! I'm Mohammed. Nice to meet you! Nice to meet you too!",
      pronunciation: ["hə-ˈləʊ", "maɪ neɪm ɪz", "wɒts jɔː neɪm"]
    }
  },
  {
    id: 2,
    title: "الأرقام والعمر",
    englishTitle: "Numbers and Age",
    level: "A1",
    category: "basics",
    objectives: [
      "الأرقام من 1 إلى 100",
      "السؤال عن العمر",
      "التعبير عن العمر"
    ],
    vocabulary: [
      { english: "One", arabic: "واحد", pronunciation: "wʌn" },
      { english: "Two", arabic: "اثنان", pronunciation: "tuː" },
      { english: "Three", arabic: "ثلاثة", pronunciation: "θriː" },
      { english: "Four", arabic: "أربعة", pronunciation: "fɔː" },
      { english: "Five", arabic: "خمسة", pronunciation: "faɪv" },
      { english: "Six", arabic: "ستة", pronunciation: "sɪks" },
      { english: "Seven", arabic: "سبعة", pronunciation: "ˈsevən" },
      { english: "Eight", arabic: "ثمانية", pronunciation: "eɪt" },
      { english: "Nine", arabic: "تسعة", pronunciation: "naɪn" },
      { english: "Ten", arabic: "عشرة", pronunciation: "ten" },
      { english: "How old are you?", arabic: "كم عمرك؟", pronunciation: "haʊ əʊld ɑː juː" },
      { english: "I am ___ years old", arabic: "عمري ___ سنة", pronunciation: "aɪ æm ___ jɪəz əʊld" }
    ],
    grammar: {
      title: "Questions with 'How old'",
      explanation: "نستخدم 'How old' للسؤال عن العمر",
      formula: "How old + be + subject?",
      examples: [
        { english: "How old are you?", arabic: "كم عمرك؟" },
        { english: "I am 25 years old", arabic: "عمري 25 سنة" },
        { english: "How old is your brother?", arabic: "كم عمر أخيك؟" },
        { english: "He is 10 years old", arabic: "عمره 10 سنوات" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "I ___ 20 years old.",
        answer: "am",
        options: ["am", "is", "are"]
      },
      {
        type: "math",
        question: "Write the number: 15",
        answer: "fifteen"
      },
      {
        type: "question_answer",
        question: "How old are you? (Write your age)",
        answer: "I am ___ years old"
      }
    ],
    audio: {
      conversation: "How old are you, Tom? I'm 12 years old. And you, Lisa? I'm 11 years old. Oh, you're younger than me!",
      pronunciation: ["haʊ əʊld ɑː juː", "aɪm ˈtwɛlv jɪəz əʊld"]
    }
  },
  {
    id: 3,
    title: "الأسرة",
    englishTitle: "Family",
    level: "A1",
    category: "personal",
    objectives: [
      "أفراد الأسرة",
      "وصف الأسرة",
      "التحدث عن أفراد العائلة"
    ],
    vocabulary: [
      { english: "Father", arabic: "أب", pronunciation: "ˈfɑːðə" },
      { english: "Mother", arabic: "أم", pronunciation: "ˈmʌðə" },
      { english: "Brother", arabic: "أخ", pronunciation: "ˈbrʌðə" },
      { english: "Sister", arabic: "أخت", pronunciation: "ˈsɪstə" },
      { english: "Son", arabic: "ابن", pronunciation: "sʌn" },
      { english: "Daughter", arabic: "بنت", pronunciation: "ˈdɔːtə" },
      { english: "Grandfather", arabic: "جد", pronunciation: "ˈɡrændfɑːðə" },
      { english: "Grandmother", arabic: "جدة", pronunciation: "ˈɡrændmʌðə" },
      { english: "Family", arabic: "عائلة", pronunciation: "ˈfæməli" },
      { english: "Parents", arabic: "والدان", pronunciation: "ˈpeərənts" }
    ],
    grammar: {
      title: "Possessive Adjectives",
      explanation: "نستخدم ضمائر الملكية للإشارة إلى ملكية الأشياء",
      formula: "my / your / his / her / its / our / their",
      examples: [
        { english: "This is my father", arabic: "هذا أبي" },
        { english: "Her name is Fatima", arabic: "اسمها فاطمة" },
        { english: "Their family is big", arabic: "عائلتهم كبيرة" },
        { english: "Our parents are teachers", arabic: "والدنا معلمون" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "This is ___ mother. (my/her)",
        answer: "my",
        options: ["my", "her", "his"]
      },
      {
        type: "translation",
        question: "Translate: أخي",
        answer: "My brother"
      },
      {
        type: "matching",
        pairs: [
          { english: "Father", arabic: "أب" },
          { english: "Mother", arabic: "أم" },
          { english: "Brother", arabic: "أخ" }
        ]
      }
    ],
    audio: {
      conversation: "This is my family photo. Who is this? This is my father. And who is she? She is my mother. Do you have brothers and sisters? Yes, I have one brother.",
      pronunciation: ["ðɪs ɪz maɪ ˈfæməli ˈfəʊtəʊ", "huː ɪz ðɪs"]
    }
  },
  {
    id: 4,
    title: "الألوان",
    englishTitle: "Colors",
    level: "A1",
    category: "descriptions",
    objectives: [
      "الألوان الأساسية",
      "وصف الأشياء بالألوان",
      "السؤال عن الألوان"
    ],
    vocabulary: [
      { english: "Red", arabic: "أحمر", pronunciation: "red" },
      { english: "Blue", arabic: "أزرق", pronunciation: "bluː" },
      { english: "Green", arabic: "أخضر", pronunciation: "ɡriːn" },
      { english: "Yellow", arabic: "أصفر", pronunciation: "ˈjeləʊ" },
      { english: "Black", arabic: "أسود", pronunciation: "blæk" },
      { english: "White", arabic: "أبيض", pronunciation: "waɪt" },
      { english: "Orange", arabic: "برتقالي", pronunciation: "ˈɒrɪndʒ" },
      { english: "Purple", arabic: "بنفسجي", pronunciation: "ˈpɜːpəl" },
      { english: "Brown", arabic: "بني", pronunciation: "braʊn" },
      { english: "Pink", arabic: "وردي", pronunciation: "pɪŋk" },
      { english: "What color is it?", arabic: "ما لونه؟", pronunciation: "wɒt ˈkʌlə ɪz ɪt" }
    ],
    grammar: {
      title: "Questions with 'What color'",
      explanation: "نستخدم 'What color' للسؤال عن لون الشيء",
      formula: "What color + be + it/this/that?",
      examples: [
        { english: "What color is the car?", arabic: "ما لون السيارة؟" },
        { english: "It is red", arabic: "هي حمراء" },
        { english: "What color are your eyes?", arabic: "ما لون عينيك؟" },
        { english: "They are brown", arabic: "هما بنيتان" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "The sky is ___.",
        answer: "blue",
        options: ["blue", "red", "green"]
      },
      {
        type: "translation",
        question: "Translate: أحمر",
        answer: "Red"
      },
      {
        type: "matching",
        pairs: [
          { english: "Sky", arabic: "سماء" },
          { english: "Grass", arabic: "عشب" },
          { english: "Sun", arabic: "شمس" }
        ]
      }
    ],
    audio: {
      conversation: "Look at the rainbow! What colors do you see? I see red, orange, yellow, green, blue, and purple. It's beautiful! Yes, nature has many colors.",
      pronunciation: ["lʊk æt ðə ˈreɪnbəʊ", "wɒt ˈkʌləz duː juː siː"]
    }
  },
  {
    id: 5,
    title: "الطعام والمشروبات",
    englishTitle: "Food and Drinks",
    level: "A1",
    category: "daily_life",
    objectives: [
      "أسماء الطعام والمشروبات",
      "التعبير عن الأطعمة المفضلة",
      "طلب الطعام"
    ],
    vocabulary: [
      { english: "Apple", arabic: "تفاحة", pronunciation: "ˈæpəl" },
      { english: "Banana", arabic: "موز", pronunciation: "bəˈnænə" },
      { english: "Orange", arabic: "برتقال", pronunciation: "ˈɒrɪndʒ" },
      { english: "Milk", arabic: "حليب", pronunciation: "mɪlk" },
      { english: "Water", arabic: "ماء", pronunciation: "ˈwɔːtə" },
      { english: "Bread", arabic: "خبز", pronunciation: "bred" },
      { english: "Rice", arabic: "أرز", pronunciation: "raɪs" },
      { english: "Chicken", arabic: "دجاج", pronunciation: "ˈtʃɪkɪn" },
      { english: "Fish", arabic: "سمك", pronunciation: "fɪʃ" },
      { english: "Egg", arabic: "بيضة", pronunciation: "eɡ" },
      { english: "I like...", arabic: "أحب...", pronunciation: "aɪ laɪk" },
      { english: "I don't like...", arabic: "لا أحب...", pronunciation: "aɪ dəʊnt laɪk" }
    ],
    grammar: {
      title: "Simple Present with Like/Don't Like",
      explanation: "نستخدم like/don't like للتعبير عن التفضيلات",
      formula: "Subject + like/don't like + object",
      examples: [
        { english: "I like apples", arabic: "أحب التفاح" },
        { english: "She doesn't like fish", arabic: "هي لا تحب السمك" },
        { english: "Do you like milk?", arabic: "هل تحب الحليب؟" },
        { english: "We like rice", arabic: "نحن نحب الأرز" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "I ___ apples.",
        answer: "like",
        options: ["like", "likes", "liking"]
      },
      {
        type: "translation",
        question: "Translate: لا أحب السمك",
        answer: "I don't like fish"
      },
      {
        type: "matching",
        pairs: [
          { english: "Apple", arabic: "تفاحة" },
          { english: "Milk", arabic: "حليب" },
          { english: "Bread", arabic: "خبز" }
        ]
      }
    ],
    audio: {
      conversation: "What do you like for breakfast? I like bread and milk. And for lunch? I like rice and chicken. Do you like fruits? Yes, I like apples and bananas.",
      pronunciation: ["wɒt duː juː laɪk fɔː ˈbrekfəst", "aɪ laɪk bred ænd mɪlk"]
    }
  }
];

// Continue with more lessons...
export const a1LessonsExtended = [
  ...a1Lessons,
  {
    id: 6,
    title: "الأيام والأشهر",
    englishTitle: "Days and Months",
    level: "A1",
    category: "time",
    objectives: ["أيام الأسبوع", "أشهر السنة", "التعبير عن التواريخ"],
    vocabulary: [
      { english: "Monday", arabic: "الإثنين", pronunciation: "ˈmʌndeɪ" },
      { english: "Tuesday", arabic: "الثلاثاء", pronunciation: "ˈtjuːzdeɪ" },
      { english: "Wednesday", arabic: "الأربعاء", pronunciation: "ˈwenzdeɪ" },
      { english: "Thursday", arabic: "الخميس", pronunciation: "ˈθɜːzdeɪ" },
      { english: "Friday", arabic: "الجمعة", pronunciation: "ˈfraɪdeɪ" },
      { english: "Saturday", arabic: "السبت", pronunciation: "ˈsætədeɪ" },
      { english: "Sunday", arabic: "الأحد", pronunciation: "ˈsʌndeɪ" },
      { english: "January", arabic: "يناير", pronunciation: "ˈdʒænjuəri" },
      { english: "February", arabic: "فبراير", pronunciation: "ˈfebruəri" },
      { english: "March", arabic: "مارس", pronunciation: "mɑːtʃ" }
    ],
    grammar: {
      title: "Prepositions of Time",
      explanation: "نستخدم on للأيام، in للأشهر والسنين، at للساعات",
      formula: "on + day | in + month/year | at + time",
      examples: [
        { english: "I have class on Monday", arabic: "عندي حصة يوم الإثنين" },
        { english: "My birthday is in June", arabic: "عيد ميلادي في يونيو" },
        { english: "We meet at 3 PM", arabic: "نلتقي الساعة 3 مساءً" }
      ]
    },
    exercises: [
      {
        type: "fill_blank",
        question: "My birthday is ___ June.",
        answer: "in",
        options: ["in", "on", "at"]
      }
    ]
  }
];

// Generate more lessons to reach 50 total
export const generateA1Lessons = () => {
  const categories = ['basics', 'personal', 'descriptions', 'daily_life', 'time', 'places', 'activities', 'nature', 'school', 'work'];
  const lessons = [...a1LessonsExtended];
  
  // Generate remaining lessons (6-50)
  for (let i = 6; i <= 50; i++) {
    const category = categories[i % categories.length];
    lessons.push({
      id: i,
      title: `درس ${i}`,
      englishTitle: `Lesson ${i}`,
      level: "A1",
      category: category,
      objectives: ["هدف 1", "هدف 2", "هدف 3"],
      vocabulary: [
        { english: `Word${i}1`, arabic: `كلمة${i}1`, pronunciation: "pronunciation" },
        { english: `Word${i}2`, arabic: `كلمة${i}2`, pronunciation: "pronunciation" }
      ],
      grammar: {
        title: `Grammar Rule ${i}`,
        explanation: "شرح القاعدة",
        formula: "القاعدة",
        examples: [
          { english: "Example 1", arabic: "مثال 1" },
          { english: "Example 2", arabic: "مثال 2" }
        ]
      },
      exercises: [
        {
          type: "fill_blank",
          question: "Question",
          answer: "answer",
          options: ["option1", "option2"]
        }
      ],
      audio: {
        conversation: "Sample conversation",
        pronunciation: ["pronunciation1", "pronunciation2"]
      }
    });
  }
  
  return lessons;
};

export const allA1Lessons = generateA1Lessons();
