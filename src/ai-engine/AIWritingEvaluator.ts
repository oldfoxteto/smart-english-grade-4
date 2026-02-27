// AI Writing Evaluator Implementation
export interface WritingEvaluation {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  analysis: {
    overallScore: number; // 0-100
    coherence: number; // 0-100
    grammar: number; // 0-100
    vocabulary: number; // 0-100
    structure: number; // 0-100
    style: number; // 0-100
    clarity: number; // 0-100
    creativity: number; // 0-100
    taskCompletion: number; // 0-100
    length: number; // words
    complexity: 'simple' | 'moderate' | 'complex';
    audience: 'beginner' | 'intermediate' | 'advanced';
    purpose: string;
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: WritingSuggestion[];
    score: number; // 0-5
    comment: string;
    examples: string[];
  };
  metadata: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordLength: number;
    avgSentenceLength: number;
    timeSpent: number; // seconds
    language: string;
    genre: string;
  };
}

export interface WritingSuggestion {
  id: string;
  type: 'grammar' | 'vocabulary' | 'structure' | 'style' | 'clarity' | 'creativity' | 'task-completion';
  text: string;
  confidence: number; // 0-100
  priority: 'high' | 'medium' | 'low';
  reason: string;
  examples?: string[];
  action: 'replace' | 'add' | 'remove' | 'reorder' | 'explain';
  position?: {
    start: number;
    end: number;
    line?: number;
  };
}

export interface WritingMetrics {
  readability: {
    fleschKincaid: number; // 0-100
    gunningFog: number; // 0-100
    colemanLiau: number; // 0-100
    automatedReadability: number; // 0-100
  };
  coherence: {
    logicalFlow: number; // 0-100
    argumentation: number; // 0-100
    consistency: number; // 0-100
  };
}

class AIWritingEvaluator {
  private evaluationHistory: Map<string, WritingEvaluation[]> = new Map();
  private writingMetrics: Map<string, WritingMetrics> = new Map();

  constructor() {
    this.initializeEvaluationCriteria();
  }

  // Initialize evaluation criteria
  private initializeEvaluationCriteria(): void {
    // This would load from ML models or configuration
    // For now, using rule-based approach
  }

  // Evaluate text
  evaluateText(text: string, userId: string, context?: any): WritingEvaluation {
    const analysis = this.analyzeText(text);
    const metrics = this.calculateMetrics(text);
    const feedback = this.generateFeedback(analysis, metrics);
    
    const evaluation: WritingEvaluation = {
      id: `eval-${userId}-${Date.now()}`,
      userId,
      text,
      timestamp: new Date(),
      analysis: {
        overallScore: analysis.overallScore,
        coherence: analysis.coherence,
        grammar: analysis.grammar,
        vocabulary: analysis.vocabulary,
        structure: analysis.structure,
        style: analysis.style,
        clarity: analysis.clarity,
        creativity: analysis.creativity,
        taskCompletion: analysis.taskCompletion,
        length: text.split(/\s+/).length,
        complexity: analysis.complexity,
        audience: analysis.audience,
        purpose: analysis.purpose
      },
      feedback: {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        score: this.calculateFeedbackScore(analysis),
        comment: analysis.generalFeedback,
        examples: analysis.goodExamples
      },
      metadata: {
        wordCount: metrics.wordCount,
        sentenceCount: metrics.sentenceCount,
        paragraphCount: metrics.paragraphCount,
        avgWordLength: metrics.avgWordLength,
        avgSentenceLength: metrics.avgSentenceLength,
        timeSpent: Date.now() - new Date().getTime(), // Placeholder
        language: analysis.language,
        genre: analysis.genre
      }
    };

    // Store evaluation
    if (!this.evaluationHistory.has(userId)) {
      this.evaluationHistory.set(userId, []);
    }
    this.evaluationHistory.get(userId)!.push(evaluation);

    return evaluation;
  }

  // Analyze text
  private analyzeText(text: string): any {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    const paragraphs = text.split(/\n\n+/);
    
    return {
      overallScore: 0, // Will be calculated
      coherence: this.analyzeCoherence(text),
      grammar: this.analyzeGrammar(text),
      vocabulary: this.analyzeVocabulary(text),
      structure: this.analyzeStructure(text),
      style: this.analyzeStyle(text),
      clarity: this.analyzeClarity(text),
      creativity: this.analyzeCreativity(text),
      taskCompletion: 0, // Will be calculated
      length: words.length,
      complexity: this.assessComplexity(text),
      audience: this.assessAudience(text),
      purpose: this.assessPurpose(text),
      strengths: [],
      weaknesses: [],
      suggestions: [],
      generalFeedback: ''
    };
  }

