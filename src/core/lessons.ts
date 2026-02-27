// 10 دروس أساسية متكاملة للمستخدم العربي
// مصمم لـ Grade 4 - المستوى A1

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  unit: number;
  duration: number; // in minutes
  level: 'beginner' | 'elementary' | 'intermediate';
  vocabulary: LessonVocabulary[];
  grammar?: GrammarRule[];
  exercises: LessonExercise[];
  reading?: ReadingContent;
  isNew?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonVocabulary {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleAr: string;
  category: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  titleAr: string;
  explanation: string;
  explanationAr: string;
  examples: string[];
  examplesAr: string[];
  rules?: string[];
}

export interface LessonExercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'ordering' | 'speaking' | 'listening';
  question: string;
  questionAr: string;
  options?: string[];
  optionsAr?: string[];
  correctAnswer: string | number;
  explanation: string;
  explanationAr: string;
  hint?: string;
  hintAr?: string;
  points: number;
}

export interface ReadingContent {
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  difficulty: 'easy' | 'medium';
  words: number;
  englishLevel: string;
}

// **الدرس 1: التحيات والأساسيات**
export const lesson1: Lesson = {
  id: 'lesson-001',
  title: 'Hello and Greetings',
  titleAr: 'التحيات والوداع',
  description: 'Learn basic English greetings and how to introduce yourself',
  descriptionAr: 'تعلم التحيات الأساسية والتعريف عن نفسك بالإنجليزية',
  unit: 1,
  duration: 10,
  level: 'beginner',
  difficulty: 'easy',
  isNew: true,
  vocabulary: [
    {
      id: 'v1-1',
      word: 'Hello',
      translation: 'مرحباً',
      pronunciation: 'hə-ˈlō',
      example: 'Hello, my name is Sara!',
      exampleAr: 'مرحباً، اسمي سارة!',
      category: 'greetings'
    },
    {
      id: 'v1-2',
      word: 'Hi',
      translation: 'أهلاً / مرحبا',
      pronunciation: 'hī',
      example: 'Hi, how are you?',
      exampleAr: 'مرحباً، كيف حالك؟',
      category: 'greetings'
    },
    {
      id: 'v1-3',
      word: 'Good morning',
      translation: 'صباح الخير',
      pronunciation: 'ˌɡu̇d-ˈmȯr-niŋ',
      example: 'Good morning! Have a great day!',
      exampleAr: 'صباح الخير! اجعل يومك رائعاً!',
      category: 'greetings'
    },
    {
      id: 'v1-4',
      word: 'Good afternoon',
      translation: 'تحية بعد الظهر',
      pronunciation: 'ˌɡu̇d-ˌaf-tər-ˈnün',
      example: 'Good afternoon, everyone!',
      exampleAr: 'مساء الخير للجميع!',
      category: 'greetings'
    },
    {
      id: 'v1-5',
      word: 'Good evening',
      translation: 'مساء الخير',
      pronunciation: 'ˌɡu̇d-ˈēv-niŋ',
      example: 'Good evening, would you like some tea?',
      exampleAr: 'مساء الخير، هل تريد الشاي؟',
      category: 'greetings'
    },
    {
      id: 'v1-6',
      word: 'Goodbye',
      translation: 'وداعاً',
      pronunciation: 'ˌɡu̇d-ˈbī',
      example: 'Goodbye! See you tomorrow!',
      exampleAr: 'وداعاً! أراك غداً!',
      category: 'farewells'
    },
    {
      id: 'v1-7',
      word: 'Bye',
      translation: 'باي / مع السلامة',
      pronunciation: 'bī',
      example: 'Bye, take care!',
      exampleAr: 'مع السلامة، اعتن بنفسك!',
      category: 'farewells'
    },
    {
      id: 'v1-8',
      word: 'See you soon',
      translation: 'أراك قريباً',
      pronunciation: 'ˌsē-(ˌ)yü-ˈsün',
      example: 'See you soon, friend!',
      exampleAr: 'أراك قريباً يا صديقي!',
      category: 'farewells'
    },
    {
      id: 'v1-9',
      word: 'My name is',
      translation: 'اسمي هو',
      pronunciation: 'mī-ˈnām-ˌiz',
      example: 'My name is Ahmed.',
      exampleAr: 'اسمي أحمد.',
      category: 'introduction'
    },
    {
      id: 'v1-10',
      word: 'Nice to meet you',
      translation: 'يسعدني التعرف عليك',
      pronunciation: 'ˌnīs-tə-ˈmēt-ˌyü',
      example: 'Nice to meet you, Sarah!',
      exampleAr: 'يسعدني التعرف عليك يا سارة!',
      category: 'social'
    }
  ],
  grammar: [
    {
      id: 'g1-1',
      title: 'Simple Greetings',
      titleAr: 'التحيات البسيطة',
      explanation: 'Greetings are the first words you say when meeting someone.',
      explanationAr: 'التحيات هي أول كلمات تقولها عند لقاء شخص ما.',
      examples: ['Hello!', 'Hi!', 'Good morning!'],
      examplesAr: ['مرحباً!', 'مرحبا!', 'صباح الخير!'],
      rules: [
        'Always start a conversation with a greeting',
        'Different greetings are used at different times of day',
        'Greetings can be followed by "How are you?"'
      ]
    }
  ],
  exercises: [
    {
      id: 'ex1-1',
      type: 'multiple-choice',
      question: 'What do you say when you meet someone in the morning?',
      questionAr: 'ماذا تقول عندما تقابل شخصاً في الصباح؟',
      options: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
      optionsAr: ['تصبح على خير', 'صباح الخير', 'مساء الخير', 'تصبح على خير'],
      correctAnswer: 1,
      explanation: '"Good morning" is the correct greeting for the morning.',
      explanationAr: '"صباح الخير" هي التحية الصحيحة للصباح.',
      points: 10
    },
    {
      id: 'ex1-2',
      type: 'fill-blank',
      question: 'My ____ is Ahmed.',
      questionAr: 'اسمي هو أحمد ____ .',
      correctAnswer: 'name',
      explanation: 'We use "name" to complete the phrase "My name is..."',
      explanationAr: 'نستخدم "name" لإكمال التعبير "My name is..."',
      points: 10,
      hint: 'The word means what people call you'
    },
    {
      id: 'ex1-3',
      type: 'multiple-choice',
      question: 'What should you say before leaving?',
      questionAr: 'ماذا تقول قبل المغادرة؟',
      options: ['Hello', 'Hi', 'Goodbye', 'Good morning'],
      optionsAr: ['مرحباً', 'مرحبا', 'وداعاً', 'صباح الخير'],
      correctAnswer: 2,
      explanation: '"Goodbye" or "Bye" is used when leaving someone.',
      explanationAr: 'نستخدم "وداعاً" أو "باي" عند المغادرة.',
      points: 10
    },
    {
      id: 'ex1-4',
      type: 'matching',
      question: 'Match greetings with their meanings',
      questionAr: 'اربط بين التحيات ومعانيها',
      options: ['Hi', 'Goodbye', 'Good evening'],
      optionsAr: ['مرحبا', 'وداعاً', 'مساء الخير'],
      correctAnswer: 0,
      explanation: 'Matching helps you learn associations',
      explanationAr: 'تساعدك الربط على تعلم الارتباطات',
      points: 15
    }
  ],
  reading: {
    title: 'Hello World',
    titleAr: 'مرحباً بالعالم',
    content: 'Hello! My name is Maria. I am from Spain. Nice to meet you!',
    contentAr: 'مرحباً! اسمي ماريا. أنا من إسبانيا. يسعدني التعرف عليك!',
    difficulty: 'easy',
    words: 17,
    englishLevel: 'A1'
  }
};

