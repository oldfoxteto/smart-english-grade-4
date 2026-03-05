import { Alert, Box, Button, Typography } from '@mui/material';

export function VoiceCooldownBanner({ cooldownMs, onRetry }: { cooldownMs: number; onRetry: () => void }) {
  const seconds = Math.ceil(cooldownMs / 1000);
  return (
    <Alert
      severity="warning"
      variant="filled"
      sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 2 }}
      action={
        <Button color="inherit" size="small" disabled={seconds > 0} onClick={onRetry}>
          Resume
        </Button>
      }
    >
      <Box>
        <Typography sx={{ fontWeight: 800 }}>Voice cooldown</Typography>
        <Typography sx={{ fontSize: '0.85rem' }}>Please wait {seconds}s to resume live call.</Typography>
      </Box>
    </Alert>
  );
}
