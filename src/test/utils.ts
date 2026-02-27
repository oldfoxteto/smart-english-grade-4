// Comprehensive Testing Suite for Smart English Grade 4
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Mock data factories
export class MockDataFactory {
  static createStudent(overrides: Partial<Student> = {}): Student {
    return {
      id: 'test-student-1',
      email: 'test@example.com',
      name: 'Test Student',
      createdAt: new Date(),
      updatedAt: new Date(),
      level: 5,
      xp: 500,
      streak: 3,
      preferences: {
        language: 'ar',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          sound: true,
          desktop: false,
          weekly: true,
          daily: false
        },
        audio: {
          volume: 75,
          microphoneEnabled: true,
          speakerEnabled: true,
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true
        },
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          reduceMotion: false,
          screenReader: false
        }
      },
      progress: {
        totalStudyTime: 120,
        lessonsCompleted: 15,
        exercisesCompleted: 45,
        testsPassed: 3,
        vocabularyLearned: 100,
        grammarMastered: 20,
        averageScore: 85,
        currentStreak: 3,
        longestStreak: 7
      },
      achievements: [],
      ...overrides
    };
  }

  static createExercise(overrides: Partial<BaseExercise> = {}): BaseExercise {
    return {
      id: 'test-exercise-1',
      type: 'vocabulary',
      title: 'Test Exercise',
      arabicTitle: 'تمرين اختبار',
      description: 'A test exercise for unit testing',
      arabicDescription: 'تمرين اختبار للاختبار الوحدوي',
      difficulty: 'intermediate',
      estimatedTime: 10,
      xpReward: 50,
      tags: ['test', 'vocabulary'],
      ...overrides
    };
  }

  static createLesson(overrides: Partial<Lesson> = {}): Lesson {
    return {
      id: 'test-lesson-1',
      title: 'Test Lesson',
      arabicTitle: 'درس اختبار',
      description: 'A test lesson for unit testing',
      arabicDescription: 'درس اختبار للاختبار الوحدوي',
      level: 5,
      duration: 30,
      objectives: ['Test objective 1', 'Test objective 2'],
      arabicObjectives: ['هدف اختبار 1', 'هدف اختبار 2'],
      exercises: [this.createExercise()],
      ...overrides
    };
  }

  static createAchievement(overrides: Partial<Achievement> = {}): Achievement {
    return {
      id: 'test-achievement-1',
      title: 'Test Achievement',
      arabicTitle: 'إنجاز اختبار',
      description: 'A test achievement',
      arabicDescription: 'إنجاز اختبار',
      category: 'learning',
      rarity: 'common',
      xpReward: 100,
      progress: 0,
      maxProgress: 1,
      icon: 'test-icon',
      ...overrides
    };
  }

  static createTestResult(overrides: Partial<TestResult> = {}): TestResult {
    return {
      score: 85,
      maxScore: 100,
      timeSpent: 300,
      answers: ['A', 'B', 'C'],
      feedback: 'Great job!',
      improvements: ['Review vocabulary', 'Practice grammar'],
      xpGained: 50,
      completedAt: new Date(),
      ...overrides
    };
  }
}

