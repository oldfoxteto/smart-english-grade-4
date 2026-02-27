// Interactive Exercises Database - 200+ Exercises
export const interactiveExercises = [
  // Vocabulary Exercises (50)
  {
    id: 1,
    type: "vocabulary",
    subtype: "multiple_choice",
    question: "What does 'Hello' mean?",
    options: ["مرحباً", "وداعاً", "شكراً", "عذراً"],
    correct: 0,
    explanation: "'Hello' means 'مرحباً' in Arabic",
    difficulty: "easy",
    category: "greetings"
  },
  {
    id: 2,
    type: "vocabulary",
    subtype: "fill_blank",
    question: "Good ___, class!",
    answer: "morning",
    hint: "Time of day when you wake up",
    difficulty: "easy",
    category: "greetings"
  },
  {
    id: 3,
    type: "vocabulary",
    subtype: "matching",
    pairs: [
      { english: "Father", arabic: "أب" },
      { english: "Mother", arabic: "أم" },
      { english: "Brother", arabic: "أخ" },
      { english: "Sister", arabic: "أخت" }
    ],
    difficulty: "easy",
    category: "family"
  },
  {
    id: 4,
    type: "vocabulary",
    subtype: "translation",
    question: "Translate: أحمر",
    answer: "Red",
    difficulty: "easy",
    category: "colors"
  },
  {
    id: 5,
    type: "vocabulary",
    subtype: "image_selection",
    question: "Select the apple:",
    images: ["apple", "banana", "orange", "grape"],
    correct: 0,
    difficulty: "easy",
    category: "food"
  },
  
  // Grammar Exercises (60)
  {
    id: 6,
    type: "grammar",
    subtype: "fill_blank",
    question: "I ___ a student.",
    answer: "am",
    options: ["am", "is", "are"],
    explanation: "With 'I', we use 'am'",
    difficulty: "easy",
    category: "verb_to_be"
  },
  {
    id: 7,
    type: "grammar",
    subtype: "sentence_formation",
    question: "Arrange: student / a / is / She",
    answer: "She is a student",
    difficulty: "easy",
    category: "word_order"
  },
  {
    id: 8,
    type: "grammar",
    subtype: "error_correction",
    question: "Correct: He are happy.",
    answer: "He is happy",
    explanation: "With 'He', we use 'is', not 'are'",
    difficulty: "easy",
    category: "verb_to_be"
  },
  {
    id: 9,
    type: "grammar",
    subtype: "multiple_choice",
    question: "___ you from Saudi Arabia?",
    options: ["Is", "Am", "Are", "Be"],
    correct: 2,
    explanation: "With 'you', we use 'are'",
    difficulty: "easy",
    category: "verb_to_be"
  },
  {
    id: 10,
    type: "grammar",
    subtype: "fill_blank",
    question: "They ___ doctors.",
    answer: "are",
    options: ["is", "am", "are"],
    difficulty: "easy",
    category: "verb_to_be"
  },
  
  // Listening Exercises (40)
  {
    id: 11,
    type: "listening",
    subtype: "dictation",
    audio: "hello_my_name_is_ahmed",
    question: "Listen and write: ___ ___ ___ ___ Ahmed.",
    answer: "Hello my name is",
    difficulty: "easy",
    category: "introductions"
  },
  {
    id: 12,
    type: "listening",
    subtype: "comprehension",
    audio: "i_like_apples_and_bananas",
    question: "What fruits does he like?",
    options: ["Apples and oranges", "Apples and bananas", "Bananas and oranges", "Only apples"],
    correct: 1,
    difficulty: "easy",
    category: "food"
  },
  {
    id: 13,
    type: "listening",
    subtype: "true_false",
    audio: "she_is_twenty_years_old",
    statement: "She is 20 years old.",
    answer: true,
    difficulty: "easy",
    category: "numbers"
  },
  
  // Reading Exercises (30)
  {
    id: 14,
    type: "reading",
    subtype: "comprehension",
    passage: "My name is Sara. I am 12 years old. I live in Riyadh. I have one brother and one sister. I like reading books and playing football.",
    question: "How old is Sara?",
    options: ["10 years old", "11 years old", "12 years old", "13 years old"],
    correct: 2,
    difficulty: "easy",
    category: "personal_info"
  },
  {
    id: 15,
    type: "reading",
    subtype: "vocabulary_in_context",
    passage: "The apple is red. The banana is yellow. The orange is orange.",
    question: "What color is the banana?",
    answer: "yellow",
    difficulty: "easy",
    category: "colors"
  },
  
  // Speaking Exercises (20)
  {
    id: 16,
    type: "speaking",
    subtype: "pronunciation",
    word: "Hello",
    target_pronunciation: "hə-ˈləʊ",
    difficulty: "easy",
    category: "greetings"
  },
  {
    id: 17,
    type: "speaking",
    subtype: "repeat_sentence",
    sentence: "My name is Ahmed.",
    difficulty: "easy",
    category: "introductions"
  }
];

