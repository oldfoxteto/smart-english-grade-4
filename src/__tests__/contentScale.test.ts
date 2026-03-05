import { describe, expect, it } from 'vitest';
import { grammarLessons, quizQuestions, readingStories, vocabularyWords } from '../core/data';

describe('content scale', () => {
  it('provides production-size vocabulary and lessons', () => {
    expect(vocabularyWords.length).toBeGreaterThanOrEqual(500);
    expect(grammarLessons.length).toBeGreaterThanOrEqual(50);
    expect(readingStories.length).toBeGreaterThanOrEqual(50);
  });

  it('ships a large quiz bank', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(300);
  });
});