// Test utilities
export class TestUtils {
  static renderWithProviders(
    component: React.ReactElement,
    options: {
      initialUser?: Student;
      mockAPI?: Record<string, any>;
      theme?: any;
      router?: any;
    } = {}
  ) {
    const { initialUser, mockAPI = {}, theme, router } = options;
    
    // Mock API calls
    vi.mock('../services/api', () => ({
      api: {
        get: vi.fn((url) => Promise.resolve(mockAPI[url] || {})),
        post: vi.fn((url, data) => Promise.resolve({ data })),
        put: vi.fn((url, data) => Promise.resolve({ data })),
        delete: vi.fn((url) => Promise.resolve({}))
      }
    }));
    
    // Mock user context
    vi.mock('../contexts/UserContext', () => ({
      UserProvider: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      useUser: () => ({
        user: initialUser || MockDataFactory.createStudent(),
        updateUser: vi.fn(),
        loading: false,
        error: null
      })
    }));
    
    // Mock theme
    const testTheme = theme || createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#dc004e',
        },
      },
    });
    
    const { container } = render(
      <ThemeProvider theme={testTheme}>
        <CssBaseline />
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </ThemeProvider>
    );
    
    return container;
  }

  static async waitForElement(
    getByTestId: (testId: string) => HTMLElement,
    testId: string,
    timeout: number = 5000
  ) {
    return await waitFor(
      () => getByTestId(testId),
      { timeout }
    );
  }

  static async fireEventAsync(
    element: HTMLElement,
    event: string,
    options?: any
  ) {
    await act(async () => {
      fireEvent(element, event, options);
    });
  }

  static async typeAsync(
    element: HTMLElement,
    text: string
  ) {
    await act(async () => {
      fireEvent.change(element, { target: { value: text } });
    });
  }

  static async clickAsync(element: HTMLElement) {
    await act(async () => {
      fireEvent.click(element);
    });
  }

  static mockAudioContext() {
    const mockAudioContext = {
      createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        frequency: { value: 440 },
        gain: { value: 0.1 },
        start: vi.fn(),
        stop: vi.fn()
      })),
      createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: { value: 0.1 }
      }))
    };
    
    vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));
    vi.stubGlobal('webkitAudioContext', vi.fn(() => mockAudioContext));
  }

  static mockSpeechRecognition() {
    const mockRecognition = {
      continuous: false,
      interimResults: false,
      lang: 'en-US',
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null
    };
    
    vi.stubGlobal('webkitSpeechRecognition', vi.fn(() => mockRecognition));
    return mockRecognition;
  }

  static mockSpeechSynthesis() {
    const mockUtterance = {
      lang: 'en-US',
      rate: 0.9,
      text: ''
    };
    
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn()
    });
    
    vi.stubGlobal('SpeechSynthesisUtterance', vi.fn((text) => ({
      ...mockUtterance,
      text
    })));
  }

  static mockLocalStorage() {
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);
  }

  static mockSessionStorage() {
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    vi.stubGlobal('sessionStorage', sessionStorageMock);
  }

  static mockFetch() {
    vi.stubGlobal('fetch', vi.fn());
  }

  static mockNavigator() {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
  }

  static mockIntersectionObserver() {
    const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    
    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  }

  static mockResizeObserver() {
    const mockResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    
    vi.stubGlobal('ResizeObserver', mockResizeObserver);
  }
}

// Performance testing utilities
export class PerformanceTestUtils {
  static async measureRenderTime(
    component: React.ReactElement,
    iterations: number = 10
  ): Promise<number> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      const { unmount } = render(component);
      
      await waitFor(() => {
        expect(screen.getByTestId('rendered-component')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      times.push(endTime - startTime);
      
      unmount();
    }
    
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  static async measureMemoryUsage(
    component: React.ReactElement
  ): Promise<number> {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    const { unmount } = render(component);
    
    await waitFor(() => {
      expect(screen.getByTestId('rendered-component')).toBeInTheDocument();
    });
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    unmount();
    
    return finalMemory - initialMemory;
  }

  static async measureInteractionLatency(
    interaction: () => Promise<void>
  ): Promise<number> {
    const startTime = performance.now();
    await interaction();
    const endTime = performance.now();
    return endTime - startTime;
  }
}

// Integration testing utilities
export class IntegrationTestUtils {
  static async completeExerciseFlow(
    exerciseType: string
  ): Promise<TestResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    let score = 0;
    
    try {
      // Start exercise
      const startButton = screen.getByTestId('start-exercise');
      await TestUtils.clickAsync(startButton);
      
      // Wait for exercise to load
      await TestUtils.waitForElement(
        screen.getByTestId,
        'exercise-content'
      );
      
      // Complete exercise based on type
      switch (exerciseType) {
        case 'vocabulary':
          score = await this.completeVocabularyExercise();
          break;
        case 'grammar':
          score = await this.completeGrammarExercise();
          break;
        case 'listening':
          score = await this.completeListeningExercise();
          break;
        default:
          throw new Error(`Unknown exercise type: ${exerciseType}`);
      }
      
      // Submit exercise
      const submitButton = screen.getByTestId('submit-exercise');
      await TestUtils.clickAsync(submitButton);
      
      // Wait for results
      await TestUtils.waitForElement(
        screen.getByTestId,
        'exercise-results'
      );
      
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      passed: errors.length === 0,
      score,
      duration,
      errors,
      coverage: 100,
      performance: {
        renderTime: 0,
        componentLoadTime: 0,
        apiResponseTime: 0,
        memoryUsage: 0,
        errorRate: errors.length,
        userEngagement: score
      }
    };
  }

  private static async completeVocabularyExercise(): Promise<number> {
    // Mock vocabulary exercise completion
    const words = screen.getAllByTestId('vocabulary-word');
    
    for (const word of words) {
      const input = word.querySelector('input');
      if (input) {
        await TestUtils.typeAsync(input, 'test');
      }
    }
    
    return 85; // Mock score
  }

  private static async completeGrammarExercise(): Promise<number> {
    // Mock grammar exercise completion
    const options = screen.getAllByTestId('grammar-option');
    
    for (const option of options) {
      if (option.textContent?.includes('correct')) {
        await TestUtils.clickAsync(option);
      }
    }
    
    return 90; // Mock score
  }

  private static async completeListeningExercise(): Promise<number> {
    // Mock listening exercise completion
    const playButton = screen.getByTestId('play-audio');
    await TestUtils.clickAsync(playButton);
    
    // Wait for audio to play
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const options = screen.getAllByTestId('listening-option');
    await TestUtils.clickAsync(options[0]);
    
    return 80; // Mock score
  }
}

// Accessibility testing utilities
export class AccessibilityTestUtils {
  static async checkAccessibility(container: HTMLElement): Promise<{
    passed: boolean;
    violations: any[];
  }> {
    const violations = [];
    
    // Check for alt text on images
    const images = container.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        violations.push({
          element: `img[${index}]`,
          issue: 'Missing alt text',
          severity: 'medium'
        });
      }
    });
    
    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > lastLevel + 1) {
        violations.push({
          element: heading.tagName,
          issue: 'Heading level skip',
          severity: 'minor'
        });
      }
      lastLevel = level;
    });
    
    // Check for form labels
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      if (!input.labels || input.labels.length === 0) {
        violations.push({
          element: `input[${index}]`,
          issue: 'Missing form label',
          severity: 'high'
        });
      }
    });
    
    return {
      passed: violations.length === 0,
      violations
    };
  }

  static async testKeyboardNavigation(container: HTMLElement): Promise<{
    passed: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Test Tab navigation
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i];
      element.focus();
      
      if (document.activeElement !== element) {
        issues.push(`Element ${i} is not focusable`);
      }
    }
    
    return {
      passed: issues.length === 0,
      issues
    };
  }
}