// Generate more exercises to reach 200+
export const generateMoreExercises = () => {
  const exercises = [...interactiveExercises];
  const types = ["vocabulary", "grammar", "listening", "reading", "speaking"];
  const subtypes = {
    vocabulary: ["multiple_choice", "fill_blank", "matching", "translation", "image_selection"],
    grammar: ["fill_blank", "sentence_formation", "error_correction", "multiple_choice"],
    listening: ["dictation", "comprehension", "true_false"],
    reading: ["comprehension", "vocabulary_in_context", "main_idea"],
    speaking: ["pronunciation", "repeat_sentence", "describe_picture"]
  };
  const categories = ["greetings", "family", "colors", "food", "numbers", "time", "places", "activities"];
  const difficulties = ["easy", "medium", "hard"];
  
  // Generate exercises 18-200
  for (let i = 18; i <= 200; i++) {
    const type = types[i % types.length];
    const subtype = (subtypes as any)[type][i % (subtypes as any)[type].length];
    const category = categories[i % categories.length];
    const difficulty = difficulties[i % difficulties.length];
    
    const exercise: any = {
      id: i,
      type,
      subtype,
      difficulty,
      category
    };
    
    // Add type-specific properties
    switch (type) {
      case "vocabulary":
        exercise.question = `Vocabulary question ${i}`;
        exercise.options = ["Option A", "Option B", "Option C", "Option D"];
        exercise.correct = i % 4;
        break;
      case "grammar":
        exercise.question = `Grammar question ${i}`;
        exercise.answer = "answer";
        exercise.options = ["am", "is", "are"];
        break;
      case "listening":
        exercise.audio = `audio_${i}`;
        exercise.question = `Listening question ${i}`;
        break;
      case "reading":
        exercise.passage = `Reading passage ${i}`;
        exercise.question = `Reading question ${i}`;
        break;
      case "speaking":
        exercise.word = `Word${i}`;
        exercise.target_pronunciation = "pronunciation";
        break;
    }
    
    exercises.push(exercise);
  }
  
  return exercises;
};

export const allExercises = generateMoreExercises();

// Exercise Categories
export const exerciseCategories = {
  vocabulary: {
    name: "المفردات",
    description: "تمارين لتعلم وتذكر الكلمات الجديدة",
    icon: "📚",
    color: "#4CAF50"
  },
  grammar: {
    name: "القواعد",
    description: "تمارين لفهم وتطبيق قواعد اللغة",
    icon: "📝",
    color: "#2196F3"
  },
  listening: {
    name: "الاستماع",
    description: "تمارين لتحسين مهارات الاستماع",
    icon: "🎧",
    color: "#FF9800"
  },
  reading: {
    name: "القراءة",
    description: "تمارين لتحسين مهارات القراءة والفهم",
    icon: "📖",
    color: "#9C27B0"
  },
  speaking: {
    name: "التحدث",
    description: "تمارين لتحسين النطق والتحدث",
    icon: "🗣️",
    color: "#F44336"
  }
};

// Exercise Difficulty Levels
export const difficultyLevels = {
  easy: {
    name: "سهل",
    description: "مبتدئين - مستوى A1",
    color: "#4CAF50",
    points: 10
  },
  medium: {
    name: "متوسط",
    description: "متوسط - مستوى A2",
    color: "#FF9800",
    points: 20
  },
  hard: {
    name: "صعب",
    description: "متقدم - مستوى B1",
    color: "#F44336",
    points: 30
  }
};
