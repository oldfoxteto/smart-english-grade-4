import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip, Zoom } from '@mui/material';
import { ArrowBack, Lock, PlayArrow, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getAllA1Lessons, type A1Lesson } from '../core/a1Content';
import { getLessonPathStatuses, type LessonPathStatus } from '../core/api';
import {
  getMasteryState,
  getMasteryThreshold,
  getUnlockedLessonIds,
  subscribeToMasteryUpdates,
} from '../core/masteryEngine';
import { playClick, playSuccess, playWrong } from '../core/sounds';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const getUnitBackground = (unit: number) => {
  const backgrounds = [
    'linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)',
    'linear-gradient(180deg, #2196F3 0%, #1565C0 100%)',
    'linear-gradient(180deg, #FF9800 0%, #EF6C00 100%)',
    'linear-gradient(180deg, #9C27B0 0%, #6A1B9A 100%)',
    'linear-gradient(180deg, #E91E63 0%, #AD1457 100%)',
  ];
  return backgrounds[(unit - 1) % backgrounds.length];
};

const LessonsPage = () => {
  const navigate = useNavigate();
  const [masteryRevision, setMasteryRevision] = useState(0);
  const [remoteStatusMap, setRemoteStatusMap] = useState<Record<string, LessonPathStatus>>({});
  const [remoteEnabled, setRemoteEnabled] = useState(false);

  const allLessons = useMemo(() => getAllA1Lessons(), []);
  const masteryState = getMasteryState();
  const unlockedIds = useMemo(() => new Set(getUnlockedLessonIds(allLessons, masteryState)), [allLessons, masteryState]);
  const threshold = getMasteryThreshold();

  useEffect(() => {
    const unsubscribe = subscribeToMasteryUpdates(() => {
      setMasteryRevision((value) => value + 1);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    getLessonPathStatuses(allLessons.map((lesson) => lesson.id))
      .then((response) => {
        if (cancelled) return;
        const map: Record<string, LessonPathStatus> = {};
        response.statuses.forEach((status) => {
          map[status.lessonId] = status;
        });
        setRemoteStatusMap(map);
        setRemoteEnabled(response.statuses.length > 0);
      })
      .catch(() => {
        if (cancelled) return;
        setRemoteEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, [allLessons, masteryRevision]);

  const units = useMemo(() => {
    const map = new Map<number, A1Lesson[]>();
    allLessons.forEach((lesson) => {
      if (!map.has(lesson.unit)) map.set(lesson.unit, []);
      map.get(lesson.unit)!.push(lesson);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allLessons]);

  let globalLessonIndex = 0;

  const totalMasteryscore = useMemo(() => {
    if (remoteEnabled) {
      return Object.values(remoteStatusMap).reduce((sum, item) => sum + Number(item.masteryScore || 0), 0);
    }
    return Object.values(masteryState.lessonMastery).reduce((sum, val) => sum + val, 0);
  }, [masteryState, remoteEnabled, remoteStatusMap]);

  const fireConfetti = () => {
    playSuccess();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC107', '#4CAF50', '#2196F3', '#E91E63']
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', fontFamily: '"Nunito", "Tajawal", sans-serif', overflowX: 'hidden', bgcolor: '#81C784' }}>

      <MotionBox
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 2, pt: 3,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(15px)',
          color: 'white',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => { playClick(); navigate('/home'); }} sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white', width: 44, height: 44, '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' } }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            World Map
          </Typography>
        </Box>
        <Paper onClick={fireConfetti} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: 8, background: 'rgba(255,255,255,0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: '#FF9800', border: '2px solid #FFC107' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#F57C00' }}>{Math.floor(totalMasteryscore)}</Typography>
          <Star sx={{ fontSize: '1.4rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))' }} />
        </Paper>
      </MotionBox>

      <Box sx={{ width: '100%', position: 'relative', pb: 15 }}>
        {units.map(([unitNum, lessons]) => {
          const bg = getUnitBackground(unitNum);
          return (
            <Box key={unitNum} sx={{ position: 'relative', width: '100%', background: bg, py: 8, borderBottom: '8px solid rgba(0,0,0,0.1)' }}>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8, position: 'relative', zIndex: 2 }}>
                <MotionPaper
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    color: '#333', py: 2, px: 5,
                    borderRadius: 8,
                    boxShadow: '0 12px 24px rgba(0,0,0,0.2), inset 0 -4px 0 rgba(0,0,0,0.1)',
                    border: '4px solid rgba(255,255,255,0.5)',
                    textAlign: 'center'
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#1B5E20' }}>
                    Unit {unitNum}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#546E7A' }}>
                    {lessons.length} Lessons
                  </Typography>
                </MotionPaper>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', maxWidth: 600, mx: 'auto', zIndex: 2 }}>

                <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 8, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 4, zIndex: 0 }} />

                {lessons.map((lesson, lessonIndex) => {
                  globalLessonIndex++;
                  const remote = remoteStatusMap[lesson.id];
                  const isUnlocked = remoteEnabled ? Boolean(remote?.unlocked) : unlockedIds.has(lesson.id);
                  const masteryScore = remoteEnabled ? Number(remote?.masteryScore || 0) : masteryState.lessonMastery[lesson.id] || 0;
                  const isMastered = remoteEnabled ? Boolean(remote?.mastered) : masteryScore >= threshold;

                  const isCurrent = isUnlocked && !isMastered;

                  const offsets = [0, 60, 0, -60];
                  const xOffset = offsets[lessonIndex % offsets.length];

                  return (
                    <Box key={lesson.id} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', zIndex: 1 }}>
                      <motion.div
                        initial={{ scale: 0, y: 30 }}
                        whileInView={{ scale: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        style={{ position: 'relative', left: `${xOffset}px` }}
                      >
                        <Tooltip TransitionComponent={Zoom} title={isUnlocked ? `${lesson.titleAr} (${masteryScore}%)` : "Locked"} placement="top" arrow>
                          <Box
                            onClick={() => {
                              if (isUnlocked) {
                                playClick();
                                navigate(`/lesson/${lesson.id}`);
                              } else {
                                playWrong();
                              }
                            }}
                            sx={{
                              width: 90, height: 90,
                              borderRadius: '50%',
                              background: isMastered
                                ? 'linear-gradient(180deg, #FFD54F, #FFB300)'
                                : isUnlocked
                                  ? 'linear-gradient(180deg, #64B5F6, #1E88E5)'
                                  : 'linear-gradient(180deg, #E0E0E0, #9E9E9E)',
                              color: isUnlocked ? 'white' : '#757575',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: isMastered
                                ? 'inset 0 -8px 0 #FF8F00, 0 8px 16px rgba(255, 179, 0, 0.4)'
                                : isUnlocked
                                  ? 'inset 0 -8px 0 #1565C0, 0 8px 16px rgba(30, 136, 229, 0.4)'
                                  : 'inset 0 -8px 0 #757575, 0 4px 8px rgba(0,0,0,0.1)',
                              cursor: isUnlocked ? 'pointer' : 'not-allowed',
                              transition: 'transform 0.1s',
                              position: 'relative',
                              '&:active': isUnlocked ? {
                                transform: 'scale(0.9) translateY(4px)',
                                boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2)'
                              } : {}
                            }}
                          >
                            {isCurrent && (
                              <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' } as any}
                                style={{
                                  position: 'absolute', top: -6, left: -6, right: -6, bottom: -6,
                                  borderRadius: '50%', border: '4px solid white', pointerEvents: 'none'
                                }}
                              />
                            )}

                            {isMastered && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                                transition={{ delay: 0.2, type: 'spring' }}
                              >
                                <Star sx={{ fontSize: '3.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', color: 'white' }} />
                              </motion.div>
                            )}

                            {!isMastered && isUnlocked && <PlayArrow sx={{ fontSize: '3.5rem', ml: 0.5, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }} />}
                            {!isUnlocked && <Lock sx={{ fontSize: '2.5rem', opacity: 0.6 }} />}

                            {isUnlocked && !isMastered && masteryScore > 0 && (
                              <Box sx={{ position: 'absolute', top: -6, left: -6, right: -6, bottom: -6, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.2)' }}>
                                <Box sx={{
                                  position: 'absolute', top: -6, left: -6, right: -6, bottom: -6, borderRadius: '50%',
                                  border: '6px solid white',
                                  clipPath: `polygon(50% 50%, 50% 0%, ${masteryScore >= 25 ? '100% 0%,' : ''} ${masteryScore >= 50 ? '100% 100%,' : ''} ${masteryScore >= 75 ? '0% 100%,' : ''} 0% ${100 - masteryScore}%, 50% 50%)`
                                }} />
                              </Box>
                            )}
                          </Box>
                        </Tooltip>

                        <Box sx={{
                          position: 'absolute', top: '50%', left: xOffset >= 0 ? '-140px' : '110px',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(255,255,255,0.95)', px: 2, py: 1, borderRadius: 4,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 120, textAlign: 'center', pointerEvents: 'none'
                        }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: isUnlocked ? '#333' : '#9E9E9E' }}>
                            {lesson.titleAr}
                          </Typography>
                        </Box>

                      </motion.div>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LessonsPage;
