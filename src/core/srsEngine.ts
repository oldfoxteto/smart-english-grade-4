import { getAccessToken } from './auth';
import { reviewSrsItem, getDueSrsItems } from './api';

export interface SRSItem {
    id: string;          // e.g. 'vocab-1'
    type: 'vocabulary' | 'grammar';
    level: number;       // Current SRS level (0 = new, 1 = seen, 2+ = reviewing)
    nextReviewAt: string; // ISO string
    easeFactor: number;   // How easy the user found it (default 2.5)
    interval: number;     // Days until next review
    history: boolean[];   // Array of past correctness
}

export interface SRSState {
    items: Record<string, SRSItem>;
    updatedAt: string;
}

const SRS_STORAGE_KEY = 'lisan_srs_state_v1';

function isBrowser() {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function nowIso() {
    return new Date().toISOString();
}

export function getSRSState(): SRSState {
    if (!isBrowser()) return { items: {}, updatedAt: nowIso() };
    try {
        const raw = localStorage.getItem(SRS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to parse SRS state", e);
    }
    return { items: {}, updatedAt: nowIso() };
}

export function saveSRSState(state: SRSState) {
    if (!isBrowser()) return;
    state.updatedAt = nowIso();
    localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(state));
}

/**
 * SuperMemo-2 (SM-2) inspired algorithm for Spaced Repetition
 * Quality: 0-5
 * 5: Perfect response
 * 4: Correct response after hesitation
 * 3: Correct response recalled with serious difficulty
 * 2: Incorrect response; where the correct one seemed easy to recall
 * 1: Incorrect response; the correct one remembered
 * 0: Complete blackout
 */
export async function reviewItem(itemId: string, itemType: 'vocabulary' | 'grammar', isCorrect: boolean, timeTakenSeconds: number) {
    // Try remote first if authenticated
    const token = getAccessToken();
    if (isBrowser() && token) {
        try {
            const remote = await reviewSrsItem({ itemId, itemType, isCorrect, timeTakenSeconds });
            return remote as SRSItem;
        } catch {
            // fall back to local logic
        }
    }

    const state = getSRSState();
    let item = state.items[itemId];

    if (!item) {
        // New item
        item = {
            id: itemId,
            type: itemType,
            level: 0,
            nextReviewAt: nowIso(),
            easeFactor: 2.5,
            interval: 0,
            history: []
        };
    }

    // Calculate quality based on correctness and speed
    let quality = 0;
    if (isCorrect) {
        quality = timeTakenSeconds < 3 ? 5 : timeTakenSeconds < 6 ? 4 : 3;
    } else {
        quality = 2; // Simple miss
    }

    // Update history
    item.history.push(isCorrect);
    if (item.history.length > 10) item.history.shift();

    // SM-2 Logic
    if (quality >= 3) {
        // Correct
        if (item.level === 0) {
            item.interval = 1;
        } else if (item.level === 1) {
            item.interval = 6;
        } else {
            item.interval = Math.round(item.interval * item.easeFactor);
        }
        item.level += 1;
    } else {
        // Incorrect
        item.level = 0;
        item.interval = 1;
    }

    // Update Ease Factor (min 1.3)
    item.easeFactor = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (item.easeFactor < 1.3) item.easeFactor = 1.3;

    // Calculate next review date using day-based SM-2 intervals.
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + item.interval);
    item.nextReviewAt = nextDate.toISOString();

    state.items[itemId] = item;
    saveSRSState(state);

    return item;
}

export async function getDueReviews(): Promise<SRSItem[]> {
    const token = getAccessToken();
    if (isBrowser() && token) {
        try {
            const items = await getDueSrsItems();
            return items as SRSItem[];
        } catch {
            // fallback to local
        }
    }

    const state = getSRSState();
    const now = new Date();

    return Object.values(state.items)
        .filter(item => new Date(item.nextReviewAt) <= now)
        .sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
}

export function getSRSStats() {
    const state = getSRSState();
    const items = Object.values(state.items);
    const now = new Date();

    const due = items.filter(item => new Date(item.nextReviewAt) <= now).length;
    const learning = items.filter(item => item.level < 3).length;
    const mastered = items.filter(item => item.level >= 3).length;

    return { total: items.length, due, learning, mastered };
}
