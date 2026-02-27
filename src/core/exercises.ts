// 50 تمرين تفاعلي متنوع
// مصمم لـ A1 Level

export interface Exercise {
  id: string;
  lessonId: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'ordering' | 'listening' | 'speaking' | 'true-false';
  question: string;
  questionAr: string;
  instructions?: string;
  instructionsAr?: string;
  options?: Array<{
    text: string;
    textAr: string;
  }>;
  correctAnswer: string | number | number[]; // for matching/ordering, can be multiple
  explanation: string;
  explanationAr: string;
  hint?: string;
  hintAr?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number; // in seconds
  category: string;
}

// ===== مهام التحيات (الدرس 1) - 5 تمارين
export const exercises1: Exercise[] = [
  {
    id: 'ex-greeting-1',
    lessonId: 'lesson-001',
    type: 'multiple-choice',
    question: 'What is the correct way to greet someone in the morning?',
    questionAr: 'ما هي الطريقة الصحيحة لتحية شخص ما في الصباح؟',
    options: [
      { text: 'Good afternoon', textAr: 'مساء الخير' },
      { text: 'Good morning', textAr: 'صباح الخير' },
      { text: 'Good evening', textAr: 'مساء الخير' },
      { text: 'Good night', textAr: 'تصبح على خير' }
    ],
    correctAnswer: 1,
    explanation: 'Good morning is the correct greeting for the morning time.',
    explanationAr: 'صباح الخير هي التحية الصحيحة في وقت الصباح.',
    points: 10,
    difficulty: 'easy',
    category: 'greetings'
  },
  {
    id: 'ex-greeting-2',
    lessonId: 'lesson-001',
    type: 'fill-blank',
    question: 'My ____ is Ahmed.',
    questionAr: 'اسمي هو أحمد ____.',
    correctAnswer: 'name',
    explanation: 'We use "name" to tell someone what we are called.',
    explanationAr: 'نستخدم "name" لنخبر شخصاً بما يُطلق علينا.',
    hint: 'What do people call you? (singular noun)',
    hintAr: 'ماذا يناديك الناس؟ (اسم مفرد)',
    points: 10,
    difficulty: 'easy',
    category: 'introduction'
  },
  {
    id: 'ex-greeting-3',
    lessonId: 'lesson-001',
    type: 'true-false',
    question: '"Goodbye" means you are leaving someone.',
    questionAr: '"وداعاً" تعني أنك تترك شخصاً ما.',
    correctAnswer: 0, // 0 = true, 1 = false in this context, but we use boolean or number
    explanation: 'True, goodbye is used when leaving someone.',
    explanationAr: 'صحيح، نستخدم وداعاً عند ترك شخص ما.',
    points: 10,
    difficulty: 'easy',
    category: 'farewells'
  },
  {
    id: 'ex-greeting-4',
    lessonId: 'lesson-001',
    type: 'matching',
    question: 'Match English greetings with Arabic meanings:',
    questionAr: 'تطابق بين التحيات الإنجليزية ومعانيها بالعربية:',
    options: [
      { text: 'Hi', textAr: 'مرحبا' },
      { text: 'Goodbye', textAr: 'وداعاً' },
      { text: 'Good morning', textAr: 'صباح الخير' }
    ],
    correctAnswer: [0, 1, 2], // positions match
    explanation: 'These are direct translations of common greetings.',
    explanationAr: 'هذه ترجمات مباشرة للتحيات الشائعة.',
    points: 15,
    difficulty: 'easy',
    category: 'greetings'
  },
  {
    id: 'ex-greeting-5',
    lessonId: 'lesson-001',
    type: 'fill-blank',
    question: '____! Nice to meet you.',
    questionAr: '____! يسعدني التعرف عليك.',
    correctAnswer: 'Hello',
    explanation: 'Hello is a common greeting before meeting someone.',
    explanationAr: 'مرحباً هي تحية شائعة قبل لقاء شخص ما.',
    points: 10,
    difficulty: 'easy',
    category: 'greetings'
  }
];

