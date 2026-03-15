import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import MobileBottomNav from '../components/common/MobileBottomNav';
import { playfulPalette } from '../theme/playfulPalette';

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(180deg, ${playfulPalette.cream} 0%, #FFF6EE 100%)` }}>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 12, md: 4 },
        }}
      >
        <Outlet />
      </Container>
      <MobileBottomNav />
    </Box>
  );
};

export default MainLayout;
