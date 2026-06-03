import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

import type { NavigationMode } from '../../../domain/preferences'
import { designTokens } from '../../../theme/designTokens'

export type SeniorEaseRoute = '/' | '/atividades' | '/perfil' | '/configuracoes'

export interface NavigationItem {
  href: SeniorEaseRoute
  label: string
  group: 'primary' | 'secondary'
}

export const seniorEaseNavigationItems: NavigationItem[] = [
  { href: '/', label: 'Painel', group: 'primary' },
  { href: '/atividades', label: 'Atividades', group: 'primary' },
  { href: '/perfil', label: 'Perfil', group: 'secondary' },
  { href: '/configuracoes', label: 'Configuracoes', group: 'secondary' },
]

export interface SideNavigationProps {
  activeRoute: SeniorEaseRoute
  items?: NavigationItem[]
  navigationMode?: NavigationMode
}

const { colors, rounded, spacing, components } = designTokens

function LogoMark() {
  return (
    <Box
      aria-hidden="true"
      component="svg"
      data-testid="senior-ease-logo-mark"
      focusable="false"
      height="44"
      preserveAspectRatio="xMidYMid meet"
      sx={{
        display: 'block',
        flex: '0 0 44px',
        height: 44,
        minHeight: 44,
        minWidth: 44,
        width: 44,
      }}
      viewBox="0 0 160 160"
      width="44"
    >
      <rect fill={colors.brandYellow} height="160" rx="52" width="160" />
      <circle cx="72" cy="88" fill={colors.brandBlue} r="37" />
      <circle cx="124" cy="60" fill={colors.brandTeal} r="19" />
    </Box>
  )
}

interface NavigationListProps {
  activeRoute: SeniorEaseRoute
  items: NavigationItem[]
  label: string
}

function NavigationList({ activeRoute, items, label }: NavigationListProps) {
  return (
    <Stack
      aria-label={label}
      component="ul"
      spacing="10px"
      sx={{ listStyle: 'none', m: 0, p: 0 }}
    >
      {items.map((item) => {
        const isActive = item.href === activeRoute

        return (
          <Box component="li" key={item.href}>
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
                px: `${components.sideNavigation.itemPaddingX}px`,
                py: `${components.sideNavigation.itemPaddingY}px`,
                textDecoration: 'none',
                width: { xs: '100%', md: 'auto' },
                '&:focus-visible': {
                  outline: `3px solid ${colors.brandYellow}`,
                  outlineOffset: 3,
                },
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  bgcolor: isActive ? colors.brandYellow : colors.muted,
                  borderRadius: `${rounded.full}px`,
                  height: 12,
                  width: 12,
                }}
              />
              {item.label}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export function SideNavigation({
  activeRoute,
  items = seniorEaseNavigationItems,
  navigationMode = 'standard',
}: SideNavigationProps) {
  const primaryItems =
    navigationMode === 'simplified'
      ? items.filter((item) => item.group === 'primary')
      : items
  const secondaryItems =
    navigationMode === 'simplified'
      ? items.filter((item) => item.group === 'secondary')
      : []

  return (
    <Box
      aria-label="SeniorEase"
      component="nav"
      data-navigation-mode={navigationMode}
      sx={{
        bgcolor: components.sideNavigation.backgroundColor,
        borderRadius: `${components.sideNavigation.radius}px`,
        color: colors.onPrimary,
        display: 'flex',
        flexDirection: 'column',
        gap: `${spacing.xl}px`,
        minHeight: { md: 355 },
        px: `${components.sideNavigation.paddingX}px`,
        py: `${components.sideNavigation.paddingY}px`,
        width: { xs: '100%', md: 248 },
      }}
    >
      <Stack alignItems="center" direction="row" minWidth={0} spacing={1.5}>
        <LogoMark />
        <Typography
          component="p"
          fontSize={22}
          fontWeight={600}
          sx={{ whiteSpace: 'nowrap' }}
        >
          SeniorEase
        </Typography>
      </Stack>

      <NavigationList
        activeRoute={activeRoute}
        items={primaryItems}
        label="Navegacao principal"
      />

      {secondaryItems.length > 0 ? (
        <Stack spacing={1}>
          <Typography component="p" fontSize={14} fontWeight={600}>
            Outras areas
          </Typography>
          <NavigationList
            activeRoute={activeRoute}
            items={secondaryItems}
            label="Outras areas"
          />
        </Stack>
      ) : null}

      <Box
        sx={{
          bgcolor: components.sideNavigation.noteBackgroundColor,
          borderRadius: `${components.sideNavigation.noteRadius}px`,
          mt: 'auto',
          p: `${components.sideNavigation.notePadding}px`,
          width: '100%',
        }}
      >
        <Typography fontSize={15} lineHeight={1.4}>
          Passos claros. Preferencias estaveis. Feedback gentil.
        </Typography>
      </Box>
    </Box>
  )
}
