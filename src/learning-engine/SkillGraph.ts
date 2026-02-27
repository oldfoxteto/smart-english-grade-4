// Skill Graph Implementation for Learning Engine
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'listening' | 'speaking' | 'reading' | 'writing';
  level: number; // 1-10
  prerequisites: string[]; // Required skills to unlock this skill
  dependencies: string[]; // Skills that depend on this skill
  learningObjectives: string[];
  assessmentCriteria: {
    type: 'quiz' | 'practice' | 'project' | 'exam';
    passingScore: number;
    timeLimit?: number;
  };
  resources: {
    lessons: string[];
    exercises: string[];
    materials: string[];
  };
  metadata: {
    estimatedTime: number; // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
  };
}

export interface SkillConnection {
  from: string;
  to: string;
  type: 'prerequisite' | 'dependency' | 'reinforcement';
  strength: number; // 1-10, how strong the connection is
  description?: string;
}

export interface SkillPath {
  id: string;
  name: string;
  description: string;
  skills: string[]; // Ordered list of skills to learn
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: 'grade4' | 'grade5' | 'grade6' | 'adult';
}

export interface UserSkillProgress {
  userId: string;
  skillId: string;
  masteryLevel: number; // 0-100
  timeSpent: number; // minutes
  practiceCount: number;
  lastPracticed: Date;
  strengths: string[];
  weaknesses: string[];
  nextRecommendations: string[];
}

export interface LearningGoal {
  id: string;
  userId: string;
  skillIds: string[];
  targetDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

class SkillGraph {
  private skills: Map<string, Skill> = new Map();
  private connections: Map<string, SkillConnection[]> = new Map();
  private userProgress: Map<string, UserSkillProgress> = new Map();
  private learningPaths: Map<string, SkillPath> = new Map();

  constructor() {
    this.initializeSkills();
    this.initializeConnections();
    this.initializeLearningPaths();
  }

