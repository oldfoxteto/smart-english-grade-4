import { describe, expect, it, beforeEach } from 'vitest';
import { getDueReviews, getSRSState, reviewItem, saveSRSState } from '../core/srsEngine';

describe('srsEngine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates and updates an item using SM-2 intervals', async () => {
    const first = await reviewItem('vocab-1', 'vocabulary', true, 2);
    expect(first.level).toBe(1);
    expect(first.interval).toBe(1);

    const second = await reviewItem('vocab-1', 'vocabulary', true, 2);
    expect(second.level).toBe(2);
    expect(second.interval).toBe(6);
    expect(second.history.length).toBe(2);
  });

  it('returns due reviews sorted by review time', async () => {
    saveSRSState({
      items: {
        late: {
          id: 'late',
          type: 'grammar',
          level: 2,
          nextReviewAt: new Date(Date.now() - 60_000).toISOString(),
          easeFactor: 2.5,
          interval: 1,
          history: [true],
        },
        future: {
          id: 'future',
          type: 'grammar',
          level: 2,
          nextReviewAt: new Date(Date.now() + 60_000).toISOString(),
          easeFactor: 2.5,
          interval: 1,
          history: [true],
        },
      },
      updatedAt: new Date().toISOString(),
    });

    const due = await getDueReviews();
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe('late');
  });

  it('persists state in local storage', () => {
    const state = getSRSState();
    expect(state.updatedAt).toBeTruthy();
    expect(Object.keys(state.items)).toHaveLength(0);
  });
});