// Test setup and teardown
export const setupTestEnvironment = () => {
  beforeAll(() => {
    // Setup global mocks
    TestUtils.mockAudioContext();
    TestUtils.mockSpeechRecognition();
    TestUtils.mockSpeechSynthesis();
    TestUtils.mockLocalStorage();
    TestUtils.mockSessionStorage();
    TestUtils.mockFetch();
    TestUtils.mockNavigator();
    TestUtils.mockIntersectionObserver();
    TestUtils.mockResizeObserver();
  });

  afterAll(() => {
    // Cleanup global mocks
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Reset localStorage
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    // Cleanup after each test
    vi.clearAllTimers();
    document.body.innerHTML = '';
  });
};

// Custom matchers
expect.extend({
  toBeAccessible(received: HTMLElement) {
    try {
      const violations = AccessibilityTestUtils.checkAccessibility(received);
      return {
        pass: violations.passed,
        message: () => violations.passed 
          ? 'Element is accessible' 
          : `Element has ${violations.violations.length} accessibility violations`
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Failed to check accessibility: ${error}`
      };
    }
  },

  toHaveValidHeadingStructure(received: HTMLElement) {
    try {
      const headings = received.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      let hasIssues = false;
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > lastLevel + 1) {
          hasIssues = true;
        }
        lastLevel = level;
      });
      
      return {
        pass: !hasIssues,
        message: () => !hasIssues 
          ? 'Element has valid heading structure' 
          : 'Element has invalid heading structure'
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Failed to check heading structure: ${error}`
      };
    }
  },

  toHaveFormLabels(received: HTMLElement) {
    try {
      const inputs = received.querySelectorAll('input, textarea, select');
      let unlabeledCount = 0;
      
      inputs.forEach((input) => {
        if (!input.labels || input.labels.length === 0) {
          unlabeledCount++;
        }
      });
      
      return {
        pass: unlabeledCount === 0,
        message: () => unlabeledCount === 0 
          ? 'All form elements have labels' 
          : `${unlabeledCount} form elements are missing labels`
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Failed to check form labels: ${error}`
      };
    }
  }
});

// Export types for testing
export interface TestEnvironment {
  container: HTMLElement;
  user: ReturnType<typeof userEvent.setup>;
  cleanup: () => void;
}

export interface MockAPI {
  [key: string]: any;
}

export interface TestConfig {
  initialUser?: Student;
  mockAPI?: MockAPI;
  theme?: any;
  router?: any;
}

// Test hooks
export const useTestEnvironment = (config: TestConfig = {}): TestEnvironment => {
  const container = TestUtils.renderWithProviders(<div />, config);
  const user = userEvent.setup();
  
  const cleanup = () => {
    container.remove();
  };
  
  return { container, user, cleanup };
};
