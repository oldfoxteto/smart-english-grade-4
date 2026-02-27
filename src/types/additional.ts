// Additional Type Definitions
export interface VocabularyWord {
  word: string;
  translation: string;
  definition: string;
  example: string;
  pronunciation: string;
  difficulty: DifficultyLevel;
  category: string;
  context: string;
}

export interface GrammarSentence {
  sentence: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  rule: string;
}

export interface GrammarRule {
  name: string;
  description: string;
  example: string;
  exceptions?: string[];
}

export interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timestamp: number;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
}

export interface SpeakingPrompt {
  id: string;
  prompt: string;
  context: string;
  expectedDuration: number;
  difficulty: DifficultyLevel;
  tips: string[];
}

export interface PronunciationCriteria {
  accuracy: number;
  fluency: number;
  intonation: number;
  speed: number;
  clarity: number;
}

export interface ReadingPassage {
  title: string;
  content: string;
  wordCount: number;
  readingLevel: DifficultyLevel;
  topic: string;
  summary: string;
}

export interface ReadingQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
}

export interface WritingPrompt {
  id: string;
  prompt: string;
  context: string;
  wordLimit: number;
  timeLimit: number;
  topic: string;
  hints: string[];
}

export interface WritingCriteria {
  grammar: number;
  vocabulary: number;
  coherence: number;
  relevance: number;
  creativity: number;
}

export interface ExerciseResult {
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: any[];
  feedback: string;
  improvements: string[];
  xpGained: number;
  completedAt: Date;
}

export interface AIFeedback {
  overall: number;
  grammar: number;
  vocabulary: number;
  pronunciation: number;
  fluency: number;
  suggestions: string[];
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  encouragement: string;
}
