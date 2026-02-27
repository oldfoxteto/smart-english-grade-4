import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationService } from '../services';
import { AuthService } from '../services';

const { width } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  subtitle?: string;
  type: 'text' | 'choice' | 'multiple';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

const AssessmentScreen: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [isLoading, setIsLoading] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What's your name?",
      subtitle: 'Tell us how to address you',
      type: 'text',
      placeholder: 'Enter your name...',
      required: true,
    },
    {
      id: 2,
      question: "What's your current English level?",
      subtitle: 'Be honest - this helps us personalize your learning',
      type: 'choice',
      options: ['Beginner (A1)', 'Elementary (A2)', 'Intermediate (B1)', 'Upper Intermediate (B2)', 'Advanced (C1)', 'Proficient (C2)'],
      required: true,
    },
    {
      id: 3,
      question: "What's your learning goal?",
      subtitle: 'Choose your primary motivation',
      type: 'choice',
      options: ['Travel', 'Work/Business', 'Study', 'Conversation', 'Tests/Exams', 'General Interest'],
      required: true,
    },
    {
      id: 4,
      question: "How much time can you dedicate daily?",
      subtitle: 'Be realistic - consistency is key',
      type: 'choice',
      options: ['5-10 minutes', '15-20 minutes', '30 minutes', '45 minutes', '1+ hour'],
      required: true,
    },
    {
      id: 5,
      question: "Why do you want to learn English?",
      subtitle: 'Your motivation helps us keep you engaged',
      type: 'text',
      placeholder: 'Tell us your story...',
      required: false,
    },
  ];

  useEffect(() => {
    animateQuestion();
  }, [currentQuestion]);

  const animateQuestion = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    const question = questions[currentQuestion];
    
    if (question.required && !answers[question.id]) {
      Alert.alert('Required', 'Please answer this question to continue.');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Process answers and create user profile
      const userProfile = {
        name: answers[1] || 'User',
        level: mapLevelToCEFR(answers[2] || 'Beginner (A1)'),
        goal: answers[3] || 'general',
        dailyTime: answers[4] || '15-20 minutes',
        motivation: answers[5] || '',
      };

      // Navigate to main app
      NavigationService.reset('MainApp', { userProfile });
      
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mapLevelToCEFR = (level: string): string => {
    const levelMap: { [key: string]: string } = {
      'Beginner (A1)': 'A1',
      'Elementary (A2)': 'A2',
      'Intermediate (B1)': 'B1',
      'Upper Intermediate (B2)': 'B2',
      'Advanced (C1)': 'C1',
      'Proficient (C2)': 'C2',
    };
    return levelMap[level] || 'A1';
  };

  const renderQuestionInput = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChangeText={handleAnswer}
            multiline={question.id === 5}
            numberOfLines={question.id === 5 ? 4 : 1}
          />
        );

      case 'choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[question.id] === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    answers[question.id] === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Icon
            name="arrow-back"
            size={24}
            color={currentQuestion === 0 ? '#CCCCCC' : '#4CAF50'}
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Level Assessment</Text>
        
        <Text style={styles.progressText}>
          {currentQuestion + 1}/{questions.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>
      </View>

      {/* Question Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.questionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Question Number */}
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>
              Question {currentQuestion + 1}
            </Text>
          </View>

          {/* Question Text */}
          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>
          
          {questions[currentQuestion].subtitle && (
            <Text style={styles.questionSubtitle}>
              {questions[currentQuestion].subtitle}
            </Text>
          )}

          {/* Input */}
          {renderQuestionInput()}

          {/* Help Text */}
          {questions[currentQuestion].required && (
            <Text style={styles.helpText}>
              This helps us personalize your learning experience
            </Text>
          )}
        </Animated.View>

        {/* Upcoming Questions Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Upcoming Questions:</Text>
          
          {questions.slice(currentQuestion + 1, currentQuestion + 4).map((question, index) => (
            <View key={question.id} style={styles.previewItem}>
              <View style={styles.previewNumber}>
                <Text style={styles.previewNumberText}>
                  {currentQuestion + index + 2}
                </Text>
              </View>
              <Text style={styles.previewText}>
                {question.question.length > 40
                  ? question.question.substring(0, 40) + '...'
                  : question.question}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Assessment takes ~2 minutes
        </Text>
        <Text style={styles.bottomSubtext}>
          Your answers help us create the perfect learning plan
        </Text>
        
        <TouchableOpacity
          style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === questions.length - 1 ? 'Complete' : 'Next Question'}
          </Text>
          <Icon
            name={currentQuestion === questions.length - 1 ? 'check' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
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
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  questionCard: {
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
  questionNumber: {
    backgroundColor: '#4CAF50',
    width: 120,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 10,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  optionButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  optionText: {
    fontSize: 14,
    color: '#424242',
  },
  optionTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 20,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  previewNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#757575',
  },
  previewText: {
    fontSize: 12,
    color: '#757575',
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bottomText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 5,
  },
  bottomSubtext: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 10,
  },
});

export default AssessmentScreen;
