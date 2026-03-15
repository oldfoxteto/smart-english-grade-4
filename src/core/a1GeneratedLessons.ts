import type { A1Lesson, Exercise, GrammarPoint, ReadingPassage, VocabularyItem } from "./a1Content";

type Level = A1Lesson["level"];

type Theme = {
  unit: number;
  level: Level;
  title: string;
  titleAr: string;
  words: Array<[string, string]>;
  promptEn: string;
  promptAr: string;
};

const themes: Theme[] = [
  { unit: 4, level: "A1.1", title: "Classroom Items", titleAr: "أدوات الصف", words: [["Book", "كتاب"], ["Pen", "قلم"], ["Bag", "حقيبة"]], promptEn: "Name three classroom items.", promptAr: "اذكر ثلاث أدوات صف." },
  { unit: 5, level: "A1.1", title: "Daily Routine", titleAr: "الروتين اليومي", words: [["Wake up", "أستيقظ"], ["Eat", "آكل"], ["Sleep", "أنام"]], promptEn: "Describe your morning in three short sentences.", promptAr: "صف صباحك في ثلاث جمل قصيرة." },
  { unit: 6, level: "A1.1", title: "Food and Drinks", titleAr: "الطعام والشراب", words: [["Bread", "خبز"], ["Milk", "حليب"], ["Apple", "تفاحة"]], promptEn: "Say two foods you like.", promptAr: "اذكر طعامين تحبهما." },
  { unit: 7, level: "A1.1", title: "Clothes", titleAr: "الملابس", words: [["Shirt", "قميص"], ["Shoes", "حذاء"], ["Dress", "فستان"]], promptEn: "Describe what you are wearing.", promptAr: "صف ما ترتديه." },
  { unit: 8, level: "A1.1", title: "Rooms in the House", titleAr: "غرف البيت", words: [["Kitchen", "مطبخ"], ["Bedroom", "غرفة النوم"], ["Living room", "غرفة الجلوس"]], promptEn: "Name the rooms in your home.", promptAr: "اذكر غرف بيتك." },
  { unit: 9, level: "A1.2", title: "Weather", titleAr: "الطقس", words: [["Sunny", "مشمس"], ["Rainy", "ممطر"], ["Windy", "عاصف"]], promptEn: "Describe the weather today.", promptAr: "صف الطقس اليوم." },
  { unit: 10, level: "A1.2", title: "School Subjects", titleAr: "المواد الدراسية", words: [["Math", "رياضيات"], ["Science", "علوم"], ["English", "الإنجليزية"]], promptEn: "Say your favorite subject.", promptAr: "اذكر مادتك المفضلة." },
  { unit: 11, level: "A1.2", title: "Days and Months", titleAr: "الأيام والشهور", words: [["Monday", "الاثنين"], ["Friday", "الجمعة"], ["January", "يناير"]], promptEn: "Say two days and one month.", promptAr: "اذكر يومين وشهرًا واحدًا." },
  { unit: 12, level: "A1.2", title: "Jobs", titleAr: "المهن", words: [["Doctor", "طبيب"], ["Teacher", "معلم"], ["Driver", "سائق"]], promptEn: "Describe two jobs in your family.", promptAr: "صف وظيفتين في عائلتك." },
  { unit: 13, level: "A1.2", title: "Places in Town", titleAr: "أماكن في المدينة", words: [["Park", "حديقة"], ["Hospital", "مستشفى"], ["Shop", "متجر"]], promptEn: "Name two places near your home.", promptAr: "اذكر مكانين قريبين من بيتك." },
  { unit: 14, level: "A1.2", title: "Animals", titleAr: "الحيوانات", words: [["Cat", "قطة"], ["Dog", "كلب"], ["Bird", "طائر"]], promptEn: "Talk about an animal you like.", promptAr: "تحدث عن حيوان تحبه." },
  { unit: 15, level: "A1.3", title: "Body and Feelings", titleAr: "الجسم والمشاعر", words: [["Head", "رأس"], ["Happy", "سعيد"], ["Tired", "متعب"]], promptEn: "Say how you feel today.", promptAr: "قل كيف تشعر اليوم." },
  { unit: 16, level: "A1.3", title: "Hobbies", titleAr: "الهوايات", words: [["Read", "أقرأ"], ["Draw", "أرسم"], ["Play football", "ألعب كرة القدم"]], promptEn: "Talk about one hobby after school.", promptAr: "تحدث عن هواية بعد المدرسة." },
  { unit: 17, level: "A1.3", title: "Transport", titleAr: "وسائل النقل", words: [["Bus", "حافلة"], ["Car", "سيارة"], ["Bike", "دراجة"]], promptEn: "Say how you go to school.", promptAr: "قل كيف تذهب إلى المدرسة." },
  { unit: 18, level: "A1.3", title: "Shopping and Money", titleAr: "التسوق والمال", words: [["Buy", "أشتري"], ["Cheap", "رخيص"], ["Money", "مال"]], promptEn: "Ask for the price of one item.", promptAr: "اسأل عن سعر غرض واحد." },
];

