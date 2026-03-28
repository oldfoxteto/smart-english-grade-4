import { Alert, Box, Button, Checkbox, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Eye, EyeOff } from 'lucide-react';
import { authInputSx, socialButtonSx } from './authStyles';

export type SocialProvider = 'google';
export type EmailAction = 'login' | 'register';

type Props = {
  mode: EmailAction;
  googleEnabled: boolean;
  showPassword: boolean;
  rememberMe: boolean;
  displayName: string;
  email: string;
  password: string;
  loading: boolean;
  enableTwoFactor: boolean;
  showTwoFactor: boolean;
  error: string;
  info: string;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onShowPasswordToggle: () => void;
  onEnableTwoFactorChange: (value: boolean) => void;
  onForgotPassword: () => void;
  onEmailAction: (action: EmailAction) => void;
  onSocialSignIn: (provider: SocialProvider) => void;
};

export function AuthLoginForm({
  mode,
  googleEnabled,
  showPassword,
  rememberMe,
  displayName,
  email,
  password,
  loading,
  enableTwoFactor,
  showTwoFactor,
  error,
  info,
  onDisplayNameChange,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onShowPasswordToggle,
  onEnableTwoFactorChange,
  onForgotPassword,
  onEmailAction,
  onSocialSignIn,
}: Props) {
  return (
    <Box dir="ltr">
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 3, bgcolor: 'rgba(254,242,242,0.95)' }}>
          {error}
        </Alert>
      )}
      {info && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 3, bgcolor: 'rgba(239,246,255,0.95)' }}>
          {info}
        </Alert>
      )}

      <Stack spacing={2}>
        {mode === 'register' && (
          <Box>
            <Typography sx={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, mb: 1, textAlign: 'left' }}>
              Name
            </Typography>
            <TextField
              fullWidth
              dir="ltr"
              placeholder="Enter your name"
              value={displayName}
              onChange={(event) => onDisplayNameChange(event.target.value)}
              sx={authInputSx}
              inputProps={{
                dir: 'ltr',
                style: { textAlign: 'left' },
              }}
              InputProps={{}}
            />
          </Box>
        )}

        <Box>
          <Typography sx={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, mb: 1, textAlign: 'left' }}>
            Email
          </Typography>
          <TextField
            fullWidth
            dir="ltr"
            placeholder="Email address"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            sx={authInputSx}
            inputProps={{
              dir: 'ltr',
              style: { textAlign: 'left' },
            }}
          />
        </Box>

        <Box>
          <Typography sx={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, mb: 1, textAlign: 'left' }}>
            Password
          </Typography>
          <TextField
            fullWidth
            dir="ltr"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            sx={authInputSx}
            inputProps={{
              dir: 'ltr',
              style: { textAlign: 'left' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={onShowPasswordToggle}
                    edge="end"
                    sx={{ color: '#94a3b8' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer' }}>
            <Checkbox
              checked={rememberMe}
              onChange={(event) => onRememberMeChange(event.target.checked)}
              sx={{
                color: 'rgba(255,255,255,0.74)',
                p: 0.2,
                '&.Mui-checked': { color: '#3b82f6' },
              }}
            />
            <Typography sx={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
              Remember me
            </Typography>
          </Box>

          <Button
            type="button"
            onClick={onForgotPassword}
            disabled={loading}
            sx={{
              p: 0,
              minWidth: 0,
              color: '#60a5fa',
              fontSize: '0.92rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { color: '#93c5fd', bgcolor: 'transparent' },
            }}
          >
            Forgot Password?
          </Button>
        </Stack>

        {showTwoFactor && (
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer' }}>
            <Checkbox
              checked={enableTwoFactor}
              onChange={(event) => onEnableTwoFactorChange(event.target.checked)}
              sx={{
                color: 'rgba(255,255,255,0.74)',
                p: 0.2,
                '&.Mui-checked': { color: '#3b82f6' },
              }}
            />
            <Typography sx={{ color: '#cbd5e1', fontSize: '0.86rem' }}>
              Enable two-factor authentication
            </Typography>
          </Box>
        )}

        <Box sx={{ pt: 0.5 }}>
          <Button
            fullWidth
            type="button"
            onClick={() => onEmailAction('login')}
            disabled={loading}
            sx={{
              minHeight: 52,
              borderRadius: '14px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              background: '#2563eb',
              boxShadow: '0 16px 28px rgba(30, 64, 175, 0.22)',
              '&:hover': { background: '#1d4ed8' },
            }}
          >
            {loading && mode === 'login' ? 'Logging in...' : 'Login'}
          </Button>

          <Button
            fullWidth
            type="button"
            onClick={() => onEmailAction('register')}
            disabled={loading}
            sx={{
              mt: 1.5,
              minHeight: 52,
              borderRadius: '14px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              background: '#f97316',
              boxShadow: '0 16px 28px rgba(154, 52, 18, 0.22)',
              '&:hover': { background: '#ea580c' },
            }}
          >
            {loading && mode === 'register' ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 1 }}>
          <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            or Continue with
          </Typography>
          <Divider sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
        </Stack>

        {googleEnabled && (
          <Button
            type="button"
            onClick={() => onSocialSignIn('google')}
            disabled={loading}
            sx={{
              ...socialButtonSx,
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.98rem',
              display: 'flex',
              gap: 1.2,
              justifyContent: 'center',
              textTransform: 'none',
              '&:hover': { background: '#f8fafc' },
            }}
          >
            <GoogleIcon sx={{ fontSize: 24, color: '#ea4335' }} />
            Continue with Google
          </Button>
        )}
      </Stack>
    </Box>
  );
}
