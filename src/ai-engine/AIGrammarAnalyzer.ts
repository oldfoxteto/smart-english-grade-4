// AI Grammar Analyzer Implementation
export interface GrammarAnalysis {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  analysis: {
    grammarType: string;
    errors: GrammarError[];
    suggestions: GrammarSuggestion[];
    score: number; // 0-100
    confidence: number; // 0-100
    patterns: GrammarPattern[];
    complexity: 'simple' | 'moderate' | 'complex';
    style: 'formal' | 'informal' | 'academic' | 'conversational';
  };
  context: {
    topic: string;
    audience: string;
    purpose: string;
    languageLevel: string;
  };
}

export interface GrammarError {
  id: string;
  type: 'syntax' | 'punctuation' | 'spelling' | 'grammar' | 'usage' | 'agreement' | 'tense' | 'structure';
  position: {
    start: number;
    end: number;
    line?: number;
    column?: number;
  };
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestions: string[];
  examples?: string[];
}

export interface GrammarSuggestion {
  id: string;
  type: 'correction' | 'improvement' | 'alternative' | 'explanation';
  text: string;
  confidence: number; // 0-100
  priority: 'high' | 'medium' | 'low';
  reason: string;
  examples?: string[];
}

export interface GrammarPattern {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  examples: string[];
  frequency: number; // How often this pattern occurs
  category: 'syntax' | 'punctuation' | 'agreement' | 'tense' | 'structure' | 'style';
}

export interface GrammarRule {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  category: string;
  exceptions: string[];
  examples: string[];
  difficulty: number; // 1-10
}

class AIGrammarAnalyzer {
  private grammarRules: Map<string, GrammarRule> = new Map();
  private commonErrors: Map<string, GrammarError> = new Map();
  private patterns: Map<string, GrammarPattern> = new Map();
  private analysisHistory: Map<string, GrammarAnalysis[]> = new Map();

  constructor() {
    this.initializeGrammarRules();
    this.initializeCommonErrors();
    this.initializePatterns();
  }

  // Initialize grammar rules
  private initializeGrammarRules(): void {
    const rules: GrammarRule[] = [
      // Subject-Verb Agreement
      {
        id: 'subject-verb-agreement',
        name: 'Subject-Verb Agreement',
        description: 'Subject must agree with verb in number and person',
        pattern: /\b(he|she|it|we|they)\s+(is|are|was|were)\s+\w+ing\b/gi,
        category: 'agreement',
        examples: ['He is going', 'They are playing', 'The cats are sleeping'],
        difficulty: 3,
        exceptions: ['The news is good', 'Mathematics is interesting']
      },
      
      // Article Usage
      {
        id: 'article-usage',
        name: 'Article Usage',
        description: 'Use correct articles (a, an, the)',
        pattern: /\b(a|an|the)\s+(uncountable|singular)\b/gi,
        category: 'usage',
        examples: ['a book', 'an apple', 'the water', 'an hour'],
        difficulty: 2,
        exceptions: ['A lot of water', 'An hour']
      },
      
      // Tense Consistency
      {
        id: 'tense-consistency',
        name: 'Tense Consistency',
        description: 'Maintain consistent tense throughout text',
        pattern: /\b(was|is|were)\s+\w+ing\b.*\b(have|has|had)\s+\w+en\b/gi,
        category: 'tense',
        examples: ['I was walking when I saw him', 'They have finished their work', 'She has been studying for years'],
        difficulty: 4,
        exceptions: ['I have seen this movie before']
      },
      
      // Punctuation
      {
        id: 'punctuation',
        name: 'Punctuation Rules',
        description: 'Use correct punctuation marks',
        pattern: /[.!?]([^.!?]|\s)/g,
        category: 'punctuation',
        examples: ['Hello! How are you?', 'What a beautiful day!', 'I love learning English.'],
        difficulty: 1,
        exceptions: ['U.S.A.', 'Mr. Smith', 'Dr. Johnson']
      },
      
      // Sentence Structure
      {
        id: 'sentence-structure',
        name: 'Sentence Structure',
        description: 'Complete sentences with subject and verb',
        pattern: /\b[A-Z][a-z]*\s+(is|are|was|were)\s+[a-z]+\s+(noun|adjective|verb)\b/gi,
        category: 'structure',
        examples: ['The cat sits on the mat', 'Students learn English', 'She reads books'],
        difficulty: 3,
        exceptions: ['Hello world!', 'Good morning']
      },
      
      // Capitalization
      {
        id: 'capitalization',
        name: 'Capitalization Rules',
        description: 'Start sentences with capital letters',
        pattern: /^[A-Z][a-z]/,
        category: 'structure',
        examples: ['English is a global language', 'The weather is nice today'],
        difficulty: 1,
        exceptions: ['iPhone', 'NASA', 'UN']
      }
    ];

    rules.forEach(rule => {
      this.grammarRules.set(rule.id, rule);
    });
  }

