import { useId, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { NavigationMode } from '../../../domain/preferences';
import { designTokens } from '../../../theme/designTokens';
import { SideNavigation, type SeniorEaseRoute } from './SideNavigation';

export interface AppShellProps {
  activeRoute: SeniorEaseRoute;
  children: ReactNode;
  navigationMode?: NavigationMode;
  subtitle?: string;
  title: string;
}

const { colors, components } = designTokens;
const mainContentId = 'conteudo-principal';

export function AppShell({
  activeRoute,
  children,
  navigationMode = 'standard',
  subtitle,
  title,
}: AppShellProps) {
  const titleId = useId();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        p: {
          xs: `${components.appShell.paddingMobile}px`,
          sm: `${components.appShell.paddingTablet}px`,
          md: `${components.appShell.paddingDesktop}px`,
        },
      }}
    >
      <Box
        component='a'
        href={`#${mainContentId}`}
        sx={{
          bgcolor: colors.brandYellow,
          borderRadius: 1,
          color: colors.ink,
          left: 16,
          px: 2,
          py: 1,
          position: 'fixed',
          top: 16,
          transform: 'translateY(-140%)',
          zIndex: 10,
          '&:focus': {
            transform: 'translateY(0)',
          },
        }}
      >
        Pular para o conteudo
      </Box>

      <Box
        sx={{
          bgcolor: colors.surface,
          border: `${components.appShell.borderWidth}px solid ${components.appShell.borderColor}`,
          borderRadius: `${components.appShell.radius}px`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: {
            xs: `${components.appShell.gapMobile}px`,
            sm: `${components.appShell.gapTablet}px`,
            md: `${components.appShell.gapDesktop}px`,
          },
          maxWidth: 1280,
          mx: 'auto',
          p: {
            xs: `${components.appShell.paddingMobile}px`,
            sm: `${components.appShell.paddingTablet}px`,
            md: `${components.appShell.paddingDesktop}px`,
          },
          width: '100%',
        }}
      >
        <SideNavigation
          activeRoute={activeRoute}
          navigationMode={navigationMode}
        />

        <Stack
          spacing={3}
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            py: { xs: 0, md: 1 },
          }}
        >
          <Box component='header'>
            <Typography
              component='h1'
              id={titleId}
              sx={{ color: 'text.primary' }}
              variant='h1'
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                color='text.secondary'
                sx={{ mt: 1 }}
                variant='subtitle1'
              >
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <Box
            aria-labelledby={titleId}
            component='main'
            id={mainContentId}
            sx={{ minWidth: 0 }}
            tabIndex={-1}
          >
            {children}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
