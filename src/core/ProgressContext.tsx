import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNotification } from './NotificationContext';
import { useMissions } from './MissionContext';

interface Progress {
    vocabularyCompleted: number[];
    grammarCompleted: number[];
    storiesCompleted: number[];
    quizScores: { date: string; score: number; total: number }[];
    stars: number;
    level: number;
    username: string;
}

interface ProgressContextType {
    progress: Progress;
    markVocabularyDone: (id: number) => void;
    markGrammarDone: (id: number) => void;
    markStoryDone: (id: number) => void;
    addQuizScore: (score: number, total: number) => void;
    addStars: (count: number) => void;
    setUsername: (name: string) => void;
    resetProgress: () => void;
}

const defaultProgress: Progress = {
    vocabularyCompleted: [],
    grammarCompleted: [],
    storiesCompleted: [],
    quizScores: [],
    stars: 0,
    level: 1,
    username: 'Student',
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const { notify } = useNotification();
    const { missions, completeMission } = useMissions();
    const [progress, setProgress] = useState<Progress>(() => {
        const saved = localStorage.getItem('smartEnglishProgress');
        return saved ? JSON.parse(saved) : defaultProgress;
    });

    useEffect(() => {
        localStorage.setItem('smartEnglishProgress', JSON.stringify(progress));
    }, [progress]);

    const markVocabularyDone = (id: number) => {
        setProgress(prev => {
            if (prev.vocabularyCompleted.includes(id)) return prev;
            const updated = { ...prev, vocabularyCompleted: [...prev.vocabularyCompleted, id], stars: prev.stars + 2 };
            const next = recalculateLevel(updated);
            notify({ message: '🎉 أحسنت! كلمة جديدة مكتملة (+2 نجوم)', severity: 'success' });
            if (next.level > prev.level) {
              notify({ message: `🏅 تهانينا! وصلت المستوى ${next.level}`, severity: 'info' });
            }
            const vocabCount = updated.vocabularyCompleted.length;
            const m1 = missions.find(m => m.id === 'm1');
            if (m1 && !m1.completed && vocabCount >= 5) {
              completeMission('m1');
              notify({ message: '✅ لقد أكملت مهمة يومية: تعلم 5 كلمات', severity: 'success' });
              addStars(m1.xpReward);
            }
            return next;
        });
    };

    const markGrammarDone = (id: number) => {
        setProgress(prev => {
            if (prev.grammarCompleted.includes(id)) return prev;
            const updated = { ...prev, grammarCompleted: [...prev.grammarCompleted, id], stars: prev.stars + 5 };
            const next = recalculateLevel(updated);
            notify({ message: '🎓 رائع! أنهيت درس قواعد (+5 نجوم)', severity: 'success' });
            if (next.level > prev.level) {
              notify({ message: `🏅 تهانينا! وصلت المستوى ${next.level}`, severity: 'info' });
            }
            const m2 = missions.find(m => m.id === 'm2');
            if (m2 && !m2.completed) {
              completeMission('m2');
              notify({ message: '✅ المهمة اليومية: إنهاء درس قواعد', severity: 'success' });
              addStars(m2.xpReward);
            }
            return next;
        });
    };

    const markStoryDone = (id: number) => {
        setProgress(prev => {
            if (prev.storiesCompleted.includes(id)) return prev;
            const updated = { ...prev, storiesCompleted: [...prev.storiesCompleted, id], stars: prev.stars + 10 };
            return recalculateLevel(updated);
        });
    };

    const addQuizScore = (score: number, total: number) => {
        setProgress(prev => {
            const starsEarned = Math.round((score / total) * 15);
            const updated = {
                ...prev,
                quizScores: [...prev.quizScores, { date: new Date().toLocaleDateString(), score, total }],
                stars: prev.stars + starsEarned,
            };
            return recalculateLevel(updated);
        });
    };

    const addStars = (count: number) => {
        setProgress(prev => recalculateLevel({ ...prev, stars: prev.stars + count }));
    };

    const setUsername = (name: string) => {
        setProgress(prev => ({ ...prev, username: name }));
    };

    const resetProgress = () => {
        setProgress(defaultProgress);
    };

    const recalculateLevel = (p: Progress): Progress => {
        const level = Math.floor(p.stars / 20) + 1;
        return { ...p, level: Math.min(level, 50) };
    };

    return (
        <ProgressContext.Provider value={{
            progress,
            markVocabularyDone,
            markGrammarDone,
            markStoryDone,
            addQuizScore,
            addStars,
            setUsername,
            resetProgress,
        }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => {
    const ctx = useContext(ProgressContext);
    if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
    return ctx;
};
