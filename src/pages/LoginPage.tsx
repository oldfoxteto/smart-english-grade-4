import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import { motion } from 'framer-motion';
import { useProgress } from '../core/ProgressContext';
import { login, register } from '../core/api';
import { isOnboardingCompleted, saveCurrentUser } from '../core/auth';

const MotionBox = motion(Box);

const floatingLights = [
  { left: '8%', delay: 0.1, duration: 5.8 },
  { left: '18%', delay: 0.8, duration: 6.6 },
  { left: '34%', delay: 0.3, duration: 5.2 },
  { left: '52%', delay: 1.1, duration: 6.9 },
  { left: '71%', delay: 0.5, duration: 5.6 },
  { left: '86%', delay: 1.5, duration: 6.2 },
];

function LampIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: 340,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(133,216,206,0.28), rgba(133,216,206,0.02) 55%, transparent 72%)',
          filter: 'blur(8px)',
        }}
      />
      <MotionBox
        animate={{ rotate: [0, -2, 1, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'relative',
          width: 190,
          height: 260,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 14,
            left: '50%',
            width: 8,
            height: 38,
            borderRadius: 4,
            background: 'linear-gradient(180deg, #d7e8ea, #9fb4b8)',
            transform: 'translateX(-50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: '50%',
            width: 132,
            height: 88,
            borderRadius: '28px 28px 18px 18px',
            background: 'linear-gradient(180deg, #a9c392, #7ea167)',
            transform: 'translateX(-50%)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
          }}
        >
          <Box sx={{ position: 'absolute', top: 28, left: 33, width: 16, height: 6, borderBottom: '3px solid #203126', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: 28, right: 33, width: 16, height: 6, borderBottom: '3px solid #203126', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', top: 46, left: '50%', width: 18, height: 14, background: '#ff9c7a', borderRadius: '0 0 12px 12px', transform: 'translateX(-50%)' }} />
          <Box sx={{ position: 'absolute', top: 53, left: '50%', width: 34, height: 10, borderTop: '3px solid #203126', borderRadius: '50%', transform: 'translateX(-50%)' }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: 116,
            left: '50%',
            width: 90,
            height: 120,
            clipPath: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(180deg, rgba(255,247,200,0.9), rgba(255,247,200,0.05))',
            transform: 'translateX(-50%)',
            filter: 'blur(1px)',
            opacity: 0.92,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 120,
            left: '50%',
            width: 14,
            height: 86,
            borderRadius: 10,
            background: 'linear-gradient(180deg, #f8fbfc, #c7d3d8)',
            transform: 'translateX(-50%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            width: 86,
            height: 18,
            borderRadius: 18,
            background: 'linear-gradient(180deg, #f9fbfc, #d0d8dd)',
            transform: 'translateX(-50%)',
            boxShadow: '0 10px 16px rgba(0,0,0,0.12)',
          }}
        />
      </MotionBox>
    </Box>
  );
}

