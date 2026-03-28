import { Box, Button, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { QrCode, ShieldCheck } from 'lucide-react';
import type { TotpEnrollment } from '../../core/firebaseAuth';
import { authCardSx, authInputSx } from './authStyles';

type Props = {
  loading: boolean;
  totpCode: string;
  pendingEnrollment: TotpEnrollment | null;
  onCodeChange: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
};

export function AuthTotpPanel({
  loading,
  totpCode,
  pendingEnrollment,
  onCodeChange,
  onConfirm,
  onBack,
}: Props) {
  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ ...authCardSx, p: 2, borderRadius: '24px' }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <ShieldCheck size={20} color="#fff9da" />
          <Typography sx={{ fontWeight: 800, color: '#fffef7' }}>
            {pendingEnrollment
              ? 'Scan the QR code, then enter the 6-digit authenticator code.'
              : 'Enter the 6-digit code from your authenticator app.'}
          </Typography>
        </Stack>
      </Paper>

      {pendingEnrollment && (
        <Stack spacing={1.5} alignItems="center">
          <Box component="img" src={pendingEnrollment.qrCodeDataUrl} alt="TOTP QR Code" sx={{ width: 220, height: 220, borderRadius: '22px', p: 1, bgcolor: '#fff' }} />
          <Typography sx={{ fontSize: '0.84rem', textAlign: 'center', color: 'rgba(237,244,255,0.84)' }}>
            If scanning does not work, use the setup key below in your authenticator app.
          </Typography>
          <Box sx={{ width: '100%', p: 1.4, borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.24)', bgcolor: 'rgba(255,255,255,0.05)' }}>
            <Typography sx={{ fontWeight: 800, letterSpacing: '0.12em', wordBreak: 'break-all' }}>
              {pendingEnrollment.secretKey}
            </Typography>
          </Box>
        </Stack>
      )}

      <TextField
        fullWidth
        label="Authenticator code"
        placeholder="123456"
        value={totpCode}
        onChange={(event) => onCodeChange(event.target.value)}
        sx={authInputSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <QrCode size={18} color="rgba(255,255,255,0.62)" />
            </InputAdornment>
          ),
        }}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
        <Button fullWidth onClick={onConfirm} disabled={loading || totpCode.trim().length !== 6} sx={{ minHeight: 54, borderRadius: '18px', fontWeight: 800, color: '#0d225c', background: 'linear-gradient(180deg, #54c3ff 0%, #1773ff 100%)', boxShadow: '0 10px 24px rgba(16,53,140,0.38)' }}>
          {loading ? 'Processing...' : 'Verify'}
        </Button>
        <Button fullWidth variant="outlined" onClick={onBack} sx={{ minHeight: 54, borderRadius: '18px', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
          Back
        </Button>
      </Stack>
    </Stack>
  );
}
