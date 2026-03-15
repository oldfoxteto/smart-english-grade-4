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
const MOBILE_PREVIEW_MESSAGE = 'Mobile lesson audio is not production-ready yet. This mobile screen remains a phase 2 preview.';

interface Lesson {
  id: string;
  title: string;
  type: string;
  level: string;
  duration: number;
  xp: number;
  track: string;
  difficulty: string;
  content: string;
}

interface LessonDetailScreenProps {
  route: {
    params: {
      lessonId: string;
    };
  };
}

const LessonDetailScreen: React.FC<LessonDetailScreenProps> = ({ route }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadLesson();
    animateContent();
  }, [route.params.lessonId]);

  const animateContent = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const loadLesson = async () => {
    try {
      const lessonData = await FirestoreService.getLessonById(route.params.lessonId);
      if (lessonData) {
        setLesson(lessonData);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'Failed to load lesson');
    }
  };

  const handleContinue = () => {
    if (progress < 100) {
      setProgress(Math.min(progress + 20, 100));
    } else {
      completeLesson();
    }
  };

  const handlePractice = () => {
    Alert.alert('Practice', 'Practice mode coming soon!');
  };

  const completeLesson = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || !lesson) return;

      // Add lesson progress
      await FirestoreService.addLessonProgress({
        userId: currentUser.uid,
        lessonId: lesson.id,
        completed: true,
        score: 85,
        xp: lesson.xp,
        timeSpent: lesson.duration * 60,
      });

      Alert.alert(
        'Congratulations!',
        `You've completed "${lesson.title}" and earned ${lesson.xp} XP!`,
        [
          { text: 'OK', onPress: () => NavigationService.goBack() },
        ]
      );
    } catch (error) {
      console.error('Error completing lesson:', error);
      Alert.alert('Error', 'Failed to complete lesson');
    }
  };

  const handleAudioPlay = () => {
    Alert.alert('Preview Only', MOBILE_PREVIEW_MESSAGE);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const renderLessonInfo = () => {
    if (!lesson) return null;

    return (
      <Animated.View style={[styles.lessonInfoCard, { opacity: fadeAnim }]}>
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
          <View style={[styles.lessonTag, styles.typeTag]}>
            <Text style={styles.lessonTagText}>{lesson.type}</Text>
          </View>
        </View>
        
        <Text style={styles.lessonDescription}>
          Learn essential {lesson.type.toLowerCase()} for {lesson.track.toLowerCase()}.
          This lesson covers key concepts and practical examples.
        </Text>
      </Animated.View>
    );
  };

  const renderIntroduction = () => (
    <Animated.View style={[styles.contentCard, { opacity: fadeAnim }]}>
      <Text style={styles.contentTitle}>📚 Introduction</Text>
      <Text style={styles.contentText}>
        Welcome to your lesson! Today you'll learn important concepts and practice
        real-world examples. Pay attention to the details and don't hesitate to
        review any section that seems challenging.
      </Text>
      
      <TouchableOpacity style={styles.audioButton} onPress={handleAudioPlay}>
        <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={20} color="#FFFFFF" />
        <Text style={styles.audioButtonText}>
          {isPlaying ? 'Pause' : 'Listen'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderVocabulary = () => (
    <Animated.View style={[styles.contentCard, { opacity: fadeAnim }]}>
      <Text style={styles.contentTitle}>📖 Key Vocabulary</Text>
      
      {[
        { word: 'Boarding Pass', phonetic: '/ˈbɔːrdɪŋ pæs/', arabic: 'تذكرة الصعود', meaning: 'The document that allows you to board the plane' },
        { word: 'Security Check', phonetic: '/sɪˈkjʊərəti tʃek/', arabic: 'فحص الأمن', meaning: 'Where they check your bags and body' },
        { word: 'Gate', phonetic: '/ɡeɪt/', arabic: 'البوابة', meaning: 'The door where you board the plane' },
      ].map((item, index) => (
        <View key={index} style={styles.vocabularyItem}>
          <Text style={styles.vocabularyWord}>{item.word}</Text>
          <Text style={styles.vocabularyPhonetic}>{item.phonetic} • {item.arabic}</Text>
          <Text style={styles.vocabularyMeaning}>{item.meaning}</Text>
        </View>
      ))}
    </Animated.View>
  );

  const renderPractice = () => (
    <Animated.View style={[styles.contentCard, { opacity: fadeAnim }]}>
      <Text style={styles.contentTitle}>🎯 Quick Practice</Text>
      <Text style={styles.practiceQuestion}>What do you show at the gate?</Text>
      
      <View style={styles.optionsContainer}>
        {['Passport', 'Boarding Pass', 'ID Card'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.optionButtonSelected,
            ]}
            onPress={() => handleAnswerSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderBottomActions = () => (
    <View style={styles.bottomContainer}>
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Lesson Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.continueButton]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {progress === 100 ? 'Complete' : 'Continue'}
          </Text>
          <Icon
            name={progress === 100 ? 'check' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.practiceButton]}
          onPress={handlePractice}
        >
          <Text style={styles.practiceButtonText}>Practice</Text>
          <Icon name="edit" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MobilePreviewBanner message={MOBILE_PREVIEW_MESSAGE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#424242" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{lesson.title}</Text>
        
        <TouchableOpacity style={styles.bookmarkButton}>
          <Icon name="bookmark-border" size={24} color="#424242" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderLessonInfo()}
        {renderIntroduction()}
        {renderVocabulary()}
        {renderPractice()}
      </ScrollView>

      {/* Bottom Actions */}
      {renderBottomActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#757575',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 200,
  },
  lessonInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  lessonTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
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
  typeTag: {
    backgroundColor: '#F3E5F5',
  },
  lessonTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
  lessonDescription: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 18,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 15,
  },
  contentText: {
    fontSize: 12,
    color: '#424242',
    lineHeight: 18,
    marginBottom: 15,
  },
  audioButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  audioButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  vocabularyItem: {
    backgroundColor: '#F8FAF5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  vocabularyWord: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 4,
  },
  vocabularyPhonetic: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 4,
  },
  vocabularyMeaning: {
    fontSize: 11,
    color: '#757575',
  },
  practiceQuestion: {
    fontSize: 12,
    color: '#424242',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D32',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  progressSection: {
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  practiceButton: {
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default LessonDetailScreen;
