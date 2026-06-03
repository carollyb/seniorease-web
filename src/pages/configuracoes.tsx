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
      subtitle="Update reminders and persisted app settings beyond the main personalization panel."
      title="Settings"
    >
      <ProfileSettings mode="settings" />
    </AppShell>
  )
}

export default SettingsPage