// **الدرس 2: الأرقام من 1-10**
export const lesson2: Lesson = {
  id: 'lesson-002',
  title: 'Numbers 1-10',
  titleAr: 'الأرقام من 1-10',
  description: 'Learn to count and recognize numbers in English',
  descriptionAr: 'تعلم العد والتعرف على الأرقام بالإنجليزية',
  unit: 1,
  duration: 8,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v2-1',
      word: 'One',
      translation: 'واحد',
      pronunciation: 'wən',
      example: 'I have one apple.',
      exampleAr: 'لدي تفاحة واحدة.',
      category: 'numbers'
    },
    {
      id: 'v2-2',
      word: 'Two',
      translation: 'اثنان',
      pronunciation: 'tü',
      example: 'There are two books on the table.',
      exampleAr: 'هناك كتابان على الطاولة.',
      category: 'numbers'
    },
    {
      id: 'v2-3',
      word: 'Three',
      translation: 'ثلاثة',
      pronunciation: 'thrē',
      example: 'I see three birds in the sky.',
      exampleAr: 'أرى ثلاثة طيور في السماء.',
      category: 'numbers'
    },
    {
      id: 'v2-4',
      word: 'Four',
      translation: 'أربعة',
      pronunciation: 'fȯr',
      example: 'There are four seasons in a year.',
      exampleAr: 'هناك أربعة فصول في السنة.',
      category: 'numbers'
    },
    {
      id: 'v2-5',
      word: 'Five',
      translation: 'خمسة',
      pronunciation: 'fīv',
      example: 'I have five fingers on my hand.',
      exampleAr: 'لدي خمسة أصابع على يدي.',
      category: 'numbers'
    },
    {
      id: 'v2-6',
      word: 'Six',
      translation: 'ستة',
      pronunciation: 'siks',
      example: 'A spider has six legs.',
      exampleAr: 'للعنكبوت ستة أرجل.',
      category: 'numbers'
    },
    {
      id: 'v2-7',
      word: 'Seven',
      translation: 'سبعة',
      pronunciation: 'ˈsev-ən',
      example: 'There are seven days in a week.',
      exampleAr: 'هناك سبعة أيام في الأسبوع.',
      category: 'numbers'
    },
    {
      id: 'v2-8',
      word: 'Eight',
      translation: 'ثمانية',
      pronunciation: 'āt',
      example: 'An octopus has eight arms.',
      exampleAr: 'للأخطبوط ثمانية أذرع.',
      category: 'numbers'
    },
    {
      id: 'v2-9',
      word: 'Nine',
      translation: 'تسعة',
      pronunciation: 'nīn',
      example: 'There are nine planets.',
      exampleAr: 'توجد تسعة كواكب.',
      category: 'numbers'
    },
    {
      id: 'v2-10',
      word: 'Ten',
      translation: 'عشرة',
      pronunciation: 'ten',
      example: 'I have ten toes.',
      exampleAr: 'لدي عشرة أصابع في قدمي.',
      category: 'numbers'
    }
  ],
  exercises: [
    {
      id: 'ex2-1',
      type: 'multiple-choice',
      question: 'What number comes after five?',
      questionAr: 'ما الرقم الذي يأتي بعد الخمسة؟',
      options: ['Four', 'Five', 'Six', 'Seven'],
      correctAnswer: 2,
      explanation: '"Six" (6) comes after "Five" (5).',
      explanationAr: '"ستة" تأتي بعد "خمسة".',
      points: 10
    },
    {
      id: 'ex2-2',
      type: 'fill-blank',
      question: 'There are ____ days in a week.',
      questionAr: 'هناك ____ يوم في الأسبوع.',
      correctAnswer: 'seven',
      explanation: 'A week has 7 days.',
      explanationAr: 'الأسبوع يحتوي على 7 أيام.',
      points: 10
    },
    {
      id: 'ex2-3',
      type: 'multiple-choice',
      question: 'How many fingers do you have?',
      questionAr: 'كم عدد أصابعك؟',
      options: ['Five', 'Six', 'Seven', 'Eight'],
      correctAnswer: 0,
      explanation: 'Humans have five fingers on each hand.',
      explanationAr: 'للإنسان خمسة أصابع على كل يد.',
      points: 10
    }
  ]
};

