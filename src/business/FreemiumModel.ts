// Freemium Business Model Implementation
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  limitations: {
    dailyLessons: number;
    aiAssistance: number;
    offlineContent: number;
    supportLevel: 'basic' | 'priority' | 'premium';
    adsFree: boolean;
    advancedAnalytics: boolean;
    personalizedLearning: boolean;
    certificates: boolean;
  };
  targetAudience: 'beginner' | 'intermediate' | 'advanced' | 'all';
  popularity: number; // 1-10
  conversionRate: number; // percentage
}

export interface FreemiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'practice' | 'analytics' | 'social' | 'support' | 'content';
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  value: number; // 1-10 perceived value
  usageLimit?: number;
  upgradePrompt: string;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'trial' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  trialUsed: boolean;
  cancellationReason?: string;
  upgradeHistory: {
    fromPlan: string;
    toPlan: string;
    date: Date;
    reason: string;
  }[];
}

export interface MonetizationMetrics {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  trialUsers: number;
  conversionRate: number;
  churnRate: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  customerLifetimeValue: number;
  planDistribution: {
    [planId: string]: number;
  };
  featureUsage: {
    [featureId: string]: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
    newUsers: number;
    conversions: number;
  }[];
}

export interface InAppPurchase {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'consumable' | 'non-consumable' | 'subscription' | 'free_trial';
  category: 'content' | 'features' | 'time' | 'boosts' | 'cosmetics';
  value: number; // perceived value 1-10
  purchaseRate: number;
  revenue: number;
}

class FreemiumModel {
  private subscriptionPlans: Map<string, SubscriptionPlan> = new Map();
  private freemiumFeatures: Map<string, FreemiumFeature> = new Map();
  private userSubscriptions: Map<string, UserSubscription> = new Map();
  private inAppPurchases: Map<string, InAppPurchase> = new Map();
  private metrics: MonetizationMetrics;

  constructor() {
    this.initializeSubscriptionPlans();
    this.initializeFreemiumFeatures();
    this.initializeInAppPurchases();
    this.initializeMetrics();
  }

