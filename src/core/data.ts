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

// ============================================================
// VOCABULARY DATA
// ============================================================
export const vocabularyWords: VocabularyWord[] = [
    { id: 1, word: 'Apple', translation: 'تفاحة', emoji: '🍎', example: 'I eat an apple every day.', category: 'Fruits' },
    { id: 2, word: 'Banana', translation: 'موزة', emoji: '🍌', example: 'The monkey loves bananas.', category: 'Fruits' },
    { id: 3, word: 'Orange', translation: 'برتقالة', emoji: '🍊', example: 'Orange juice is delicious.', category: 'Fruits' },
    { id: 4, word: 'Grapes', translation: 'عنب', emoji: '🍇', example: 'She picked grapes from the garden.', category: 'Fruits' },
    { id: 5, word: 'Strawberry', translation: 'فراولة', emoji: '🍓', example: 'Strawberries are red and sweet.', category: 'Fruits' },
    { id: 6, word: 'Cat', translation: 'قطة', emoji: '🐱', example: 'The cat is sleeping on the sofa.', category: 'Animals' },
    { id: 7, word: 'Dog', translation: 'كلب', emoji: '🐶', example: 'My dog loves to play fetch.', category: 'Animals' },
    { id: 8, word: 'Elephant', translation: 'فيل', emoji: '🐘', example: 'The elephant has a long trunk.', category: 'Animals' },
    { id: 9, word: 'Lion', translation: 'أسد', emoji: '🦁', example: 'The lion is the king of the jungle.', category: 'Animals' },
    { id: 10, word: 'Butterfly', translation: 'فراشة', emoji: '🦋', example: 'A butterfly landed on the flower.', category: 'Animals' },
    { id: 11, word: 'School', translation: 'مدرسة', emoji: '🏫', example: 'I go to school every morning.', category: 'Places' },
    { id: 12, word: 'Library', translation: 'مكتبة', emoji: '📚', example: 'We read books in the library.', category: 'Places' },
    { id: 13, word: 'Hospital', translation: 'مستشفى', emoji: '🏥', example: 'The doctor works at the hospital.', category: 'Places' },
    { id: 14, word: 'Park', translation: 'حديقة', emoji: '🌳', example: 'Children play in the park.', category: 'Places' },
    { id: 15, word: 'Happy', translation: 'سعيد', emoji: '😊', example: 'I am happy when I see my friends.', category: 'Feelings' },
    { id: 16, word: 'Sad', translation: 'حزين', emoji: '😢', example: 'She felt sad when she lost her toy.', category: 'Feelings' },
    { id: 17, word: 'Excited', translation: 'متحمس', emoji: '🤩', example: 'He was excited about his birthday.', category: 'Feelings' },
    { id: 18, word: 'Brave', translation: 'شجاع', emoji: '💪', example: 'The brave knight saved the princess.', category: 'Feelings' },
    { id: 19, word: 'Run', translation: 'يجري', emoji: '🏃', example: 'I run in the park every morning.', category: 'Actions' },
    { id: 20, word: 'Jump', translation: 'يقفز', emoji: '🦘', example: 'The frog can jump very high.', category: 'Actions' },
    { id: 21, word: 'Swim', translation: 'يسبح', emoji: '🏊', example: 'Fish swim in the ocean.', category: 'Actions' },
    { id: 22, word: 'Read', translation: 'يقرأ', emoji: '📖', example: 'I read a book before bed.', category: 'Actions' },
    { id: 23, word: 'Write', translation: 'يكتب', emoji: '✏️', example: 'She writes her name on the paper.', category: 'Actions' },
    { id: 24, word: 'Sing', translation: 'يغني', emoji: '🎵', example: 'Birds sing in the morning.', category: 'Actions' },
];

