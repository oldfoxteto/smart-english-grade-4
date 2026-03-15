import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
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

interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  reward: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedDate?: Date;
}

const ProfileScreen: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
    animateContent();
  }, []);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const loadData = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      // Load user progress
      const progress = await FirestoreService.getUserProgress(currentUser.uid);
      setUserProgress(progress);

      // Load achievements
      const allAchievements = await FirestoreService.getAchievements();
      const userAchievements = await FirestoreService.getUserAchievements(currentUser.uid);
      
      // Mark achievements as unlocked or locked
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        isUnlocked: userAchievements.some(ua => ua.id === achievement.id),
      }));
      
      setAchievements(achievementsWithStatus.slice(0, 6)); // Show first 6
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSettings = () => {
    NavigationService.navigate('Settings');
  };

  const handleEdit = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

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

  const renderProfileHeader = () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser || !userProgress) return null;

    return (
      <Animated.View style={[styles.profileCard, { opacity: fadeAnim }]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(currentUser.displayName || 'U')[0].toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {currentUser.displayName || 'User'}
            </Text>
            <Text style={styles.profileLevel}>
              Level {userProgress.currentLevel} • {getLevelName(userProgress.currentLevel)}
            </Text>
            <Text style={styles.profileEmail}>{currentUser.email}</Text>
            <Text style={styles.profileDate}>
              Member since January 2024
            </Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="edit" size={20} color="#424242" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            {userProgress.currentLevel} {getLevelName(userProgress.currentLevel)}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderStatistics = () => {
    if (!userProgress) return null;

    return (
      <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>📊 Your Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🌟</Text>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>XP Points</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{userProgress.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>{userProgress.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderLearningGoals = () => (
    <Animated.View style={[styles.goalsCard, { opacity: fadeAnim }]}>
      <Text style={styles.cardTitle}>🎯 Learning Goals</Text>
      
      <View style={styles.goalItem}>
        <Text style={styles.goalLabel}>Primary Goal:</Text>
        <View style={styles.goalTag}>
          <Text style={styles.goalTagText}>Travel</Text>
        </View>
      </View>
      
      <View style={styles.goalItem}>
        <Text style={styles.goalLabel}>Track:</Text>
        <View style={[styles.goalTag, styles.trackTag]}>
          <Text style={styles.goalTagText}>Travel English</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderAchievements = () => (
    <Animated.View style={[styles.achievementsCard, { opacity: fadeAnim }]}>
      <Text style={styles.cardTitle}>🏆 Recent Achievements</Text>
      
      {achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={[
            styles.achievementIcon,
            achievement.isUnlocked ? styles.achievementIconUnlocked : styles.achievementIconLocked,
          ]}>
            <Text style={styles.achievementIconText}>
              {achievement.isUnlocked ? achievement.icon : '🔒'}
            </Text>
          </View>
          
          <View style={styles.achievementContent}>
            <Text style={[
              styles.achievementName,
              !achievement.isUnlocked && styles.achievementNameLocked,
            ]}>
              {achievement.name}
            </Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>
          
          <Text style={styles.achievementXP}>+{achievement.xp} XP</Text>
        </View>
      ))}
    </Animated.View>
  );

  const renderSettings = () => (
    <Animated.View style={[styles.settingsCard, { opacity: fadeAnim }]}>
      <Text style={styles.cardTitle}>⚙️ Settings</Text>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>🔔 Notifications</Text>
        <Text style={styles.settingValue}>On</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>🌍 Language</Text>
        <Text style={styles.settingValue}>English</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>🎨 Theme</Text>
        <Text style={styles.settingValue}>Light</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
        <Text style={styles.settingText}>📊 Privacy</Text>
        <Icon name="arrow-forward" size={16} color="#757575" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <MobilePreviewBanner />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Icon name="settings" size={24} color="#424242" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Profile</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Icon name="edit" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderProfileHeader()}
        {renderStatistics()}
        {renderLearningGoals()}
        {renderAchievements()}
        {renderSettings()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 20,
    backgroundColor: '#4CAF50',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
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
  profileEmail: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  profileDate: {
    fontSize: 12,
    color: '#757575',
  },
  levelBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: 100,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
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
  goalsCard: {
    backgroundColor: '#FFFFFF',
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
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalLabel: {
    fontSize: 12,
    color: '#424242',
    marginRight: 12,
  },
  goalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
  },
  trackTag: {
    backgroundColor: '#E3F2FD',
  },
  goalTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  achievementIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIconUnlocked: {
    backgroundColor: '#E8F5E8',
  },
  achievementIconLocked: {
    backgroundColor: '#E0E0E0',
  },
  achievementIconText: {
    fontSize: 14,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  achievementNameLocked: {
    color: '#757575',
  },
  achievementDescription: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  achievementXP: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    fontSize: 12,
    color: '#424242',
  },
  settingValue: {
    fontSize: 10,
    color: '#757575',
  },
});

export default ProfileScreen;
