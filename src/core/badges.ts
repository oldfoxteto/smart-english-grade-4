// نظام الشارات والإنجازات
// مصمم لتحفيز المستخدمين

export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string; // emoji or icon name
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'milestone' | 'challenge' | 'skill';
  requirement: {
    type: 'lessons' | 'exercises' | 'xp' | 'streak' | 'score';
    value: number;
  };
  color: string;
  unlocked?: boolean;
  unlockedDate?: string;
  points: number; // XP reward for unlocking
}

// **الشارات الأساسية**
export const badges: Badge[] = [
  // ===== شارات الإنجازات الأساسية (Common - ذهبي)
  {
    id: 'first-lesson',
    name: 'Getting Started',
    nameAr: 'البداية',
    description: 'Complete your first lesson',
    descriptionAr: 'أكمل درسك الأول',
    icon: '🎓',
    rarity: 'common',
    category: 'achievement',
    requirement: { type: 'lessons', value: 1 },
    color: '#FFD700',
    points: 25
  },
  {
    id: 'lesson-master-5',
    name: 'Lesson Enthusiast',
    nameAr: 'محبوب الدروس',
    description: 'Complete 5 lessons',
    descriptionAr: 'أكمل 5 دروس',
    icon: '📚',
    rarity: 'common',
    category: 'milestone',
    requirement: { type: 'lessons', value: 5 },
    color: '#FFD700',
    points: 50
  },
  {
    id: 'lesson-master-10',
    name: 'Lesson Champion',
    nameAr: 'بطل الدروس',
    description: 'Complete 10 lessons',
    descriptionAr: 'أكمل 10 دروس',
    icon: '🏆',
    rarity: 'rare',
    category: 'milestone',
    requirement: { type: 'lessons', value: 10 },
    color: '#C0C0C0',
    points: 100
  },

  // ===== شارات ممارسة التمارين (Common - برونزي)
  {
    id: 'first-exercise',
    name: 'Exercise Starter',
    nameAr: 'متدرب التمارين',
    description: 'Complete your first exercise',
    descriptionAr: 'أكمل تمرينك الأول',
    icon: '💪',
    rarity: 'common',
    category: 'achievement',
    requirement: { type: 'exercises', value: 1 },
    color: '#CD7F32',
    points: 20
  },
  {
    id: 'exercise-pro-10',
    name: 'Practice Pro',
    nameAr: 'محترف الممارسة',
    description: 'Complete 10 exercises',
    descriptionAr: 'أكمل 10 تمارين',
    icon: '⚡',
    rarity: 'common',
    category: 'achievement',
    requirement: { type: 'exercises', value: 10 },
    color: '#CD7F32',
    points: 60
  },
  {
    id: 'exercise-master-50',
    name: 'Exercise Master',
    nameAr: 'ماهر التمارين',
    description: 'Complete 50 exercises',
    descriptionAr: 'أكمل 50 تمرين',
    icon: '🥇',
    rarity: 'epic',
    category: 'milestone',
    requirement: { type: 'exercises', value: 50 },
    color: '#9B59B6',
    points: 200
  },

  // ===== شارات XP (نقاط التجربة)
  {
    id: 'xp-100',
    name: 'Experience Seeker',
    nameAr: 'متطلب الخبرة',
    description: 'Earn 100 XP',
    descriptionAr: 'اكسب 100 نقطة خبرة',
    icon: '⭐',
    rarity: 'common',
    category: 'achievement',
    requirement: { type: 'xp', value: 100 },
    color: '#FFD700',
    points: 30
  },
  {
    id: 'xp-500',
    name: 'XP Collector',
    nameAr: 'جامع النقاط',
    description: 'Earn 500 XP',
    descriptionAr: 'اكسب 500 نقطة خبرة',
    icon: '💫',
    rarity: 'rare',
    category: 'milestone',
    requirement: { type: 'xp', value: 500 },
    color: '#C0C0C0',
    points: 100
  },
  {
    id: 'xp-1000',
    name: 'XP Legend',
    nameAr: 'أسطورة النقاط',
    description: 'Earn 1000 XP',
    descriptionAr: 'اكسب 1000 نقطة خبرة',
    icon: '🌟',
    rarity: 'epic',
    category: 'milestone',
    requirement: { type: 'xp', value: 1000 },
    color: '#9B59B6',
    points: 250
  },

  // ===== شارات الاستمرارية (Streak)
  {
    id: 'streak-3',
    name: 'On Fire 🔥',
    nameAr: 'في النار',
    description: 'Achieve 3-day streak',
    descriptionAr: 'حقق سلسلة 3 أيام',
    icon: '🔥',
    rarity: 'common',
    category: 'achievement',
    requirement: { type: 'streak', value: 3 },
    color: '#FF6347',
    points: 40
  },
  {
    id: 'streak-7',
    name: 'Consistent Learner',
    nameAr: 'متعلم متسق',
    description: 'Achieve 7-day streak',
    descriptionAr: 'حقق سلسلة 7 أيام',
    icon: '📅',
    rarity: 'rare',
    category: 'challenge',
    requirement: { type: 'streak', value: 7 },
    color: '#FF6347',
    points: 100
  },
  {
    id: 'streak-30',
    name: 'Dedication Master',
    nameAr: 'سيد التفاني',
    description: 'Achieve 30-day streak',
    descriptionAr: 'حقق سلسلة 30 يوم',
    icon: '👑',
    rarity: 'legendary',
    category: 'challenge',
    requirement: { type: 'streak', value: 30 },
    color: '#FFD700',
    points: 500
  },

  // ===== شارات الدقة (Score)
  {
    id: 'perfect-score',
    name: 'Perfect One',
    nameAr: 'الكمال',
    description: 'Get 100% on a lesson',
    descriptionAr: 'احصل على 100% في درس',
    icon: '💯',
    rarity: 'epic',
    category: 'achievement',
    requirement: { type: 'score', value: 100 },
    color: '#FFD700',
    points: 150
  },
  {
    id: 'excellent-score',
    name: 'Excellent Work',
    nameAr: 'عمل ممتاز',
    description: 'Get 90%+ on a lesson',
    descriptionAr: 'احصل على 90%+ في درس',
    icon: '⭐',
    rarity: 'rare',
    category: 'achievement',
    requirement: { type: 'score', value: 90 },
    color: '#FFD700',
    points: 75
  },

  // ===== شارات خاصة إضافية
  {
    id: 'early-bird',
    name: 'Early Bird',
    nameAr: 'الطير المبكر',
    description: 'Start learning before 8 AM',
    descriptionAr: 'ابدأ التعلم قبل الساعة 8 صباحاً',
    icon: '🌅',
    rarity: 'rare',
    category: 'achievement',
    requirement: { type: 'lessons', value: 1 },
    color: '#FF8C00',
    points: 50
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    nameAr: 'بومة الليل',
    description: 'Learn after 8 PM',
    descriptionAr: 'تعلم بعد الساعة 8 مساءً',
    icon: '🌙',
    rarity: 'rare',
    category: 'achievement',
    requirement: { type: 'lessons', value: 1 },
    color: '#1E90FF',
    points: 50
  },
  {
    id: 'vocabulary-master',
    name: 'Vocabulary Master',
    nameAr: 'ماهر المفردات',
    description: 'Learn 100 new words',
    descriptionAr: 'تعلم 100 كلمة جديدة',
    icon: '📖',
    rarity: 'epic',
    category: 'skill',
    requirement: { type: 'exercises', value: 100 },
    color: '#20B2AA',
    points: 200
  },
  {
    id: 'grammar-guru',
    name: 'Grammar Guru',
    nameAr: 'معلم القواعد',
    description: 'Master grammar lessons',
    descriptionAr: 'أتقن دروس القواعد',
    icon: '🧠',
    rarity: 'epic',
    category: 'skill',
    requirement: { type: 'lessons', value: 5 },
    color: '#DA70D6',
    points: 200
  },
  {
    id: 'linguist',
    name: 'Young Linguist',
    nameAr: 'لغوي صغير',
    description: 'Complete 20 lessons and 100 exercises',
    descriptionAr: 'أكمل 20 درس و 100 تمرين',
    icon: '🌍',
    rarity: 'legendary',
    category: 'skill',
    requirement: { type: 'lessons', value: 20 },
    color: '#FFD700',
    points: 500
  }
];