// ============================================================
// GRAMMAR DATA
// ============================================================
export const grammarLessons: GrammarLesson[] = [
    {
        id: 1,
        title: 'Nouns',
        emoji: '🏷️',
        color: '#6C63FF',
        explanation: 'A noun is a word that names a person, place, thing, or animal. Nouns are the "naming words" in a sentence!',
        examples: [
            '🧑 Person: teacher, student, doctor',
            '🏠 Place: school, park, home',
            '🎁 Thing: book, ball, pencil',
            '🐶 Animal: dog, cat, bird',
        ],
    },
    {
        id: 2,
        title: 'Verbs',
        emoji: '⚡',
        color: '#FF6B6B',
        explanation: 'A verb is an action word. It tells us what someone or something does. Every sentence needs a verb!',
        examples: [
            '🏃 I run to school.',
            '📚 She reads a book.',
            '🎨 He paints a picture.',
            '🎵 They sing a song.',
        ],
    },
    {
        id: 3,
        title: 'Adjectives',
        emoji: '🎨',
        color: '#4CAF50',
        explanation: 'Adjectives are describing words. They tell us more about nouns — what they look like, feel like, or how many there are.',
        examples: [
            '🌟 The big elephant is grey.',
            '🌹 She has a beautiful flower.',
            '🍦 The ice cream is cold and sweet.',
            '📦 I have three red boxes.',
        ],
    },
    {
        id: 4,
        title: 'Present Simple',
        emoji: '⏰',
        color: '#FF9800',
        explanation: 'We use the Present Simple tense to talk about things we do regularly or things that are always true.',
        examples: [
            '☀️ The sun rises in the east.',
            '🐟 Fish live in water.',
            '📅 I go to school every day.',
            '🍎 She eats an apple for lunch.',
        ],
    },
    {
        id: 5,
        title: 'Articles (a, an, the)',
        emoji: '📝',
        color: '#29B6F6',
        explanation: '"A" and "an" are used before singular nouns. Use "an" before words starting with a vowel sound (a, e, i, o, u). "The" is used for specific things.',
        examples: [
            '🍎 I ate an apple. (vowel sound)',
            '🐶 I have a dog. (consonant sound)',
            '🌙 The moon is bright tonight.',
            '📚 Please close the book.',
        ],
    },
    {
        id: 6,
        title: 'Pronouns',
        emoji: '👤',
        color: '#9C27B0',
        explanation: 'Pronouns replace nouns so we don\'t have to repeat the same word. They make our sentences shorter and smoother.',
        examples: [
            '👦 Ahmed is smart. He is my friend.',
            '👧 Sara is kind. She helps everyone.',
            '🐱 The cat is cute. It is fluffy.',
            '👫 Tom and I are happy. We are friends.',
        ],
    },
];

// ============================================================
// READING STORIES
// ============================================================
export const readingStories: ReadingStory[] = [
    {
        id: 1,
        title: 'The Brave Little Turtle',
        emoji: '🐢',
        level: 'Easy',
        color: '#4CAF50',
        text: `Once upon a time, there was a little turtle named Tim. Tim lived near a beautiful pond. Every day, Tim would walk slowly to the pond to drink water and play with his friends.

One sunny morning, Tim saw a small bird with a broken wing. The bird was crying. Tim felt sad for the bird. He decided to help.

Tim carried the bird on his shell all the way to the old oak tree. There, the bird's mother was waiting. She was very happy to see her baby.

"Thank you, brave turtle!" said the mother bird.

Tim smiled. He felt warm and happy inside. Being kind is the best thing in the world!`,
        questions: [
            { question: 'Where did Tim live?', options: ['In a forest', 'Near a pond', 'On a mountain', 'In a city'], answer: 1 },
            { question: 'What did Tim find one morning?', options: ['A lost dog', 'A broken toy', 'A bird with a broken wing', 'A golden coin'], answer: 2 },
            { question: 'How did Tim help the bird?', options: ['He flew it home', 'He carried it on his shell', 'He called for help', 'He gave it food'], answer: 1 },
            { question: 'How did Tim feel at the end?', options: ['Tired and sad', 'Angry and upset', 'Warm and happy', 'Scared and worried'], answer: 2 },
        ],
    },
    {
        id: 2,
        title: 'The Magic Garden',
        emoji: '🌻',
        level: 'Medium',
        color: '#FF9800',
        text: `Lily loved her grandmother's garden. It was full of colorful flowers, tall trees, and singing birds. But this was no ordinary garden — it was a magic garden!

Every plant in the garden could talk. The roses told stories about brave knights. The sunflowers shared jokes that made everyone laugh. The old oak tree gave wise advice to anyone who needed it.

One day, Lily came to the garden feeling very sad. She had failed her English test at school. She sat under the oak tree and started to cry.

"Why are you crying, little one?" asked the oak tree in a deep, gentle voice.

"I failed my test," said Lily. "I am not smart enough."

"Nonsense!" said the oak tree. "Every great person fails sometimes. What matters is that you try again. Practice every day, and you will succeed."

Lily wiped her tears. She went home, studied hard, and the next week, she got the highest score in her class!`,
        questions: [
            { question: 'What was special about the garden?', options: ['It had golden flowers', 'The plants could talk', 'It was very large', 'It had a fountain'], answer: 1 },
            { question: 'Why was Lily sad?', options: ['She lost her toy', 'She had a fight with a friend', 'She failed her English test', 'She was sick'], answer: 2 },
            { question: 'What did the oak tree tell Lily?', options: ['To give up', 'To ask her teacher for help', 'That failing is okay and to try again', 'To find a new school'], answer: 2 },
            { question: 'What happened the next week?', options: ['Lily failed again', 'Lily got the highest score', 'Lily did not go to school', 'Lily forgot to study'], answer: 1 },
        ],
    },
    {
        id: 3,
        title: 'A Day at the Space Station',
        emoji: '🚀',
        level: 'Hard',
        color: '#6C63FF',
        text: `Commander Zara floated through the corridors of Space Station Alpha. Outside the circular windows, Earth glowed like a beautiful blue marble against the darkness of space.

"Good morning, Commander," said ARIA, the station's artificial intelligence. "Today's mission: repair the solar panels on the station's east wing."

Zara put on her spacesuit carefully. Each piece had to be checked three times. One mistake in space could be very dangerous. She attached her safety cable and stepped into the airlock.

The moment she stepped outside, she gasped. The view was breathtaking. Thousands of stars sparkled around her. She could see the curve of the Earth below.

Working carefully, Zara replaced the damaged solar panel. It took two hours of precise, patient work. When she finished, the station's power levels returned to normal.

"Mission accomplished," she reported. "The station is fully operational."

Back inside, her crew cheered. Zara smiled. She had always dreamed of being an astronaut. Hard work and dedication had made that dream come true.`,
        questions: [
            { question: 'What was Zara\'s mission for the day?', options: ['To pilot the spacecraft', 'To repair the solar panels', 'To contact Earth', 'To cook breakfast'], answer: 1 },
            { question: 'Why did Zara check her spacesuit three times?', options: ['Because she forgot things easily', 'Because it was a rule', 'Because one mistake could be dangerous', 'Because ARIA told her to'], answer: 2 },
            { question: 'How long did the repair take?', options: ['One hour', 'Three hours', 'Two hours', 'All day'], answer: 2 },
            { question: 'What does the story teach us?', options: ['Space is scary', 'Hard work and dedication make dreams come true', 'Only geniuses can be astronauts', 'Robots do all the work'], answer: 1 },
        ],
    },
];

