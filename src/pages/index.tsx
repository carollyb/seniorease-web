import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Box
      component='main'
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Container maxWidth='md' sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3} alignItems='flex-start'>
          <Typography component='h1' variant='h3'>
            SeniorEase
          </Typography>
          <Typography color='text.secondary' variant='h6'>
            Gerencie suas tarefas com simplicidade.
          </Typography>
          <Button variant='contained' size='large'>
            Comecar
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;