// ===== مهام الأرقام (الدرس 2) - 5 تمارين
export const exercises2: Exercise[] = [
  {
    id: 'ex-numbers-1',
    lessonId: 'lesson-002',
    type: 'multiple-choice',
    question: 'What number comes after seven?',
    questionAr: 'ما الرقم الذي يأتي بعد سبعة؟',
    options: [
      { text: 'Six', textAr: 'ستة' },
      { text: 'Seven', textAr: 'سبعة' },
      { text: 'Eight', textAr: 'ثمانية' },
      { text: 'Nine', textAr: 'تسعة' }
    ],
    correctAnswer: 2,
    explanation: 'Eight (8) comes after Seven (7).',
    explanationAr: 'ثمانية تأتي بعد سبعة.',
    points: 10,
    difficulty: 'easy',
    category: 'numbers'
  },
  {
    id: 'ex-numbers-2',
    lessonId: 'lesson-002',
    type: 'matching',
    question: 'Match numbers with their English words:',
    questionAr: 'تطابق بين الأرقام والكلمات الإنجليزية:',
    options: [
      { text: '1', textAr: 'One' },
      { text: '5', textAr: 'Five' },
      { text: '10', textAr: 'Ten' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are basic number translations.',
    explanationAr: 'هذه ترجمات أرقام أساسية.',
    points: 15,
    difficulty: 'easy',
    category: 'numbers'
  },
  {
    id: 'ex-numbers-3',
    lessonId: 'lesson-002',
    type: 'fill-blank',
    question: 'There are ____ days in a week.',
    questionAr: 'هناك ____ يوم في الأسبوع.',
    correctAnswer: 'seven',
    explanation: 'A week has 7 days: Monday through Sunday.',
    explanationAr: 'الأسبوع يحتوي على 7 أيام من الاثنين إلى الأحد.',
    hint: 'Think about the days of the week',
    hintAr: 'فكر في أيام الأسبوع',
    points: 10,
    difficulty: 'easy',
    category: 'numbers'
  },
  {
    id: 'ex-numbers-4',
    lessonId: 'lesson-002',
    type: 'true-false',
    question: 'A spider has four legs.',
    questionAr: 'للعنكبوت أربعة أرجل.',
    correctAnswer: 1, // false
    explanation: 'False, a spider has eight legs.',
    explanationAr: 'خطأ، للعنكبوت ثمانية أرجل.',
    points: 10,
    difficulty: 'medium',
    category: 'numbers'
  },
  {
    id: 'ex-numbers-5',
    lessonId: 'lesson-002',
    type: 'fill-blank',
    question: 'I have ____ fingers on my hand.',
    questionAr: 'لدي ____ أصابع على يدي.',
    correctAnswer: 'five',
    explanation: 'Humans have five fingers on each hand.',
    explanationAr: 'للإنسان خمسة أصابع على كل يد.',
    points: 10,
    difficulty: 'easy',
    category: 'numbers'
  }
];

// ===== مهام الألوان (الدرس 3) - 5 تمارين
export const exercises3: Exercise[] = [
  {
    id: 'ex-colors-1',
    lessonId: 'lesson-003',
    type: 'multiple-choice',
    question: 'What color is grass?',
    questionAr: 'ما لون العشب؟',
    options: [
      { text: 'Red', textAr: 'أحمر' },
      { text: 'Blue', textAr: 'أزرق' },
      { text: 'Green', textAr: 'أخضر' },
      { text: 'Yellow', textAr: 'أصفر' }
    ],
    correctAnswer: 2,
    explanation: 'Grass is green.',
    explanationAr: 'العشب أخضر.',
    points: 10,
    difficulty: 'easy',
    category: 'colors'
  },
  {
    id: 'ex-colors-2',
    lessonId: 'lesson-003',
    type: 'fill-blank',
    question: 'The sky is ____.',
    questionAr: 'السماء ____.',
    correctAnswer: 'blue',
    explanation: 'The sky appears blue during the day.',
    explanationAr: 'السماء تبدو زرقاء أثناء النهار.',
    points: 10,
    difficulty: 'easy',
    category: 'colors'
  },
  {
    id: 'ex-colors-3',
    lessonId: 'lesson-003',
    type: 'matching',
    question: 'Match colors with objects:',
    questionAr: 'تطابق بين الألوان والأشياء:',
    options: [
      { text: 'Black', textAr: 'الليل' },
      { text: 'White', textAr: 'الثلج' },
      { text: 'Red', textAr: 'التفاح' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are typical colors of these objects.',
    explanationAr: 'هذه الألوان النموذجية لهذه الأشياء.',
    points: 15,
    difficulty: 'medium',
    category: 'colors'
  },
  {
    id: 'ex-colors-4',
    lessonId: 'lesson-003',
    type: 'true-false',
    question: 'An orange is green.',
    questionAr: 'البرتقالة خضراء.',
    correctAnswer: 1, // false
    explanation: 'False, an orange is orange in color.',
    explanationAr: 'خطأ، البرتقالة برتقالية اللون.',
    points: 10,
    difficulty: 'easy',
    category: 'colors'
  },
  {
    id: 'ex-colors-5',
    lessonId: 'lesson-003',
    type: 'fill-blank',
    question: 'Snow is ____.',
    questionAr: 'الثلج ____.',
    correctAnswer: 'white',
    explanation: 'Snow is white in color.',
    explanationAr: 'الثلج أبيض اللون.',
    points: 10,
    difficulty: 'easy',
    category: 'colors'
  }
];

// ===== مهام أجزاء الجسم (الدرس 4) - 5 تمارين
export const exercises4: Exercise[] = [
  {
    id: 'ex-body-1',
    lessonId: 'lesson-004',
    type: 'multiple-choice',
    question: 'With what do you see?',
    questionAr: 'بماذا ترى؟',
    options: [
      { text: 'Hands', textAr: 'أيدي' },
      { text: 'Eyes', textAr: 'عيون' },
      { text: 'Ears', textAr: 'آذان' },
      { text: 'Nose', textAr: 'أنف' }
    ],
    correctAnswer: 1,
    explanation: 'We see with our eyes.',
    explanationAr: 'نرى بعيوننا.',
    points: 10,
    difficulty: 'easy',
    category: 'body'
  },
  {
    id: 'ex-body-2',
    lessonId: 'lesson-004',
    type: 'fill-blank',
    question: 'I walk with my ____.',
    questionAr: 'أمشي ب____.',
    correctAnswer: 'feet',
    explanation: 'We walk using our feet.',
    explanationAr: 'نمشي باستخدام أقدامنا.',
    hint: 'Body part at the end of your leg',
    hintAr: 'جزء الجسم في نهاية ساقك',
    points: 10,
    difficulty: 'easy',
    category: 'body'
  },
  {
    id: 'ex-body-3',
    lessonId: 'lesson-004',
    type: 'matching',
    question: 'Match body parts with their functions:',
    questionAr: 'تطابق بين أجزاء الجسم ووظائفها:',
    options: [
      { text: 'Ears', textAr: 'السمع' },
      { text: 'Nose', textAr: 'الشم' },
      { text: 'Mouth', textAr: 'الأكل' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These functions are performed by their respective body parts.',
    explanationAr: 'يتم تنفيذ هذه الوظائف بواسطة أجزاء الجسم الخاصة بها.',
    points: 15,
    difficulty: 'medium',
    category: 'body'
  },
  {
    id: 'ex-body-4',
    lessonId: 'lesson-004',
    type: 'true-false',
    question: 'Humans have one head.',
    questionAr: 'الإنسان له رأس واحد.',
    correctAnswer: 0, // true
    explanation: 'True, humans have one head.',
    explanationAr: 'صحيح، للإنسان رأس واحد.',
    points: 10,
    difficulty: 'easy',
    category: 'body'
  },
  {
    id: 'ex-body-5',
    lessonId: 'lesson-004',
    type: 'fill-blank',
    question: 'I eat with my ____.',
    questionAr: 'أكل ب____.',
    correctAnswer: 'mouth',
    explanation: 'We eat using our mouth.',
    explanationAr: 'نأكل باستخدام فمنا.',
    points: 10,
    difficulty: 'easy',
    category: 'body'
  }
];

// ===== مهام الحيوانات (الدرس 5) - 5 تمارين
export const exercises5: Exercise[] = [
  {
    id: 'ex-animals-1',
    lessonId: 'lesson-005',
    type: 'multiple-choice',
    question: 'What sound does a dog make?',
    questionAr: 'ما الصوت الذي يصدره الكلب؟',
    options: [
      { text: 'Meow', textAr: 'مياو' },
      { text: 'Bark', textAr: 'نباح' },
      { text: 'Roar', textAr: 'زئير' },
      { text: 'Chirp', textAr: 'تغريد' }
    ],
    correctAnswer: 1,
    explanation: 'Dogs bark.',
    explanationAr: 'الكلاب تنبح.',
    points: 10,
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'ex-animals-2',
    lessonId: 'lesson-005',
    type: 'fill-blank',
    question: 'A fish lives in ____.',
    questionAr: 'السمكة تعيش في ____.',
    correctAnswer: 'water',
    explanation: 'Fish live in water.',
    explanationAr: 'تعيش الأسماك في الماء.',
    points: 10,
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'ex-animals-3',
    lessonId: 'lesson-005',
    type: 'matching',
    question: 'Match animals with their habitats:',
    questionAr: 'تطابق بين الحيوانات وموطنها:',
    options: [
      { text: 'Bird', textAr: 'السماء' },
      { text: 'Fish', textAr: 'الماء' },
      { text: 'Lion', textAr: 'الغابة' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'Animals live in their natural habitats.',
    explanationAr: 'تعيش الحيوانات في موطنها الطبيعي.',
    points: 15,
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'ex-animals-4',
    lessonId: 'lesson-005',
    type: 'true-false',
    question: 'A butterfly can fly.',
    questionAr: 'الفراشة يمكنها الطيران.',
    correctAnswer: 0, // true
    explanation: 'True, butterflies can fly.',
    explanationAr: 'صحيح، الفراشات يمكنها الطيران.',
    points: 10,
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'ex-animals-5',
    lessonId: 'lesson-005',
    type: 'fill-blank',
    question: 'An elephant is very ____.',
    questionAr: 'الفيل ____جداً.',
    correctAnswer: 'big',
    explanation: 'Elephants are the largest land animals.',
    explanationAr: 'الأفيال هي أكبر الحيوانات البرية.',
    hint: 'Think about the size of an elephant',
    hintAr: 'فكر في حجم الفيل',
    points: 10,
    difficulty: 'easy',
    category: 'animals'
  }
];

// ===== مهام الفواكه والخضراوات (الدرس 6) - 5 تمارين
export const exercises6: Exercise[] = [
  {
    id: 'ex-food-1',
    lessonId: 'lesson-006',
    type: 'multiple-choice',
    question: 'What color is a banana?',
    questionAr: 'ما لون الموزة؟',
    options: [
      { text: 'Red', textAr: 'أحمر' },
      { text: 'Yellow', textAr: 'أصفر' },
      { text: 'Green', textAr: 'أخضر' },
      { text: 'Orange', textAr: 'برتقالي' }
    ],
    correctAnswer: 1,
    explanation: 'A ripe banana is yellow.',
    explanationAr: 'الموزة الناضجة صفراء.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-food-2',
    lessonId: 'lesson-006',
    type: 'fill-blank',
    question: 'A carrot is ____.',
    questionAr: 'الجزرة ____.',
    correctAnswer: 'orange',
    explanation: 'Carrots are orange in color.',
    explanationAr: 'الجزر برتقالية اللون.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-food-3',
    lessonId: 'lesson-006',
    type: 'matching',
    question: 'Match foods with their types:',
    questionAr: 'تطابق بين الأطعمة ونوعها:',
    options: [
      { text: 'Apple', textAr: 'فاكهة' },
      { text: 'Tomato', textAr: 'خضار' },
      { text: 'Banana', textAr: 'فاكهة' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'Apples and bananas are fruits, tomatoes are vegetables.',
    explanationAr: 'التفاح والموز فواكه، الطماطم خضار.',
    points: 15,
    difficulty: 'medium',
    category: 'food'
  },
  {
    id: 'ex-food-4',
    lessonId: 'lesson-006',
    type: 'true-false',
    question: 'Strawberries are red.',
    questionAr: 'الفراولة حمراء.',
    correctAnswer: 0, // true
    explanation: 'True, strawberries are red fruit.',
    explanationAr: 'صحيح، الفراولة فاكهة حمراء.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-food-5',
    lessonId: 'lesson-006',
    type: 'fill-blank',
    question: 'Grapes can be purple or ____.',
    questionAr: 'العنب يمكن أن يكون بنفسجياً أو ____.',
    correctAnswer: 'green',
    explanation: 'Grapes come in purple and green varieties.',
    explanationAr: 'يأتي العنب بأنواع بنفسجية وخضراء.',
    points: 10,
    difficulty: 'medium',
    category: 'food'
  }
];

// ===== مهام الملابس (الدرس 7) - 5 تمارين
export const exercises7: Exercise[] = [
  {
    id: 'ex-clothes-1',
    lessonId: 'lesson-007',
    type: 'multiple-choice',
    question: 'What do you wear on your feet?',
    questionAr: 'ماذا ترتدي على قدميك؟',
    options: [
      { text: 'Hat', textAr: 'قبعة' },
      { text: 'Shoes', textAr: 'حذاء' },
      { text: 'Shirt', textAr: 'قميص' },
      { text: 'Pants', textAr: 'بنطال' }
    ],
    correctAnswer: 1,
    explanation: 'We wear shoes on our feet.',
    explanationAr: 'نرتدي الأحذية على أقدامنا.',
    points: 10,
    difficulty: 'easy',
    category: 'clothes'
  },
  {
    id: 'ex-clothes-2',
    lessonId: 'lesson-007',
    type: 'fill-blank',
    question: 'A ____ keeps your head warm.',
    questionAr: 'ال____ يبقي رأسك دافئاً.',
    correctAnswer: 'hat',
    explanation: 'We wear a hat to keep our head warm.',
    explanationAr: 'نرتدي قبعة للحفاظ على دفء رؤوسنا.',
    points: 10,
    difficulty: 'easy',
    category: 'clothes'
  },
  {
    id: 'ex-clothes-3',
    lessonId: 'lesson-007',
    type: 'matching',
    question: 'Match clothing with body parts:',
    questionAr: 'تطابق بين الملابس وأجزاء الجسم:',
    options: [
      { text: 'Shoes', textAr: 'الأقدام' },
      { text: 'Hat', textAr: 'الرأس' },
      { text: 'Gloves', textAr: 'الأيدي' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are clothing items for specific body parts.',
    explanationAr: 'هذه ملابس لأجزاء جسم محددة.',
    points: 15,
    difficulty: 'medium',
    category: 'clothes'
  },
  {
    id: 'ex-clothes-4',
    lessonId: 'lesson-007',
    type: 'true-false',
    question: 'You wear a dress on your head.',
    questionAr: 'ترتدي فستاباً على رأسك.',
    correctAnswer: 1, // false
    explanation: 'False, you wear a dress on your body.',
    explanationAr: 'خطأ، ترتدي الفستان على جسدك.',
    points: 10,
    difficulty: 'easy',
    category: 'clothes'
  },
  {
    id: 'ex-clothes-5',
    lessonId: 'lesson-007',
    type: 'fill-blank',
    question: 'A ____ keeps your body warm.',
    questionAr: 'ال____ يحافظ على جسمك دافئاً.',
    correctAnswer: 'jacket',
    explanation: 'A jacket is worn to keep your body warm.',
    explanationAr: 'تُرتدى السترة للحفاظ على دفء جسمك.',
    points: 10,
    difficulty: 'easy',
    category: 'clothes'
  }
];

// ===== مهام الطعام والشراب (الدرس 8) - 5 تمارين
export const exercises8: Exercise[] = [
  {
    id: 'ex-drinks-1',
    lessonId: 'lesson-008',
    type: 'multiple-choice',
    question: 'What is a healthy drink?',
    questionAr: 'ما هو المشروب الصحي؟',
    options: [
      { text: 'Soda', textAr: 'مشروب غازي' },
      { text: 'Water', textAr: 'ماء' },
      { text: 'Juice', textAr: 'عصير' },
      { text: 'Coffee', textAr: 'قهوة' }
    ],
    correctAnswer: 1,
    explanation: 'Water is the healthiest drink.',
    explanationAr: 'الماء هو أصح مشروب.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-drinks-2',
    lessonId: 'lesson-008',
    type: 'fill-blank',
    question: 'Milk is ____.',
    questionAr: 'الحليب ____.',
    correctAnswer: 'healthy',
    explanation: 'Milk is a healthy drink rich in calcium.',
    explanationAr: 'الحليب مشروب صحي غني بالكالسيوم.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-drinks-3',
    lessonId: 'lesson-008',
    type: 'matching',
    question: 'Match drinks with descriptions:',
    questionAr: 'تطابق بين المشروبات والأوصاف:',
    options: [
      { text: 'Tea', textAr: 'مشروب ساخن ومريح' },
      { text: 'Coffee', textAr: 'مشروب قوي' },
      { text: 'Juice', textAr: 'مشروب طبيعي من الفاكهة' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These descriptions match the drinks.',
    explanationAr: 'هذه الأوصاف تتطابق مع المشروبات.',
    points: 15,
    difficulty: 'medium',
    category: 'food'
  },
  {
    id: 'ex-drinks-4',
    lessonId: 'lesson-008',
    type: 'true-false',
    question: 'Bread is a drink.',
    questionAr: 'الخبز مشروب.',
    correctAnswer: 1, // false
    explanation: 'False, bread is food, not a drink.',
    explanationAr: 'خطأ، الخبز طعام وليس مشروب.',
    points: 10,
    difficulty: 'easy',
    category: 'food'
  },
  {
    id: 'ex-drinks-5',
    lessonId: 'lesson-008',
    type: 'fill-blank',
    question: 'I drink ____ in the morning.',
    questionAr: 'أشرب ____ في الصباح.',
    correctAnswer: 'tea',
    explanation: 'Many people drink tea or coffee in the morning.',
    explanationAr: 'يشرب الكثيرون الشاي أو القهوة في الصباح.',
    hint: 'A hot drink many people have in the morning',
    hintAr: 'مشروب ساخن يشربه الكثيرون في الصباح',
    points: 10,
    difficulty: 'medium',
    category: 'food'
  }
];

// ===== مهام الأيام (الدرس 9) - 5 تمارين
export const exercises9: Exercise[] = [
  {
    id: 'ex-days-1',
    lessonId: 'lesson-009',
    type: 'multiple-choice',
    question: 'How many days are in a week?',
    questionAr: 'كم عدد أيام الأسبوع؟',
    options: [
      { text: '5 days', textAr: '5 أيام' },
      { text: '6 days', textAr: '6 أيام' },
      { text: '7 days', textAr: '7 أيام' },
      { text: '8 days', textAr: '8 أيام' }
    ],
    correctAnswer: 2,
    explanation: 'There are 7 days in a week.',
    explanationAr: 'هناك 7 أيام في الأسبوع.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ex-days-2',
    lessonId: 'lesson-009',
    type: 'fill-blank',
    question: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, ____.',
    questionAr: 'الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت، ____.',
    correctAnswer: 'Sunday',
    explanation: 'Sunday is the last day of the week.',
    explanationAr: 'الأحد هو آخر يوم في الأسبوع.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ex-days-3',
    lessonId: 'lesson-009',
    type: 'matching',
    question: 'Match days with their position in the week:',
    questionAr: 'تطابق بين الأيام وموقعها في الأسبوع:',
    options: [
      { text: 'Monday', textAr: 'اليوم الأول' },
      { text: 'Wednesday', textAr: 'اليوم الثالث' },
      { text: 'Friday', textAr: 'اليوم الخامس' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are the correct positions of these days.',
    explanationAr: 'هذه المواقع الصحيحة لهذه الأيام.',
    points: 15,
    difficulty: 'medium',
    category: 'time'
  },
  {
    id: 'ex-days-4',
    lessonId: 'lesson-009',
    type: 'true-false',
    question: 'Saturday and Sunday are weekdays.',
    questionAr: 'السبت والأحد أيام عمل.',
    correctAnswer: 1, // false
    explanation: 'False, Saturday and Sunday are weekends.',
    explanationAr: 'خطأ، السبت والأحد هما نهاية الأسبوع.',
    points: 10,
    difficulty: 'medium',
    category: 'time'
  },
  {
    id: 'ex-days-5',
    lessonId: 'lesson-009',
    type: 'fill-blank',
    question: '____ is the day after today.',
    questionAr: '____ هو اليوم الذي يأتي بعد اليوم.',
    correctAnswer: 'Tomorrow',
    explanation: 'Tomorrow is the next day after today.',
    explanationAr: 'غداً هو اليوم التالي بعد اليوم.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  }
];

// ===== مهام الشهور والفصول (الدرس 10) - 5 تمارين
export const exercises10: Exercise[] = [
  {
    id: 'ex-months-1',
    lessonId: 'lesson-010',
    type: 'multiple-choice',
    question: 'How many months are in a year?',
    questionAr: 'كم عدد الشهور في السنة؟',
    options: [
      { text: '10 months', textAr: '10 شهور' },
      { text: '11 months', textAr: '11 شهر' },
      { text: '12 months', textAr: '12 شهر' },
      { text: '13 months', textAr: '13 شهر' }
    ],
    correctAnswer: 2,
    explanation: 'There are 12 months in a year.',
    explanationAr: 'هناك 12 شهراً في السنة.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ex-months-2',
    lessonId: 'lesson-010',
    type: 'fill-blank',
    question: '____ is the first month of the year.',
    questionAr: '____ هو الشهر الأول من السنة.',
    correctAnswer: 'January',
    explanation: 'January is the first month of the calendar year.',
    explanationAr: 'يناير هو الشهر الأول من السنة الميلادية.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ex-months-3',
    lessonId: 'lesson-010',
    type: 'matching',
    question: 'Match seasons with their months:',
    questionAr: 'تطابق بين الفصول وشهورها:',
    options: [
      { text: 'Summer', textAr: 'يونيو، يوليو، أغسطس' },
      { text: 'Winter', textAr: 'ديسمبر، يناير، فبراير' },
      { text: 'Spring', textAr: 'مارس، أبريل، مايو' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are the typical months for each season.',
    explanationAr: 'هذه أشهر كل فصل النموذجية.',
    points: 15,
    difficulty: 'medium',
    category: 'time'
  },
  {
    id: 'ex-months-4',
    lessonId: 'lesson-010',
    type: 'true-false',
    question: 'Winter is hot.',
    questionAr: 'الشتاء حار.',
    correctAnswer: 1, // false
    explanation: 'False, winter is cold.',
    explanationAr: 'خطأ، الشتاء بارد.',
    points: 10,
    difficulty: 'easy',
    category: 'time'
  },
  {
    id: 'ex-months-5',
    lessonId: 'lesson-010',
    type: 'fill-blank',
    question: '____ is when flowers bloom and birds sing.',
    questionAr: '____ هو عندما تتفتح الزهور وتغرد الطيور.',
    correctAnswer: 'Spring',
    explanation: 'Spring is the season of renewal and growth.',
    explanationAr: 'الربيع هو فصل التجديد والنمو.',
    hint: 'Think about the season after winter',
    hintAr: 'فكر في الفصل الذي يأتي بعد الشتاء',
    points: 10,
    difficulty: 'medium',
    category: 'time'
  }
];

// ===== 10 تمارين إضافية متنوعة (Bonus)
export const bonusExercises: Exercise[] = [
  {
    id: 'ex-bonus-1',
    lessonId: 'lesson-001',
    type: 'fill-blank',
    question: 'What is your ____?',
    questionAr: 'اسمك ____ ؟',
    correctAnswer: 'name',
    explanation: 'We ask "What is your name?" to introduce ourselves.',
    explanationAr: 'نسأل "ما اسمك؟" لنتعريف أنفسنا.',
    points: 10,
    difficulty: 'easy',
    category: 'introduction'
  },
  {
    id: 'ex-bonus-2',
    lessonId: 'lesson-002',
    type: 'true-false',
    question: 'An octopus has 10 arms.',
    questionAr: 'للأخطبوط 10 أذرع.',
    correctAnswer: 1, // false
    explanation: 'False, an octopus has 8 arms.',
    explanationAr: 'خطأ، للأخطبوط 8 أذرع.',
    points: 10,
    difficulty: 'medium',
    category: 'animals'
  },
  {
    id: 'ex-bonus-3',
    lessonId: 'lesson-003',
    type: 'fill-blank',
    question: 'A flamingo is ____.',
    questionAr: 'طائر الفلامنجو ____.',
    correctAnswer: 'pink',
    explanation: 'Flamingos are pink birds.',
    explanationAr: 'طيور الفلامنجو وردية.',
    points: 10,
    difficulty: 'medium',
    category: 'colors'
  },
  {
    id: 'ex-bonus-4',
    lessonId: 'lesson-005',
    type: 'multiple-choice',
    question: 'Which animal can fly?',
    questionAr: 'أي من هذه الحيوانات يمكنه الطيران؟',
    options: [
      { text: 'Fish', textAr: 'سمكة' },
      { text: 'Bird', textAr: 'طائر' },
      { text: 'Dog', textAr: 'كلب' },
      { text: 'Elephant', textAr: 'فيل' }
    ],
    correctAnswer: 1,
    explanation: 'Birds can fly.',
    explanationAr: 'الطيور يمكنها الطيران.',
    points: 10,
    difficulty: 'easy',
    category: 'animals'
  },
  {
    id: 'ex-bonus-5',
    lessonId: 'lesson-006',
    type: 'matching',
    question: 'Match fruits:',
    questionAr: 'تطابق الفواكه:',
    options: [
      { text: 'Apple', textAr: 'تفاح' },
      { text: 'Banana', textAr: 'موزة' },
      { text: 'Orange', textAr: 'برتقالة' }
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'These are common fruits.',
    explanationAr: 'هذه فواكه شائعة.',
    points: 15,
    difficulty: 'easy',
    category: 'food'
  }
];

// تصدير جميع التمارين
export const allExercises: Exercise[] = [
  ...exercises1,
  ...exercises2,
  ...exercises3,
  ...exercises4,
  ...exercises5,
  ...exercises6,
  ...exercises7,
  ...exercises8,
  ...exercises9,
  ...exercises10,
  ...bonusExercises
];

// دالة للبحث عن تمرين
export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find(ex => ex.id === id);
}

// دالة للحصول على تمارين حسب الدرس
export function getExercisesByLesson(lessonId: string): Exercise[] {
  return allExercises.filter(ex => ex.lessonId === lessonId);
}

// دالة للحصول على عدد التمارين الإجمالي
export function getTotalExercises(): number {
  return allExercises.length;
}
