import { useMemo } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { ArrowBack, CheckCircle, Lock, PlayArrow, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllA1Lessons, type A1Lesson } from '../core/a1Content';
import { useProgress } from '../core/ProgressContext';
import { playClick } from '../core/sounds';
import AnimatedBackground from '../components/AnimatedBackground';

// Motion wrappers
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const LessonsPage = () => {
  const navigate = useNavigate();
  const allLessons = useMemo(() => getAllA1Lessons(), []);
  const { stars } = useProgress();

  const units = useMemo(() => {
    const map = new Map<number, A1Lesson[]>();
    allLessons.forEach(lesson => {
      if (!map.has(lesson.unit)) map.set(lesson.unit, []);
      map.get(lesson.unit)!.push(lesson);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allLessons]);

  const getLessonStatus = (index: number) => {
    if (index < 2) return 'completed';
    if (index === 2) return 'current';
    return 'locked';
  };

  let globalLessonIndex = 0;

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', fontFamily: '"Nunito", sans-serif', pb: 15, overflowX: 'hidden' }}>
      <AnimatedBackground />

      {/* App Bar (Glassmorphism) */}
      <MotionBox
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 2, pt: 3,
          background: 'linear-gradient(135deg, rgba(76,175,80,0.95), rgba(56,142,60,0.95))',
          backdropFilter: 'blur(10px)',
          color: 'white',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
          mb: 6,
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 10px 30px rgba(76,175,80,0.3)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate('/home')} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', width: 44, height: 44, '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: '"Merriweather", serif', letterSpacing: '0.5px' }}>
            Path
          </Typography>
        </Box>
        <Paper sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: 8, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(5px)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>{stars}</Typography>
          <Star sx={{ color: '#FFC107', fontSize: '1.2rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }} />
        </Paper>
      </MotionBox>

      {/* Path Container */}
      <Box sx={{ px: 2, maxWidth: 500, mx: 'auto', position: 'relative' }}>

        {/* SVG Winding Path Background */}
        <Box sx={{ position: 'absolute', top: 50, bottom: 50, left: '50%', transform: 'translateX(-50%)', width: 150, zIndex: 0, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" preserveAspectRatio="none">
            {/* A thick dashed connecting line */}
            <path
              d="M 75 0 C 150 150, 0 300, 75 450 C 150 600, 0 750, 75 900 C 150 1050, 0 1200, 75 1350 C 150 1500, 0 1650, 75 1800"
              fill="none"
              stroke="rgba(200,200,200,0.4)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="0 24"
            />
          </svg>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {units.map(([unitNum, lessons], unitIndex) => (
            <MotionBox
              key={unitNum}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.2, duration: 0.5 }}
              sx={{ mb: 8 }}
            >
              {/* Unit Header */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                <MotionPaper
                  whileHover={{ scale: 1.05 }}
                  sx={{
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    color: 'white', py: 1.5, px: 4,
                    borderRadius: 8,
                    boxShadow: '0 8px 20px rgba(255,152,0,0.4), inset 0 -4px 0 rgba(0,0,0,0.1)',
                    border: '2px solid rgba(255,255,255,0.5)'
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Unit {unitNum}</Typography>
                </MotionPaper>
              </Box>

              {/* Lessons Nodes */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {lessons.map((lesson) => {
                  const status = getLessonStatus(globalLessonIndex++);

                  // Create a sin wave offset
                  const offsetIndex = globalLessonIndex % 4; // 0, 1, 2, 3
                  const xOffsets = [0, 40, 0, -40]; // Center, Right, Center, Left
                  const xOffset = xOffsets[offsetIndex];

                  const isCompleted = status === 'completed';
                  const isCurrent = status === 'current';
                  const isLocked = status === 'locked';

                  // Colors
                  const bgColors = {
                    completed: 'linear-gradient(180deg, #66BB6A, #43A047)',
                    current: 'linear-gradient(180deg, #42A5F5, #1E88E5)',
                    locked: 'linear-gradient(180deg, #E0E0E0, #BDBDBD)'
                  };

                  const borderShadows = {
                    completed: '#2E7D32',
                    current: '#1565C0',
                    locked: '#9E9E9E'
                  };

                  const glowEffect = isCurrent
                    ? '0 0 0 8px rgba(33, 150, 243, 0.2), 0 12px 24px rgba(33, 150, 243, 0.4)'
                    : isCompleted
                      ? '0 8px 16px rgba(76, 175, 80, 0.2)'
                      : '0 4px 8px rgba(0, 0, 0, 0.1)';

                  return (
                    <Box key={lesson.id} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', mb: 2 }}>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring', stiffness: 200, damping: 15,
                          delay: globalLessonIndex * 0.1
                        }}
                        style={{ position: 'relative', left: `${xOffset}px`, zIndex: 10 }}
                      >
                        {/* The Node Button */}
                        <Box
                          onClick={() => {
                            if (!isLocked) {
                              playClick();
                              navigate(`/lesson/${lesson.id}`);
                            }
                          }}
                          sx={{
                            width: 80, height: 80,
                            borderRadius: '50%',
                            background: bgColors[status],
                            color: isLocked ? '#757575' : 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `inset 0 -6px 0 ${borderShadows[status]}, inset 0 6px 0 rgba(255,255,255,0.3), ${glowEffect}`,
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            '&:active': !isLocked && {
                              transform: 'scale(0.95) translateY(4px)',
                              boxShadow: `inset 0 -2px 0 ${borderShadows[status]}, inset 0 6px 0 rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.2)`
                            } || undefined
                          }}
                        >
                          {/* Pulsing ring for current level */}
                          {isCurrent && (
                            <motion.div
                              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              style={{
                                position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
                                borderRadius: '50%', border: '4px solid #2196F3', pointerEvents: 'none'
                              }}
                            />
                          )}

                          {isCompleted && <CheckCircle sx={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }} />}
                          {isCurrent && <PlayArrow sx={{ fontSize: '3rem', ml: 0.5, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }} />}
                          {isLocked && <Lock sx={{ fontSize: '2rem', opacity: 0.7 }} />}

                          {/* Floating Star Element */}
                          {isCompleted && (
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: globalLessonIndex * 0.2 }}
                              style={{ position: 'absolute', top: -10, right: -10 }}
                            >
                              <Box sx={{ bgcolor: '#FFC107', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                                <Star sx={{ color: 'white', fontSize: '1rem' }} />
                              </Box>
                            </motion.div>
                          )}
                        </Box>

                        {/* Title Floating Bubble */}
                        <Box sx={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          mt: 1.5,
                          bgcolor: 'white',
                          px: 2, py: 0.75,
                          borderRadius: 4,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          border: '1px solid rgba(0,0,0,0.04)',
                          minWidth: 120,
                          textAlign: 'center',
                          pointerEvents: 'none',
                          opacity: isLocked ? 0.7 : 1
                        }}>
                          <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: isLocked ? '#9E9E9E' : '#2C3E50', lineHeight: 1.2 }}>
                            {lesson.title}
                          </Typography>
                        </Box>

                      </motion.div>
                    </Box>
                  );
                })}
              </Box>
            </MotionBox>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LessonsPage;