// **الدرس 3: الألوان**
export const lesson3: Lesson = {
  id: 'lesson-003',
  title: 'Colors',
  titleAr: 'الألوان',
  description: 'Learn to identify and name colors in English',
  descriptionAr: 'تعلم التعرف على الألوان وتسميتها بالإنجليزية',
  unit: 1,
  duration: 8,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v3-1',
      word: 'Red',
      translation: 'أحمر',
      pronunciation: 'red',
      example: 'The apple is red.',
      exampleAr: 'التفاح أحمر.',
      category: 'colors'
    },
    {
      id: 'v3-2',
      word: 'Blue',
      translation: 'أزرق',
      pronunciation: 'blü',
      example: 'The sky is blue.',
      exampleAr: 'السماء زرقاء.',
      category: 'colors'
    },
    {
      id: 'v3-3',
      word: 'Green',
      translation: 'أخضر',
      pronunciation: 'grēn',
      example: 'The grass is green.',
      exampleAr: 'العشب أخضر.',
      category: 'colors'
    },
    {
      id: 'v3-4',
      word: 'Yellow',
      translation: 'أصفر',
      pronunciation: 'ˈyel-(ˌ)ō',
      example: 'The sun is yellow.',
      exampleAr: 'الشمس صفراء.',
      category: 'colors'
    },
    {
      id: 'v3-5',
      word: 'Black',
      translation: 'أسود',
      pronunciation: 'blak',
      example: 'The night is black.',
      exampleAr: 'الليل أسود.',
      category: 'colors'
    },
    {
      id: 'v3-6',
      word: 'White',
      translation: 'أبيض',
      pronunciation: 'hwīt',
      example: 'Snow is white.',
      exampleAr: 'الثلج أبيض.',
      category: 'colors'
    },
    {
      id: 'v3-7',
      word: 'Orange',
      translation: 'برتقالي',
      pronunciation: 'ˈȯr-inj',
      example: 'The orange fruit is orange.',
      exampleAr: 'البرتقالة برتقالية اللون.',
      category: 'colors'
    },
    {
      id: 'v3-8',
      word: 'Purple',
      translation: 'بنفسجي',
      pronunciation: 'ˈpər-pəl',
      example: 'This flower is purple.',
      exampleAr: 'هذا الزهرة بنفسجية.',
      category: 'colors'
    },
    {
      id: 'v3-9',
      word: 'Pink',
      translation: 'وردي',
      pronunciation: 'piŋk',
      example: 'A flamingo is pink.',
      exampleAr: 'طائر الفلامنجو وردي.',
      category: 'colors'
    },
    {
      id: 'v3-10',
      word: 'Brown',
      translation: 'بني',
      pronunciation: 'brau̇n',
      example: 'The tree is brown.',
      exampleAr: 'الشجرة بنية.',
      category: 'colors'
    }
  ],
  exercises: [
    {
      id: 'ex3-1',
      type: 'multiple-choice',
      question: 'What color is the sky?',
      questionAr: 'ما لون السماء؟',
      options: ['Red', 'Blue', 'Green', 'Yellow'],
      correctAnswer: 1,
      explanation: 'The sky is typically blue during the day.',
      explanationAr: 'السماء عادة ما تكون زرقاء أثناء النهار.',
      points: 10
    },
    {
      id: 'ex3-2',
      type: 'fill-blank',
      question: 'Snow is ____.',
      questionAr: 'الثلج ____ .',
      correctAnswer: 'white',
      explanation: 'Snow appears white due to its crystalline structure.',
      explanationAr: 'يظهر الثلج أبيض بسبب بنيته البلورية.',
      points: 10
    }
  ]
};

