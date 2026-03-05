import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Avatar, Stack, Chip, Grid } from '@mui/material';
import { Menu, NotificationsNone, ArrowForward, LocalFireDepartment, AutoAwesome, EmojiEvents, ChatBubble, MenuBook, Bolt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../core/ProgressContext';
import { getOnboardingProfile } from '../core/auth';
import { getGamificationStatus } from '../core/api';
import { getAllA1Lessons } from '../core/a1Content';
import { getUnlockedLessonIds, getNextRecommendedLesson } from '../core/masteryEngine';
import { playClick } from '../core/sounds';
import AnimatedBackground from '../components/AnimatedBackground';

// Framer motion wrappers
const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const onboarding = getOnboardingProfile();

  const [, setLoading] = useState(true);
  const [gamification, setGamification] = useState<any>(null);

  const allLessons = getAllA1Lessons();
  const unlockedIds = getUnlockedLessonIds(allLessons);
  const nextLesson = getNextRecommendedLesson(allLessons) || allLessons[0];

  const recommendedLessons = allLessons.filter(l => unlockedIds.includes(l.id)).slice(0, 3);
  if (recommendedLessons.length === 0) recommendedLessons.push(nextLesson);

  useEffect(() => {
    getGamificationStatus()
      .then(g => setGamification(g))
      .catch(() => setGamification(null))
      .finally(() => setLoading(false));
  }, []);

  const totalXp = gamification?.totalXp ?? progress.stars * 10;
  const streak = gamification?.currentStreakDays ?? 1;
  const levelText = onboarding?.proficiency || "A1";

  const dailyProgress = 30; // 30%
  const levelProgress = totalXp % 500;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', fontFamily: '"Nunito", sans-serif', pb: 10 }}>
      <AnimatedBackground />

      {/* App Bar (Glassmorphism) */}
      <MotionBox
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          p: 3, pt: 4,
          background: 'linear-gradient(135deg, rgba(76,175,80,0.95), rgba(56,142,60,0.95))',
          backdropFilter: 'blur(10px)',
          color: 'white',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
          mb: 4,
          boxShadow: '0 10px 30px rgba(76,175,80,0.3)',
          position: 'sticky', top: 0, zIndex: 100
        }}
      >
        <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
          <Menu />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: '"Merriweather", serif', letterSpacing: '0.5px' }}>
          Dashboard
        </Typography>
        <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
          <NotificationsNone />
        </IconButton>
      </MotionBox>

      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="show"
        sx={{ px: 3, maxWidth: 600, mx: 'auto', position: 'relative', zIndex: 1 }}
      >
        {/* Profile Card */}
        <MotionCard variants={itemVariants} sx={{ borderRadius: 5, mb: 3, border: '2px solid rgba(255,255,255,0.8)', background: 'linear-gradient(145deg, #ffffff, #f0f4f8)', boxShadow: '0 12px 40px rgba(0,0,0,0.05)', overflow: 'visible' }}>
          <CardContent sx={{ display: 'flex', gap: 2.5, alignItems: 'center', p: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar sx={{ width: 72, height: 72, background: 'linear-gradient(135deg, #4CAF50, #8BC34A)', fontSize: '2.5rem', fontWeight: 900, boxShadow: '0 8px 16px rgba(76,175,80,0.4)', color: 'white' }}>
                {progress.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: -5, right: -5, bgcolor: '#FFC107', borderRadius: '50%', p: 0.5, border: '3px solid white', display: 'flex' }}>
                <AutoAwesome sx={{ color: 'white', fontSize: '1rem' }} />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1B5E20', letterSpacing: '-0.5px' }}>{progress.username}</Typography>
              <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 800, mb: 1, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>
                Level {levelText} • Beginner
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip icon={<AutoAwesome sx={{ color: '#F57F17 !important' }} />} label={`${totalXp} XP`} size="small" sx={{ bgcolor: '#FFF9C4', color: '#F57F17', fontWeight: 800, borderRadius: 2.5, '& .MuiChip-label': { px: 1 } }} />
                <Chip icon={<LocalFireDepartment sx={{ color: '#E65100 !important' }} />} label={`${streak} Days`} size="small" sx={{ bgcolor: '#FFE0B2', color: '#E65100', fontWeight: 800, borderRadius: 2.5, '& .MuiChip-label': { px: 1 } }} />
              </Stack>
            </Box>
          </CardContent>
        </MotionCard>

        {/* Progress Card */}
        <MotionCard variants={itemVariants} sx={{ borderRadius: 5, mb: 4, bgcolor: 'white', boxShadow: '0 12px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1B5E20' }}>Journey Progress</Typography>
              <Chip label={`${dailyProgress}% Daily`} size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 800, borderRadius: 2 }} />
            </Box>

            <Box sx={{ position: 'relative', height: 16, bgcolor: '#F5F5F5', borderRadius: 8, overflow: 'hidden', mb: 1, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dailyProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  borderRadius: 8,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="caption" sx={{ color: '#9E9E9E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Level XP</Typography>
              <Typography variant="caption" sx={{ color: '#1B5E20', fontWeight: 900 }}>{levelProgress} <span style={{ color: '#9E9E9E', fontWeight: 600 }}>/ 500</span></Typography>
            </Box>
            <Box sx={{ position: 'relative', height: 10, bgcolor: '#F5F5F5', borderRadius: 5, overflow: 'hidden', mt: 0.5, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(levelProgress / 500) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #2196F3, #64B5F6)',
                  borderRadius: 5,
                }}
              />
            </Box>
          </CardContent>
        </MotionCard>

        {/* Quick Actions */}
        <MotionBox variants={itemVariants}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1B5E20', mb: 2, fontFamily: '"Merriweather", serif', px: 1 }}>Explore Actions</Typography>
        </MotionBox>
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {/* Action 1 */}
          <Grid size={{ xs: 6 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card onClick={() => { playClick(); navigate('/ai-tutor'); }} sx={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', color: 'white', borderRadius: 5, cursor: 'pointer', boxShadow: '0 12px 24px rgba(76,175,80,0.3)', border: 'none' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', mb: 1.5 }}>
                    <ChatBubble sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>Chat AI</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          {/* Action 2 */}
          <Grid size={{ xs: 6 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card onClick={() => { playClick(); navigate(`/lesson/${nextLesson.id}`); }} sx={{ background: 'linear-gradient(135deg, #2196F3, #1565C0)', color: 'white', borderRadius: 5, cursor: 'pointer', boxShadow: '0 12px 24px rgba(33,150,243,0.3)', border: 'none' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', mb: 1.5 }}>
                    <MenuBook sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>Start</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          {/* Action 3 */}
          <Grid size={{ xs: 6 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card onClick={() => { playClick(); navigate('/leaderboard'); }} sx={{ background: 'linear-gradient(135deg, #9C27B0, #6A1B9A)', color: 'white', borderRadius: 5, cursor: 'pointer', boxShadow: '0 12px 24px rgba(156,39,176,0.3)', border: 'none' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', mb: 1.5 }}>
                    <EmojiEvents sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>Ranks</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          {/* Action 4 */}
          <Grid size={{ xs: 6 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card onClick={() => { playClick(); navigate('/reading-quest'); }} sx={{ background: 'linear-gradient(135deg, #E91E63, #AD1457)', color: 'white', borderRadius: 5, cursor: 'pointer', boxShadow: '0 12px 24px rgba(233,30,99,0.3)', border: 'none' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', mb: 1.5 }}>
                    <AutoAwesome sx={{ fontSize: '2rem' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.5px' }}>Quests</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Speed Rush Promo */}
        <MotionBox variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card onClick={() => { playClick(); navigate('/speed-rush'); }} sx={{ background: 'linear-gradient(135deg, #FF9800, #F57D00)', color: 'white', borderRadius: 5, mb: 5, cursor: 'pointer', boxShadow: '0 16px 32px rgba(255,152,0,0.4)', overflow: 'hidden', position: 'relative' }}>
              {/* Decorative background circle */}
              <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%' }} />
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{ bgcolor: 'white', color: '#FF9800', width: 64, height: 64, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
                  <Bolt sx={{ fontSize: '2.5rem' }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: '"Merriweather", serif', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Speed Rush</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#FFF8E1', opacity: 0.9 }}>Play a 60-second match game for double XP!</Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </MotionBox>

        {/* Recommended Lessons */}
        <MotionBox variants={itemVariants}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1B5E20', mb: 2, fontFamily: '"Merriweather", serif', px: 1 }}>Next Up</Typography>
        </MotionBox>
        <Stack spacing={2.5} sx={{ mb: 6 }}>
          {recommendedLessons.map((lesson) => (
            <MotionBox key={lesson.id} variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                <Card
                  onClick={() => { playClick(); navigate(`/lesson/${lesson.id}`); }}
                  sx={{
                    borderRadius: 4,
                    cursor: 'pointer',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'stretch',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.02)'
                  }}
                >
                  <Box sx={{ width: 8, background: lesson.category === 'vocabulary' ? 'linear-gradient(180deg, #4CAF50, #8BC34A)' : lesson.category === 'grammar' ? 'linear-gradient(180deg, #2196F3, #64B5F6)' : 'linear-gradient(180deg, #FF9800, #FFB74D)' }} />
                  <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:last-child': { pb: 2.5 } }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2C3E50', mb: 0.5 }}>{lesson.title}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={lesson.category} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', bgcolor: '#F5F5F5', color: '#78909C' }} />
                        <Typography variant="caption" sx={{ color: '#90A4AE', fontWeight: 700 }}>{lesson.duration} min</Typography>
                      </Stack>
                    </Box>
                    <IconButton sx={{ bgcolor: '#F5F5F5', color: '#4CAF50', '&:hover': { bgcolor: '#E8F5E9' } }}>
                      <ArrowForward />
                    </IconButton>
                  </CardContent>
                </Card>
              </motion.div>
            </MotionBox>
          ))}
        </Stack>
      </MotionBox>
    </Box>
  );
};

export default HomePage;
