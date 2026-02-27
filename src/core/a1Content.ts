// محتوى الإنجليزية A1 - 50 درس أساسي
// مصمم خصيصاً للمستخدم العربي

export interface A1Lesson {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'speaking';
  level: 'A1.1' | 'A1.2' | 'A1.3';
  unit: number;
  duration: number; // in minutes
  objectives: string[];
  objectivesAr: string[];
  vocabulary?: VocabularyItem[];
  grammar?: GrammarPoint;
  reading?: ReadingPassage;
  exercises?: Exercise[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  category: string;
  image?: string;
}

export interface GrammarPoint {
  title: string;
  titleAr: string;
  explanation: string;
  explanationAr: string;
  formula: string;
  examples: Array<{
    correct: string;
    translation: string;
    highlight: string;
  }>;
}

export interface ReadingPassage {
  title: string;
  titleAr: string;
  text: string;
  textAr: string;
  difficulty: 'easy' | 'medium';
  questions: Array<{
    question: string;
    questionAr: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    explanationAr: string;
  }>;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'ordering' | 'speaking';
  question: string;
  questionAr: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  explanationAr: string;
  hints?: string[];
}

// الدروس الأولى - التحيات والأساسيات
export const a1Lessons: A1Lesson[] = [
  {
    id: 'a1-001',
    title: 'Hello and Goodbye',
    titleAr: 'التحيات والوداع',
    description: 'Basic greetings and farewells in English',
    descriptionAr: 'التحيات والوداع الأساسية في اللغة الإنجليزية',
    category: 'vocabulary',
    level: 'A1.1',
    unit: 1,
    duration: 5,
    objectives: ['Learn basic greetings', 'Learn farewells', 'Practice pronunciation'],
    objectivesAr: ['تعلم التحيات الأساسية', 'تعلم عبارات الوداع', 'ممارسة النطق'],
    vocabulary: [
      {
        word: 'Hello',
        translation: 'مرحباً',
        pronunciation: '/həˈloʊ/',
        example: 'Hello, how are you?',
        exampleTranslation: 'مرحباً، كيف حالك؟',
        category: 'greetings'
      },
      {
        word: 'Goodbye',
        translation: 'وداعاً',
        pronunciation: '/ˌɡʊdˈbaɪ/',
        example: 'Goodbye, see you tomorrow!',
        exampleTranslation: 'وداعاً، أراك غداً!',
        category: 'farewells'
      },
      {
        word: 'Hi',
        translation: 'أهلاً',
        pronunciation: '/haɪ/',
        example: 'Hi, nice to meet you!',
        exampleTranslation: 'أهلاً، سعيد بلقائك!',
        category: 'greetings'
      },
      {
        word: 'Bye',
        translation: 'باي',
        pronunciation: '/baɪ/',
        example: 'Bye, take care!',
        exampleTranslation: 'باي، اعتن بنفسك!',
        category: 'farewells'
      },
      {
        word: 'Good morning',
        translation: 'صباح الخير',
        pronunciation: '/ˌɡʊdˈmɔːrnɪŋ/',
        example: 'Good morning, everyone!',
        exampleTranslation: 'صباح الخير للجميع!',
        category: 'greetings'
      },
      {
        word: 'Good evening',
        translation: 'مساء الخير',
        pronunciation: '/ˌɡʊdˈiːvnɪŋ/',
        example: 'Good evening, welcome to our home!',
        exampleTranslation: 'مساء الخير، أهلاً بكم في بيتنا!',
        category: 'greetings'
      }
    ],
    exercises: [
      {
        id: 'ex-001-1',
        type: 'multiple-choice',
        question: 'What do you say when you meet someone in the morning?',
        questionAr: 'ماذا تقول عندما تقابل شخصاً في الصباح؟',
        options: ['Good night', 'Good morning', 'Good afternoon', 'Hello'],
        correctAnswer: 1,
        explanation: 'Good morning is used to greet someone in the morning.',
        explanationAr: 'نستخدم Good morning للتحية في الصباح.'
      },
      {
        id: 'ex-001-2',
        type: 'fill-blank',
        question: '_____, how are you?',
        questionAr: '_____، كيف حالك؟',
        correctAnswer: 'Hello',
        explanation: 'Hello is a common greeting.',
        explanationAr: 'Hello هي تحية شائعة.'
      }
    ]
  },
  {
    id: 'a1-002',
    title: 'Introducing Yourself',
    titleAr: 'تعريف نفسك',
    description: 'How to introduce yourself and ask for names',
    descriptionAr: 'كيفية تعريف نفسك والسؤال عن الأسماء',
    category: 'speaking',
    level: 'A1.1',
    unit: 1,
    duration: 7,
    objectives: ['Introduce yourself', 'Ask for names', 'Use "I am" correctly'],
    objectivesAr: ['تعريف نفسك', 'السؤال عن الأسماء', 'استخدام "I am" بشكل صحيح'],
    grammar: {
      title: 'Verb "to be" - Present Simple',
      titleAr: 'فعل "to be" - المضارع البسيط',
      explanation: 'Use "I am" to introduce yourself. Use "What is your name?" to ask for names.',
      explanationAr: 'استخدم "I am" لتعريف نفسك. استخدم "What is your name?" للسؤال عن الأسماء.',
      formula: 'I am + name / What is + your + name?',
      examples: [
        {
          correct: 'I am Ahmed.',
          translation: 'أنا أحمد.',
          highlight: 'I am'
        },
        {
          correct: 'What is your name?',
          translation: 'ما هو اسمك؟',
          highlight: 'What is'
        },
        {
          correct: 'My name is Fatima.',
          translation: 'اسمي فاطمة.',
          highlight: 'My name is'
        }
      ]
    },
    vocabulary: [
      {
        word: 'Name',
        translation: 'اسم',
        pronunciation: '/neɪm/',
        example: 'My name is Ali.',
        exampleTranslation: 'اسمي علي.',
        category: 'personal-info'
      },
      {
        word: 'From',
        translation: 'من',
        pronunciation: '/frəm/',
        example: 'I am from Egypt.',
        exampleTranslation: 'أنا من مصر.',
        category: 'personal-info'
      },
      {
        word: 'Nice to meet you',
        translation: 'سعيد بلقائك',
        pronunciation: '/naɪs tuː miːt juː/',
        example: 'Nice to meet you too!',
        exampleTranslation: 'سعيد بلقائك أيضاً!',
        category: 'greetings'
      }
    ],
    exercises: [
      {
        id: 'ex-002-1',
        type: 'fill-blank',
        question: 'I _____ Mohammed.',
        questionAr: 'أنا _____ محمد.',
        correctAnswer: 'am',
        explanation: 'With "I", we use "am" not "is" or "are".',
        explanationAr: 'مع "I" نستخدم "am" وليس "is" أو "are".'
      },
      {
        id: 'ex-002-2',
        type: 'multiple-choice',
        question: 'How do you ask for someone\'s name?',
        questionAr: 'كيف تسأل عن اسم شخص؟',
        options: ['What your name?', 'What is your name?', 'Name what is?', 'Your name is what?'],
        correctAnswer: 1,
        explanation: 'The correct question structure is "What is your name?"',
        explanationAr: 'التركيب الصحيح للسؤال هو "What is your name?"'
      }
    ]
  },
  {
    id: 'a1-003',
    title: 'Numbers 1-20',
    titleAr: 'الأرقام 1-20',
    description: 'Learning numbers from 1 to 20',
    descriptionAr: 'تعلم الأرقام من 1 إلى 20',
    category: 'vocabulary',
    level: 'A1.1',
    unit: 2,
    duration: 8,
    objectives: ['Count 1-20', 'Use numbers in sentences', 'Practice pronunciation'],
    objectivesAr: ['العد من 1-20', 'استخدام الأرقام في الجمل', 'ممارسة النطق'],
    vocabulary: [
      {
        word: 'One',
        translation: 'واحد',
        pronunciation: '/wʌn/',
        example: 'I have one brother.',
        exampleTranslation: 'لدي أخ واحد.',
        category: 'numbers'
      },
      {
        word: 'Two',
        translation: 'اثنان',
        pronunciation: '/tuː/',
        example: 'Two cats are playing.',
        exampleTranslation: 'قطتان تلعبان.',
        category: 'numbers'
      },
      {
        word: 'Three',
        translation: 'ثلاثة',
        pronunciation: '/θriː/',
        example: 'I have three books.',
        exampleTranslation: 'لدي ثلاثة كتب.',
        category: 'numbers'
      },
      {
        word: 'Ten',
        translation: 'عشرة',
        pronunciation: '/ten/',
        example: 'Ten students are in class.',
        exampleTranslation: 'عشرة طلاب في الفصل.',
        category: 'numbers'
      },
      {
        word: 'Twenty',
        translation: 'عشرون',
        pronunciation: '/ˈtwenti/',
        example: 'I am twenty years old.',
        exampleTranslation: 'عمري عشرون عاماً.',
        category: 'numbers'
      }
    ],
    exercises: [
      {
        id: 'ex-003-1',
        type: 'multiple-choice',
        question: 'What number comes after nine?',
        questionAr: 'ما هو الرقم الذي يأتي بعد تسعة؟',
        options: ['Eight', 'Ten', 'Eleven', 'Nine'],
        correctAnswer: 1,
        explanation: 'Ten comes after nine.',
        explanationAr: 'عشرة تأتي بعد تسعة.'
      },
      {
        id: 'ex-003-2',
        type: 'fill-blank',
        question: 'I have _____ apples. (5)',
        questionAr: 'لدي _____ تفاح. (5)',
        correctAnswer: 'five',
        explanation: 'The word for 5 is "five".',
        explanationAr: 'كلمة الرقم 5 هي "five".'
      }
    ]
  },
  {
    id: 'a1-004',
    title: 'Colors',
    titleAr: 'الألوان',
    description: 'Basic colors in English',
    descriptionAr: 'الألوان الأساسية في اللغة الإنجليزية',
    category: 'vocabulary',
    level: 'A1.1',
    unit: 2,
    duration: 6,
    objectives: ['Learn basic colors', 'Describe objects with colors', 'Use "it is" structure'],
    objectivesAr: ['تعلم الألوان الأساسية', 'وصف الأشياء بالألوان', 'استخدام تركيب "it is"'],
    vocabulary: [
      {
        word: 'Red',
        translation: 'أحمر',
        pronunciation: '/red/',
        example: 'The apple is red.',
        exampleTranslation: 'التفاحة حمراء.',
        category: 'colors'
      },
      {
        word: 'Blue',
        translation: 'أزرق',
        pronunciation: '/bluː/',
        example: 'The sky is blue.',
        exampleTranslation: 'السماء زرقاء.',
        category: 'colors'
      },
      {
        word: 'Green',
        translation: 'أخضر',
        pronunciation: '/ɡriːn/',
        example: 'The grass is green.',
        exampleTranslation: 'العشب أخضر.',
        category: 'colors'
      },
      {
        word: 'Yellow',
        translation: 'أصفر',
        pronunciation: '/ˈjeloʊ/',
        example: 'The sun is yellow.',
        exampleTranslation: 'الشمس صفراء.',
        category: 'colors'
      },
      {
        word: 'Black',
        translation: 'أسود',
        pronunciation: '/blæk/',
        example: 'The cat is black.',
        exampleTranslation: 'القطة سوداء.',
        category: 'colors'
      },
      {
        word: 'White',
        translation: 'أبيض',
        pronunciation: '/waɪt/',
        example: 'The snow is white.',
        exampleTranslation: 'الثلج أبيض.',
        category: 'colors'
      }
    ],
    exercises: [
      {
        id: 'ex-004-1',
        type: 'multiple-choice',
        question: 'What color is the sun?',
        questionAr: 'ما هو لون الشمس؟',
        options: ['Red', 'Blue', 'Yellow', 'Green'],
        correctAnswer: 2,
        explanation: 'The sun is yellow.',
        explanationAr: 'الشمس صفراء.'
      },
      {
        id: 'ex-004-2',
        type: 'fill-blank',
        question: 'The grass is _____.',
        questionAr: 'العشب _____.',
        correctAnswer: 'green',
        explanation: 'Grass is typically green in color.',
        explanationAr: 'العشب عادة ما يكون أخضر اللون.'
      }
    ]
  },
  {
    id: 'a1-005',
    title: 'Family Members',
    titleAr: 'أفراد العائلة',
    description: 'Basic family vocabulary',
    descriptionAr: 'مفردات العائلة الأساسية',
    category: 'vocabulary',
    level: 'A1.2',
    unit: 3,
    duration: 7,
    objectives: ['Learn family member names', 'Describe your family', 'Use possessive adjectives'],
    objectivesAr: ['تعلم أسماء أفراد العائلة', 'وصف عائلتك', 'استخدام صفات الملكية'],
    vocabulary: [
      {
        word: 'Father',
        translation: 'أب',
        pronunciation: '/ˈfɑːðər/',
        example: 'My father is a doctor.',
        exampleTranslation: 'أبي طبيب.',
        category: 'family'
      },
      {
        word: 'Mother',
        translation: 'أم',
        pronunciation: '/ˈmʌðər/',
        example: 'My mother is a teacher.',
        exampleTranslation: 'أمي معلمة.',
        category: 'family'
      },
      {
        word: 'Brother',
        translation: 'أخ',
        pronunciation: '/ˈbrʌðər/',
        example: 'I have one brother.',
        exampleTranslation: 'لدي أخ واحد.',
        category: 'family'
      },
      {
        word: 'Sister',
        translation: 'أخت',
        pronunciation: '/ˈsɪstər/',
        example: 'My sister lives in Dubai.',
        exampleTranslation: 'أختي تعيش في دبي.',
        category: 'family'
      },
      {
        word: 'Son',
        translation: 'ابن',
        pronunciation: '/sʌn/',
        example: 'He has two sons.',
        exampleTranslation: 'لديه ابنان.',
        category: 'family'
      },
      {
        word: 'Daughter',
        translation: 'ابنة',
        pronunciation: '/ˈdɔːtər/',
        example: 'Their daughter is very smart.',
        exampleTranslation: 'ابنتهم ذكية جداً.',
        category: 'family'
      }
    ],
    exercises: [
      {
        id: 'ex-005-1',
        type: 'multiple-choice',
        question: 'Who is your father\'s wife?',
        questionAr: 'من هي زوجة أبيك؟',
        options: ['Sister', 'Mother', 'Daughter', 'Aunt'],
        correctAnswer: 1,
        explanation: 'Your father\'s wife is your mother.',
        explanationAr: 'زوجة أبيك هي أمك.'
      },
      {
        id: 'ex-005-2',
        type: 'fill-blank',
        question: 'My _____ is a teacher. (female parent)',
        questionAr: '_____ معلمة. (الوالدة الأنثى)',
        correctAnswer: 'mother',
        explanation: 'Mother is the female parent.',
        explanationAr: 'Mother هي الوالدة الأنثى.'
      }
    ]
  }
];

// المزيد من الدروس سيتم إضافتها للوصول إلى 50 درس
// هذا مجرد بداية للمحتوى التعليمي

export const getA1LessonById = (id: string): A1Lesson | undefined => {
  return a1Lessons.find(lesson => lesson.id === id);
};

export const getA1LessonsByUnit = (unit: number): A1Lesson[] => {
  return a1Lessons.filter(lesson => lesson.unit === unit);
};

export const getA1LessonsByCategory = (category: string): A1Lesson[] => {
  return a1Lessons.filter(lesson => lesson.category === category);
};

export const getAllA1Lessons = (): A1Lesson[] => {
  return a1Lessons;
};
