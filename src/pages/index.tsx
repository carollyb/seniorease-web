import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';

import { PersonalizationDashboard } from '../presentation/personalization';
import { AppShell, StatusPill } from '../presentation/shared';
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore';
import mapPreferences from '@/presentation/shared/utils/preferencesMapper';

const HomePage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences);

  return (
    <AppShell
      activeRoute='/'
      navigationMode={preferences.navigationMode}
      subtitle='Ajuste leitura, contraste e seguranca para usar o app com conforto.'
      title='Painel SeniorEase'
    >
      <Stack spacing={3}>
        <Box
          component='section'
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            p: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2}>
            <Typography component='h2' variant='h4'>
              Preferencias ativas
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <StatusPill
                label={`Texto: ${mapPreferences(preferences.fontScale)}`}
              />
              <StatusPill
                label={`Contraste: ${mapPreferences(preferences.contrastLevel)}`}
              />
              <StatusPill
                label={`Espaco: ${mapPreferences(preferences.spacingLevel)}`}
              />
            </Stack>
          </Stack>
        </Box>

        <PersonalizationDashboard />
      </Stack>
    </AppShell>
  );
};

export default HomePage;
