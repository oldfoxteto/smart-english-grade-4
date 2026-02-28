import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CheckCircle, Lock, PlayArrow } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllA1Lessons, type A1Lesson } from '../core/a1Content';
import {
  getMasteryState,
  getMasteryThreshold,
  getNextRecommendedLesson,
  getUnitRoadmap,
  getUnlockedLessonIds,
  subscribeToMasteryUpdates,
} from '../core/masteryEngine';

const LessonsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [masteryRevision, setMasteryRevision] = useState(0);

  const allLessons = useMemo(() => getAllA1Lessons(), []);
  const masteryState = useMemo(
    () => getMasteryState(),
    // State comes from localStorage + mastery update event.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [masteryRevision]
  );
  const unlockedIds = useMemo(
    () => new Set(getUnlockedLessonIds(allLessons, masteryState)),
    [allLessons, masteryState]
  );
  const threshold = getMasteryThreshold();
  const roadmap = useMemo(() => getUnitRoadmap(allLessons, masteryState), [allLessons, masteryState]);
  const nextLesson = useMemo(() => getNextRecommendedLesson(allLessons, masteryState), [allLessons, masteryState]);

  useEffect(() => {
    const unsubscribe = subscribeToMasteryUpdates(() => {
      setMasteryRevision((value) => value + 1);
    });
    return unsubscribe;
  }, []);

  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const textMatches =
        !searchQuery ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatches = categoryFilter === 'all' || lesson.category === categoryFilter;
      const unitMatches = unitFilter === 'all' || String(lesson.unit) === unitFilter;
      return textMatches && categoryMatches && unitMatches;
    });
  }, [allLessons, categoryFilter, searchQuery, unitFilter]);

  const masteredCount = allLessons.filter((lesson) => (masteryState.lessonMastery[lesson.id] || 0) >= threshold).length;
  const unlockedCount = allLessons.filter((lesson) => unlockedIds.has(lesson.id)).length;

  const getLockReason = (lesson: A1Lesson) => {
    const index = allLessons.findIndex((item) => item.id === lesson.id);
    if (index <= 0) return 'Unlocked';
    const previous = allLessons[index - 1];
    const previousMastery = masteryState.lessonMastery[previous.id] || 0;
    if (previousMastery < threshold) {
      return `Complete "${previous.titleAr}" to ${threshold}% mastery`;
    }
    return 'Unlocked';
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0B4B88 0%, #0C7FA0 60%, #7BC8A4 100%)',
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 3 },
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 900, mb: 1 }}>
          Smart Lesson Map
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          Lessons unlock progressively based on real mastery.
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {nextLesson && (
          <Alert
            severity="info"
            sx={{ mb: 2.5 }}
            action={
              <Button variant="outlined" size="small" onClick={() => navigate(`/lesson/${nextLesson.id}`)}>
                Continue
              </Button>
            }
          >
            Next recommended lesson: <strong>{nextLesson.titleAr}</strong>
          </Alert>
        )}

        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Total lessons</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{allLessons.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Unlocked</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{unlockedCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Mastered ({threshold}%+)</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{masteredCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 2.5 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.25 }}>
              Unit Progress
            </Typography>
            <Grid container spacing={1.25}>
              {roadmap.map((entry) => {
                const unlockedPct = Math.round((entry.unlocked / Math.max(1, entry.total)) * 100);
                const masteryPct = Math.round((entry.mastered / Math.max(1, entry.total)) * 100);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={entry.unit}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
                          Unit {entry.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unlocked {entry.unlocked}/{entry.total}
                        </Typography>
                        <LinearProgress variant="determinate" value={unlockedPct} sx={{ mt: 0.75, mb: 1, height: 7, borderRadius: 4 }} />
                        <Typography variant="caption" color="text.secondary">
                          Mastered {entry.mastered}/{entry.total}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={masteryPct}
                          sx={{
                            mt: 0.75,
                            height: 7,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': { background: '#2E7D32' },
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2.5 }}>
          <CardContent>
            <Stack spacing={1.25}>
              <TextField
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search lesson by title..."
                fullWidth
              />
              <Grid container spacing={1.25}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={categoryFilter} label="Category" onChange={(event) => setCategoryFilter(event.target.value)}>
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="vocabulary">Vocabulary</MenuItem>
                      <MenuItem value="grammar">Grammar</MenuItem>
                      <MenuItem value="reading">Reading</MenuItem>
                      <MenuItem value="listening">Listening</MenuItem>
                      <MenuItem value="speaking">Speaking</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select value={unitFilter} label="Unit" onChange={(event) => setUnitFilter(event.target.value)}>
                      <MenuItem value="all">All Units</MenuItem>
                      {[...new Set(allLessons.map((lesson) => lesson.unit))]
                        .sort((a, b) => a - b)
                        .map((unit) => (
                          <MenuItem key={unit} value={String(unit)}>
                            Unit {unit}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={1.5}>
          {filteredLessons.map((lesson) => {
            const masteryScore = masteryState.lessonMastery[lesson.id] || 0;
            const unlocked = unlockedIds.has(lesson.id);
            const mastered = masteryScore >= threshold;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson.id}>
                <Card
                  sx={{
                    height: '100%',
                    opacity: unlocked ? 1 : 0.74,
                    border: mastered ? '2px solid #2E7D32' : '1px solid #E5EAF2',
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.25}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={`Unit ${lesson.unit}`} size="small" />
                        <Chip
                          size="small"
                          color={unlocked ? (mastered ? 'success' : 'primary') : 'default'}
                          icon={unlocked ? <CheckCircle /> : <Lock />}
                          label={unlocked ? (mastered ? 'Mastered' : 'Unlocked') : 'Locked'}
                        />
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{lesson.titleAr}</Typography>
                      <Typography variant="body2" color="text.secondary">{lesson.description}</Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip label={lesson.category} size="small" />
                        <Chip label={lesson.level} size="small" />
                        <Chip label={`${lesson.duration} min`} size="small" />
                      </Stack>

                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Lesson mastery</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {masteryScore}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={masteryScore}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background:
                                masteryScore >= threshold
                                  ? 'linear-gradient(90deg, #2E7D32, #66BB6A)'
                                  : 'linear-gradient(90deg, #EF6C00, #FFA726)',
                            },
                          }}
                        />
                      </Box>

                      {!unlocked && (
                        <Typography variant="caption" color="error">
                          {getLockReason(lesson)}
                        </Typography>
                      )}

                      <Button
                        variant={unlocked ? 'contained' : 'outlined'}
                        color={unlocked ? 'primary' : 'inherit'}
                        startIcon={unlocked ? <PlayArrow /> : <Lock />}
                        disabled={!unlocked}
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                      >
                        {unlocked ? 'Start Lesson' : 'Locked'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default LessonsPage;