// **الدرس 4: أجزاء الجسم**
export const lesson4: Lesson = {
  id: 'lesson-004',
  title: 'Body Parts',
  titleAr: 'أجزاء الجسم',
  description: 'Learn the names of different body parts',
  descriptionAr: 'تعلم أسماء أجزاء الجسم المختلفة',
  unit: 2,
  duration: 10,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v4-1',
      word: 'Head',
      translation: 'رأس',
      pronunciation: 'hed',
      example: 'My head is round.',
      exampleAr: 'رأسي مستدير.',
      category: 'body'
    },
    {
      id: 'v4-2',
      word: 'Eye',
      translation: 'عين',
      pronunciation: 'ī',
      example: 'I have two eyes.',
      exampleAr: 'لدي عينان.',
      category: 'body'
    },
    {
      id: 'v4-3',
      word: 'Nose',
      translation: 'أنف',
      pronunciation: 'nōz',
      example: 'My nose smells flowers.',
      exampleAr: 'أنفي يشم الزهور.',
      category: 'body'
    },
    {
      id: 'v4-4',
      word: 'Mouth',
      translation: 'فم',
      pronunciation: 'mau̇th',
      example: 'I use my mouth to eat.',
      exampleAr: 'أستخدم فمي للأكل.',
      category: 'body'
    },
    {
      id: 'v4-5',
      word: 'Ear',
      translation: 'أذن',
      pronunciation: 'ir',
      example: 'I hear with my ears.',
      exampleAr: 'أسمع بأذني.',
      category: 'body'
    },
    {
      id: 'v4-6',
      word: 'Hand',
      translation: 'يد',
      pronunciation: 'hand',
      example: 'I have two hands.',
      exampleAr: 'لدي يدان.',
      category: 'body'
    },
    {
      id: 'v4-7',
      word: 'Foot',
      translation: 'قدم',
      pronunciation: 'fu̇t',
      example: 'I walk with my feet.',
      exampleAr: 'أمشي بقدمي.',
      category: 'body'
    },
    {
      id: 'v4-8',
      word: 'Arm',
      translation: 'ذراع',
      pronunciation: 'ärm',
      example: 'My arm is strong.',
      exampleAr: 'ذراعي قوية.',
      category: 'body'
    },
    {
      id: 'v4-9',
      word: 'Leg',
      translation: 'ساق',
      pronunciation: 'leg',
      example: 'I run with my legs.',
      exampleAr: 'أركض بساقي.',
      category: 'body'
    },
    {
      id: 'v4-10',
      word: 'Tooth',
      translation: 'سن',
      pronunciation: 'tüth',
      example: 'I have strong teeth.',
      exampleAr: 'لدي أسنان قوية.',
      category: 'body'
    }
  ],
  exercises: [
    {
      id: 'ex4-1',
      type: 'multiple-choice',
      question: 'With what do you see?',
      questionAr: 'بماذا ترى؟',
      options: ['Hands', 'Eyes', 'Nose', 'Mouth'],
      correctAnswer: 1,
      explanation: 'We see with our eyes.',
      explanationAr: 'نرى بعيوننا.',
      points: 10
    },
    {
      id: 'ex4-2',
      type: 'fill-blank',
      question: 'I walk with my ____.',
      questionAr: 'أمشي ب____ .',
      correctAnswer: 'feet',
      explanation: 'We use our feet to walk.',
      explanationAr: 'نستخدم أقدامنا للمشي.',
      points: 10
    }
  ]
};

