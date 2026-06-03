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
      subtitle="Atualize lembretes e confirmacoes para manter a rotina previsivel."
      title="Configuracoes"
    >
      <ProfileSettings mode="settings" withShellNavigation={false} />
    </AppShell>
  )
}

export default SettingsPage