  // Initialize common grammar errors
  private initializeCommonErrors(): void {
    const errors: GrammarError[] = [
      {
        id: 'double-negative',
        type: 'grammar',
        position: { start: 0, end: 0 },
        message: 'Double negative detected',
        severity: 'error',
        suggestions: ['Use positive construction instead', 'Consider: "I don\'t have no money"'],
        examples: ['I have some money', 'I am happy']
      },
      {
        id: 'subject-verb-disagreement',
        type: 'grammar',
        position: { start: 0, end: 0 },
        message: 'Subject-verb disagreement',
        severity: 'error',
        suggestions: ['Check subject-verb agreement', 'Ensure singular subjects with singular verbs'],
        examples: ['He go to school', 'They goes to school'],
        examples: ['He go to school', 'They go to school']
      },
      {
        id: 'article-misuse',
        type: 'usage',
        position: { start: 0, end: 0 },
        message: 'Article misuse detected',
        severity: 'warning',
        suggestions: ['Review article usage rules', 'Consider: "an apple" vs "a apple"'],
        examples: ['I saw a cat', 'I saw a cat']
      },
      {
        id: 'punctuation-error',
        type: 'punctuation',
        position: { start: 0, end: 0 },
        message: 'Punctuation error detected',
        severity: 'error',
        suggestions: ['Add missing punctuation', 'Check sentence boundaries'],
        examples: ['Hello world', 'What are you doing'],
        examples: ['Hello world!', 'What are you doing']
      },
      {
        id: 'run-on-sentence',
        type: 'structure',
        position: { start: 0, end: 0 },
        message: 'Run-on sentence detected',
        severity: 'error',
        suggestions: ['Break into multiple sentences', 'Use proper punctuation'],
        examples: ['I like English. I learn every day.', 'I like English I learn every day.']
      }
    ];

    errors.forEach(error => {
      this.commonErrors.set(error.id, error);
    });
  }

