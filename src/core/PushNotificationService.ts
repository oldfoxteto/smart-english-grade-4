import { useNotification } from './NotificationContext';

export class PushNotificationService {
  private static instance: PushNotificationService;
  private isSupported = 'Notification' in window;
  private permission: NotificationPermission = 'default';

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return this.permission;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  async showNotification(
    title: string,
    options: NotificationOptions & { encouraging?: boolean } = {}
  ): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    const { encouraging, ...notificationOptions } = options;

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      ...notificationOptions
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showEncouragingNotification(
    title: string,
    message: string,
    xp?: number
  ): Promise<void> {
    const encouragingMessages = [
      '🎯 رائع! استمر في التقدم!',
      '💪 ممتاز! أنت تتعلم بسرعة!',
      '⭐ أحسنت! حافظ على هذا الزخم!',
      '🚀 مذهل! مستواك يتحسن باستمرار!',
      '🏆 ممتاز! أنت على الطريق الصحيح!'
    ];

    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    const fullMessage = xp ? `${message} ${randomMessage} +${xp} XP` : `${message} ${randomMessage}`;

    await this.showNotification(title, {
      body: fullMessage,
      encouraging: true,
      tag: 'learning-progress'
    });
  }

  async showStudyReminder(): Promise<void> {
    await this.showNotification('⏰ وقت التعلم!', {
      body: 'لقد حان وقت جلسة التعلم اليومية. استمر في التقدم! 📚',
      tag: 'study-reminder',
      requireInteraction: true
    });
  }

  async showAchievementUnlocked(achievement: string): Promise<void> {
    await this.showNotification('🏆 إنجاز جديد!', {
      body: `مبروك! لقد فتحت: ${achievement}`,
      tag: 'achievement',
      requireInteraction: true
    });
  }

  async showStreakMilestone(days: number): Promise<void> {
    await this.showNotification(`🔥 سلسلة ${days} يوم!`, {
      body: `ممتاز! لقد حافظت على التعلم لمدة ${days} أيام متتالية`,
      tag: 'streak-milestone',
      requireInteraction: true
    });
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

// Hook for using push notifications in React components
export const usePushNotifications = () => {
  const { notifySuccess, notifyInfo } = useNotification();
  const pushService = PushNotificationService.getInstance();

  const requestPermission = async () => {
    const permission = await pushService.requestPermission();
    if (permission === 'granted') {
      notifySuccess('تم تفعيل الإشعارات بنجاح! 🎉');
    } else if (permission === 'denied') {
      notifyInfo('يمكنك تفعيل الإشعارات من إعدادات المتصفح');
    }
    return permission;
  };

  const showEncouragingNotification = async (title: string, message: string, xp?: number) => {
    await pushService.showEncouragingNotification(title, message, xp);
    // Also show in-app notification
    notifySuccess(`${message} ${xp ? `+${xp} XP` : ''}`, true);
  };

  const showStudyReminder = async () => {
    await pushService.showStudyReminder();
    notifyInfo('⏰ وقت التعلم! استمر في التقدم 📚');
  };

  const showAchievementUnlocked = async (achievement: string) => {
    await pushService.showAchievementUnlocked(achievement);
    notifySuccess(`🏆 إنجاز جديد: ${achievement}`, true);
  };

  const showStreakMilestone = async (days: number) => {
    await pushService.showStreakMilestone(days);
    notifySuccess(`🔥 سلسلة ${days} يوم! استمر في التميز`, true);
  };

  return {
    requestPermission,
    showEncouragingNotification,
    showStudyReminder,
    showAchievementUnlocked,
    showStreakMilestone,
    getPermissionStatus: () => pushService.getPermissionStatus(),
    isSupported: () => pushService.isNotificationSupported()
  };
};