// **الدرس 5: الحيوانات**
export const lesson5: Lesson = {
  id: 'lesson-005',
  title: 'Animals',
  titleAr: 'الحيوانات',
  description: 'Learn names of common animals',
  descriptionAr: 'تعلم أسماء الحيوانات الشائعة',
  unit: 2,
  duration: 10,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v5-1',
      word: 'Cat',
      translation: 'قطة',
      pronunciation: 'kat',
      example: 'A cat says meow.',
      exampleAr: 'القطة تقول مياو.',
      category: 'animals'
    },
    {
      id: 'v5-2',
      word: 'Dog',
      translation: 'كلب',
      pronunciation: 'dȯg',
      example: 'A dog is a good friend.',
      exampleAr: 'الكلب صديق جيد.',
      category: 'animals'
    },
    {
      id: 'v5-3',
      word: 'Bird',
      translation: 'طائر',
      pronunciation: 'bərd',
      example: 'A bird can fly.',
      exampleAr: 'الطائر يمكنه الطيران.',
      category: 'animals'
    },
    {
      id: 'v5-4',
      word: 'Fish',
      translation: 'سمكة',
      pronunciation: 'fish',
      example: 'A fish lives in water.',
      exampleAr: 'السمكة تعيش في الماء.',
      category: 'animals'
    },
    {
      id: 'v5-5',
      word: 'Lion',
      translation: 'أسد',
      pronunciation: 'ˈlī-ən',
      example: 'A lion is very strong.',
      exampleAr: 'الأسد قوي جداً.',
      category: 'animals'
    },
    {
      id: 'v5-6',
      word: 'Elephant',
      translation: 'فيل',
      pronunciation: 'ˈel-ə-fənt',
      example: 'An elephant is very big.',
      exampleAr: 'الفيل كبير جداً.',
      category: 'animals'
    },
    {
      id: 'v5-7',
      word: 'Monkey',
      translation: 'قرد',
      pronunciation: 'ˈməŋ-kē',
      example: 'A monkey is very smart.',
      exampleAr: 'القرد ذكي جداً.',
      category: 'animals'
    },
    {
      id: 'v5-8',
      word: 'Horse',
      translation: 'حصان',
      pronunciation: 'hȯrs',
      example: 'A horse can run very fast.',
      exampleAr: 'الحصان يمكنه الركض بسرعة كبيرة.',
      category: 'animals'
    },
    {
      id: 'v5-9',
      word: 'Cow',
      translation: 'بقرة',
      pronunciation: 'ˈkau̇',
      example: 'A cow produces milk.',
      exampleAr: 'البقرة تنتج الحليب.',
      category: 'animals'
    },
    {
      id: 'v5-10',
      word: 'Butterfly',
      translation: 'فراشة',
      pronunciation: 'ˈbət-ər-ˌflī',
      example: 'A butterfly is very beautiful.',
      exampleAr: 'الفراشة جميلة جداً.',
      category: 'animals'
    }
  ],
  exercises: [
    {
      id: 'ex5-1',
      type: 'multiple-choice',
      question: 'What sound does a dog make?',
      questionAr: 'ما الصوت الذي يصنعه الكلب؟',
      options: ['Meow', 'Bark', 'Roar', 'Chirp'],
      correctAnswer: 1,
      explanation: 'Dogs bark.',
      explanationAr: 'الكلاب تنبح.',
      points: 10
    }
  ]
};

// **الدرس 6: الفواكه والخضراوات**
export const lesson6: Lesson = {
  id: 'lesson-006',
  title: 'Fruits and Vegetables',
  titleAr: 'الفواكه والخضراوات',
  description: 'Learn names of common fruits and vegetables',
  descriptionAr: 'تعلم أسماء الفواكه والخضراوات الشائعة',
  unit: 2,
  duration: 10,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v6-1',
      word: 'Apple',
      translation: 'تفاح',
      pronunciation: 'ˈa-pəl',
      example: 'An apple is red.',
      exampleAr: 'التفاح أحمر.',
      category: 'fruits'
    },
    {
      id: 'v6-2',
      word: 'Banana',
      translation: 'موزة',
      pronunciation: 'bə-ˈna-nə',
      example: 'A banana is yellow.',
      exampleAr: 'الموزة صفراء.',
      category: 'fruits'
    },
    {
      id: 'v6-3',
      word: 'Orange',
      translation: 'برتقالة',
      pronunciation: 'ˈȯr-inj',
      example: 'An orange is juicy.',
      exampleAr: 'البرتقالة عصيرية.',
      category: 'fruits'
    },
    {
      id: 'v6-4',
      word: 'Strawberry',
      translation: 'فراولة',
      pronunciation: 'ˈstrȯ-ˌber-ē',
      example: 'Strawberries are sweet.',
      exampleAr: 'الفراولة حلوة.',
      category: 'fruits'
    },
    {
      id: 'v6-5',
      word: 'Carrot',
      translation: 'جزرة',
      pronunciation: 'ˈkar-ət',
      example: 'A carrot is orange.',
      exampleAr: 'الجزرة برتقالية.',
      category: 'vegetables'
    },
    {
      id: 'v6-6',
      word: 'Tomato',
      translation: 'طماطم',
      pronunciation: 'tə-ˈmā-(ˌ)tō',
      example: 'A tomato is red.',
      exampleAr: 'الطماطم حمراء.',
      category: 'vegetables'
    },
    {
      id: 'v6-7',
      word: 'Cucumber',
      translation: 'خيار',
      pronunciation: 'ˈkyü-ˌkəm-bər',
      example: 'A cucumber is green.',
      exampleAr: 'الخيار أخضر.',
      category: 'vegetables'
    },
    {
      id: 'v6-8',
      word: 'Potato',
      translation: 'بطاطا',
      pronunciation: 'pə-ˈtā-(ˌ)tō',
      example: 'Potatoes are delicious.',
      exampleAr: 'البطاطا لذيذة.',
      category: 'vegetables'
    },
    {
      id: 'v6-9',
      word: 'Grape',
      translation: 'عنب',
      pronunciation: 'ˈgrāp',
      example: 'Grapes are purple.',
      exampleAr: 'العنب بنفسجي.',
      category: 'fruits'
    },
    {
      id: 'v6-10',
      word: 'Lettuce',
      translation: 'خس',
      pronunciation: 'ˈlet-əs',
      example: 'Lettuce is green and healthy.',
      exampleAr: 'الخس أخضر وصحي.',
      category: 'vegetables'
    }
  ],
  exercises: [
    {
      id: 'ex6-1',
      type: 'multiple-choice',
      question: 'What color is a banana?',
      questionAr: 'ما لون الموزة؟',
      options: ['Red', 'Yellow', 'Green', 'Orange'],
      correctAnswer: 1,
      explanation: 'A banana is yellow.',
      explanationAr: 'الموزة صفراء.',
      points: 10
    }
  ]
};

