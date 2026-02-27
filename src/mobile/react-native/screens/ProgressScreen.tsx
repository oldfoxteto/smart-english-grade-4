import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { FirestoreService, AuthService } from '../services';

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

const ProgressScreen: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
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

      const progress = await FirestoreService.getUserProgress(currentUser.uid);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
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

  const renderOverviewCard = () => {
    if (!userProgress) return null;

    const currentLevelXP = getLevelXP(userProgress.currentLevel);
    const nextLevelXP = getNextLevelXP(userProgress.currentLevel);
    const progressToNextLevel = userProgress.totalXP - currentLevelXP;
    const totalToNextLevel = nextLevelXP - currentLevelXP;
    const levelProgress = (progressToNextLevel / totalToNextLevel) * 100;

    return (
      <Animated.View style={[styles.overviewCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>📊 Learning Overview</Text>
        
        <View style={styles.levelProgress}>
          <Text style={styles.levelText}>
            Level {userProgress.currentLevel} - {getLevelName(userProgress.currentLevel)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${levelProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {userProgress.totalXP}/{nextLevelXP} XP
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProgress.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProgress.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(userProgress.averageScore)}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderWeeklyProgress = () => {
    const weeklyData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [30, 45, 28, 80, 99, 43, 65],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      }],
    };

    const chartConfig = {
      backgroundColor: '#FFFFFF',
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: '#4CAF50',
      },
    };

    return (
      <Animated.View style={[styles.chartCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>📈 Weekly Progress</Text>
        
        <LineChart
          data={weeklyData}
          width={width - 60}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        
        <Text style={styles.chartSubtitle}>Minutes studied per day</Text>
      </Animated.View>
    );
  };

  const renderSkillBreakdown = () => {
    const skillsData = {
      labels: ['Vocab', 'Grammar', 'Speaking', 'Listening'],
      datasets: [{
        data: [85, 70, 60, 75],
      }],
    };

    const chartConfig = {
      backgroundColor: '#FFFFFF',
      backgroundGradientFrom: '#FFFFFF',
      backgroundGradientTo: '#FFFFFF',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`,
      style: {
        borderRadius: 16,
      },
    };

    return (
      <Animated.View style={[styles.chartCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>🎯 Skill Breakdown</Text>
        
        <BarChart
          data={skillsData}
          width={width - 60}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
        />
        
        <Text style={styles.chartSubtitle}>Performance by skill area</Text>
      </Animated.View>
    );
  };

  const renderRecentActivity = () => {
    const activities = [
      { date: 'Today', lesson: 'At the Airport', score: 85, xp: 50 },
      { date: 'Yesterday', lesson: 'Hotel Check-in', score: 92, xp: 75 },
      { date: '2 days ago', lesson: 'Ordering Food', score: 78, xp: 60 },
      { date: '3 days ago', lesson: 'Business Meeting', score: 88, xp: 100 },
    ];

    return (
      <Animated.View style={[styles.activityCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>📚 Recent Activity</Text>
        
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityDate}>
              <Text style={styles.activityDateText}>{activity.date}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityLesson}>{activity.lesson}</Text>
              <View style={styles.activityStats}>
                <Text style={styles.activityScore}>Score: {activity.score}%</Text>
                <Text style={styles.activityXP}>+{activity.xp} XP</Text>
              </View>
            </View>
          </View>
        ))}
      </Animated.View>
    );
  };

  const renderGoalsProgress = () => {
    const goals = [
      { name: 'Weekly Goal', current: 245, target: 300, unit: 'min' },
      { name: 'Monthly XP', current: 450, target: 1000, unit: 'XP' },
      { name: 'Lessons', current: 12, target: 20, unit: 'lessons' },
    ];

    return (
      <Animated.View style={[styles.goalsCard, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>🎯 Goals Progress</Text>
        
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalProgress}>
                  {goal.current}/{goal.target} {goal.unit}
                </Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View
                  style={[styles.goalProgressFill, { width: `${Math.min(progress, 100)}%` }]}
                />
              </View>
              <Text style={styles.goalPercentage}>{Math.round(progress)}%</Text>
            </View>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderOverviewCard()}
        {renderWeeklyProgress()}
        {renderSkillBreakdown()}
        {renderRecentActivity()}
        {renderGoalsProgress()}
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
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 20,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  overviewCard: {
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
  levelProgress: {
    marginBottom: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F8FAF5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  chartCard: {
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  activityCard: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityDate: {
    width: 80,
  },
  activityDateText: {
    fontSize: 12,
    color: '#757575',
  },
  activityContent: {
    flex: 1,
    marginLeft: 16,
  },
  activityLesson: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityScore: {
    fontSize: 12,
    color: '#4CAF50',
  },
  activityXP: {
    fontSize: 12,
    color: '#FF9800',
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
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  goalProgress: {
    fontSize: 12,
    color: '#757575',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  goalPercentage: {
    fontSize: 12,
    color: '#2196F3',
    textAlign: 'right',
  },
});

export default ProgressScreen;
