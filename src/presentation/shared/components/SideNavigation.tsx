import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import type { NavigationMode } from '../../../domain/preferences';
import { designTokens } from '../../../theme/designTokens';

export type SeniorEaseRoute =
  | '/'
  | '/atividades'
  | '/perfil'
  | '/configuracoes';

export interface NavigationItem {
  href: SeniorEaseRoute;
  label: string;
  group: 'primary' | 'secondary';
}

export const seniorEaseNavigationItems: NavigationItem[] = [
  { href: '/', label: 'Dashboard', group: 'primary' },
  { href: '/atividades', label: 'Activities', group: 'primary' },
  { href: '/perfil', label: 'Profile', group: 'secondary' },
  { href: '/configuracoes', label: 'Settings', group: 'secondary' },
];

export interface SideNavigationProps {
  activeRoute: SeniorEaseRoute;
  items?: NavigationItem[];
  navigationMode?: NavigationMode;
}

const { colors, rounded, spacing, components } = designTokens;

function LogoMark() {
  return (
    <Box
      aria-hidden='true'
      component='svg'
      data-testid='senior-ease-logo-mark'
      focusable='false'
      height='44'
      preserveAspectRatio='xMidYMid meet'
      sx={{
        display: 'block',
        flex: '0 0 44px',
        height: 44,
        minHeight: 44,
        minWidth: 44,
        width: 44,
      }}
      viewBox='0 0 160 160'
      width='44'
    >
      <rect fill={colors.brandYellow} height='160' rx='52' width='160' />
      <circle cx='72' cy='88' fill={colors.brandBlue} r='37' />
      <circle cx='124' cy='60' fill={colors.brandTeal} r='19' />
    </Box>
  );
}

interface NavigationListProps {
  activeRoute: SeniorEaseRoute;
  items: NavigationItem[];
  label: string;
}

function NavigationList({ activeRoute, items, label }: NavigationListProps) {
  return (
    <Box
      aria-label={label}
      component='ul'
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        flexWrap: 'wrap',
        gap: '10px',
        listStyle: 'none',
        m: 0,
        p: 0,
        width: '100%',
      }}
    >
      {items.map((item) => {
        const isActive = item.href === activeRoute;

        return (
          <Box component='li' key={item.href}>
            <Box
              aria-current={isActive ? 'page' : undefined}
              component={Link}
              href={item.href}
              sx={{
                alignItems: 'center',
                bgcolor: isActive
                  ? components.sideNavigation.itemActiveBackgroundColor
                  : components.sideNavigation.itemInactiveBackgroundColor,
                borderRadius: `${components.sideNavigation.itemRadius}px`,
                color: isActive ? colors.ink : colors.onPrimary,
                display: 'inline-flex',
                fontSize: 16,
                fontWeight: isActive ? 600 : 500,
                gap: `${spacing.sm}px`,
                justifyContent: 'center',
                lineHeight: 1.4,
                minHeight: 48,
                minWidth: { xs: 0, md: 'auto' },
                px: `${components.sideNavigation.itemPaddingX}px`,
                py: `${components.sideNavigation.itemPaddingY}px`,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                width: 'auto',
                '&:focus-visible': {
                  outline: `3px solid ${colors.brandBlue}`,
                  outlineOffset: 3,
                },
              }}
            >
              <Box
                aria-hidden='true'
                sx={{
                  bgcolor: isActive ? colors.brandYellow : colors.muted,
                  borderRadius: `${rounded.full}px`,
                  display: { xs: 'none', md: 'block' },
                  height: 12,
                  width: 12,
                }}
              />
              {item.label}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export function SideNavigation({
  activeRoute,
  items = seniorEaseNavigationItems,
  navigationMode = 'standard',
}: SideNavigationProps) {
  return (
    <Box
      aria-label='SeniorEase'
      component='nav'
      data-navigation-mode={navigationMode}
      sx={{
        bgcolor: components.sideNavigation.backgroundColor,
        borderRadius: {
          xs: `${components.topNavigation.radiusMobile}px`,
          sm: `${components.topNavigation.radiusTablet}px`,
          md: `${components.sideNavigation.radius}px`,
        },
        color: colors.onPrimary,
        display: 'flex',
        flexDirection: 'column',
        gap: {
          xs: `${spacing.sm}px`,
          sm: `${spacing.md}px`,
          md: `${spacing.xl}px`,
        },
        minHeight: { md: 355 },
        px: {
          xs: `${components.topNavigation.paddingXMobile}px`,
          sm: `${components.topNavigation.paddingXTablet}px`,
          md: `${components.sideNavigation.paddingX}px`,
        },
        py: {
          xs: `${components.topNavigation.paddingYMobile}px`,
          sm: `${components.topNavigation.paddingYTablet}px`,
          md: `${components.sideNavigation.paddingY}px`,
        },
        width: { xs: '100%', md: 248 },
      }}
    >
      <Stack
        alignItems='center'
        direction='row'
        justifyContent={{ xs: 'space-between', md: 'flex-start' }}
        minWidth={0}
        spacing={1.5}
        width='100%'
      >
        <Stack alignItems='center' direction='row' minWidth={0} spacing={1.5}>
          <Box sx={{ display: 'block' }}>
            <LogoMark />
          </Box>
          <Typography
            component='p'
            fontSize={{
              xs: components.topNavigation.brandFontSizeMobile,
              sm: components.topNavigation.brandFontSizeTablet,
              md: 22,
            }}
            fontWeight={600}
            sx={{ whiteSpace: 'nowrap' }}
          >
            SeniorEase
          </Typography>
        </Stack>

        <Box
          aria-hidden='true'
          sx={{
            bgcolor: components.topNavigation.menuBackgroundColor,
            borderRadius: `${rounded.full}px`,
            color: colors.ink,
            display: { xs: 'inline-flex', md: 'none' },
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.4,
            px: `${components.topNavigation.menuPaddingX}px`,
            py: `${components.topNavigation.menuPaddingY}px`,
          }}
        >
          Menu
        </Box>
      </Stack>

      <NavigationList
        activeRoute={activeRoute}
        items={items}
        label='Primary navigation'
      />

      <Box
        sx={{
          bgcolor: components.sideNavigation.noteBackgroundColor,
          borderRadius: `${components.sideNavigation.noteRadius}px`,
          display: { xs: 'none', md: 'block' },
          mt: 'auto',
          p: `${components.sideNavigation.notePadding}px`,
          width: '100%',
        }}
      >
        <Typography fontSize={15} lineHeight={1.4}>
          Clear steps. Stable preferences. Gentle feedback.
        </Typography>
      </Box>
    </Box>
  );
}