// **الدرس 7: الملابس**
export const lesson7: Lesson = {
  id: 'lesson-007',
  title: 'Clothes',
  titleAr: 'الملابس',
  description: 'Learn names of different types of clothing',
  descriptionAr: 'تعلم أسماء أنواع مختلفة من الملابس',
  unit: 3,
  duration: 10,
  level: 'beginner',
  difficulty: 'medium',
  vocabulary: [
    {
      id: 'v7-1',
      word: 'Shirt',
      translation: 'قميص',
      pronunciation: 'ˈshərt',
      example: 'I wear a blue shirt.',
      exampleAr: 'ترتدي قميص أزرق.',
      category: 'clothing'
    },
    {
      id: 'v7-2',
      word: 'Pants',
      translation: 'بنطال',
      pronunciation: 'ˈpants',
      example: 'My pants are black.',
      exampleAr: 'بنطالي أسود.',
      category: 'clothing'
    },
    {
      id: 'v7-3',
      word: 'Dress',
      translation: 'فستان',
      pronunciation: 'ˈdres',
      example: 'She wears a red dress.',
      exampleAr: 'ترتدي فستان أحمر.',
      category: 'clothing'
    },
    {
      id: 'v7-4',
      word: 'Shoes',
      translation: 'حذاء',
      pronunciation: 'ˈshüz',
      example: 'I have new shoes.',
      exampleAr: 'لدي حذاء جديد.',
      category: 'clothing'
    },
    {
      id: 'v7-5',
      word: 'Hat',
      translation: 'قبعة',
      pronunciation: 'ˈhat',
      example: 'He wears a hat.',
      exampleAr: 'يرتدي قبعة.',
      category: 'clothing'
    },
    {
      id: 'v7-6',
      word: 'Jacket',
      translation: 'سترة',
      pronunciation: 'ˈja-kət',
      example: 'The jacket is warm.',
      exampleAr: 'السترة دافئة.',
      category: 'clothing'
    },
    {
      id: 'v7-7',
      word: 'Socks',
      translation: 'جوارب',
      pronunciation: 'ˈsäks',
      example: 'I wear white socks.',
      exampleAr: 'أرتدي جوارب بيضاء.',
      category: 'clothing'
    },
    {
      id: 'v7-8',
      word: 'Gloves',
      translation: 'قفازات',
      pronunciation: 'ˈɡləvz',
      example: 'Gloves keep my hands warm.',
      exampleAr: 'القفازات تحافظ على دفء يديّ.',
      category: 'clothing'
    },
    {
      id: 'v7-9',
      word: 'Scarf',
      translation: 'وشاح',
      pronunciation: 'ˈskärf',
      example: 'I like my blue scarf.',
      exampleAr: 'أحب وشاحي الأزرق.',
      category: 'clothing'
    },
    {
      id: 'v7-10',
      word: 'Tie',
      translation: 'ربطة عنق',
      pronunciation: 'ˈtī',
      example: 'He wears a tie.',
      exampleAr: 'يرتدي ربطة عنق.',
      category: 'clothing'
    }
  ],
  exercises: [
    {
      id: 'ex7-1',
      type: 'multiple-choice',
      question: 'What do you wear on your feet?',
      questionAr: 'ماذا ترتدي على قدميك؟',
      options: ['Hat', 'Shoes', 'Shirt', 'Pants'],
      correctAnswer: 1,
      explanation: 'We wear shoes on our feet.',
      explanationAr: 'نرتدي أحذية على أقدامنا.',
      points: 10
    }
  ]
};