// دالة للحصول على شارة حسب المعرف
export function getBadgeById(id: string): Badge | undefined {
  return badges.find(badge => badge.id === id);
}

// دالة للحصول على شارات حسب الندرة
export function getBadgesByRarity(rarity: 'common' | 'rare' | 'epic' | 'legendary'): Badge[] {
  return badges.filter(badge => badge.rarity === rarity);
}

// دالة للحصول على شارات حسب الفئة
export function getBadgesByCategory(category: 'achievement' | 'milestone' | 'challenge' | 'skill'): Badge[] {
  return badges.filter(badge => badge.category === category);
}

// دالة لحساب إجمالي النقاط الممكنة
export function getTotalPossiblePoints(): number {
  return badges.reduce((sum, badge) => sum + badge.points, 0);
}

// دالة للحصول على شارات غير مفتوحة
export function getLockedBadges(): Badge[] {
  return badges.filter(badge => !badge.unlocked);
}

// دالة للحصول على شارات مفتوحة
export function getUnlockedBadges(): Badge[] {
  return badges.filter(badge => badge.unlocked);
}

// دالة to check if badge should be unlocked
export interface UserProgress {
  completedLessons: number;
  completedExercises: number;
  totalXP: number;
  currentStreak: number;
  highestScore: number;
}

export function checkBadgeUnlock(badge: Badge, progress: UserProgress): boolean {
  switch (badge.requirement.type) {
    case 'lessons':
      return progress.completedLessons >= badge.requirement.value;
    case 'exercises':
      return progress.completedExercises >= badge.requirement.value;
    case 'xp':
      return progress.totalXP >= badge.requirement.value;
    case 'streak':
      return progress.currentStreak >= badge.requirement.value;
    case 'score':
      return progress.highestScore >= badge.requirement.value;
    default:
      return false;
  }
}