// ============================================================
// QUIZ DATA
// ============================================================
export const quizQuestions: QuizQuestion[] = [
    { id: 1, question: 'Which word is a noun?', options: ['Run', 'Beautiful', 'School', 'Quickly'], answer: 2, explanation: '"School" is a noun because it names a place.', category: 'Grammar' },
    { id: 2, question: 'Choose the correct article: "I saw ___ elephant at the zoo."', options: ['a', 'an', 'the', 'some'], answer: 1, explanation: 'We use "an" before words that start with a vowel sound. "Elephant" starts with "e".', category: 'Grammar' },
    { id: 3, question: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], answer: 2, explanation: '"Children" is the irregular plural of "child".', category: 'Grammar' },
    { id: 4, question: 'Which sentence is correct?', options: ['She run fast.', 'She runs fast.', 'She running fast.', 'She runned fast.'], answer: 1, explanation: 'With "she", we add "s" to the verb in present simple: "runs".', category: 'Grammar' },
    { id: 5, question: 'What does "Butterfly" mean in Arabic?', options: ['نحلة', 'فراشة', 'عصفور', 'دودة'], answer: 1, explanation: '"Butterfly" means "فراشة" in Arabic.', category: 'Vocabulary' },
    { id: 6, question: 'Which word means "سعيد" in English?', options: ['Sad', 'Angry', 'Happy', 'Tired'], answer: 2, explanation: '"Happy" means "سعيد" in Arabic.', category: 'Vocabulary' },
    { id: 7, question: 'What is the opposite of "big"?', options: ['Large', 'Huge', 'Small', 'Tall'], answer: 2, explanation: '"Small" is the opposite of "big".', category: 'Vocabulary' },
    { id: 8, question: 'Which word is an adjective?', options: ['Jump', 'Quickly', 'Beautiful', 'School'], answer: 2, explanation: '"Beautiful" is an adjective because it describes how something looks.', category: 'Grammar' },
    { id: 9, question: 'Complete: "The cat ___ on the mat."', options: ['sit', 'sits', 'sitting', 'sitted'], answer: 1, explanation: 'With "the cat" (singular), we use "sits" in present simple.', category: 'Grammar' },
    { id: 10, question: 'What does "Library" mean?', options: ['مستشفى', 'مدرسة', 'مكتبة', 'حديقة'], answer: 2, explanation: '"Library" means "مكتبة" — a place where you find books.', category: 'Vocabulary' },
    { id: 11, question: 'Which is a verb?', options: ['Apple', 'Blue', 'Swim', 'House'], answer: 2, explanation: '"Swim" is a verb — it is an action word.', category: 'Grammar' },
    { id: 12, question: 'What is the correct pronoun for "Sara"?', options: ['He', 'It', 'They', 'She'], answer: 3, explanation: 'We use "She" for a girl or woman.', category: 'Grammar' },
];