const makeVocabulary = (theme: Theme): VocabularyItem[] =>
  theme.words.map(([word, translation], index) => ({
    word,
    translation,
    pronunciation: `/${word.toLowerCase().replaceAll(" ", "-")}/`,
    example: `I use ${index === 0 ? "this" : "the"} ${word.toLowerCase()} every day.`,
    exampleTranslation: `أنا أستخدم ${translation} كل يوم.`,
    category: theme.title.toLowerCase(),
  }));

const makeGrammar = (theme: Theme): GrammarPoint => ({
  title: `${theme.title} Sentences`,
  titleAr: `جمل ${theme.titleAr}`,
  explanation: `Use short present simple sentences to talk about ${theme.title.toLowerCase()}.`,
  explanationAr: `استخدم جمل المضارع البسيط القصيرة للحديث عن ${theme.titleAr}.`,
  formula: `Subject + verb + ${theme.words[0][0].toLowerCase()}`,
  examples: [
    { correct: `I know the word ${theme.words[0][0]}.`, translation: `أنا أعرف كلمة ${theme.words[0][1]}.`, highlight: theme.words[0][0] },
    { correct: `We talk about ${theme.words[1][0].toLowerCase()} in class.`, translation: `نحن نتحدث عن ${theme.words[1][1]} في الصف.`, highlight: theme.words[1][0] },
  ],
});

const makeReading = (theme: Theme): ReadingPassage => ({
  title: `${theme.title} Story`,
  titleAr: `قصة ${theme.titleAr}`,
  text: `Today we learn ${theme.words[0][0]}, ${theme.words[1][0]}, and ${theme.words[2][0]}. These words help us talk about ${theme.title.toLowerCase()}.`,
  textAr: `اليوم نتعلم ${theme.words[0][1]} و${theme.words[1][1]} و${theme.words[2][1]}. هذه الكلمات تساعدنا على الحديث عن ${theme.titleAr}.`,
  difficulty: "easy",
  questions: [
    {
      question: `Which word belongs to ${theme.title.toLowerCase()}?`,
      questionAr: `أي كلمة تنتمي إلى موضوع ${theme.titleAr}؟`,
      options: [theme.words[0][0], "Window", "Teacher", "Street"],
      correctAnswer: 0,
      explanation: `${theme.words[0][0]} is part of the topic.`,
      explanationAr: `${theme.words[0][1]} من كلمات هذا الموضوع.`,
    },
    {
      question: "How many key words are in the text?",
      questionAr: "كم كلمة أساسية توجد في النص؟",
      options: ["One", "Two", "Three", "Four"],
      correctAnswer: 2,
      explanation: "The passage includes three key words.",
      explanationAr: "الفقرة تحتوي على ثلاث كلمات أساسية.",
    },
  ],
});

const makeVocabularyExercises = (lessonId: string, vocabulary: VocabularyItem[]): Exercise[] => [
  {
    id: `${lessonId}-mcq`,
    type: "multiple-choice",
    question: `Which word means "${vocabulary[0].translation}"?`,
    questionAr: `ما الكلمة التي تعني "${vocabulary[0].translation}"؟`,
    options: vocabulary.map((item) => item.word),
    correctAnswer: 0,
    explanation: `${vocabulary[0].word} is the correct word.`,
    explanationAr: `${vocabulary[0].word} هي الكلمة الصحيحة.`,
  },
  {
    id: `${lessonId}-blank`,
    type: "fill-blank",
    question: vocabulary[1].example.replace(vocabulary[1].word.toLowerCase(), "_____"),
    questionAr: `أكمل الجملة بالكلمة المناسبة: ${vocabulary[1].exampleTranslation}`,
    correctAnswer: vocabulary[1].word.toLowerCase(),
    explanation: `The missing word is ${vocabulary[1].word}.`,
    explanationAr: `الكلمة الناقصة هي ${vocabulary[1].word}.`,
  },
];

