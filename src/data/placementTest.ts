// Placement Test System - 20-30 Real Questions
export interface PlacementQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'listening' | 'reading' | 'grammar' | 'vocabulary' | 'speaking';
  category: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking';
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  question: string;
  arabicQuestion: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  arabicExplanation: string;
  points: number;
  timeLimit?: number; // in seconds
  audioUrl?: string;
  imageUrl?: string;
  passage?: string;
  arabicPassage?: string;
}

export interface PlacementTestResult {
  userId: string;
  testDate: Date;
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  categoryScores: {
    grammar: number;
    vocabulary: number;
    listening: number;
    reading: number;
    speaking: number;
  };
  recommendations: string[];
  arabicRecommendations: string[];
  timeSpent: number; // in minutes
}

// Real Placement Test Questions
export const placementTestQuestions: PlacementQuestion[] = [
  // Grammar Questions (8)
  {
    id: 'grammar_1',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'A1',
    question: "What ___ your name?",
    arabicQuestion: "ما ___ اسمك؟",
    options: ["is", "are", "am", "be"],
    correctAnswer: 2,
    explanation: "With 'I', we use 'am' in present simple.",
    arabicExplanation: "مع 'I' نستخدم 'am' في المضارع البسيط.",
    points: 10,
    timeLimit: 30
  },
  {
    id: 'grammar_2',
    type: 'fill_blank',
    category: 'grammar',
    difficulty: 'A1',
    question: "She ___ a teacher.",
    arabicQuestion: "هي ___ معلمة.",
    correctAnswer: "is",
    explanation: "With 'She', we use 'is' in present simple.",
    arabicExplanation: "مع 'She' نستخدم 'is' في المضارع البسيط.",
    points: 10,
    timeLimit: 30
  },
  {
    id: 'grammar_3',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'A2',
    question: "They ___ to school every day.",
    arabicQuestion: "هم ___ إلى المدرسة كل يوم.",
    options: ["go", "goes", "going", "went"],
    correctAnswer: 0,
    explanation: "With 'They', we use the base form 'go' in present simple.",
    arabicExplanation: "مع 'They' نستخدم الفعل الأساسي 'go' في المضارع البسيط.",
    points: 15,
    timeLimit: 45
  },
  {
    id: 'grammar_4',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'A2',
    question: "I ___ English for 5 years.",
    arabicQuestion: "أنا ___ الإنجليزية لمدة 5 سنوات.",
    options: ["study", "studies", "studying", "have studied"],
    correctAnswer: 1,
    explanation: "For duration, use present perfect: 'have/has + past participle'.",
    arabicExplanation: "للمدة، استخدم المضارع التام: 'have/has + past participle'.",
    points: 15,
    timeLimit: 45
  },
  {
    id: 'grammar_5',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'B1',
    question: "If I ___ rich, I would travel the world.",
    arabicQuestion: "لو أنا ___ غنياً، لسافرت العالم.",
    options: ["was", "am", "were", "would be"],
    correctAnswer: 0,
    explanation: "Second conditional: If + past simple, would + base verb.",
    arabicExplanation: "الشرطية الثانية: If + past simple, would + base verb.",
    points: 20,
    timeLimit: 60
  },
  {
    id: 'grammar_6',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'B1',
    question: "The book ___ by Shakespeare.",
    arabicQuestion: "الكتاب ___ بواسطة شكسبير.",
    options: ["was wrote", "is written", "was written", "wrote"],
    correctAnswer: 2,
    explanation: "Passive voice: was/were + past participle.",
    arabicExplanation: "المبني للمجهول: was/were + past participle.",
    points: 20,
    timeLimit: 60
  },
  {
    id: 'grammar_7',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'B2',
    question: "Despite ___ hard, he failed the exam.",
    arabicQuestion: "على الرغم من ___ بجد، رسب في الامتحان.",
    options: ["studying", "study", "having studied", "to study"],
    correctAnswer: 0,
    explanation: "Despite + gerund (verb-ing) for ongoing actions.",
    arabicExplanation: "Despite + gerund (verb-ing) للأفعال المستمرة.",
    points: 25,
    timeLimit: 90
  },
  {
    id: 'grammar_8',
    type: 'multiple_choice',
    category: 'grammar',
    difficulty: 'B2',
    question: "I wish I ___ more time.",
    arabicQuestion: "أتمنى لو أنا ___ وقتاً أكثر.",
    options: ["have", "had", "would have", "will have"],
    correctAnswer: 1,
    explanation: "Wish + past simple for present regrets.",
    arabicExplanation: "Wish + past simple للندم الحالية.",
    points: 25,
    timeLimit: 90
  },

  // Vocabulary Questions (6)
  {
    id: 'vocab_1',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'A1',
    question: "What does 'delicious' mean?",
    arabicQuestion: "ماذا تعني 'delicious'؟",
    options: ["bad", "tasty", "big", "small"],
    correctAnswer: 1,
    explanation: "Delicious means very tasty or good to eat.",
    arabicExplanation: "Delicious تعني لذيذ جداً أو جيد للأكل.",
    points: 10,
    timeLimit: 30
  },
  {
    id: 'vocab_2',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'A1',
    question: "Choose the opposite of 'hot':",
    arabicQuestion: "اختر عكس 'hot':",
    options: ["warm", "cold", "cool", "freezing"],
    correctAnswer: 1,
    explanation: "Cold is the opposite of hot.",
    arabicExplanation: "Cold هو عكس hot.",
    points: 10,
    timeLimit: 20
  },
  {
    id: 'vocab_3',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'A2',
    question: "A 'brave' person is:",
    arabicQuestion: "الشخص 'brave' هو:",
    options: ["scared", "frightened", "courageous", "worried"],
    correctAnswer: 2,
    explanation: "Brave means having or showing courage.",
    arabicExplanation: "Brave تعني يمتلك أو يظهر شجاعة.",
    points: 15,
    timeLimit: 30
  },
  {
    id: 'vocab_4',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'B1',
    question: "To 'accomplish' means to:",
    arabicQuestion: "'Accomplish' تعني:",
    options: ["start something", "finish something", "continue something", "plan something"],
    correctAnswer: 1,
    explanation: "Accomplish means to complete or finish successfully.",
    arabicExplanation: "Accomplish تعني إنهاء أو إنجاز بنجاح.",
    points: 20,
    timeLimit: 45
  },
  {
    id: 'vocab_5',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'B2',
    question: "'Ambiguous' means:",
    arabicQuestion: "'Ambiguous' تعني:",
    options: ["clear", "certain", "uncertain", "having more than one meaning"],
    correctAnswer: 3,
    explanation: "Ambiguous means unclear or having multiple possible meanings.",
    arabicExplanation: "Ambiguous تعني غير واضح أو له معاني متعددة ممكنة.",
    points: 25,
    timeLimit: 60
  },
  {
    id: 'vocab_6',
    type: 'multiple_choice',
    category: 'vocabulary',
    difficulty: 'B2',
    question: "To 'prioritize' means to:",
    arabicQuestion: "'Prioritize' تعني:",
    options: ["make everything equal", "treat as less important", "treat as more important", "ignore completely"],
    correctAnswer: 2,
    explanation: "Prioritize means to deal with something first or treat as more important.",
    arabicExplanation: "Prioritize تعني التعامل مع شيء أولاً أو معاملته كأكثر أهمية.",
    points: 25,
    timeLimit: 60
  },

  // Listening Questions (4)
  {
    id: 'listening_1',
    type: 'listening',
    category: 'listening',
    difficulty: 'A1',
    question: "Listen and answer: What is the speaker's name?",
    arabicQuestion: "استمع وأجب: ما اسم المتحدث؟",
    audioUrl: "/audio/placement_name.mp3",
    correctAnswer: "John",
    explanation: "The speaker says 'My name is John'.",
    arabicExplanation: "المتحدث يقول 'My name is John'.",
    points: 10,
    timeLimit: 60
  },
  {
    id: 'listening_2',
    type: 'listening',
    category: 'listening',
    difficulty: 'A2',
    question: "Listen and answer: What time does the meeting start?",
    arabicQuestion: "استمع وأجب: متى تبدأ الاجتماع؟",
    audioUrl: "/audio/placement_meeting.mp3",
    options: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM"],
    correctAnswer: 1,
    explanation: "The speaker says 'The meeting starts at 10:00 AM'.",
    arabicExplanation: "المتحدث يقول 'The meeting starts at 10:00 AM'.",
    points: 15,
    timeLimit: 90
  },
  {
    id: 'listening_3',
    type: 'listening',
    category: 'listening',
    difficulty: 'B1',
    question: "Listen and answer: What is the main topic?",
    arabicQuestion: "استمع وأجب: ما هو الموضوع الرئيسي؟",
    audioUrl: "/audio/placement_topic.mp3",
    options: ["Weather", "Sports", "Technology", "Food"],
    correctAnswer: 2,
    explanation: "The speaker discusses new technology and its impact.",
    arabicExplanation: "المتحدث يناقش التكنولوجيا الجديدة وتأثيرها.",
    points: 20,
    timeLimit: 120
  },
  {
    id: 'listening_4',
    type: 'listening',
    category: 'listening',
    difficulty: 'B2',
    question: "Listen and answer: What is the speaker's opinion?",
    arabicQuestion: "استمع وأجب: ما رأي المتحدث؟",
    audioUrl: "/audio/placement_opinion.mp3",
    options: ["Completely positive", "Mixed feelings", "Completely negative", "No opinion"],
    correctAnswer: 1,
    explanation: "The speaker expresses both positive and negative points.",
    arabicExplanation: "المتحدث يعبر عن نقاط إيجابية وسلبية.",
    points: 25,
    timeLimit: 150
  },

  // Reading Questions (4)
  {
    id: 'reading_1',
    type: 'reading',
    category: 'reading',
    difficulty: 'A1',
    question: "Read the passage and answer: What is the main color mentioned?",
    arabicQuestion: "اقرأ النص وأجب: ما هو اللون الرئيسي المذكور؟",
    passage: "Sarah has a red dress. Her shoes are blue. The sky is gray today.",
    arabicPassage: "سارة لديها فستان أحمر. حذاؤها زرقاء. السماء رمادية اليوم.",
    options: ["Red", "Blue", "Gray", "Green"],
    correctAnswer: 0,
    explanation: "The passage mentions 'red dress' as the first item.",
    arabicExplanation: "النص يذكر 'red dress' كأول عنصر.",
    points: 10,
    timeLimit: 90
  },
  {
    id: 'reading_2',
    type: 'reading',
    category: 'reading',
    difficulty: 'A2',
    question: "Read the passage and answer: Where does the family live?",
    arabicQuestion: "اقرأ النص وأجب: أين تعيش العائلة؟",
    passage: "The Ahmed family lives in a small apartment in the city center. They have lived there for five years and love the neighborhood.",
    arabicPassage: "عائلة أحمد تعيش في شقة صغيرة في وسط المدينة. لقد عاشت هناك لمدة خمس سنوات وتحب الحي.",
    options: ["In the countryside", "In the city center", "Near the beach", "In a big house"],
    correctAnswer: 1,
    explanation: "The passage states 'in the city center'.",
    arabicExplanation: "النص ينص 'in the city center'.",
    points: 15,
    timeLimit: 120
  },
  {
    id: 'reading_3',
    type: 'reading',
    category: 'reading',
    difficulty: 'B1',
    question: "Read the passage and answer: What is the writer's main argument?",
    arabicQuestion: "اقرأ النص وأجب: ما هو الحجة الرئيسية للكاتب؟",
    passage: "While technology has brought many benefits to education, some argue that it has also created new challenges. Students today have access to unlimited information, but they may lack critical thinking skills needed to evaluate sources properly.",
    arabicPassage: "بينما جلبت التكنولوجيا العديد من الفوائد للتعليم، يجادل البعض أنها خلقت أيضاً تحديات جديدة. الطلاب اليوم لديهم وصول غير محدود للمعلومات، لكن قد يفتقرون مهارات التفكير النقدي اللازمة لتقييم المصادر بشكل صحيح.",
    options: ["Technology is only beneficial", "Technology has both benefits and challenges", "Technology should be banned from education", "Students don't need technology"],
    correctAnswer: 1,
    explanation: "The writer presents both positive and negative aspects.",
    arabicExplanation: "الكاتب يقدم جوانب إيجابية وسلبية.",
    points: 20,
    timeLimit: 180
  },
  {
    id: 'reading_4',
    type: 'reading',
    category: 'reading',
    difficulty: 'B2',
    question: "Read the passage and answer: What can be inferred about the future?",
    arabicQuestion: "اقرأ النص وأجب: ماذا يمكن استنتاجه عن المستقبل؟",
    passage: "The rapid advancement of artificial intelligence suggests a future where human-machine collaboration becomes the norm. While some fear job displacement, others envision new opportunities for creativity and innovation that we can barely imagine today.",
    arabicPassage: "التقدم السريع للذكاء الاصطناعي يوحي بمستقبل يصبح فيه التعاون بين الإنسان والآلة هو القاعدة. بينما يخشى البعض displacement الوظائف، يتخيل آخرون فرصاً جديدة للإبداع والابتكار بالكاد لا نتخيلها اليوم.",
    options: ["AI will replace all human jobs", "Human-AI collaboration will become normal", "Technology will stop advancing", "Only AI will be creative in the future"],
    correctAnswer: 1,
    explanation: "The passage suggests 'human-machine collaboration becomes the norm'.",
    arabicExplanation: "النص يوحي 'human-machine collaboration becomes the norm'.",
    points: 25,
    timeLimit: 240
  },

  // Speaking Questions (4)
  {
    id: 'speaking_1',
    type: 'speaking',
    category: 'speaking',
    difficulty: 'A1',
    question: "Describe your family in 2-3 sentences.",
    arabicQuestion: "صف عائلتك في 2-3 جمل.",
    correctAnswer: "User will record their response",
    explanation: "Speak clearly about your family members.",
    arabicExplanation: "تحدث بوضوح عن أفراد عائلتك.",
    points: 10,
    timeLimit: 60
  },
  {
    id: 'speaking_2',
    type: 'speaking',
    category: 'speaking',
    difficulty: 'A2',
    question: "What did you do yesterday? Tell me in 3-4 sentences.",
    arabicQuestion: "ماذا فعلت بالأمس؟ أخبرني في 3-4 جمل.",
    correctAnswer: "User will record their response",
    explanation: "Use past tense to describe yesterday's activities.",
    arabicExplanation: "استخدم الماضي لوصف أنشطة الأمس.",
    points: 15,
    timeLimit: 90
  },
  {
    id: 'speaking_3',
    type: 'speaking',
    category: 'speaking',
    difficulty: 'B1',
    question: "Explain your opinion about social media. Speak for 1-2 minutes.",
    arabicQuestion: "اشرح رأيك عن وسائل التواصل الاجتماعي. تحدث لمدة 1-2 دقيقة.",
    correctAnswer: "User will record their response",
    explanation: "Express your views clearly with reasons and examples.",
    arabicExplanation: "عبّر عن آرائك بوضوح مع أسباب وأمثلة.",
    points: 20,
    timeLimit: 150
  },
  {
    id: 'speaking_4',
    type: 'speaking',
    category: 'speaking',
    difficulty: 'B2',
    question: "Discuss the advantages and disadvantages of remote work. Speak for 2-3 minutes.",
    arabicQuestion: "ناقش مزايا وعيوب العمل عن بعد. تحدث لمدة 2-3 دقائق.",
    correctAnswer: "User will record their response",
    explanation: "Provide balanced arguments with specific examples.",
    arabicExplanation: "قدم حجج متوازنة مع أمثلة محددة.",
    points: 25,
    timeLimit: 210
  }
];

