import type { NextPage } from 'next'

import { AppShell } from '../presentation/shared'
import { ProfileSettings } from '../presentation/profile'
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore'

const SettingsPage: NextPage = () => {
  const navigationMode = usePreferenceStore(
    (state) => state.preferences.navigationMode,
  )

  return (
    <AppShell
      activeRoute="/configuracoes"
      navigationMode={navigationMode}
      subtitle="Atualize lembretes e configurações salvas além do painel principal de personalização."
      title="Configurações"
    >
      <ProfileSettings mode="settings" />
    </AppShell>
  )
}

export default SettingsPage
