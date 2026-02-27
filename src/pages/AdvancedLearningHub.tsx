import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { MenuBook, Chat, Quiz, EmojiEvents, RocketLaunch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppGrid } from '../components/ui';

const modules = [
  {
    title: 'Smart Reading',
    description: 'Adaptive reading activities with instant feedback.',
    icon: <MenuBook color="primary" />,
    route: '/reading',
    cta: 'Open Reading',
  },
  {
    title: 'AI Conversation',
    description: 'Conversation practice with guided prompts.',
    icon: <Chat color="secondary" />,
    route: '/ai-tutor',
    cta: 'Open AI Tutor',
  },
  {
    title: 'Interactive Practice',
    description: 'Focused practice sessions across core skills.',
    icon: <Quiz color="success" />,
    route: '/practice',
    cta: 'Open Practice',
  },
  {
    title: 'Challenges & Rewards',
    description: 'Track progress, challenges, and achievements.',
    icon: <EmojiEvents color="warning" />,
    route: '/testing',
    cta: 'Open Testing',
  },
];

const AdvancedLearningHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Advanced Learning Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Central access to advanced activities and guided learning flows.
        </Typography>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <RocketLaunch color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Quick Start
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start with practice, then move to testing for measurable progress.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => navigate('/practice')}>
              Start Practice
            </Button>
            <Button variant="outlined" onClick={() => navigate('/testing')}>
              View Tests
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <AppGrid spacing={16}>
        {modules.map((module) => (
          <AppGrid key={module.title} xs={12} sm={6}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  {module.icon}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {module.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
                <Button variant="outlined" onClick={() => navigate(module.route)}>
                  {module.cta}
                </Button>
              </CardContent>
            </Card>
          </AppGrid>
        ))}
      </AppGrid>
    </Box>
  );
};

export default AdvancedLearningHub;
