import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationService } from '../services';
import { FirestoreService, AuthService } from '../services';
import MobilePreviewBanner from '../components/MobilePreviewBanner';

const { width } = Dimensions.get('window');

interface UserProgress {
  userId: string;
  currentLevel: string;
  totalXP: number;
  streak: number;
  lessonsCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastStudyDate: Date;
  achievements: string[];
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  level: string;
  duration: number;
  xp: number;
  track: string;
  difficulty: string;
}

const DashboardScreen: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recommendedLessons, setRecommendedLessons] = useState<Lesson[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
    animateContent();
  }, []);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const loadData = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      // Load user progress
      const progress = await FirestoreService.getUserProgress(currentUser.uid);
      if (!progress) {
        await FirestoreService.createUserProgress(currentUser.uid);
        const newProgress = await FirestoreService.getUserProgress(currentUser.uid);
        setUserProgress(newProgress);
      } else {
        setUserProgress(progress);
      }

      // Load recommended lessons
      const lessons = await FirestoreService.getLessons('general', progress?.currentLevel || 'A1');
      setRecommendedLessons(lessons.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAIChat = () => {
    NavigationService.navigate('AIChat');
  };

  const handleStartLesson = (lessonId: string) => {
    NavigationService.navigate('LessonDetail', { lessonId });
  };

  const handleLessons = () => {
    NavigationService.navigate('Lessons');
  };

  const renderProfileCard = () => {
    if (!userProgress) return null;

    return (
      <Animated.View
        style={[
          styles.profileCard,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(AuthService.getCurrentUser()?.displayName || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {AuthService.getCurrentUser()?.displayName || 'User'}
            </Text>
            <Text style={styles.profileLevel}>
              Level {userProgress.currentLevel} • {getLevelName(userProgress.currentLevel)}
            </Text>
            <Text style={styles.profileGoal}>
              Goal: General • Track: General English
            </Text>
          </View>
        </View>

        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🔥 {userProgress.streak}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProgress.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderProgressOverview = () => {
    if (!userProgress) return null;

    const dailyGoalXP = 50;
    const levelXP = getLevelXP(userProgress.currentLevel);
    const progressToNextLevel = userProgress.totalXP - levelXP;
    const nextLevelXP = getNextLevelXP(userProgress.currentLevel) - levelXP;
    const dailyProgress = Math.min((userProgress.totalXP % dailyGoalXP) / dailyGoalXP * 100, 100);
    const levelProgress = (progressToNextLevel / nextLevelXP) * 100;

    return (
      <Animated.View
        style={[
          styles.progressCard,
          { opacity: fadeAnim },
        ]}
      >
        <Text style={styles.cardTitle}>Today's Progress</Text>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Daily Goal</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${dailyProgress}%` }]} />
          </View>
          <Text style={styles.progressValue}>{Math.round(dailyProgress)}%</Text>
        </View>

        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Level Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${levelProgress}%`, backgroundColor: '#2196F3' }]} />
          </View>
          <Text style={styles.progressValue}>
            {userProgress.totalXP}/{getNextLevelXP(userProgress.currentLevel)} XP
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderQuickActions = () => (
    <Animated.View
      style={[
        styles.quickActionsContainer,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={styles.cardTitle}>Quick Actions</Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.aiChatButton]}
          onPress={handleAIChat}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Chat with AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.startLessonButton]}
          onPress={handleLessons}
        >
          <Text style={styles.actionIcon}>📚</Text>
          <Text style={styles.actionText}>Start Lesson</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderRecommendedLessons = () => (
    <Animated.View
      style={[
        styles.lessonsContainer,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={styles.cardTitle}>Recommended Lessons</Text>
      
      {recommendedLessons.map((lesson, index) => (
        <TouchableOpacity
          key={lesson.id}
          style={styles.lessonCard}
          onPress={() => handleStartLesson(lesson.id)}
        >
          <View style={[styles.lessonIndicator, { backgroundColor: getLessonColor(lesson.type) }]} />
          <View style={styles.lessonContent}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <Text style={styles.lessonSubtitle}>
              {lesson.type} • {lesson.duration} min • {lesson.xp} XP
            </Text>
            <View style={styles.lessonTag}>
              <Text style={styles.lessonTagText}>{lesson.difficulty}</Text>
            </View>
          </View>
          <Icon name="arrow-forward" size={20} color={getLessonColor(lesson.type)} />
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  const getLevelName = (level: string): string => {
    const levels: { [key: string]: string } = {
      'A1': 'Beginner',
      'A2': 'Elementary',
      'B1': 'Intermediate',
      'B2': 'Upper Intermediate',
      'C1': 'Advanced',
      'C2': 'Proficient',
    };
    return levels[level] || 'Beginner';
  };

  const getLevelXP = (level: string): number => {
    const levels: { [key: string]: number } = {
      'A1': 0,
      'A2': 1000,
      'B1': 2000,
      'B2': 3000,
      'C1': 4000,
      'C2': 5000,
    };
    return levels[level] || 0;
  };

  const getNextLevelXP = (level: string): number => {
    const levels: { [key: string]: number } = {
      'A1': 1000,
      'A2': 2000,
      'B1': 3000,
      'B2': 4000,
      'C1': 5000,
      'C2': 5000,
    };
    return levels[level] || 1000;
  };

  const getLessonColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      'vocabulary': '#4CAF50',
      'grammar': '#2196F3',
      'conversation': '#FF9800',
      'listening': '#9C27B0',
      'reading': '#F44336',
    };
    return colors[type] || '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <MobilePreviewBanner />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="menu" size={24} color="#424242" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color="#424242" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderProfileCard()}
        {renderProgressOverview()}
        {renderQuickActions()}
        {renderRecommendedLessons()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B5E20',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 2,
  },
  profileGoal: {
    fontSize: 12,
    color: '#757575',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#757575',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 20,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressLabel: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 10,
    color: '#757575',
    textAlign: 'right',
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 160,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiChatButton: {
    backgroundColor: '#4CAF50',
  },
  startLessonButton: {
    backgroundColor: '#2196F3',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  lessonsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F8FAF5',
    borderRadius: 12,
  },
  lessonIndicator: {
    width: 4,
    height: 70,
    borderRadius: 2,
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  lessonTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  lessonTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
});

export default DashboardScreen;