// **الدرس 8: الأطعمة والمشروبات**
export const lesson8: Lesson = {
  id: 'lesson-008',
  title: 'Food and Drinks',
  titleAr: 'الطعام والمشروبات',
  description: 'Learn common food and drink items',
  descriptionAr: 'تعلم العناصر الشائعة من الطعام والمشروبات',
  unit: 3,
  duration: 10,
  level: 'beginner',
  difficulty: 'medium',
  vocabulary: [
    {
      id: 'v8-1',
      word: 'Bread',
      translation: 'خبز',
      pronunciation: 'ˈbred',
      example: 'I eat bread every day.',
      exampleAr: 'أكل الخبز كل يوم.',
      category: 'food'
    },
    {
      id: 'v8-2',
      word: 'Milk',
      translation: 'حليب',
      pronunciation: 'ˈmilk',
      example: 'Milk is healthy.',
      exampleAr: 'الحليب صحي.',
      category: 'drinks'
    },
    {
      id: 'v8-3',
      word: 'Cheese',
      translation: 'جبن',
      pronunciation: 'ˈchēz',
      example: 'I like cheese.',
      exampleAr: 'أحب الجبن.',
      category: 'food'
    },
    {
      id: 'v8-4',
      word: 'Egg',
      translation: 'بيضة',
      pronunciation: 'ˈeg',
      example: 'Eggs are nutritious.',
      exampleAr: 'البيض غني بالعناصر الغذائية.',
      category: 'food'
    },
    {
      id: 'v8-5',
      word: 'Rice',
      translation: 'أرز',
      pronunciation: 'ˈrīs',
      example: 'Rice is delicious.',
      exampleAr: 'الأرز لذيذ.',
      category: 'food'
    },
    {
      id: 'v8-6',
      word: 'Chicken',
      translation: 'دجاج',
      pronunciation: 'ˈchi-kən',
      example: 'Chicken is tasty.',
      exampleAr: 'الدجاج لذيذ.',
      category: 'food'
    },
    {
      id: 'v8-7',
      word: 'Water',
      translation: 'ماء',
      pronunciation: 'ˈwȯ-tər',
      example: 'Drink water every day.',
      exampleAr: 'اشرب الماء كل يوم.',
      category: 'drinks'
    },
    {
      id: 'v8-8',
      word: 'Coffee',
      translation: 'قهوة',
      pronunciation: 'ˈkȯ-fē',
      example: 'I drink coffee in the morning.',
      exampleAr: 'أشرب القهوة في الصباح.',
      category: 'drinks'
    },
    {
      id: 'v8-9',
      word: 'Tea',
      translation: 'شاي',
      pronunciation: 'ˈtē',
      example: 'Tea is relaxing.',
      exampleAr: 'الشاي مريح.',
      category: 'drinks'
    },
    {
      id: 'v8-10',
      word: 'Juice',
      translation: 'عصير',
      pronunciation: 'ˈjüs',
      example: 'Orange juice is tasty.',
      exampleAr: 'عصير البرتقال لذيذ.',
      category: 'drinks'
    }
  ],
  exercises: [
    {
      id: 'ex8-1',
      type: 'multiple-choice',
      question: 'What is a healthy drink?',
      questionAr: 'ما هو المشروب الصحي؟',
      options: ['Soda', 'Water', 'Juice', 'Coffee'],
      correctAnswer: 1,
      explanation: 'Water is the healthiest drink.',
      explanationAr: 'الماء هو أصح مشروب.',
      points: 10
    }
  ]
};

// **الدرس 9: الأيام والأسابيع**
export const lesson9: Lesson = {
  id: 'lesson-009',
  title: 'Days and Weeks',
  titleAr: 'الأيام والأسابيع',
  description: 'Learn the days of the week and time concepts',
  descriptionAr: 'تعلم أيام الأسبوع ومفاهيم الوقت',
  unit: 3,
  duration: 8,
  level: 'beginner',
  difficulty: 'easy',
  vocabulary: [
    {
      id: 'v9-1',
      word: 'Monday',
      translation: 'الاثنين',
      pronunciation: 'ˈmən-dē',
      example: 'Monday is the first day of the week.',
      exampleAr: 'الاثنين هو أول يوم في الأسبوع.',
      category: 'days'
    },
    {
      id: 'v9-2',
      word: 'Tuesday',
      translation: 'الثلاثاء',
      pronunciation: 'ˈtüz-dē',
      example: 'I have English class on Tuesday.',
      exampleAr: 'لدي فصل إنجليزي يوم الثلاثاء.',
      category: 'days'
    },
    {
      id: 'v9-3',
      word: 'Wednesday',
      translation: 'الأربعاء',
      pronunciation: 'ˈwenz-dē',
      example: 'Wednesday is in the middle of the week.',
      exampleAr: 'الأربعاء في منتصف الأسبوع.',
      category: 'days'
    },
    {
      id: 'v9-4',
      word: 'Thursday',
      translation: 'الخميس',
      pronunciation: 'ˈthərz-dē',
      example: 'Thursday is before Friday.',
      exampleAr: 'الخميس قبل الجمعة.',
      category: 'days'
    },
    {
      id: 'v9-5',
      word: 'Friday',
      translation: 'الجمعة',
      pronunciation: 'ˈfrī-dē',
      example: 'I like Friday because of the weekend.',
      exampleAr: 'أحب الجمعة بسبب نهاية الأسبوع.',
      category: 'days'
    },
    {
      id: 'v9-6',
      word: 'Saturday',
      translation: 'السبت',
      pronunciation: 'ˈsa-tər-dē',
      example: 'Saturday and Sunday are weekends.',
      exampleAr: 'السبت والأحد هما نهاية الأسبوع.',
      category: 'days'
    },
    {
      id: 'v9-7',
      word: 'Sunday',
      translation: 'الأحد',
      pronunciation: 'ˈsən-dē',
      example: 'I rest on Sunday.',
      exampleAr: 'أستريح يوم الأحد.',
      category: 'days'
    },
    {
      id: 'v9-8',
      word: 'Week',
      translation: 'أسبوع',
      pronunciation: 'ˈwēk',
      example: 'There are 7 days in a week.',
      exampleAr: 'هناك 7 أيام في الأسبوع.',
      category: 'time'
    },
    {
      id: 'v9-9',
      word: 'Today',
      translation: 'اليوم',
      pronunciation: 'tu̇ˈdā',
      example: 'Today is Monday.',
      exampleAr: 'اليوم هو الاثنين.',
      category: 'time'
    },
    {
      id: 'v9-10',
      word: 'Tomorrow',
      translation: 'غداً',
      pronunciation: 'tə-ˈmȧr-(ˌ)ō',
      example: 'Tomorrow will be Tuesday.',
      exampleAr: 'غداً هو الثلاثاء.',
      category: 'time'
    }
  ],
  exercises: [
    {
      id: 'ex9-1',
      type: 'multiple-choice',
      question: 'How many days are in a week?',
      questionAr: 'كم عدد أيام الأسبوع؟',
      options: ['5 days', '6 days', '7 days', '8 days'],
      correctAnswer: 2,
      explanation: 'There are 7 days in a week.',
      explanationAr: 'هناك 7 أيام في الأسبوع.',
      points: 10
    }
  ]
};