// Placement Test Evaluation
export const evaluatePlacementTest = (answers: Record<string, string | number>): PlacementTestResult => {
  const totalQuestions = placementTestQuestions.length;
  let correctAnswers = 0;
  let totalPoints = 0;
  const categoryScores = {
    grammar: 0,
    vocabulary: 0,
    listening: 0,
    reading: 0,
    speaking: 0
  };

  placementTestQuestions.forEach((question, index) => {
    const userAnswer = answers[`question_${index}`];
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) {
      correctAnswers++;
      totalPoints += question.points;
      categoryScores[question.category] += question.points;
    }
  });

  // Determine level based on score
  const percentage = (correctAnswers / totalQuestions) * 100;
  let level: 'A1' | 'A2' | 'B1' | 'B2';
  
  if (percentage >= 80) {
    level = 'B2';
  } else if (percentage >= 65) {
    level = 'B1';
  } else if (percentage >= 45) {
    level = 'A2';
  } else {
    level = 'A1';
  }

  // Generate recommendations
  const recommendations = generateRecommendations(categoryScores, level);
  const arabicRecommendations = generateArabicRecommendations(categoryScores, level);

  return {
    userId: '',
    testDate: new Date(),
    totalQuestions,
    correctAnswers,
    totalPoints,
    level,
    categoryScores,
    recommendations,
    arabicRecommendations,
    timeSpent: 0
  };
};

