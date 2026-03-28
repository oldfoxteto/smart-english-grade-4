import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Slider, Stack, TextField, Typography } from '@mui/material';

const STORAGE_KEY = 'beefluent-login-overlay-url';
const OPACITY_KEY = 'beefluent-login-overlay-opacity';
const SCALE_KEY = 'beefluent-login-overlay-scale';
const OFFSET_X_KEY = 'beefluent-login-overlay-offset-x';
const OFFSET_Y_KEY = 'beefluent-login-overlay-offset-y';

type Props = {
  enabled: boolean;
};

export function LoginReferenceOverlay({ enabled }: Props) {
  const fileUrlRef = useRef<string | null>(null);
  const fileInputId = useMemo(() => `login-overlay-file-${Math.random().toString(36).slice(2)}`, []);
  const [visible, setVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [opacity, setOpacity] = useState(42);
  const [scale, setScale] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    setImageUrl(window.localStorage.getItem(STORAGE_KEY) || '');
    setOpacity(Number(window.localStorage.getItem(OPACITY_KEY) || 42));
    setScale(Number(window.localStorage.getItem(SCALE_KEY) || 100));
    setOffsetX(Number(window.localStorage.getItem(OFFSET_X_KEY) || 0));
    setOffsetY(Number(window.localStorage.getItem(OFFSET_Y_KEY) || 0));
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, imageUrl);
    window.localStorage.setItem(OPACITY_KEY, String(opacity));
    window.localStorage.setItem(SCALE_KEY, String(scale));
    window.localStorage.setItem(OFFSET_X_KEY, String(offsetX));
    window.localStorage.setItem(OFFSET_Y_KEY, String(offsetY));
  }, [enabled, imageUrl, opacity, scale, offsetX, offsetY]);

  useEffect(() => {
    return () => {
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current);
      }
    };
  }, []);

  if (!enabled) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    fileUrlRef.current = objectUrl;
    setImageUrl(objectUrl);
  };

  const handleReset = () => {
    setImageUrl('');
    setOpacity(42);
    setScale(100);
    setOffsetX(0);
    setOffsetY(0);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(OPACITY_KEY);
      window.localStorage.removeItem(SCALE_KEY);
      window.localStorage.removeItem(OFFSET_X_KEY);
      window.localStorage.removeItem(OFFSET_Y_KEY);
    }

    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current);
      fileUrlRef.current = null;
    }
  };

  return (
    <>
      {visible && imageUrl && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 12,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={imageUrl}
            alt="Login reference overlay"
            sx={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              opacity: opacity / 100,
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale / 100})`,
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.28))',
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 13,
          width: 320,
          maxWidth: 'calc(100vw - 32px)',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.18)',
          bgcolor: 'rgba(15,23,42,0.82)',
          color: '#fff',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
          p: 2,
          direction: 'ltr',
        }}
      >
        <Stack spacing={1.5}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.98rem' }}>
            Login Overlay
          </Typography>

          <Typography sx={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
            Open this mode with `/login?overlay=1`, then upload the screenshot and align the page against it.
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              component="label"
              htmlFor={fileInputId}
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Upload image
            </Button>
            <input
              id={fileInputId}
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              variant="outlined"
              onClick={() => setVisible((current) => !current)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.22)',
              }}
            >
              {visible ? 'Hide' : 'Show'}
            </Button>
          </Stack>

          <TextField
            size="small"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Or paste a direct image URL"
            InputProps={{ sx: { color: '#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.06)',
                borderRadius: 2,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.16)' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#94a3b8',
                opacity: 1,
              },
            }}
          />

          <Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Opacity: {opacity}%
            </Typography>
            <Slider value={opacity} min={10} max={90} onChange={(_, value) => setOpacity(value as number)} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Scale: {scale}%
            </Typography>
            <Slider value={scale} min={70} max={130} onChange={(_, value) => setScale(value as number)} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Horizontal: {offsetX}px
            </Typography>
            <Slider value={offsetX} min={-300} max={300} onChange={(_, value) => setOffsetX(value as number)} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              Vertical: {offsetY}px
            </Typography>
            <Slider value={offsetY} min={-300} max={300} onChange={(_, value) => setOffsetY(value as number)} />
          </Box>

          <Button
            variant="text"
            onClick={handleReset}
            sx={{ textTransform: 'none', color: '#fca5a5', fontWeight: 700, alignSelf: 'flex-start' }}
          >
            Reset overlay
          </Button>
        </Stack>
      </Box>
    </>
  );
}