  // Analyze coherence
  private analyzeCoherence(text: string): number {
    let coherenceScore = 80; // Start with good score
    
    // Check for logical flow
    const sentences = text.split(/[.!?]+/);
    let logicalIssues = 0;
    
    for (let i = 1; i < sentences.length - 1; i++) {
      const currentSentence = sentences[i];
      const nextSentence = sentences[i + 1];
      
      // Check for logical connections
      if (this.hasLogicalBreak(currentSentence, nextSentence)) {
        logicalIssues++;
      }
    }
    
    coherenceScore -= logicalIssues * 5;
    
    // Check for consistency
    coherenceScore -= this.checkConsistency(text) * 3;
    
    return Math.max(0, coherenceScore);
  }

  // Check for logical breaks
  private hasLogicalBreak(sentence1: string, sentence2: string): boolean {
    // Simple check for logical flow
    const connectors = ['however', 'therefore', 'consequently', 'moreover', 'furthermore', 'in addition', 'on the other hand'];
    
    const hasConnector1 = connectors.some(connector => sentence1.toLowerCase().includes(connector));
    const hasConnector2 = connectors.some(connector => sentence2.toLowerCase().includes(connector));
    
    return hasConnector1 && !hasConnector2;
  }

  // Check consistency
  private checkConsistency(text: string): number {
    let consistencyScore = 100;
    
    // Check tense consistency
    const tenses = this.extractTenses(text);
    if (tenses.length > 2) {
      consistencyScore -= 10;
    }
    
    // Check pronoun consistency
    const pronouns = this.extractPronouns(text);
    const uniquePronouns = [...new Set(pronouns)];
    if (uniquePronouns.length > 5) {
      consistencyScore -= 5;
    }
    
    return consistencyScore;
  }

  // Extract tenses
  private extractTenses(text: string): string[] {
    const tenses = [];
    
    // Simple tense detection
    if (text.includes(' is ')) tenses.push('present');
    if (text.includes(' was ')) tenses.push('past');
    if (text.includes(' will ')) tenses.push('future');
    if (text.includes(' have ')) tenses.push('present-perfect');
    
    return tenses;
  }

  // Extract pronouns
  private extractPronouns(text: string): string[] {
    const pronouns = text.match(/\b(he|she|it|we|they|you|your|my|our|us|his|her|its|their)\b/gi) || [];
    return pronouns ? pronouns.map(p => p.toLowerCase()) : [];
  }

  // Analyze grammar
  private analyzeGrammar(text: string): number {
    let grammarScore = 80;
    
    // Check for common errors
    const errors = [
      { pattern: /\b(no|not|never|nothing|none)\s+\w+out\b/gi, severity: 'error' },
      { pattern: /\b(a|an|the)\s+\s\b/gi, severity: 'error' },
      { pattern: /\b(is|are|was|were)\s+\w+ing\b/gi, severity: 'error' },
      { pattern: /\b(he|she|it)\s+\w+en\b/gi, severity: 'error' },
      { pattern: /\b(there|their|our)\s+\w+ing\b/gi, severity: 'error' }
    ];
    
    errors.forEach(error => {
      if (error.pattern.test(text)) {
        grammarScore -= 5;
      }
    });
    
    return Math.max(0, grammarScore);
  }

  // Analyze vocabulary
  private analyzeVocabulary(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = [...new Set(words)];
    
    let vocabularyScore = 50; // Base score
    
    // Bonus for word variety
    if (uniqueWords.length > 50) vocabularyScore += 10;
    if (uniqueWords.length > 100) vocabularyScore += 20;
    
    // Bonus for academic vocabulary
    const academicWords = words.filter(word => 
      ['analyze', 'hypothesize', 'synthesize', 'comprehensive', 'methodology', 'theoretical', 'empirical', 'quantitative', 'qualitative'].includes(word)
    );
    if (academicWords.length > 5) vocabularyScore += 15;
    
    // Bonus for appropriate vocabulary
    const appropriateWords = words.filter(word => 
      ['use', 'learn', 'study', 'practice', 'improve', 'master', 'develop', 'enhance', 'acquire', 'obtain', 'gain', 'achieve'].includes(word)
    );
    if (appropriateWords.length > words.length * 0.7) vocabularyScore += 10;
    
    return Math.min(100, vocabularyScore);
  }

