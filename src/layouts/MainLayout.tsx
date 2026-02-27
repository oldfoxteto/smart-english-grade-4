import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const MainLayout = () => {
  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
