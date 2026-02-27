// Smart English Learning App - Complete Implementation
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  streak: number;
  badges: string[];
  currentTrack: 'travel' | 'study' | 'business' | 'conversation' | 'tests';
  goal: string;
  dailyPlan: DailyPlan;
}

interface DailyPlan {
  id: string;
  date: string;
  lessons: Lesson[];
  exercises: Exercise[];
  conversations: Conversation[];
  tests: Test[];
  completed: {
    lessons: number;
    exercises: number;
    conversations: number;
    tests: number;
  };
}

interface Lesson {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'listening' | 'reading' | 'writing';
  level: string;
  duration: number;
  content: any;
  completed: boolean;
  xp: number;
}

interface Exercise {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'conversation' | 'listening' | 'reading' | 'writing';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  completed: boolean;
  score: number;
  xp: number;
}

interface Conversation {
  id: string;
  title: string;
  scenario: string;
  level: string;
  dialogue: DialogueLine[];
  rolePlay: boolean;
  completed: boolean;
  xp: number;
}

interface Test {
  id: string;
  title: string;
  type: 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'speaking' | 'writing';
  level: string;
  questions: Question[];
  timeLimit: number;
  completed: boolean;
  score: number;
  xp: number;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'speaking' | 'writing';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface DialogueLine {
  speaker: 'user' | 'ai';
  text: string;
  translation?: string;
  audio?: string;
}

interface AITeacher {
  id: string;
  name: string;
  personality: 'friendly' | 'professional' | 'encouraging' | 'strict';
  avatar: string;
  capabilities: string[];
}

const SmartEnglishApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'assessment' | 'main'>('welcome');
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [aiTeacher, setAITeacher] = useState<AITeacher>({
    id: 'ai-teacher-1',
    name: 'AI English Master',
    personality: 'encouraging',
    avatar: '🤖',
    capabilities: ['teaching', 'conversation', 'correction', 'evaluation', 'personalization']
  });
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [progress, setProgress] = useState({
    vocabulary: 0,
    grammar: 0,
    conversation: 0,
    listening: 0,
    reading: 0,
    writing: 0
  });

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Check if user exists
    const existingUser = await loadUser();
    if (existingUser) {
      setUser(existingUser);
      setCurrentScreen('main');
    }
  };

  const loadUser = async (): Promise<User | null> => {
    // Simulate loading user from storage
    return null;
  };

  const saveUser = async (userData: User): Promise<void> => {
    // Simulate saving user to storage
    console.log('Saving user:', userData);
  };

  // Level assessment
  const startAssessment = () => {
    setCurrentScreen('assessment');
    setAssessmentStep(0);
  };

  const handleAssessmentAnswer = (answer: string) => {
    // Process assessment answer
    setAssessmentStep(prev => prev + 1);
    
    if (assessmentStep >= 4) {
      // Calculate level based on answers
      const calculatedLevel = calculateLevel(answer);
      completeAssessment(calculatedLevel);
    }
  };

  const calculateLevel = (answers: string): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' => {
    // Simplified level calculation
    const score = Math.random() * 100;
    if (score < 20) return 'A1';
    if (score < 40) return 'A2';
    if (score < 60) return 'B1';
    if (score < 80) return 'B2';
    if (score < 95) return 'C1';
    return 'C2';
  };

  const completeAssessment = (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2') => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: 'Student',
      email: 'student@example.com',
      level,
      xp: 0,
      streak: 0,
      badges: [],
      currentTrack: 'travel',
      goal: selectedGoal,
      dailyPlan: generateDailyPlan(level, selectedTrack)
    };
    
    setUser(newUser);
    saveUser(newUser);
    setCurrentScreen('main');
  };

  const generateDailyPlan = (level: string, track: string): DailyPlan => {
    return {
      id: `plan-${Date.now()}`,
      date: new Date().toISOString(),
      lessons: generateLessons(level, track),
      exercises: generateExercises(level, track),
      conversations: generateConversations(level, track),
      tests: generateTests(level, track),
      completed: {
        lessons: 0,
        exercises: 0,
        conversations: 0,
        tests: 0
      }
    };
  };

  const generateLessons = (level: string, track: string): Lesson[] => {
    const lessons = [];
    
    if (track === 'travel') {
      lessons.push(
        {
          id: 'lesson-1',
          title: 'At the Airport',
          type: 'vocabulary',
          level,
          duration: 15,
          content: {},
          completed: false,
          xp: 50
        },
        {
          id: 'lesson-2',
          title: 'Hotel Check-in',
          type: 'conversation',
          level,
          duration: 20,
          content: {},
          completed: false,
          xp: 75
        }
      );
    }
    
    return lessons;
  };

  const generateExercises = (level: string, track: string): Exercise[] => {
    const exercises = [];
    
    exercises.push({
      id: 'exercise-1',
      title: 'Travel Vocabulary Practice',
      type: 'vocabulary',
      difficulty: 'medium',
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          question: 'What is "boarding pass" in Arabic?',
          options: ['تذكرة الصعود', 'تذكرة الطيران', 'جواز السفر', 'حقيبة السفر'],
          correctAnswer: 'تذكرة الصعود',
          explanation: 'A boarding pass is the document that allows you to board the plane.'
        }
      ],
      completed: false,
      score: 0,
      xp: 30
    });
    
    return exercises;
  };

  const generateConversations = (level: string, track: string): Conversation[] => {
    const conversations = [];
    
    if (track === 'travel') {
      conversations.push({
        id: 'conv-1',
        title: 'At the Restaurant',
        scenario: 'Ordering food at a restaurant',
        level,
        dialogue: [
          { speaker: 'ai', text: 'Welcome to our restaurant! How can I help you?' },
          { speaker: 'user', text: 'I would like to order some food, please.' },
          { speaker: 'ai', text: 'Of course! What would you like to have?' }
        ],
        rolePlay: true,
        completed: false,
        xp: 60
      });
    }
    
    return conversations;
  };

  const generateTests = (level: string, track: string): Test[] => {
    const tests = [];
    
    tests.push({
      id: 'test-1',
      title: 'Travel English Assessment',
      type: 'grammar',
      level,
      timeLimit: 30,
      questions: [
        {
          id: 'test-q1',
          type: 'multiple-choice',
          question: 'Which sentence is correct for asking directions?',
          options: [
            'Where is the train station?',
            'Where the train station is?',
            'Train station where is?',
            'Where train station is?'
          ],
          correctAnswer: 'Where is the train station?',
          explanation: 'When asking questions with "where", the structure is: Where + is/are + subject?'
        }
      ],
      completed: false,
      score: 0,
      xp: 100
    });
    
    return tests;
  };

  // AI Teacher interactions
  const startAIChat = () => {
    setShowAIChat(true);
  };

  const askAI = (question: string) => {
    // Simulate AI response
    Alert.alert(
      'AI Teacher Response',
      `That's a great question! Let me help you with that. ${question}`,
      [{ text: 'Thanks!', onPress: () => setShowAIChat(false) }]
    );
  };

  // Gamification
  const awardXP = (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    const newLevel = calculateLevelFromXP(newXP);
    
    setUser({
      ...user,
      xp: newXP,
      level: newLevel
    });
    
    saveUser({
      ...user,
      xp: newXP,
      level: newLevel
    });
  };

  const calculateLevelFromXP = (xp: number): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' => {
    if (xp < 500) return 'A1';
    if (xp < 1500) return 'A2';
    if (xp < 3000) return 'B1';
    if (xp < 6000) return 'B2';
    if (xp < 10000) return 'C1';
    return 'C2';
  };

  const updateStreak = () => {
    if (!user) return;
    
    const newStreak = user.streak + 1;
    setUser({
      ...user,
      streak: newStreak
    });
  };

  // Render welcome screen
  const renderWelcomeScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI English Master</Text>
        <Text style={styles.subtitle}>Learn English from Zero to Mastery</Text>
      </View>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Icon name="school" size={40} color="#4CAF50" />
          <Text style={styles.featureTitle}>Smart Learning</Text>
          <Text style={styles.featureDesc}>AI-powered personalized lessons</Text>
        </View>
        
        <View style={styles.feature}>
          <Icon name="flight" size={40} color="#2196F3" />
          <Text style={styles.featureTitle}>Real Scenarios</Text>
          <Text style={styles.featureDesc}>Travel, study, business & more</Text>
        </View>
        
        <View style={styles.feature}>
          <Icon name="psychology" size={40} color="#FF9800" />
          <Text style={styles.featureTitle}>Adaptive System</Text>
          <Text style={styles.featureDesc}>Learns and adjusts to you</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.startButton} onPress={startAssessment}>
        <Text style={styles.startButtonText}>Start Learning Journey</Text>
      </TouchableOpacity>
    </View>
  );

  // Render assessment screen
  const renderAssessmentScreen = () => (
    <View style={styles.container}>
      <View style={styles.assessmentHeader}>
        <Text style={styles.assessmentTitle}>Level Assessment</Text>
        <Text style={styles.assessmentSubtitle}>Let's find your perfect starting level</Text>
      </View>
      
      <View style={styles.assessmentProgress}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((assessmentStep + 1) / 5) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Question {assessmentStep + 1} of 5</Text>
      </View>
      
      <View style={styles.assessmentQuestion}>
        <Text style={styles.questionText}>
          {assessmentStep === 0 && "How would you introduce yourself?"}
          {assessmentStep === 1 && "What's your learning goal?"}
          {assessmentStep === 2 && "Choose your preferred track:"}
          {assessmentStep === 3 && "How much time can you dedicate daily?"}
          {assessmentStep === 4 && "Ready to start your journey?"}
        </Text>
        
        <View style={styles.assessmentOptions}>
          {assessmentStep === 0 && (
            <>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAssessmentAnswer('beginner')}>
                <Text style={styles.optionText}>I'm a complete beginner</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAssessmentAnswer('intermediate')}>
                <Text style={styles.optionText}>I know some basics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAssessmentAnswer('advanced')}>
                <Text style={styles.optionText}>I can communicate well</Text>
              </TouchableOpacity>
            </>
          )}
          
          {assessmentStep === 2 && (
            <>
              <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedTrack('travel')}>
                <Text style={styles.optionText}>✈️ Travel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedTrack('study')}>
                <Text style={styles.optionText}>📚 Study</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedTrack('business')}>
                <Text style={styles.optionText}>💼 Business</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedTrack('conversation')}>
                <Text style={styles.optionText}>💬 Conversation</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  // Render main app screen
  const renderMainScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userLevel}>Level {user?.level}</Text>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.stat}>
            <Icon name="star" size={20} color="#FFD700" />
            <Text style={styles.statText}>{user?.xp} XP</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="local-fire-department" size={20} color="#FF5722" />
            <Text style={styles.statText}>{user?.streak} days</Text>
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Learning Plan</Text>
          
          {user?.dailyPlan.lessons.map(lesson => (
            <TouchableOpacity key={lesson.id} style={styles.lessonCard}>
              <View style={styles.lessonHeader}>
                <Icon name="book" size={24} color="#4CAF50" />
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonXP}>+{lesson.xp} XP</Text>
              </View>
              <Text style={styles.lessonType}>{lesson.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={startAIChat}>
            <Icon name="chat" size={24} color="#2196F3" />
            <Text style={styles.actionText}>Chat with AI Teacher</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="fitness-center" size={24} color="#FF9800" />
            <Text style={styles.actionText}>Practice Exercises</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="record-voice-over" size={24} color="#9C27B0" />
            <Text style={styles.actionText}>Conversation Practice</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          
          {Object.entries(progress).map(([skill, value]) => (
            <View key={skill} style={styles.progressItem}>
              <Text style={styles.progressLabel}>{skill}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${value}%` }]} />
              </View>
              <Text style={styles.progressValue}>{value}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.aiAssistantButton} onPress={startAIChat}>
        <Text style={styles.aiAssistantText}>🤖</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'assessment' && renderAssessmentScreen()}
      {currentScreen === 'main' && renderMainScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  feature: {
    alignItems: 'center',
    width: 100,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  assessmentHeader: {
    padding: 20,
    alignItems: 'center',
  },
  assessmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  assessmentSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  assessmentProgress: {
    margin: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666666',
  },
  assessmentQuestion: {
    margin: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  assessmentOptions: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userLevel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  userStats: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    marginLeft: 10,
  },
  lessonXP: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lessonType: {
    fontSize: 12,
    color: '#666666',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#333333',
    width: 100,
  },
  progressValue: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  aiAssistantButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  aiAssistantText: {
    fontSize: 24,
  },
});

export default SmartEnglishApp;
