import type { ReactNode } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { playfulPalette } from '../../theme/playfulPalette';

const MotionBox = motion(Box);

type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  match?: (pathname: string) => boolean;
};

const items: NavItem[] = [
  { label: 'Home', path: '/home', icon: <HomeRoundedIcon /> },
  {
    label: 'Lessons',
    path: '/lessons',
    icon: <MenuBookRoundedIcon />,
    match: (pathname) => pathname.startsWith('/lesson') || pathname.startsWith('/lessons'),
  },
  { label: 'Tutor', path: '/ai-tutor', icon: <SmartToyRoundedIcon /> },
  { label: 'Ranks', path: '/leaderboard', icon: <EmojiEventsRoundedIcon /> },
  { label: 'Settings', path: '/settings', icon: <SettingsRoundedIcon /> },
];

function getIsActive(item: NavItem, pathname: string) {
  if (item.match) {
    return item.match(pathname);
  }
  return pathname === item.path;
}

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        left: 14,
        right: 14,
        bottom: 14,
        px: 1.5,
        py: 1,
        borderRadius: '28px',
        background: 'rgba(255,253,244,0.96)',
        boxShadow: '0 18px 48px rgba(255,190,120,0.24)',
        border: `1px solid ${playfulPalette.line}`,
        backdropFilter: 'blur(18px)',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          alignItems: 'end',
          gap: 0.5,
        }}
      >
        {items.map((item) => {
          const active = getIsActive(item, location.pathname);

          return (
            <MotionBox key={item.path} whileTap={{ scale: 0.96 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <MotionBox
                  animate={active ? { y: -18, scale: 1.02 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  sx={{
                    borderRadius: '50%',
                    background: active ? playfulPalette.heroGradient : 'transparent',
                    boxShadow: active ? '0 10px 28px rgba(255,190,120,0.28)' : 'none',
                    border: active ? '6px solid #fff9ea' : '6px solid transparent',
                  }}
                >
                  <IconButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      width: active ? 58 : 46,
                      height: active ? 58 : 46,
                      color: active ? playfulPalette.ink : '#7C91A3',
                      background: active
                        ? 'rgba(255,255,255,0.36)'
                        : 'transparent',
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </MotionBox>
                <Typography
                  variant="caption"
                  sx={{
                    mt: active ? -1.2 : 0.2,
                    fontWeight: active ? 800 : 600,
                    color: active ? playfulPalette.ink : '#9CB0BE',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </MotionBox>
          );
        })}
      </Box>
    </Paper>
  );
};

export default MobileBottomNav;