  // Initialize core skills for Grade 4 English
  private initializeSkills(): void {
    const grade4Skills: Skill[] = [
      // Vocabulary Skills
      {
        id: 'vocab-basic-nouns',
        name: 'Basic Nouns',
        description: 'Learn common nouns for everyday objects',
        category: 'vocabulary',
        level: 1,
        prerequisites: [],
        dependencies: [],
        learningObjectives: [
          'Identify common nouns in context',
          'Use nouns in simple sentences',
          'Recognize noun plurals'
        ],
        assessmentCriteria: {
          type: 'quiz',
          passingScore: 80,
          timeLimit: 300
        },
        resources: {
          lessons: ['nouns-intro', 'everyday-objects'],
          exercises: ['noun-matching', 'plural-forms'],
          materials: ['flashcards', 'picture-dictionary']
        },
        metadata: {
          estimatedTime: 45,
          difficulty: 'beginner',
          tags: ['nouns', 'vocabulary', 'basics']
        }
      },
      {
        id: 'vocab-basic-verbs',
        name: 'Basic Verbs',
        description: 'Learn common action words',
        category: 'vocabulary',
        level: 2,
        prerequisites: ['vocab-basic-nouns'],
        dependencies: ['vocab-basic-nouns'],
        learningObjectives: [
          'Identify verbs in sentences',
          'Use present tense verbs',
          'Understand verb conjugation basics'
        ],
        assessmentCriteria: {
          type: 'practice',
          passingScore: 75,
          timeLimit: 400
        },
        resources: {
          lessons: ['verbs-intro', 'present-tense'],
          exercises: ['verb-conjugation', 'sentence-building'],
          materials: ['verb-cards', 'tense-tables']
        },
        metadata: {
          estimatedTime: 60,
          difficulty: 'beginner',
          tags: ['verbs', 'vocabulary', 'grammar']
        }
      },
      {
        id: 'vocab-adjectives',
        name: 'Adjectives',
        description: 'Learn describing words',
        category: 'vocabulary',
        level: 3,
        prerequisites: ['vocab-basic-verbs'],
        dependencies: ['vocab-basic-verbs'],
        learningObjectives: [
          'Use adjectives to describe nouns',
          'Understand comparative and superlative forms',
          'Learn adjective order in sentences'
        ],
        assessmentCriteria: {
          type: 'quiz',
          passingScore: 85,
          timeLimit: 350
        },
        resources: {
          lessons: ['adjectives-intro', 'describing-objects'],
          exercises: ['adjective-matching', 'description-writing'],
          materials: ['adjective-lists', 'picture-prompts']
        },
        metadata: {
          estimatedTime: 50,
          difficulty: 'intermediate',
          tags: ['adjectives', 'vocabulary', 'describing']
        }
      },

      // Grammar Skills
      {
        id: 'grammar-sentence-structure',
        name: 'Sentence Structure',
        description: 'Learn to build correct sentences',
        category: 'grammar',
        level: 2,
        prerequisites: ['vocab-basic-nouns', 'vocab-basic-verbs'],
        dependencies: ['vocab-basic-nouns', 'vocab-basic-verbs'],
        learningObjectives: [
          'Understand subject-verb-object structure',
          'Form simple questions',
          'Use correct word order'
        ],
        assessmentCriteria: {
          type: 'project',
          passingScore: 80,
          timeLimit: 600
        },
        resources: {
          lessons: ['sentence-basics', 'word-order'],
          exercises: ['sentence-building', 'error-correction'],
          materials: ['sentence-templates', 'grammar-rules']
        },
        metadata: {
          estimatedTime: 90,
          difficulty: 'beginner',
          tags: ['grammar', 'sentences', 'structure']
        }
      },
      {
        id: 'grammar-tenses',
        name: 'Verb Tenses',
        description: 'Learn past, present, and future tenses',
        category: 'grammar',
        level: 4,
        prerequisites: ['grammar-sentence-structure', 'vocab-adjectives'],
        dependencies: ['grammar-sentence-structure', 'vocab-adjectives'],
        learningObjectives: [
          'Use present tense correctly',
          'Understand past tense formation',
          'Apply future tense concepts'
        ],
        assessmentCriteria: {
          type: 'exam',
          passingScore: 85,
          timeLimit: 900
        },
        resources: {
          lessons: ['tense-overview', 'past-tense', 'future-tense'],
          exercises: ['tense-conversion', 'timeline-writing'],
          materials: ['tense-charts', 'verb-tables']
        },
        metadata: {
          estimatedTime: 120,
          difficulty: 'intermediate',
          tags: ['grammar', 'tenses', 'verbs']
        }
      },

      // Pronunciation Skills
      {
        id: 'pronunciation-phonics',
        name: 'Phonics Basics',
        description: 'Learn English sounds and pronunciation',
        category: 'pronunciation',
        level: 1,
        prerequisites: [],
        dependencies: [],
        learningObjectives: [
          'Recognize English phonemes',
          'Produce basic sounds correctly',
          'Understand sound-letter relationships'
        ],
        assessmentCriteria: {
          type: 'practice',
          passingScore: 70,
          timeLimit: 600
        },
        resources: {
          lessons: ['phonics-intro', 'sound-recognition'],
          exercises: ['sound-matching', 'pronunciation-practice'],
          materials: ['phonics-charts', 'audio-examples']
        },
        metadata: {
          estimatedTime: 180,
          difficulty: 'beginner',
          tags: ['pronunciation', 'phonics', 'sounds']
        }
      },
      {
        id: 'pronunciation-word-stress',
        name: 'Word Stress',
        description: 'Learn stress patterns in English words',
        category: 'pronunciation',
        level: 3,
        prerequisites: ['pronunciation-phonics'],
        dependencies: ['pronunciation-phonics'],
        learningObjectives: [
          'Identify stressed syllables',
          'Apply stress rules correctly',
          'Use stress in natural speech'
        ],
        assessmentCriteria: {
          type: 'practice',
          passingScore: 75,
          timeLimit: 450
        },
        resources: {
          lessons: ['stress-patterns', 'rhythm-practice'],
          exercises: ['stress-marking', 'word-rhythm'],
          materials: ['stress-dictionaries', 'audio-examples']
        },
        metadata: {
          estimatedTime: 90,
          difficulty: 'intermediate',
          tags: ['pronunciation', 'stress', 'rhythm']
        }
      },

      // Listening Skills
      {
        id: 'listening-basic-comprehension',
        name: 'Basic Comprehension',
        description: 'Understand spoken English in simple contexts',
        category: 'listening',
        level: 2,
        prerequisites: ['vocab-basic-nouns', 'vocab-basic-verbs', 'pronunciation-phonics'],
        dependencies: ['vocab-basic-nouns', 'vocab-basic-verbs', 'pronunciation-phonics'],
        learningObjectives: [
          'Follow simple conversations',
          'Identify key information in audio',
          'Respond to basic questions'
        ],
        assessmentCriteria: {
          type: 'quiz',
          passingScore: 70,
          timeLimit: 400
        },
        resources: {
          lessons: ['listening-basics', 'conversation-practice'],
          exercises: ['audio-comprehension', 'question-response'],
          materials: ['audio-stories', 'conversation-scripts']
        },
        metadata: {
          estimatedTime: 120,
          difficulty: 'beginner',
          tags: ['listening', 'comprehension', 'conversation']
        }
      },

      // Speaking Skills
      {
        id: 'speaking-basic-conversation',
        name: 'Basic Conversation',
        description: 'Engage in simple English conversations',
        category: 'speaking',
        level: 2,
        prerequisites: ['vocab-basic-nouns', 'vocab-basic-verbs', 'listening-basic-comprehension'],
        dependencies: ['vocab-basic-nouns', 'vocab-basic-verbs', 'listening-basic-comprehension'],
        learningObjectives: [
          'Introduce yourself in English',
          'Ask and answer basic questions',
          'Use common expressions in dialogue'
        ],
        assessmentCriteria: {
          type: 'practice',
          passingScore: 65,
          timeLimit: 600
        },
        resources: {
          lessons: ['conversation-basics', 'dialogue-practice'],
          exercises: ['role-playing', 'question-answer'],
          materials: ['conversation-prompts', 'phrase-books']
        },
        metadata: {
          estimatedTime: 150,
          difficulty: 'beginner',
          tags: ['speaking', 'conversation', 'dialogue']
        }
      },

      // Reading Skills
      {
        id: 'reading-basic-comprehension',
        name: 'Basic Reading',
        description: 'Read and understand simple English texts',
        category: 'reading',
        level: 1,
        prerequisites: ['vocab-basic-nouns', 'pronunciation-phonics'],
        dependencies: ['vocab-basic-nouns', 'pronunciation-phonics'],
        learningObjectives: [
          'Recognize common words in text',
          'Understand simple sentences',
          'Extract main ideas from short texts'
        ],
        assessmentCriteria: {
          type: 'quiz',
          passingScore: 75,
          timeLimit: 300
        },
        resources: {
          lessons: ['reading-basics', 'word-recognition'],
          exercises: ['reading-comprehension', 'vocabulary-in-context'],
          materials: ['graded-readers', 'picture-books']
        },
        metadata: {
          estimatedTime: 100,
          difficulty: 'beginner',
          tags: ['reading', 'comprehension', 'vocabulary']
        }
      },

      // Writing Skills
      {
        id: 'writing-basic-sentences',
        name: 'Basic Writing',
        description: 'Write simple English sentences',
        category: 'writing',
        level: 2,
        prerequisites: ['vocab-basic-nouns', 'vocab-basic-verbs', 'grammar-sentence-structure'],
        dependencies: ['vocab-basic-nouns', 'vocab-basic-verbs', 'grammar-sentence-structure'],
        learningObjectives: [
          'Write complete sentences',
          'Use correct punctuation',
          'Apply basic grammar rules'
        ],
        assessmentCriteria: {
          type: 'project',
          passingScore: 70,
          timeLimit: 450
        },
        resources: {
          lessons: ['writing-basics', 'sentence-structure'],
          exercises: ['sentence-writing', 'grammar-application'],
          materials: ['writing-prompts', 'grammar-guides']
        },
        metadata: {
          estimatedTime: 90,
          difficulty: 'beginner',
          tags: ['writing', 'sentences', 'grammar']
        }
      }
    ];

    grade4Skills.forEach(skill => {
      this.skills.set(skill.id, skill);
    });
  }