const LoginPage = () => {
  const { setUsername } = useProgress();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const payload = {
        email: normalizedEmail,
        password,
        displayName: displayName.trim(),
        country: 'SA',
      };

      const response = mode === 'register' ? await register(payload) : await login(payload);
      saveCurrentUser(response.user);
      setUsername(response.user.displayName || displayName || 'Student');
      const target = isOnboardingCompleted() ? '/home' : '/onboarding';
      window.location.replace(target);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not complete authentication.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #071722 0%, #0B2433 48%, #12394B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 4, md: 6 },
      }}
    >
      {floatingLights.map((light) => (
        <Box
          key={light.left}
          sx={{
            position: 'absolute',
            top: 0,
            left: light.left,
            width: 1,
            height: { xs: 120, md: 180 },
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.02))',
            opacity: 0.42,
          }}
        >
          <MotionBox
            animate={{ y: [0, 10, 0], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: light.duration, delay: light.delay, repeat: Infinity, ease: 'easeInOut' }}
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: -6,
              width: 10,
              height: 10,
              borderRadius: '50%',
              transform: 'translateX(-50%)',
              background: '#fff1a7',
              boxShadow: '0 0 18px rgba(255,241,167,0.9)',
            }}
          />
        </Box>
      ))}

      <MotionBox
        animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.32, 0.22] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          top: -120,
          right: -120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(133,216,206,0.34), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1080,
          overflow: 'hidden',
          borderRadius: { xs: 4, md: 6 },
          background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.34)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #f4fbfc 0%, #e8f4f6 100%)',
              px: { xs: 2.5, md: 4.5 },
              py: { xs: 3, md: 4 },
              borderBottom: { xs: '1px solid rgba(12,127,160,0.08)', md: 'none' },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '2rem', md: '3.3rem' },
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: '#0B2433',
                  mb: 1.2,
                }}
              >
                Bright Login
              </Typography>
              <Typography
                sx={{
                  color: '#46616C',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  maxWidth: 420,
                }}
              >
                A cleaner sign-in experience for LISAN with playful motion and a strong mobile-first presentation.
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <LampIllustration />
            </Box>

            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap' }}>
              <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, bgcolor: 'rgba(11,75,136,0.08)', color: '#0B4B88', fontWeight: 700, fontSize: '0.85rem' }}>Smart onboarding</Box>
              <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, bgcolor: 'rgba(46,125,50,0.08)', color: '#2E7D32', fontWeight: 700, fontSize: '0.85rem' }}>Arabic friendly</Box>
              <Box sx={{ px: 1.5, py: 0.8, borderRadius: 999, bgcolor: 'rgba(12,127,160,0.08)', color: '#0C7FA0', fontWeight: 700, fontSize: '0.85rem' }}>Fast access</Box>
            </Stack>
          </Box>

          <Box
            sx={{
              position: 'relative',
              px: { xs: 2.5, sm: 4, md: 5 },
              py: { xs: 3, md: 5 },
              background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
            }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#0B2433',
                  mb: 0.75,
                  fontSize: { xs: '1.7rem', md: '2.15rem' },
                }}
              >
                {mode === 'register' ? 'Create account' : 'Welcome back'}
              </Typography>
              <Typography sx={{ color: '#5F7380', mb: 3 }}>
                {mode === 'register'
                  ? 'Start your learning path in a few seconds.'
                  : 'Sign in to continue your lessons and AI practice.'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Button
                  type="button"
                  variant={mode === 'login' ? 'contained' : 'outlined'}
                  onClick={() => setMode('login')}
                  sx={{ borderRadius: 999, px: 2.2, fontWeight: 800 }}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant={mode === 'register' ? 'contained' : 'outlined'}
                  onClick={() => setMode('register')}
                  sx={{ borderRadius: 999, px: 2.2, fontWeight: 800 }}
                >
                  Sign up
                </Button>
              </Stack>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <TextField
                    fullWidth
                    label="Display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    InputProps={{
                      startAdornment: <PersonOutlineRoundedIcon sx={{ mr: 1, color: '#7A8E99' }} />,
                    }}
                  />
                )}
                <TextField
                  fullWidth
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                  InputProps={{
                    startAdornment: <AlternateEmailRoundedIcon sx={{ mr: 1, color: '#7A8E99' }} />,
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 1 }}
                  helperText="Use at least 8 characters."
                  required
                  InputProps={{
                    startAdornment: <LockOpenRoundedIcon sx={{ mr: 1, color: '#7A8E99' }} />,
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 900,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #0C7FA0 100%)',
                    boxShadow: '0 18px 30px rgba(12,127,160,0.22)',
                  }}
                >
                  {loading ? 'Processing...' : mode === 'register' ? 'Create account' : 'Sign in'}
                </Button>

                <Typography
                  sx={{
                    mt: 2.5,
                    textAlign: 'center',
                    color: '#647986',
                    fontSize: '0.92rem',
                  }}
                >
                  {mode === 'register'
                    ? 'Already have an account? Switch to sign in.'
                    : 'Need a new account? Switch to sign up.'}
                </Typography>
              </Box>
            </MotionBox>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
