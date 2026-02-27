import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert, Slide, type SlideProps } from '@mui/material';

export type NotificationSeverity = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
  message: string;
  severity?: NotificationSeverity;
  duration?: number;
  encouraging?: boolean;
}

interface NotificationContextType {
  notify: (notification: Notification) => void;
  notifySuccess: (message: string, encouraging?: boolean) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Slide transition for mobile
const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="down" />;
};

const encouragingMessages = [
  '🎯 رائع! استمر في التقدم!',
  '💪 ممتاز! أنت تتعلم بسرعة!',
  '⭐ أحسنت! حافظ على هذا الزخم!',
  '🚀 مذهل! مستواك يتحسن باستمرار!',
  '🏆 ممتاز! أنت على الطريق الصحيح!',
  '🌟 رائع! لا تتوقف عن التعلم!',
  '🎉 أحسنت! كل خطوة مهمة!',
  '📚 ممتاز! معرفتك تتوسع!',
  '🎯 مذهل! استمر في التميز!',
  '💫 رائع! أنت تبلي بلاء حسناً!'
];

const getRandomEncouragingMessage = () => {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Notification>({ message: '', severity: 'info' });

  const notify = (notif: Notification) => {
    let finalMessage = notif.message;
    if (notif.encouraging && notif.severity === 'success') {
      finalMessage = `${notif.message} ${getRandomEncouragingMessage()}`;
    }
    
    setCurrent({ 
      message: finalMessage, 
      severity: notif.severity || 'info',
      duration: notif.duration || 4000
    });
    setOpen(true);
  };

  const notifySuccess = (message: string, encouraging = true) => {
    notify({ message, severity: 'success', encouraging });
  };

  const notifyError = (message: string) => {
    notify({ message, severity: 'error', duration: 6000 });
  };

  const notifyInfo = (message: string) => {
    notify({ message, severity: 'info' });
  };

  const notifyWarning = (message: string) => {
    notify({ message, severity: 'warning', duration: 5000 });
  };

  const handleClose = (_?: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ notify, notifySuccess, notifyError, notifyInfo, notifyWarning }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={current.duration || 4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-root': {
            mt: { xs: 1, sm: 2 },
          }
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={current.severity} 
          sx={{ 
            width: '100%',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            '& .MuiAlert-message': {
              textAlign: 'center',
              fontWeight: 500
            }
          }}
        >
          {current.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
};
