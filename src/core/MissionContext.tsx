import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Mission {
  id: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

interface MissionContextType {
  missions: Mission[];
  completeMission: (id: string) => void;
  resetMissions: () => void;
}

const defaultMissions: Mission[] = [
  { id: 'm1', description: 'Learn 5 new vocabulary words', xpReward: 10, completed: false },
  { id: 'm2', description: 'Finish a grammar lesson', xpReward: 15, completed: false },
  { id: 'm3', description: 'Use AI Tutor once', xpReward: 12, completed: false }
];

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider = ({ children }: { children: ReactNode }) => {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const lastDate = localStorage.getItem('lisanMissionsDate');
    const today = new Date().toISOString().slice(0, 10);
    if (lastDate !== today) {
      localStorage.setItem('lisanMissionsDate', today);
      return defaultMissions.map(m => ({ ...m, completed: false }));
    }
    const saved = localStorage.getItem('lisanMissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return defaultMissions;
  });

  useEffect(() => {
    localStorage.setItem('lisanMissions', JSON.stringify(missions));
  }, [missions]);

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => (m.id === id ? { ...m, completed: true } : m)));
  };

  const resetMissions = () => {
    setMissions(defaultMissions.map(m => ({ ...m, completed: false })));
    localStorage.setItem('lisanMissionsDate', new Date().toISOString().slice(0, 10));
  };

  return (
    <MissionContext.Provider value={{ missions, completeMission, resetMissions }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMissions = () => {
  const ctx = useContext(MissionContext);
  if (!ctx) {
    throw new Error('useMissions must be used within MissionProvider');
  }
  return ctx;
};
