// Enhanced TypeScript Types and Interfaces
export interface BaseUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends BaseUser {
  level: number;
  xp: number;
  streak: number;
  preferences: UserPreferences;
  progress: LearningProgress;
  achievements: Achievement[];
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  audio: AudioSettings;
  accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  desktop: boolean;
  weekly: boolean;
  daily: boolean;
}

export interface AudioSettings {
  volume: number;
  microphoneEnabled: boolean;
  speakerEnabled: boolean;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
}

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export interface LearningProgress {
  totalStudyTime: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  testsPassed: number;
  vocabularyLearned: number;
  grammarMastered: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpReward: number;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  icon: string;
}

export type AchievementCategory = 'learning' | 'practice' | 'social' | 'milestone';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Exercise Types
export interface BaseExercise {
  id: string;
  type: ExerciseType;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  xpReward: number;
  prerequisites?: string[];
  tags: string[];
}

export interface VocabularyExercise extends BaseExercise {
  type: 'vocabulary';
  words: VocabularyWord[];
  instructions: string;
  arabicInstructions: string;
}

export interface GrammarExercise extends BaseExercise {
  type: 'grammar';
  sentences: GrammarSentence[];
  rules: GrammarRule[];
  instructions: string;
  arabicInstructions: string;
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioUrl: string;
  transcript: string;
  questions: ListeningQuestion[];
  speed: 'slow' | 'normal' | 'fast';
}

export interface SpeakingExercise extends BaseExercise {
  type: 'speaking';
  prompts: SpeakingPrompt[];
  expectedAnswers: string[];
  pronunciationCriteria: PronunciationCriteria;
}

export interface ReadingExercise extends BaseExercise {
  type: 'reading';
  passage: ReadingPassage;
  questions: ReadingQuestion[];
  vocabulary: VocabularyWord[];
}

export interface WritingExercise extends BaseExercise {
  type: 'writing';
  prompts: WritingPrompt[];
  criteria: WritingCriteria;
  wordLimit?: number;
}

export type ExerciseType = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Component Props with strict typing
export interface ExerciseCardProps {
  exercise: BaseExercise;
  onStart: (exercise: BaseExercise) => void;
  onBookmark?: (exerciseId: string) => void;
  isBookmarked?: boolean;
  progress?: number;
  showProgress?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export interface ProgressIndicatorProps {
  value: number;
  max: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  animated?: boolean;
}

export interface AIResponse<T> {
  data: T;
  confidence: number;
  processingTime: number;
  model: string;
  timestamp: Date;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: Date;
    requestId: string;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Generic Hooks
export interface UseExerciseReturn {
  exercise: BaseExercise | null;
  loading: boolean;
  error: string | null;
  progress: number;
  startExercise: () => void;
  pauseExercise: () => void;
  resetExercise: () => void;
  submitAnswer: (answer: any) => Promise<ExerciseResult>;
}

export interface UseAIFeedbackReturn {
  feedback: AIFeedback | null;
  loading: boolean;
  error: string | null;
  generateFeedback: (input: any) => Promise<void>;
  clearFeedback: () => void;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
  renderTime: number;
  componentLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  errorRate: number;
  userEngagement: number;
}

export interface ComponentPerformance {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  memoryFootprint: number;
}

// Error Handling Types
export interface AppError {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  component?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorInfo: any;
  retryCount: number;
}

// Testing Types
export interface TestFixture {
  user: Student;
  exercises: BaseExercise[];
  achievements: Achievement[];
  mockAPI: {
    responses: Record<string, any>;
    delays: Record<string, number>;
    errors: Record<string, boolean>;
  };
}

export interface TestResult {
  passed: boolean;
  score: number;
  duration: number;
  errors: string[];
  coverage: number;
  performance: PerformanceMetrics;
}
