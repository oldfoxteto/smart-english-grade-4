import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationService } from '../services';
import { FirestoreService, AuthService } from '../services';

const { width } = Dimensions.get('window');

interface Lesson {
  id: string;
  title: string;
  type: string;
  level: string;
  duration: number;
  xp: number;
  track: string;
  difficulty: string;
  isLocked: boolean;
}

const LessonsScreen: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const filters = ['All', 'Vocabulary', 'Grammar', 'Conversation'];

  useEffect(() => {
    loadLessons();
    animateContent();
  }, []);

  useEffect(() => {
    filterLessons();
  }, [lessons, selectedFilter]);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const loadLessons = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;

      const userProgress = await FirestoreService.getUserProgress(currentUser.uid);
      const allLessons = await FirestoreService.getLessons('general', userProgress?.currentLevel || 'A1');
      
      // Mark lessons as locked based on user progress
      const lessonsWithLock = allLessons.map((lesson, index) => ({
        ...lesson,
        isLocked: index > 2, // Lock lessons beyond the first 3 for demo
      }));

      setLessons(lessonsWithLock);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const filterLessons = () => {
    if (selectedFilter === 'All') {
      setFilteredLessons(lessons);
    } else {
      const filtered = lessons.filter(lesson => 
        lesson.type.toLowerCase() === selectedFilter.toLowerCase()
      );
      setFilteredLessons(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLessons();
    setRefreshing(false);
  };

  const handleLessonPress = (lessonId: string) => {
    NavigationService.navigate('LessonDetail', { lessonId });
  };

  const renderFilterTab = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterTab,
        selectedFilter === filter && styles.filterTabSelected,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterTabText,
          selectedFilter === filter && styles.filterTabTextSelected,
        ]}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderLessonCard = (lesson: Lesson, index: number) => (
    <Animated.View
      key={lesson.id}
      style={[
        styles.lessonCard,
        { opacity: fadeAnim },
        { transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }) }] },
      ]}
    >
      <View style={[styles.lessonIndicator, { backgroundColor: getLessonColor(lesson.type) }]} />
      
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSubtitle}>
          {lesson.type} • {lesson.duration} min • {lesson.xp} XP
        </Text>
        
        <View style={styles.lessonTags}>
          <View style={styles.lessonTag}>
            <Text style={styles.lessonTagText}>{lesson.level}</Text>
          </View>
          <View style={[styles.lessonTag, styles.durationTag]}>
            <Text style={styles.lessonTagText}>{lesson.duration} min</Text>
          </View>
          <View style={[styles.lessonTag, styles.xpTag]}>
            <Text style={styles.lessonTagText}>{lesson.xp} XP</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.random() * 100}%`, backgroundColor: getLessonColor(lesson.type) },
              ]}
            />
          </View>
          <Text style={styles.progressValue}>0%</Text>
        </View>
      </View>
      
      {lesson.isLocked ? (
        <View style={styles.lockedContainer}>
          <View style={styles.lockedIcon}>
            <Icon name="lock" size={16} color="#757575" />
          </View>
          <Text style={styles.lockedText}>Locked</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: getLessonColor(lesson.type) }]}
          onPress={() => handleLessonPress(lesson.id)}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

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

  const getDifficultyColor = (difficulty: string): string => {
    const colors: { [key: string]: string } = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336',
    };
    return colors[difficulty] || '#4CAF50';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#424242" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Lessons</Text>
        
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="search" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map(renderFilterTab)}
      </ScrollView>

      {/* Lessons List */}
      <ScrollView
        contentContainerStyle={styles.lessonsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredLessons.map((lesson, index) => renderLessonCard(lesson, index))}
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
  backButton: {
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterContent: {
    paddingRight: 20,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  filterTabSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
  },
  filterTabTextSelected: {
    color: '#FFFFFF',
  },
  lessonsContent: {
    padding: 20,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lessonIndicator: {
    width: 4,
    height: 100,
    borderRadius: 2,
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  lessonTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  lessonTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
    marginRight: 8,
    marginBottom: 4,
  },
  durationTag: {
    backgroundColor: '#E3F2FD',
  },
  xpTag: {
    backgroundColor: '#FFF3E0',
  },
  lessonTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#424242',
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 10,
    color: '#757575',
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lockedContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  lockedIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 10,
    color: '#757575',
  },
});

export default LessonsScreen;