  // Initialize grammar patterns
  private initializePatterns(): void {
    const patterns: GrammarPattern[] = [
      {
        id: 'present-simple',
        name: 'Present Simple Tense',
        description: 'Actions happening now or regularly',
        pattern: /\b(am|is|are)\s+\w+ing\b/gi,
        examples: ['I am studying', 'She is working', 'They are playing'],
        frequency: 8,
        category: 'tense'
      },
      {
        id: 'past-simple',
        name: 'Past Simple Tense',
        description: 'Actions completed in the past',
        pattern: /\b(was|were)\s+\w+ed\b/gi,
        examples: ['I studied', 'She worked', 'They played'],
        frequency: 7,
        category: 'tense'
      },
      {
        id: 'present-perfect',
        name: 'Present Perfect',
        description: 'Actions completed in the past with connection to present',
        pattern: /\b(have|has)\s+\w+en\b/gi,
        examples: ['I have studied', 'She has worked', 'They have played'],
        frequency: 6,
        category: 'tense'
      },
      {
        id: 'passive-voice',
        name: 'Passive Voice',
        description: 'Subject receives action rather than performs it',
        pattern: /\b(am|is|are|was|were)\s+\w+en\b.*\bby\b/gi,
        examples: ['The book was written by him', 'The email was sent by her', 'The song was sung by them'],
        frequency: 4,
        category: 'structure'
      },
      {
        id: 'conditional-sentences',
        name: 'Conditional Sentences',
        description: 'Sentences with conditional clauses',
        pattern: /\b(if|when|unless)\s+[^,]+\b(then|when)\b[^,]*\b/gi,
        examples: ['If it rains, we will stay home', 'When I study, I listen to music'],
        frequency: 5,
        category: 'structure'
      },
      {
        id: 'question-formation',
        name: 'Question Formation',
        description: 'Formation of different question types',
        pattern: /\b(Do|Does|Did|Can|Will|Are|Is|Have|Has)\b[^,]*\b\w+\b/gi,
        examples: ['Do you like English?', 'Does he speak English?', 'Can you help me?'],
        frequency: 6,
        category: 'structure'
      }
    ];

    patterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  // Analyze text for grammar
  analyzeGrammar(text: string, userId: string, context?: any): GrammarAnalysis {
    const analysis: GrammarAnalysis = {
      id: `grammar-${userId}-${Date.now()}`,
      userId,
      text,
      timestamp: new Date(),
      analysis: {
        grammarType: this.detectGrammarType(text),
        errors: [],
        suggestions: [],
        score: 0,
        confidence: 0,
        patterns: [],
        complexity: 'simple',
        style: 'neutral'
      },
      context: {
        topic: context?.topic || 'general',
        audience: context?.audience || 'general',
        purpose: context?.purpose || 'general',
        languageLevel: context?.languageLevel || 'intermediate'
      }
    };

    // Check against grammar rules
    this.grammarRules.forEach(rule => {
      const matches = text.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          const error: this.createGrammarError(rule, match);
          analysis.analysis.errors.push(error);
          
          // Create suggestion
          const suggestion = this.createGrammarSuggestion(rule, match);
          if (suggestion) {
            analysis.analysis.suggestions.push(suggestion);
          }
        });
      }
    });

    // Check for common errors
    this.commonErrors.forEach(error => {
      if (this.matchesCommonError(text, error)) {
        analysis.analysis.errors.push(error);
      }
    });

    // Calculate score and confidence
    analysis.analysis.score = this.calculateGrammarScore(analysis.analysis.errors, text.length);
    analysis.analysis.confidence = this.calculateConfidence(analysis.analysis.errors, text.length);

    // Detect patterns
    analysis.analysis.patterns = this.detectPatterns(text);

    // Determine complexity and style
    analysis.analysis.complexity = this.calculateComplexity(text, analysis.analysis.errors);
    analysis.analysis.style = this.detectStyle(text);

    return analysis;
  }

  // Detect grammar type
  private detectGrammarType(text: string): string {
    const hasVerbs = /\b(am|is|are|was|were|be|been|being|have|has|had)\s+\w+ing\b/gi.test(text);
    const hasNouns = /\b(cat|dog|book|student|teacher|school|home|car|computer)\b/gi.test(text);
    const hasAdjectives = /\b(good|bad|big|small|happy|sad|beautiful|interesting|difficult|easy|hard)\b/gi.test(text);
    const hasPastTense = /\b(was|were)\s+\w+ed\b/gi.test(text);
    const hasQuestions = /\b(what|where|when|why|how|who|which|do|does|can|could|would|should|could|will|shall|may|might|must)\b/gi.test(text);
    
    if (hasQuestions && hasVerbs) return 'interrogative';
    if (hasPastTense && !hasQuestions) return 'narrative';
    if (hasVerbs && hasAdjectives && !hasQuestions) return 'descriptive';
    if (hasNouns && !hasAdjectives && !hasQuestions) return 'expository';
    return 'general';
  }

  // Create grammar error
  private createGrammarError(rule: GrammarRule, match: RegExpMatchArray): GrammarError {
    const position = {
      start: match.index || 0,
      end: (match.index || 0) + match[0].length
    };

    let message = rule.description;
    let severity: 'error' | 'warning' | 'info' = 'error';
    let suggestions: string[] = [];

    switch (rule.category) {
      case 'agreement':
        severity = 'error';
        suggestions = ['Check subject-verb agreement', 'Ensure singular/plural consistency'];
        break;
      case 'usage':
        severity = 'warning';
        suggestions = ['Review usage rules', 'Consider alternative phrasing'];
        break;
      case 'tense':
        severity = 'error';
        suggestions = ['Check tense consistency', 'Use timeline markers if needed'];
        break;
      case 'punctuation':
        severity = 'error';
        suggestions = ['Add missing punctuation', 'Check sentence boundaries'];
        break;
      case 'structure':
        severity = 'error';
        suggestions = ['Review sentence structure', 'Ensure complete sentences'];
        break;
    }

    return {
      id: `error-${rule.id}-${Date.now()}`,
      type: rule.category,
      position,
      message,
      severity,
      suggestions,
      examples: rule.examples
    };
  }

  // Create grammar suggestion
  private createGrammarSuggestion(rule: GrammarRule, match: RegExpMatchArray): GrammarSuggestion | null {
    const originalText = match[0];
    
    switch (rule.id) {
      case 'subject-verb-agreement':
        return {
          id: `suggestion-${rule.id}-${Date.now()}`,
          type: 'correction',
          text: `Consider: "${originalText}"`,
          confidence: 85,
          priority: 'high',
          reason: 'Subject-verb agreement issue',
          examples: rule.examples
        };
      case 'article-usage':
        return {
          id: `suggestion-${rule.id}-${Date.now()}`,
          type: 'improvement',
          text: `Consider using ${this.suggestArticle(originalText)} instead`,
          confidence: 70,
          priority: 'medium',
          reason: 'Article usage improvement',
          examples: rule.examples
        };
      case 'tense-consistency':
        return {
          id: `suggestion-${rule.id}-${Date.now()}`,
          type: 'correction',
          text: 'Maintain consistent tense throughout your text',
          confidence: 80,
          priority: 'high',
          reason: 'Tense consistency issue',
          examples: rule.examples
        };
      default:
        return null;
    }
  }

  // Suggest correct article
  private suggestArticle(text: string): string {
    const lowerText = text.toLowerCase().trim();
    
    // Simple article suggestion logic
    if (lowerText.startsWith('a') || lowerText.startsWith('e') || lowerText.startsWith('i') || lowerText.startsWith('o' || lowerText.startsWith('u')) {
      return 'an';
    }
    
    return 'a';
  }

  // Check if text matches common error
  private matchesCommonError(text: string, error: GrammarError): boolean {
    switch (error.id) {
      case 'double-negative':
        return /\b(no|not|never|none|nothing)\s+\w+out\b/gi.test(text) && 
               !/\b(nothing|nowhere|nobody|nowhere)\s+\w+out\b/gi.test(text);
      case 'run-on-sentence':
        return text.split(/[.!?]/).length > 10 && text.split(' ').length < 5;
      default:
        return false;
    }
  }

  // Calculate grammar score
  private calculateGrammarScore(errors: GrammarError[], textLength: number): number {
    if (errors.length === 0) return 100;
    
    const errorWeight = errors.reduce((sum, error) => {
      const weight = error.severity === 'error' ? 10 : 
                     error.severity === 'warning' ? 5 : 1;
      return sum + weight;
    }, 0);

    const errorPenalty = errorWeight / (textLength / 10) * 100;
    return Math.max(0, 100 - errorPenalty);
  }

  // Calculate confidence
  private calculateConfidence(errors: GrammarError[], textLength: number): number {
    const errorCount = errors.length;
    const errorRate = errorCount / (textLength / 10); // Errors per 10 characters
    
    if (errorRate > 0.2) return 20; // Low confidence
    if (errorRate > 0.1) return 40; // Medium confidence
    if (errorRate > 0.05) return 60; // High confidence
    return 80; // Very high confidence
  }

  // Calculate complexity
  private calculateComplexity(text: string, errors: GrammarError[]): 'simple' | 'moderate' | 'complex' {
    let complexityScore = 1;
    
    // Add complexity based on sentence structure
    const sentences = text.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    
    if (avgSentenceLength > 20) complexityScore += 2;
    if (avgSentenceLength > 10) complexityScore += 1;
    
    // Add complexity based on errors
    if (errors.length > 5) complexityScore += 2;
    
    // Add complexity based on vocabulary
    const complexWords = /\b(sophisticated|comprehensive|nevertheless|furthermore|consequently|nevertheless)\b/gi.test(text);
    if (complexWords) complexityScore += 2;
    
    if (complexityScore <= 2) return 'simple';
    if (complexityScore <= 4) return 'moderate';
    return 'complex';
  }

  // Detect style
  private detectStyle(text: string): 'formal' | 'informal' | 'academic' | 'conversational' {
    const formalWords = ['furthermore', 'consequently', 'nevertheless', 'therefore', 'moreover', 'henceforth'];
    const informalWords = ['gonna', 'wanna', 'kinda', 'awesome', 'cool', 'stuff'];
    const academicWords = ['furthermore', 'consequently', 'nevertheless', 'therefore', 'moreover', 'henceforth'];
    const conversationalWords = ['well', 'you know', 'I think', 'I mean', 'actually'];
    
    const formalCount = formalWords.filter(word => text.toLowerCase().includes(word)).length;
    const informalCount = informalWords.filter(word => text.toLowerCase().includes(word)).length;
    const academicCount = academicWords.filter(word => text.toLowerCase().includes(word)).length;
    const conversationalCount = conversationalWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (formalCount > informalCount && formalCount > conversationalCount) return 'formal';
    if (conversationalCount > informalCount && conversationalCount > academicCount) return 'conversational';
    if (academicCount > 0) return 'academic';
    return 'informal';
  }

  // Detect patterns in text
  private detectPatterns(text: string): GrammarPattern[] {
    const detectedPatterns: GrammarPattern[] = [];
    
    this.patterns.forEach(pattern => {
      const matches = text.match(new RegExp(pattern.pattern, 'gi'));
      if (matches) {
        detectedPatterns.push({
          ...pattern,
          frequency: matches.length,
          examples: pattern.examples
        });
      }
    });
    
    return detectedPatterns;
  }

  // Get analysis history
  getAnalysisHistory(userId: string): GrammarAnalysis[] {
    return this.analysisHistory.get(userId) || [];
  }

  // Get common grammar errors
  getCommonErrors(): GrammarError[] {
    return Array.from(this.commonErrors.values());
  }

  // Get grammar rules
  getGrammarRules(): GrammarRule[] {
    return Array.from(this.grammarRules.values());
  }

  // Get patterns
  getPatterns(): GrammarPattern[] {
    return Array.from(this.patterns.values());
  }

  // Add custom grammar rule
  addCustomRule(rule: Omit<GrammarRule, 'id'>): void {
    const customRule: GrammarRule = {
      ...rule,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.grammarRules.set(customRule.id, customRule);
  }

  // Analyze specific grammar aspect
  analyzeAspect(text: string, aspect: 'tenses' | 'agreement' | 'punctuation' | 'structure'): GrammarAnalysis {
    const relevantRules = Array.from(this.grammarRules.values())
      .filter(rule => rule.category === aspect);
    
    const analysis: GrammarAnalysis = {
      id: `aspect-${aspect}-${Date.now()}`,
      userId: 'system',
      text,
      timestamp: new Date(),
      analysis: {
        grammarType: aspect,
        errors: [],
        suggestions: [],
        score: 0,
        confidence: 0,
        patterns: [],
        complexity: 'simple',
        style: 'neutral'
      },
      context: {
        topic: 'grammar analysis',
        audience: 'system',
        purpose: 'aspect-specific analysis',
        languageLevel: 'intermediate'
      }
    };

    relevantRules.forEach(rule => {
      const matches = text.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          const error = this.createGrammarError(rule, match);
          analysis.analysis.errors.push(error);
          
          const suggestion = this.createGrammarSuggestion(rule, match);
          if (suggestion) {
            analysis.analysis.suggestions.push(suggestion);
          }
        });
      }
    });

    analysis.analysis.score = this.calculateGrammarScore(analysis.analysis.errors, text.length);
    analysis.analysis.confidence = this.calculateConfidence(analysis.analysis.errors, text.length);

    return analysis;
  }
}

export default AIGrammarAnalyzer;
export type { GrammarAnalysis, GrammarError, GrammarSuggestion, GrammarPattern, GrammarRule };