const makeGrammarExercises = (lessonId: string, grammar: GrammarPoint): Exercise[] => [
  {
    id: `${lessonId}-g1`,
    type: "multiple-choice",
    question: `Choose the sentence that follows: ${grammar.formula}`,
    questionAr: `اختر الجملة التي تتبع: ${grammar.formula}`,
    options: grammar.examples.map((example) => example.correct),
    correctAnswer: 0,
    explanation: grammar.examples[0].correct,
    explanationAr: grammar.examples[0].translation,
  },
  {
    id: `${lessonId}-g2`,
    type: "ordering",
    question: "Put the words in the correct order.",
    questionAr: "رتب الكلمات بالترتيب الصحيح.",
    correctAnswer: grammar.examples[1].correct,
    explanation: grammar.explanation,
    explanationAr: grammar.explanationAr,
  },
];

const makeSpeakingExercises = (lessonId: string, promptEn: string, promptAr: string): Exercise[] => [
  {
    id: `${lessonId}-s1`,
    type: "speaking",
    question: promptEn,
    questionAr: promptAr,
    correctAnswer: promptEn,
    explanation: "Use a short clear sentence.",
    explanationAr: "استخدم جملة قصيرة وواضحة.",
  },
  {
    id: `${lessonId}-s2`,
    type: "matching",
    question: "Match the key words with their meanings.",
    questionAr: "طابق الكلمات الأساسية مع معانيها.",
    correctAnswer: "matching-complete",
    explanation: "Review the key words before speaking.",
    explanationAr: "راجع الكلمات الأساسية قبل التحدث.",
  },
];

export const generatedA1Lessons: A1Lesson[] = themes.flatMap((theme, index) => {
  const number = 6 + index * 3;
  const vocabulary = makeVocabulary(theme);
  const grammar = makeGrammar(theme);
  const reading = makeReading(theme);

  return [
    {
      id: `a1-${String(number).padStart(3, "0")}`,
      title: `${theme.title}: Key Words`,
      titleAr: `${theme.titleAr}: كلمات أساسية`,
      description: `Core vocabulary for ${theme.title.toLowerCase()}.`,
      descriptionAr: `مفردات أساسية حول ${theme.titleAr}.`,
      category: "vocabulary",
      level: theme.level,
      unit: theme.unit,
      duration: 8,
      objectives: ["Learn key words.", "Practice meaning.", "Review pronunciation."],
      objectivesAr: ["تعلم الكلمات الأساسية.", "تدرب على المعنى.", "راجع النطق."],
      vocabulary,
      exercises: makeVocabularyExercises(`a1-${String(number).padStart(3, "0")}`, vocabulary),
    },
    {
      id: `a1-${String(number + 1).padStart(3, "0")}`,
      title: `${theme.title}: Sentence Builder`,
      titleAr: `${theme.titleAr}: بناء الجملة`,
      description: `Simple grammar practice for ${theme.title.toLowerCase()}.`,
      descriptionAr: `تدريب نحوي بسيط لموضوع ${theme.titleAr}.`,
      category: "grammar",
      level: theme.level,
      unit: theme.unit,
      duration: 9,
      objectives: ["Understand the pattern.", "Use two example sentences.", "Answer quick grammar tasks."],
      objectivesAr: ["افهم النمط.", "استخدم جملتين مثاليتين.", "أجب عن مهام نحوية سريعة."],
      grammar,
      exercises: makeGrammarExercises(`a1-${String(number + 1).padStart(3, "0")}`, grammar),
    },
    {
      id: `a1-${String(number + 2).padStart(3, "0")}`,
      title: `${theme.title}: Read and Speak`,
      titleAr: `${theme.titleAr}: قراءة وتحدث`,
      description: `Read a short passage and speak about ${theme.title.toLowerCase()}.`,
      descriptionAr: `اقرأ فقرة قصيرة وتحدث عن ${theme.titleAr}.`,
      category: "reading",
      level: theme.level,
      unit: theme.unit,
      duration: 10,
      objectives: ["Read a short text.", "Answer two questions.", "Say one idea aloud."],
      objectivesAr: ["اقرأ نصًا قصيرًا.", "أجب عن سؤالين.", "قل فكرة واحدة بصوت عالٍ."],
      reading,
      exercises: makeSpeakingExercises(`a1-${String(number + 2).padStart(3, "0")}`, theme.promptEn, theme.promptAr),
    },
  ];
});