  // Initialize skill connections
  private initializeConnections(): void {
    const connections: SkillConnection[] = [
      // Vocabulary connections
      { from: 'vocab-basic-nouns', to: 'vocab-basic-verbs', type: 'prerequisite', strength: 8, description: 'Nouns are needed before learning verbs' },
      { from: 'vocab-basic-verbs', to: 'vocab-adjectives', type: 'prerequisite', strength: 7, description: 'Verbs help understand adjectives' },
      { from: 'vocab-adjectives', to: 'grammar-sentence-structure', type: 'dependency', strength: 6, description: 'Adjectives enhance sentence building' },
      
      // Grammar connections
      { from: 'grammar-sentence-structure', to: 'grammar-tenses', type: 'prerequisite', strength: 9, description: 'Sentence structure needed for tenses' },
      { from: 'grammar-tenses', to: 'writing-basic-sentences', type: 'dependency', strength: 8, description: 'Tense knowledge improves writing' },
      
      // Pronunciation connections
      { from: 'pronunciation-phonics', to: 'pronunciation-word-stress', type: 'prerequisite', strength: 9, description: 'Phonics needed for stress patterns' },
      { from: 'pronunciation-word-stress', to: 'speaking-basic-conversation', type: 'dependency', strength: 7, description: 'Stress patterns improve speaking' },
      
      // Integrated skills connections
      { from: 'vocab-basic-verbs', to: 'speaking-basic-conversation', type: 'dependency', strength: 8, description: 'Verbs essential for conversation' },
      { from: 'listening-basic-comprehension', to: 'speaking-basic-conversation', type: 'dependency', strength: 9, description: 'Listening comprehension supports conversation' },
      { from: 'reading-basic-comprehension', to: 'writing-basic-sentences', type: 'dependency', strength: 7, description: 'Reading skills support writing' },
      
      // Cross-category reinforcement
      { from: 'vocab-basic-nouns', to: 'reading-basic-comprehension', type: 'reinforcement', strength: 6, description: 'Vocabulary reinforces reading' },
      { from: 'grammar-sentence-structure', to: 'listening-basic-comprehension', type: 'dependency', strength: 5, description: 'Grammar helps listening comprehension' }
    ];

    connections.forEach(connection => {
      if (!this.connections.has(connection.from)) {
        this.connections.set(connection.from, []);
      }
      this.connections.get(connection.from)!.push(connection);
    });
  }