const generateRecommendations = (scores: any, level: string): string[] => {
  const recommendations = [];
  
  if (scores.grammar < 30) {
    recommendations.push("Focus on grammar fundamentals - verb tenses, articles, and prepositions");
  }
  if (scores.vocabulary < 25) {
    recommendations.push("Expand your vocabulary with daily reading and word lists");
  }
  if (scores.listening < 20) {
    recommendations.push("Practice listening with podcasts and audio exercises");
  }
  if (scores.reading < 20) {
    recommendations.push("Read graded readers and news articles regularly");
  }
  if (scores.speaking < 20) {
    recommendations.push("Practice speaking with language exchange partners");
  }
  
  if (level === 'A1') {
    recommendations.push("Start with beginner lessons and basic conversations");
  } else if (level === 'A2') {
    recommendations.push("Move to intermediate topics and complex sentences");
  } else if (level === 'B1') {
    recommendations.push("Challenge yourself with advanced materials and debates");
  } else {
    recommendations.push("Focus on fluency, idioms, and professional English");
  }
  
  return recommendations;
};

const generateArabicRecommendations = (scores: any, level: string): string[] => {
  const recommendations = [];
  
  if (scores.grammar < 30) {
    recommendations.push("ركز على أساسيات القواعد - أزمنة الأفعال، الأدوات، وحروف الجر");
  }
  if (scores.vocabulary < 25) {
    recommendations.push("وسع مفرداتك بالقراءة اليومية وقوائم الكلمات");
  }
  if (scores.listening < 20) {
    recommendations.push("مارس الاستماع مع البودكاست والتمارين الصوتية");
  }
  if (scores.reading < 20) {
    recommendations.push("اقرأ القراءات المصنفة والمقالات الإخبارية بانتظام");
  }
  if (scores.speaking < 20) {
    recommendations.push("مارس التحدث مع شركاء تبادل اللغات");
  }
  
  if (level === 'A1') {
    recommendations.push("ابدأ مع الدروس للمبتدئين والمحادثات الأساسية");
  } else if (level === 'A2') {
    recommendations.push("انتقل إلى المواضيع المتوسطة والجمل المعقدة");
  } else if (level === 'B1') {
    recommendations.push("تحد نفسك مع المواد المتقدمة والنقاشات");
  } else {
    recommendations.push("ركز على الطلاقة، التعابير، والإنجليزية المهنية");
  }
  
  return recommendations;
};

// Test Configuration
export const testConfig = {
  timeLimits: {
    A1: 30, // minutes
    A2: 45,
    B1: 60,
    B2: 90
  },
  passingScores: {
    A1: 40, // percentage
    A2: 50,
    B1: 65,
    B2: 75
  },
  questionDistribution: {
    grammar: 8,
    vocabulary: 6,
    listening: 4,
    reading: 4,
    speaking: 4
  }
};