  // Initialize subscription plans
  private initializeSubscriptionPlans(): void {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'مجاني',
        description: 'تعلم إنجليزي أساسي مجاني',
        price: { monthly: 0, yearly: 0, currency: 'USD' },
        features: [
          '5 دروس يومياً',
          'تمارين أساسية',
          'تتبع التقدم الأساسي',
          'إعلانات مدعومة'
        ],
        limitations: {
          dailyLessons: 5,
          aiAssistance: 3,
          offlineContent: 10,
          supportLevel: 'basic',
          adsFree: false,
          advancedAnalytics: false,
          personalizedLearning: false,
          certificates: false
        },
        targetAudience: 'beginner',
        popularity: 10,
        conversionRate: 15
      },
      {
        id: 'basic',
        name: 'أساسي',
        description: 'ميزات تعلم محسنة',
        price: { monthly: 4.99, yearly: 49.99, currency: 'USD' },
        features: [
          'دروس غير محدودة',
          'مساعدة ذكية غير محدودة',
          'محتوى للتعلم بدون إنترنت',
          'تحليلات متقدمة',
          'بدون إعلانات'
        ],
        limitations: {
          dailyLessons: -1,
          aiAssistance: -1,
          offlineContent: 100,
          supportLevel: 'priority',
          adsFree: true,
          advancedAnalytics: true,
          personalizedLearning: true,
          certificates: false
        },
        targetAudience: 'intermediate',
        popularity: 8,
        conversionRate: 25
      },
      {
        id: 'premium',
        name: 'مميز',
        description: 'تجربة تعلم كاملة',
        price: { monthly: 9.99, yearly: 99.99, currency: 'USD' },
        features: [
          'كل ميزات الباقة الأساسية',
          'محتوى غير محدود للتعلم بدون إنترنت',
          'شهادات إتمام',
          'دعم فوري 24/7',
          'محتوى حصري',
          'تدريب شخصي'
        ],
        limitations: {
          dailyLessons: -1,
          aiAssistance: -1,
          offlineContent: -1,
          supportLevel: 'premium',
          adsFree: true,
          advancedAnalytics: true,
          personalizedLearning: true,
          certificates: true
        },
        targetAudience: 'advanced',
        popularity: 6,
        conversionRate: 35
      },
      {
        id: 'family',
        name: 'عائلي',
        description: 'للمدرسة والأسرة',
        price: { monthly: 19.99, yearly: 199.99, currency: 'USD' },
        features: [
          'كل ميزات الباقة المميزة',
          'حتى 6 مستخدمين',
          'لوحة تحكم للوالدين',
          'تقارير تفصيلية',
          'محتوى تعليمي إضافي'
        ],
        limitations: {
          dailyLessons: -1,
          aiAssistance: -1,
          offlineContent: -1,
          supportLevel: 'premium',
          adsFree: true,
          advancedAnalytics: true,
          personalizedLearning: true,
          certificates: true
        },
        targetAudience: 'all',
        popularity: 4,
        conversionRate: 20
      }
    ];

    plans.forEach(plan => {
      this.subscriptionPlans.set(plan.id, plan);
    });
  }

  // Initialize freemium features
  private initializeFreemiumFeatures(): void {
    const features: FreemiumFeature[] = [
      {
        id: 'daily-lessons',
        name: 'دروس يومية',
        description: 'الوصول إلى دروس اللغة الإنجليزية',
        category: 'learning',
        tier: 'free',
        value: 8,
        usageLimit: 5,
        upgradePrompt: 'ترقية للحصول على دروس غير محدودة'
      },
      {
        id: 'ai-assistance',
        name: 'مساعدة ذكية',
        description: 'مساعدة AI للإجابة على الأسئلة',
        category: 'learning',
        tier: 'basic',
        value: 9,
        usageLimit: 10,
        upgradePrompt: 'ترقية للحصول على مساعدة غير محدودة'
      },
      {
        id: 'offline-content',
        name: 'محتوى بدون إنترنت',
        description: 'تحميل الدروس للتعلم بدون إنترنت',
        category: 'content',
        tier: 'basic',
        value: 7,
        usageLimit: 50,
        upgradePrompt: 'ترقية لمحتوى غير محدود'
      },
      {
        id: 'advanced-analytics',
        name: 'تحليلات متقدمة',
        description: 'تقارير مفصلة عن التقدم والإنجازات',
        category: 'analytics',
        tier: 'premium',
        value: 6,
        upgradePrompt: 'ترقية للحصول على تحليلات متقدمة'
      },
      {
        id: 'certificates',
        name: 'شهادات الإتمام',
        description: 'شهادات معتمدة عند إكمال المستويات',
        category: 'learning',
        tier: 'premium',
        value: 8,
        upgradePrompt: 'ترقية للحصول على شهادات معتمدة'
      },
      {
        id: 'priority-support',
        name: 'دعم أولوي',
        description: 'دعم فني ومساعدة تعليمية أولوية',
        category: 'support',
        tier: 'premium',
        value: 7,
        upgradePrompt: 'ترقية للحصول على دعم أولوي'
      },
      {
        id: 'ads-free',
        name: 'بدون إعلانات',
        description: 'تجربة تعلم بدون مقاطعات',
        category: 'learning',
        tier: 'basic',
        value: 9,
        upgradePrompt: 'ترقية لإزالة الإعلانات'
      },
      {
        id: 'personalized-learning',
        name: 'تعلم مخصص',
        description: 'مسارات تعلم مخصصة حسب المستوى',
        category: 'learning',
        tier: 'basic',
        value: 10,
        upgradePrompt: 'ترقية للحصول على تعلم مخصص'
      }
    ];

    features.forEach(feature => {
      this.freemiumFeatures.set(feature.id, feature);
    });
  }

  // Initialize in-app purchases
  private initializeInAppPurchases(): void {
    const purchases: InAppPurchase[] = [
      {
        id: 'extra-lessons',
        name: 'دروس إضافية',
        description: '10 دروس إضافية لليوم',
        price: 0.99,
        currency: 'USD',
        type: 'consumable',
        category: 'content',
        value: 7,
        purchaseRate: 15,
        revenue: 1500
      },
      {
        id: 'ai-boost',
        name: 'تعزيز ذكي',
        description: '50 استشارة إضافية من AI',
        price: 1.99,
        currency: 'USD',
        type: 'consumable',
        category: 'features',
        value: 8,
        purchaseRate: 12,
        revenue: 2400
      },
      {
        id: 'offline-pack',
        name: 'حزمة بدون إنترنت',
        description: '100 درس للتعلم بدون إنترنت',
        price: 4.99,
        currency: 'USD',
        type: 'non-consumable',
        category: 'content',
        value: 6,
        purchaseRate: 8,
        revenue: 4000
      },
      {
        id: 'premium-month',
        name: 'شهر مميز',
        description: 'وصول لجميع الميزات المميزة لمدة شهر',
        price: 9.99,
        currency: 'USD',
        type: 'subscription',
        category: 'features',
        value: 10,
        purchaseRate: 25,
        revenue: 25000
      },
      {
        id: 'cosmetic-pack',
        name: 'حزمة مظهر',
        description: 'ثيمات وأفاتار خاصة',
        price: 2.99,
        currency: 'USD',
        type: 'non-consumable',
        category: 'cosmetics',
        value: 4,
        purchaseRate: 5,
        revenue: 1500
      }
    ];

    purchases.forEach(purchase => {
      this.inAppPurchases.set(purchase.id, purchase);
    });
  }

  // Initialize metrics
  private initializeMetrics(): void {
    this.metrics = {
      totalUsers: 10000,
      freeUsers: 7000,
      paidUsers: 2500,
      trialUsers: 500,
      conversionRate: 25,
      churnRate: 5,
      monthlyRecurringRevenue: 25000,
      averageRevenuePerUser: 2.5,
      customerLifetimeValue: 120,
      planDistribution: {
        'free': 7000,
        'basic': 1500,
        'premium': 800,
        'family': 200
      },
      featureUsage: {
        'daily-lessons': 8500,
        'ai-assistance': 6000,
        'offline-content': 3000,
        'advanced-analytics': 2000,
        'certificates': 1500
      },
      revenueByMonth: [
        { month: '2024-01', revenue: 22000, newUsers: 800, conversions: 180 },
        { month: '2024-02', revenue: 24000, newUsers: 900, conversions: 200 },
        { month: '2024-03', revenue: 25000, newUsers: 1000, conversions: 220 }
      ]
    };
  }

  // Get subscription plan
  getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
    return this.subscriptionPlans.get(planId);
  }

  // Get all subscription plans
  getAllSubscriptionPlans(): SubscriptionPlan[] {
    return Array.from(this.subscriptionPlans.values());
  }

  // Get freemium feature
  getFreemiumFeature(featureId: string): FreemiumFeature | undefined {
    return this.freemiumFeatures.get(featureId);
  }

  // Get all freemium features
  getAllFreemiumFeatures(): FreemiumFeature[] {
    return Array.from(this.freemiumFeatures.values());
  }

  // Get user subscription
  getUserSubscription(userId: string): UserSubscription | undefined {
    return this.userSubscriptions.get(userId);
  }

  // Create user subscription
  createUserSubscription(
    userId: string,
    planId: string,
    paymentMethod: string
  ): UserSubscription {
    const plan = this.getSubscriptionPlan(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const subscription: UserSubscription = {
      userId,
      planId,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      paymentMethod,
      trialUsed: false,
      upgradeHistory: []
    };

    this.userSubscriptions.set(userId, subscription);
    this.updateMetrics();
    return subscription;
  }

  // Upgrade subscription
  upgradeSubscription(
    userId: string,
    newPlanId: string,
    reason: string
  ): UserSubscription {
    const currentSubscription = this.getUserSubscription(userId);
    if (!currentSubscription) {
      throw new Error(`No subscription found for user ${userId}`);
    }

    const newPlan = this.getSubscriptionPlan(newPlanId);
    if (!newPlan) {
      throw new Error(`Plan ${newPlanId} not found`);
    }

    const upgradeRecord = {
      fromPlan: currentSubscription.planId,
      toPlan: newPlanId,
      date: new Date(),
      reason
    };

    currentSubscription.upgradeHistory.push(upgradeRecord);
    currentSubscription.planId = newPlanId;
    currentSubscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    this.userSubscriptions.set(userId, currentSubscription);
    this.updateMetrics();
    return currentSubscription;
  }

  // Check feature access
  checkFeatureAccess(userId: string, featureId: string): {
    hasAccess: boolean;
    remainingUsage?: number;
    upgradePrompt?: string;
  } {
    const subscription = this.getUserSubscription(userId);
    const feature = this.getFreemiumFeature(featureId);
    
    if (!feature) {
      return { hasAccess: false };
    }

    // Free users have limitations
    if (!subscription || subscription.planId === 'free') {
      if (feature.tier === 'free') {
        return { 
          hasAccess: true, 
          remainingUsage: feature.usageLimit 
        };
      } else {
        return { 
          hasAccess: false, 
          upgradePrompt: feature.upgradePrompt 
        };
      }
    }

    // Basic and premium users have full access
    const plan = this.getSubscriptionPlan(subscription.planId);
    if (plan && this.hasFeatureAccess(plan.id, feature.tier)) {
      return { hasAccess: true };
    }

    return { 
      hasAccess: false, 
      upgradePrompt: feature.upgradePrompt 
    };
  }

  // Check if plan has access to feature tier
  private hasFeatureAccess(planId: string, featureTier: string): boolean {
    const accessMap = {
      'free': ['free'],
      'basic': ['free', 'basic'],
      'premium': ['free', 'basic', 'premium'],
      'family': ['free', 'basic', 'premium']
    };

    return accessMap[planId]?.includes(featureTier) || false;
  }

  // Get in-app purchase
  getInAppPurchase(purchaseId: string): InAppPurchase | undefined {
    return this.inAppPurchases.get(purchaseId);
  }

  // Get all in-app purchases
  getAllInAppPurchases(): InAppPurchase[] {
    return Array.from(this.inAppPurchases.values());
  }

  // Process purchase
  processPurchase(
    userId: string,
    purchaseId: string,
    paymentMethod: string
  ): boolean {
    const purchase = this.getInAppPurchase(purchaseId);
    if (!purchase) {
      return false;
    }

    // Process payment logic here
    // Update user features/content
    // Record transaction
    
    this.updateMetrics();
    return true;
  }

  // Get metrics
  getMetrics(): MonetizationMetrics {
    return this.metrics;
  }

  // Update metrics
  private updateMetrics(): void {
    const subscriptions = Array.from(this.userSubscriptions.values());
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    
    this.metrics.paidUsers = activeSubscriptions.length;
    this.metrics.freeUsers = this.metrics.totalUsers - this.metrics.paidUsers;
    this.metrics.conversionRate = (this.metrics.paidUsers / this.metrics.totalUsers) * 100;
    
    // Calculate MRR
    let mrr = 0;
    activeSubscriptions.forEach(sub => {
      const plan = this.getSubscriptionPlan(sub.planId);
      if (plan) {
        mrr += plan.price.monthly;
      }
    });
    this.metrics.monthlyRecurringRevenue = mrr;
    
    // Calculate ARPU
    this.metrics.averageRevenuePerUser = mrr / this.metrics.totalUsers;
  }

  // Get revenue forecast
  getRevenueForecast(months: number): {
    month: string;
    projectedRevenue: number;
    projectedUsers: number;
    projectedConversions: number;
  }[] {
    const forecast = [];
    const currentMonth = new Date();
    
    for (let i = 1; i <= months; i++) {
      const projectedDate = new Date(currentMonth);
      projectedDate.setMonth(currentMonth.getMonth() + i);
      
      const growthRate = 0.05; // 5% monthly growth
      const projectedUsers = Math.floor(this.metrics.totalUsers * Math.pow(1 + growthRate, i));
      const projectedConversions = Math.floor(projectedUsers * (this.metrics.conversionRate / 100));
      const projectedRevenue = projectedConversions * 7.5; // Average subscription price
      
      forecast.push({
        month: projectedDate.toISOString().slice(0, 7),
        projectedRevenue,
        projectedUsers,
        projectedConversions
      });
    }
    
    return forecast;
  }

  // Get churn analysis
  getChurnAnalysis(): {
    overallChurn: number;
    churnByPlan: { [planId: string]: number };
    churnReasons: { [reason: string]: number };
    retentionRate: number;
  } {
    const subscriptions = Array.from(this.userSubscriptions.values());
    const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled');
    
    const churnByPlan = {};
    const churnReasons = {};
    
    cancelledSubscriptions.forEach(sub => {
      churnByPlan[sub.planId] = (churnByPlan[sub.planId] || 0) + 1;
      if (sub.cancellationReason) {
        churnReasons[sub.cancellationReason] = (churnReasons[sub.cancellationReason] || 0) + 1;
      }
    });
    
    const overallChurn = (cancelledSubscriptions.length / subscriptions.length) * 100;
    const retentionRate = 100 - overallChurn;
    
    return {
      overallChurn,
      churnByPlan,
      churnReasons,
      retentionRate
    };
  }
}

export default FreemiumModel;
export type { 
  SubscriptionPlan, 
  FreemiumFeature, 
  UserSubscription, 
  MonetizationMetrics, 
  InAppPurchase 
};