  // Initialize learning paths
  private initializeLearningPaths(): void {
    const paths: SkillPath[] = [
      {
        id: 'beginner-foundation',
        name: 'Beginner Foundation',
        description: 'Essential skills for starting English learning',
        skills: ['vocab-basic-nouns', 'vocab-basic-verbs', 'pronunciation-phonics', 'reading-basic-comprehension'],
        estimatedDuration: 480, // 8 hours
        difficulty: 'beginner',
        targetAudience: 'grade4'
      },
      {
        id: 'grammar-foundation',
        name: 'Grammar Foundation',
        description: 'Build strong grammar basics',
        skills: ['grammar-sentence-structure', 'vocab-adjectives', 'writing-basic-sentences'],
        estimatedDuration: 360, // 6 hours
        difficulty: 'beginner',
        targetAudience: 'grade4'
      },
      {
        id: 'communication-skills',
        name: 'Communication Skills',
        description: 'Develop speaking and listening abilities',
        skills: ['listening-basic-comprehension', 'speaking-basic-conversation', 'pronunciation-word-stress'],
        estimatedDuration: 420, // 7 hours
        difficulty: 'intermediate',
        targetAudience: 'grade4'
      },
      {
        id: 'advanced-grammar',
        name: 'Advanced Grammar',
        description: 'Master complex grammar concepts',
        skills: ['grammar-tenses'],
        estimatedDuration: 300, // 5 hours
        difficulty: 'intermediate',
        targetAudience: 'grade4'
      }
    ];

    paths.forEach(path => {
      this.learningPaths.set(path.id, path);
    });
  }

  // Public API methods
  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getSkillsByCategory(category: Skill['category']): Skill[] {
    return Array.from(this.skills.values()).filter(skill => skill.category === category);
  }