  // Analyze structure
  private analyzeStructure(text: string): number {
    let structureScore = 70;
    
    // Check for sentence variety
    const sentences = text.split(/[.!?]+/);
    const avgLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    
    if (avgLength < 8) structureScore -= 10;
    if (avgLength > 25) structureScore -= 10;
    
    // Check for paragraph structure
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length > 1) structureScore += 5;
    
    return Math.max(0, structureScore);
  }

  // Analyze style
  private analyzeStyle(text: string): number {
    let styleScore = 70;
    
    // Check for sentence variety
    const sentences = text.split(/[.!?]+/);
    const sentenceStarts = sentences.map(s => s.trim().substring(0, 20));
    
    const hasVariety = sentenceStarts.some((start, index) => {
      if (index > 0) {
        return start !== sentenceStarts[index - 1];
      }
      return false;
    });
    
    if (hasVariety) styleScore += 10;
    
    // Check for transition words
    const transitions = ['however', 'therefore', 'consequently', 'moreover', 'furthermore', 'in addition', 'on the other hand'];
    const transitionCount = transitions.filter(transition => text.toLowerCase().includes(transition)).length;
    
    if (transitionCount > 5) styleScore += 5;
    if (transitionCount > 10) styleScore += 5;
    
    // Check for active voice
    const activeVoice = text.toLowerCase().includes('i think') || text.toLowerCase().includes('we believe');
    if (activeVoice) styleScore += 5;
    
    return Math.max(0, styleScore);
  }

  // Analyze clarity
  private analyzeClarity(text: string): number {
    let clarityScore = 70;
    
    // Check for ambiguity
    const ambiguousWords = ['maybe', 'perhaps', 'might', 'could', 'seem', 'often', 'sometimes', 'usually', 'generally'];
    const wordCount = text.split(/\s+/).length;
    const ambiguousCount = ambiguousWords.filter(word => text.toLowerCase().includes(word)).length;
    
    if (ambiguousCount > wordCount * 0.1) clarityScore -= 15;
    
    // Check for passive voice
    const passiveVoice = text.toLowerCase().includes('is ') || text.toLowerCase().includes('was ') || text.toLowerCase().includes('are ') || text.toLowerCase().includes('were ') || text.toLowerCase().includes('been ') || text.toLowerCase().includes('be ') || text.toLowerCase().includes('being '));
    if (passiveVoice) clarityScore -= 10;
    
    // Check for complex sentences
    const avgSentenceLength = text.split(/[.!?]+/).reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    if (avgSentenceLength > 30) clarityScore -= 10;
    
    return Math.max(0, clarityScore);
  }

  // Analyze creativity
  private analyzeCreativity(text: string): number {
    let creativityScore = 50;
    
    // Check for unique vocabulary
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = [...new Set(words)];
    
    if (uniqueWords.length > 50) creativityScore += 15;
    
    // Check for figurative language
    const figurativeWords = ['metaphor', 'simile', 'analogy', 'personification', 'symbolism'];
    const figurativeCount = words.filter(word => figurativeWords.some(figWord => word.includes(figWord))).length;
    
    if (figurativeCount > words.length * 0.1) creativityScore += 10;
    
    // Check for original ideas
    const originalWords = words.filter(word => !['common', 'basic', 'simple', 'everyday'].includes(word)).length;
    if (originalWords.length > words.length * 0.2) creativityScore += 10;
    
    return Math.max(0, creativityScore);
  }

  // Assess complexity
  private assessComplexity(text: string): 'simple' | 'moderate' | 'complex' {
    const words = text.split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentences = text.split(/[.!?]+/);
    const avgSentenceLength = sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length;
    
    let complexity = 'simple';
    
    if (avgWordLength > 15 || avgSentenceLength > 25) complexity = 'moderate';
    if (avgWordLength > 25 || avgSentenceLength > 35) complexity = 'complex';
    
    return complexity;
  }

  // Assess audience
  private assessAudience(text: string): 'beginner' | 'intermediate' | 'advanced' {
    const words = text.toLowerCase().split(/\s+/);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    if (avgWordLength < 8) return 'beginner';
    if (avgWordLength < 12) return 'beginner';
    if (avgWordLength < 16) return 'beginner';
    if (avgWordLength < 20) return 'intermediate';
    return 'advanced';
  }

  // Assess purpose
  private assessPurpose(text: string): string {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('question')) return 'inquiry';
    if (textLower.includes('explain') || textLower.includes('describe') || textLower.includes('define')) return 'explanatory';
    if (textLower.includes('persuade') || textLower.includes('convince') || textLower.includes('argue')) return 'persuasive';
    if (textLower.includes('narrate') || textLower.includes('story')) return 'narrative';
    if (textLower.includes('inform') || textLower.includes('report')) return 'informative';
    if (textLower.includes('instruct') || textLower.includes('direction')) return 'instructional';
    
    return 'general';
  }

  // Calculate metrics
  private calculateMetrics(text: string): WritingMetrics {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    const paragraphs = text.split(/\n\n+/);
    
    return {
      readability: {
        fleschKincaid: this.calculateFleschKincaid(text),
        gunningFog: this.calculateGunningFog(text),
        colemanLiau: this.calculateColemanLiau(text),
        automatedReadability: this.calculateAutomatedReadability(text)
      },
      coherence: {
        logicalFlow: 0, // Would be calculated
        argumentation: 0,
        consistency: 0
      },
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
      avgSentenceLength: sentences.reduce((sum, sentence) => sum + sentence.length, 0) / sentences.length
    };
  };

  // Calculate readability scores
  private calculateFleschKincaid(text: string): number {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/);
    let totalWords = 0;
    let totalSyllables = 0;
    let totalSentences = 0;
    
    words.forEach(word => {
      totalWords++;
      totalSyllables += this.countSyllables(word);
    });
    
    sentences.forEach(() => totalSentences++);
    
    const avgWordsPerSentence = totalWords / totalSentences;
    const avgSyllablesPerWord = totalSyllables / totalWords;
    
    // Flesch-Kincaid formula: 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    let score = Math.max(0, Math.round(206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)));
    
    // Adjust for sentence length
    const avgSentenceLength = totalSentences > 0 ? totalWords / totalSentences : 0;
    if (avgSentenceLength > 15) score -= 5;
    if (avgSentenceLength > 20) score -= 10;
    if (avgSentenceLength > 25) score -= 15;
    
    return Math.min(100, score);
  }

  // Calculate Gunning Fog
  private calculateGunningFog(text: string): number {
    const sentences = text.split(/[.!?]+/);
    let complexWords = 0;
    let totalWords = 0;
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      words.forEach(word => {
        totalWords++;
        if (word.length > 6) complexWords++;
      });
    });
    
    const percentageComplex = (complexWords / totalWords) * 100;
    
    // Gunning Fog formula: 0.4 * (percentageComplex) + 5);
    let score = 100 - Math.round(0.4 * (percentageComplex + 5));
    
    return Math.max(0, score);
  }

  // Calculate Coleman-Liau Index
  private calculateColemanLiau(text: string): number {
    const words = text.split(/\s+/);
    let totalWords = 0;
    let totalCharacters = 0;
    
    words.forEach(word => {
      totalWords++;
      totalCharacters += word.length;
    });
    
    const avgWordLength = totalCharacters / totalWords;
    
    // Coleman-Liau formula: (5.89 * avgWordLength) - (29.5 * (avgWordLength / avgWordLength)) - (15.8 * (totalCharacters / totalWords));
    let score = Math.round(5.89 * avgWordLength - (29.5 * (totalCharacters / totalWords)));
    
    if (avgWordLength > 14) score -= 5;
    if (avgWordLength > 21) score -= 10;
    
    return Math.max(0, score);
  }

  // Calculate automated readability
  private calculateAutomatedReadability(text: string): number {
    // Simplified automated readability score
    const sentences = text.split(/[.!?]+/);
    let totalWords = 0;
    let totalCharacters = 0;
    let complexWords = 0;
    
    sentences.forEach(sentence => {
      const words = sentence.split(/\s+/);
      totalWords++;
      totalCharacters += sentence.length;
      words.forEach(word => {
        if (word.length > 6) complexWords++;
      });
    });
    
    const avgWordLength = totalCharacters / totalWords;
    const percentageComplex = (complexWords / totalWords) * 100;
    
    // Simplified formula: 100 - (percentageComplex * 50) - (avgWordLength * 30);
    let score = 100 - Math.round(percentageComplex * 50) - (avgWordLength * 30));
    
    return Math.max(0, score);
  }

  // Count syllables
  private countSyllables(word: string): number {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    let syllableCount = 0;
    let inVowel = false;
    
    for (const char of word.toLowerCase()) {
      if (vowels.includes(char)) {
        if (inVowel) {
          syllableCount++;
        } else {
          inVowel = true;
        }
      } else {
        syllableCount++;
      }
    }
    
    return syllableCount;
  }

  // Generate feedback
  private generateFeedback(analysis: any, metrics: WritingMetrics): WritingEvaluation['feedback'] {
    const feedback = {
      strengths: [],
      weaknesses: [],
      suggestions: [],
      score: this.calculateFeedbackScore(analysis),
      comment: '',
      examples: []
    };
    
    // Generate strengths based on analysis
    if (analysis.grammar > 85) {
      feedback.strengths.push('Strong grammar with minimal errors');
    }
    
    if (analysis.vocabulary > 80) {
      feedback.strengths.push('Rich and varied vocabulary');
    }
    
    if (analysis.structure > 80) {
      feedback.strengths.push('Well-structured sentences');
    }
    
    if (analysis.style > 80) {
      feedback.strengths.push('Clear and engaging writing style');
    }
    
    if (analysis.clarity > 85) {
      feedback.strengths.push('Clear and easy to understand');
    }
    
    // Generate weaknesses based on analysis
    if (analysis.grammar < 60) {
      feedback.weaknesses.push('Grammar needs improvement');
      feedback.suggestions.push({
        id: 'suggestion-grammar-1',
        type: 'grammar',
        text: 'Review basic grammar rules',
        confidence: 75,
        priority: 'high',
        reason: 'Grammar errors detected',
        examples: ['Incorrect: "He go to school" -> "He goes to school"']
      });
    }
    
    if (analysis.vocabulary < 60) {
      feedback.weaknesses.push('Limited vocabulary range');
      feedback.suggestions.push({
        id: 'suggestion-vocabulary-1',
        type: 'vocabulary',
        text: 'Use more descriptive words',
        confidence: 70,
        priority: 'high',
        reason: 'Vocabulary could be expanded',
        examples: ['Try: "The weather is beautiful" instead of "The weather is nice"']
      });
    }
    
    if (analysis.structure < 60) {
      feedback.weaknesses.push('Sentence structure issues');
      feedback.suggestions.push({
        id: 'suggestion-structure-1',
        type: 'structure',
        text: 'Vary sentence length and structure',
        confidence: 70,
        priority: 'medium',
        reason: 'Repetitive sentence patterns',
        examples: ['Mix short and long sentences']
      });
    }
    
    // Generate suggestions
    if (analysis.complexity === 'complex') {
      feedback.suggestions.push({
        id: 'suggestion-complexity-1',
        type: 'task-completion',
        text: 'Break down complex ideas into simpler parts',
        confidence: 80,
        priority: 'medium',
        reason: 'Complex text may be hard to follow'
      });
    }
    
    return feedback;
  }

  // Calculate feedback score
  private calculateFeedbackScore(analysis: any): number {
    let score = 50; // Base score
    
    if (analysis.overallScore > 80) score += 20;
    if (analysis.overallScore > 90) score += 30;
    if (analysis.overallScore > 95) score += 40;
    
    return Math.min(100, score);
  }

  // Get evaluation history
  getEvaluationHistory(userId: string): WritingEvaluation[] {
    return this.evaluationHistory.get(userId) || [];
  }

  // Get writing metrics
  getWritingMetrics(userId: string): WritingMetrics | undefined {
    return this.writingMetrics.get(userId);
  }

  // Add custom evaluation criteria
  addCustomCriteria(criteria: any): void {
    // This would integrate with AI models
    console.log('Custom evaluation criteria added:', criteria);
  }
}

export default AIWritingEvaluator;
export type { WritingEvaluation, WritingSuggestion, WritingMetrics, WritingAnalytics };
