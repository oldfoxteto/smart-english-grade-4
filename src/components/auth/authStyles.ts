export const authCardSx = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '26px',
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.10)',
  boxShadow: '0 28px 60px rgba(0,0,0,0.32)',
  backdropFilter: 'blur(20px)',
  color: '#ffffff',
};

export const authInputSx = {
  '& .MuiOutlinedInput-root': {
    direction: 'ltr',
    borderRadius: '14px',
    minHeight: 52,
    color: '#ffffff',
    background: 'rgba(255,255,255,0.05)',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.12)',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.18)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
  '& .MuiInputBase-input': {
    direction: 'ltr',
    textAlign: 'left',
  },
  '& .MuiInputAdornment-positionStart': {
    marginRight: '8px',
    marginLeft: 0,
  },
  '& .MuiInputAdornment-positionEnd': {
    marginLeft: '8px',
    marginRight: 0,
  },
  '& .MuiInputAdornment-root svg': {
    color: '#94a3b8',
  },
};

export const socialButtonSx = {
  width: '100%',
  minHeight: 52,
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.22)',
  background: '#ffffff',
  boxShadow: '0 18px 32px rgba(15, 23, 42, 0.24)',
};