  getSkillConnections(skillId: string): SkillConnection[] {
    return this.connections.get(skillId) || [];
  }

  getPrerequisites(skillId: string): string[] {
    const connections = this.connections.get(skillId) || [];
    return connections
      .filter(conn => conn.type === 'prerequisite')
      .map(conn => conn.from);
  }

  getDependencies(skillId: string): string[] {
    const connections = this.connections.get(skillId) || [];
    return connections
      .filter(conn => conn.type === 'dependency')
      .map(conn => conn.from);
  }

  getLearningPath(pathId: string): SkillPath | undefined {
    return this.learningPaths.get(pathId);
  }

  getAllLearningPaths(): SkillPath[] {
    return Array.from(this.learningPaths.values());
  }

  // Learning path recommendation
  recommendLearningPath(userId: string, userProgress: UserSkillProgress[], goal?: string): SkillPath[] {
    const completedSkills = userProgress.map(progress => progress.skillId);
    const availablePaths = Array.from(this.learningPaths.values());
    
    // Filter paths based on completed skills
    const suitablePaths = availablePaths.filter(path => 
      path.skills.some(skillId => !completedSkills.includes(skillId))
    );

    // Sort by priority (fewest unmet prerequisites first)
    return suitablePaths.sort((a, b) => {
      const aUnmet = a.skills.filter(skillId => !completedSkills.includes(skillId)).length;
      const bUnmet = b.skills.filter(skillId => !completedSkills.includes(skillId)).length;
      return aUnmet - bUnmet;
    });
  }

  // Skill mastery calculation
  calculateMasteryLevel(skillId: string, userProgress: UserSkillProgress): number {
    const skill = this.getSkill(skillId);
    if (!skill) return 0;

    const progress = userProgress;
    const baseScore = progress.masteryLevel || 0;
    
    // Factor in practice count and consistency
    const practiceBonus = Math.min(progress.practiceCount * 2, 20); // Max 20 points for practice
    const timeBonus = Math.min(progress.timeSpent / 10, 15); // Max 15 points for time spent
    
    // Factor in recent practice (within last 7 days)
    const daysSinceLastPractice = (Date.now() - progress.lastPracticed.getTime()) / (1000 * 60 * 60 * 24);
    const recencyBonus = daysSinceLastPractice < 7 ? 10 : 0;
    
    // Calculate weighted score
    const weightedScore = (baseScore * 0.6) + (practiceBonus * 0.2) + (timeBonus * 0.15) + (recencyBonus * 0.05);
    
    return Math.min(Math.round(weightedScore), 100);
  }

  // Next skill recommendation
  getNextSkill(skillId: string, userProgress: UserSkillProgress[]): string | null {
    const currentSkill = this.getSkill(skillId);
    if (!currentSkill) return null;

    // Check if current skill is mastered (80%+)
    const progress = userProgress.find(p => p.skillId === skillId);
    if (!progress || this.calculateMasteryLevel(skillId, progress) < 80) {
      return null; // Continue with current skill
    }

    // Get available next skills
    const nextSkills = this.connections.get(skillId)
      ?.filter(conn => conn.type === 'prerequisite')
      .map(conn => conn.to) || [];

    // Filter out already mastered skills
    const masteredSkills = userProgress
      .filter(p => this.calculateMasteryLevel(p.skillId, p) >= 80)
      .map(p => p.skillId);

    const availableNextSkills = nextSkills.filter(skillId => !masteredSkills.includes(skillId));

    // Return the highest priority skill
    if (availableNextSkills.length > 0) {
      return availableNextSkills[0];
    }

    return null;
  }

  // Learning difficulty adjustment
  adjustDifficulty(skillId: string, userProgress: UserSkillProgress): 'easier' | 'harder' | 'same' {
    const progress = userProgress.find(p => p.skillId === skillId);
    if (!progress) return 'same';

    const masteryLevel = this.calculateMasteryLevel(skillId, progress);
    
    if (masteryLevel < 30) return 'easier';
    if (masteryLevel > 80) return 'harder';
    return 'same';
  }
}

export default SkillGraph;
export type { Skill, SkillConnection, SkillPath, UserSkillProgress, LearningGoal };