// **الدرس 10: الشهور والفصول**
export const lesson10: Lesson = {
  id: 'lesson-010',
  title: 'Months and Seasons',
  titleAr: 'الشهور والفصول',
  description: 'Learn the months of the year and seasons',
  descriptionAr: 'تعلم شهور السنة والفصول',
  unit: 4,
  duration: 10,
  level: 'beginner',
  difficulty: 'medium',
  vocabulary: [
    {
      id: 'v10-1',
      word: 'January',
      translation: 'يناير',
      pronunciation: 'ˈja-nü-ˌwer-ē',
      example: 'January is the first month.',
      exampleAr: 'يناير هو الشهر الأول.',
      category: 'months'
    },
    {
      id: 'v10-2',
      word: 'February',
      translation: 'فبراير',
      pronunciation: 'ˈfe-brü-ˌwer-ē',
      example: 'February is a short month.',
      exampleAr: 'فبراير شهر قصير.',
      category: 'months'
    },
    {
      id: 'v10-3',
      word: 'March',
      translation: 'مارس',
      pronunciation: 'ˈmärch',
      example: 'Spring starts in March.',
      exampleAr: 'الربيع يبدأ في مارس.',
      category: 'months'
    },
    {
      id: 'v10-4',
      word: 'April',
      translation: 'أبريل',
      pronunciation: 'ˈā-prəl',
      example: 'April is a beautiful month.',
      exampleAr: 'أبريل شهر جميل.',
      category: 'months'
    },
    {
      id: 'v10-5',
      word: 'May',
      translation: 'مايو',
      pronunciation: 'ˈmā',
      example: 'I like May because of the weather.',
      exampleAr: 'أحب مايو بسبب الطقس.',
      category: 'months'
    },
    {
      id: 'v10-6',
      word: 'Summer',
      translation: 'الصيف',
      pronunciation: 'ˈsə-mər',
      example: 'Summer is hot and sunny.',
      exampleAr: 'الصيف حار وسطع الشمس.',
      category: 'seasons'
    },
    {
      id: 'v10-7',
      word: 'Autumn',
      translation: 'الخريف',
      pronunciation: 'ˈȯ-təm',
      example: 'Autumn leaves are beautiful.',
      exampleAr: 'أوراق الخريف جميلة.',
      category: 'seasons'
    },
    {
      id: 'v10-8',
      word: 'Winter',
      translation: 'الشتاء',
      pronunciation: 'ˈwin-tər',
      example: 'Winter is cold.',
      exampleAr: 'الشتاء بارد.',
      category: 'seasons'
    },
    {
      id: 'v10-9',
      word: 'Spring',
      translation: 'الربيع',
      pronunciation: 'ˈspriŋ',
      example: 'Spring flowers are lovely.',
      exampleAr: 'زهور الربيع جميلة.',
      category: 'seasons'
    },
    {
      id: 'v10-10',
      word: 'Year',
      translation: 'سنة',
      pronunciation: 'ˈyir',
      example: 'There are 12 months in a year.',
      exampleAr: 'هناك 12 شهر في السنة.',
      category: 'time'
    }
  ],
  exercises: [
    {
      id: 'ex10-1',
      type: 'multiple-choice',
      question: 'How many months are in a year?',
      questionAr: 'كم عدد الشهور في السنة؟',
      options: ['10 months', '11 months', '12 months', '13 months'],
      correctAnswer: 2,
      explanation: 'There are 12 months in a year.',
      explanationAr: 'هناك 12 شهر في السنة.',
      points: 10
    }
  ]
};

// تصديرالكل الدروس كمصفوفة
export const allLessons: Lesson[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
  lesson7,
  lesson8,
  lesson9,
  lesson10
];

// دالة للبحث عن درس بالمعرف
export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find(lesson => lesson.id === id);
}

// دالة للحصول على جميع المفردات
export function getAllVocabulary(): LessonVocabulary[] {
  return allLessons.flatMap(lesson => lesson.vocabulary);
}

// دالة للحصول على جميع التمارين
export function getAllExercises(): LessonExercise[] {
  return allLessons.flatMap(lesson => lesson.exercises);
}
