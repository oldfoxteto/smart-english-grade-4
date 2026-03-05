export interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  emoji: string;
  example: string;
  image?: string;
  category: string;
}

export interface GrammarLesson {
  id: number;
  title: string;
  emoji: string;
  explanation: string;
  examples: string[];
  color: string;
}

export interface ReadingStory {
  id: number;
  title: string;
  emoji: string;
  level: 'Easy' | 'Medium' | 'Hard';
  text: string;
  questions: { question: string; options: string[]; answer: number }[];
  color: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  category: string;
}

type CategorySeed = {
  category: string;
  emoji: string;
  words: string[];
};

const vocabularySeeds: CategorySeed[] = [
  { category: 'Animals', emoji: '🐾', words: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Horse', 'Cow', 'Goat', 'Duck', 'Fish', 'Tiger', 'Lion', 'Monkey', 'Panda', 'Zebra', 'Koala'] },
  { category: 'Food', emoji: '🍎', words: ['Apple', 'Banana', 'Orange', 'Mango', 'Tomato', 'Carrot', 'Potato', 'Bread', 'Rice', 'Cheese', 'Milk', 'Egg', 'Soup', 'Pizza', 'Salad'] },
  { category: 'School', emoji: '📘', words: ['Book', 'Notebook', 'Pencil', 'Pen', 'Ruler', 'Bag', 'Board', 'Classroom', 'Teacher', 'Student', 'Homework', 'Lesson', 'Question', 'Answer', 'Project'] },
  { category: 'Home', emoji: '🏠', words: ['House', 'Room', 'Kitchen', 'Bathroom', 'Window', 'Door', 'Table', 'Chair', 'Bed', 'Lamp', 'Sofa', 'Garden', 'Kitchen Sink', 'Wall', 'Clock'] },
  { category: 'Nature', emoji: '🌿', words: ['Tree', 'Flower', 'Grass', 'River', 'Mountain', 'Forest', 'Cloud', 'Rain', 'Snow', 'Wind', 'Sun', 'Moon', 'Star', 'Ocean', 'Beach'] },
  { category: 'Travel', emoji: '✈️', words: ['Airport', 'Passport', 'Ticket', 'Plane', 'Train', 'Bus', 'Taxi', 'Station', 'Hotel', 'Map', 'Suitcase', 'Journey', 'Trip', 'Bridge', 'Road'] },
  { category: 'Actions', emoji: '⚡', words: ['Run', 'Walk', 'Jump', 'Read', 'Write', 'Speak', 'Listen', 'Watch', 'Open', 'Close', 'Clean', 'Build', 'Draw', 'Play', 'Learn'] },
  { category: 'Feelings', emoji: '🙂', words: ['Happy', 'Sad', 'Excited', 'Calm', 'Brave', 'Nervous', 'Proud', 'Shy', 'Tired', 'Curious', 'Kind', 'Friendly', 'Angry', 'Careful', 'Confident'] },
  { category: 'Jobs', emoji: '👩‍💼', words: ['Doctor', 'Nurse', 'Teacher', 'Engineer', 'Farmer', 'Pilot', 'Chef', 'Artist', 'Driver', 'Police Officer', 'Firefighter', 'Scientist', 'Dentist', 'Builder', 'Coach'] },
  { category: 'Weather', emoji: '⛅', words: ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Stormy', 'Foggy', 'Hot', 'Cold', 'Warm', 'Dry', 'Wet', 'Lightning', 'Thunder', 'Rainbow', 'Breeze'] },
  { category: 'Community', emoji: '🏙️', words: ['Library', 'Hospital', 'Market', 'Park', 'Museum', 'Mosque', 'Church', 'Post Office', 'Bakery', 'Pharmacy', 'Clinic', 'Factory', 'Stadium', 'Theater', 'Square'] },
  { category: 'Sports', emoji: '🏅', words: ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Swimming', 'Cycling', 'Running', 'Boxing', 'Karate', 'Gymnastics', 'Skating', 'Hiking', 'Yoga', 'Sailing', 'Rowing'] },
];

const wordVariants = [
  {
    suffix: '',
    sentence: (word: string) => `I can use the word ${word} in a sentence.`,
  },
  {
    suffix: ' (plural)',
    sentence: (word: string) => `We often see many ${word.toLowerCase()}s in our daily life.`,
  },
  {
    suffix: ' (sentence)',
    sentence: (word: string) => `My teacher asked me to explain ${word.toLowerCase()} in class.`,
  },
];

const vocabularyWords: VocabularyWord[] = [];
let vocabId = 1;
for (const seed of vocabularySeeds) {
  for (const baseWord of seed.words) {
    for (const variant of wordVariants) {
      const word = `${baseWord}${variant.suffix}`;
      vocabularyWords.push({
        id: vocabId,
        word,
        translation: `${baseWord.toLowerCase()} (arabic)` ,
        emoji: seed.emoji,
        example: variant.sentence(baseWord),
        category: seed.category,
      });
      vocabId += 1;
    }
  }
}

const grammarTopicSeeds = [
  { title: 'Nouns', explanation: 'Nouns name people, places, things, or ideas.' },
  { title: 'Verbs', explanation: 'Verbs describe action or state.' },
  { title: 'Adjectives', explanation: 'Adjectives describe nouns.' },
  { title: 'Adverbs', explanation: 'Adverbs describe verbs, adjectives, or other adverbs.' },
  { title: 'Pronouns', explanation: 'Pronouns replace nouns in a sentence.' },
  { title: 'Prepositions', explanation: 'Prepositions show relation of place, time, or direction.' },
  { title: 'Articles', explanation: 'Articles are a, an, and the.' },
  { title: 'Present Simple', explanation: 'Use present simple for routines and facts.' },
  { title: 'Present Continuous', explanation: 'Use present continuous for actions happening now.' },
  { title: 'Past Simple', explanation: 'Use past simple for finished actions in the past.' },
  { title: 'Future with will', explanation: 'Use will for predictions and quick decisions.' },
  { title: 'Can and Cannot', explanation: 'Use can and cannot to express ability.' },
  { title: 'There is and There are', explanation: 'Use there is/are to introduce things.' },
  { title: 'Comparatives', explanation: 'Comparatives compare two things.' },
  { title: 'Superlatives', explanation: 'Superlatives show the highest or lowest degree.' },
  { title: 'Question Forms', explanation: 'Question forms use helping verbs and word order.' },
  { title: 'Conjunctions', explanation: 'Conjunctions connect words and clauses.' },
  { title: 'Possessive Adjectives', explanation: 'Possessive adjectives show ownership.' },
  { title: 'Countable and Uncountable', explanation: 'Some nouns can be counted and others cannot.' },
  { title: 'Short Answers', explanation: 'Short answers make conversation natural and clear.' },
];

const grammarColors = ['#4CAF50', '#1E88E5', '#FF9800', '#8E24AA', '#E53935', '#00897B'];
const grammarEmojis = ['📘', '✍️', '🧠', '🎯', '🧩', '📚'];

export const grammarLessons: GrammarLesson[] = grammarTopicSeeds.flatMap((topic, topicIndex) => {
  return [1, 2, 3].map((level, offset) => {
    const id = topicIndex * 3 + level;
    const difficultyLabel = level === 1 ? 'Basics' : level === 2 ? 'Practice' : 'Mastery';
    const title = `${topic.title} - ${difficultyLabel}`;
    const explanation = `${topic.explanation} This lesson focuses on grade-4 level ${difficultyLabel.toLowerCase()} tasks.`;
    const examples = [
      `Example 1: ${topic.title} in a short sentence for level ${level}.`,
      `Example 2: Build your own sentence using ${topic.title.toLowerCase()}.`,
      `Example 3: Fix the grammar error in a classroom sentence.`,
      `Example 4: Speak the sentence and check pronunciation.`,
    ];

    return {
      id,
      title,
      emoji: grammarEmojis[(topicIndex + offset) % grammarEmojis.length],
      explanation,
      examples,
      color: grammarColors[(topicIndex + offset) % grammarColors.length],
    };
  });
});

const storyHeroes = ['Maya', 'Omar', 'Lina', 'Yousef', 'Rana', 'Salem', 'Nora', 'Karim', 'Hadi', 'Sara'];
const storyPlaces = ['school garden', 'city library', 'science lab', 'sports field', 'old market', 'train station'];
const storyGoals = ['find a lost notebook', 'prepare a class show', 'help a friend learn words', 'solve a language puzzle'];
const storyColors = ['#4CAF50', '#2196F3', '#FF9800', '#8E24AA', '#E53935', '#009688'];
const storyEmojis = ['📖', '🌟', '🧭', '🚀', '🏆', '🧠'];

function buildStory(index: number): ReadingStory {
  const hero = storyHeroes[index % storyHeroes.length];
  const place = storyPlaces[index % storyPlaces.length];
  const goal = storyGoals[index % storyGoals.length];
  const helper = storyHeroes[(index + 3) % storyHeroes.length];
  const level: ReadingStory['level'] = index % 3 === 0 ? 'Easy' : index % 3 === 1 ? 'Medium' : 'Hard';

  const text = [
    `${hero} walked into the ${place} before class. Today, the mission was to ${goal}.`,
    `${helper} joined the mission and suggested using English clues on every step. They wrote three clues and read them aloud together.`,
    `At the middle of the challenge, they made one mistake, then corrected it with a calm plan. They practiced one short sentence for speaking and one for writing.`,
    `At the end, the team completed the mission and shared what they learned with the class. The teacher praised their teamwork and confidence.`,
  ].join('\n\n');

  return {
    id: index + 1,
    title: `Story Quest ${index + 1}: ${hero} in the ${place}`,
    emoji: storyEmojis[index % storyEmojis.length],
    level,
    color: storyColors[index % storyColors.length],
    text,
    questions: [
      {
        question: `Where did ${hero} start the mission?`,
        options: ['At home', `At the ${place}`, 'At the beach', 'At a zoo'],
        answer: 1,
      },
      {
        question: `What was the main goal?`,
        options: ['Win a race', goal, 'Cook dinner', 'Clean a room'],
        answer: 1,
      },
      {
        question: 'How did the students improve during the mission?',
        options: ['They gave up', 'They ignored mistakes', 'They corrected and practiced', 'They left early'],
        answer: 2,
      },
      {
        question: 'What happened at the end?',
        options: ['They forgot the mission', 'They completed it and shared learning', 'They canceled class', 'They lost all clues'],
        answer: 1,
      },
    ],
  };
}

export const readingStories: ReadingStory[] = Array.from({ length: 55 }, (_, index) => buildStory(index));

const grammarQuestionPool = grammarLessons.slice(0, 120).map((lesson, index) => {
  return {
    id: index + 1,
    question: `Which sentence best matches ${lesson.title}?`,
    options: [
      'Sentence with a clear grammar pattern.',
      'Sentence with random words only.',
      'Sentence with no verb.',
      'Sentence with incorrect punctuation everywhere.',
    ],
    answer: 0,
    explanation: `${lesson.title} needs a clear and correct structure.`,
    category: 'Grammar',
  };
});

const vocabularyQuestionPool = vocabularyWords.slice(0, 260).map((word, index) => {
  return {
    id: grammarQuestionPool.length + index + 1,
    question: `What category does "${word.word}" belong to?`,
    options: [word.category, 'Math', 'Music', 'Unknown'],
    answer: 0,
    explanation: `"${word.word}" is part of the ${word.category} set.`,
    category: 'Vocabulary',
  };
});

export const quizQuestions: QuizQuestion[] = [...grammarQuestionPool, ...vocabularyQuestionPool];

export { vocabularyWords };
