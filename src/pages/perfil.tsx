import type { NextPage } from 'next'

import { AppShell } from '../presentation/shared'
import { ProfileSettings } from '../presentation/profile'
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore'

const ProfilePage: NextPage = () => {
  const navigationMode = usePreferenceStore(
    (state) => state.preferences.navigationMode,
  )

  return (
    <AppShell
      activeRoute="/perfil"
      navigationMode={navigationMode}
      subtitle="Current persisted accessibility and preference state in readable language."
      title="Profile summary"
    >
      <ProfileSettings mode="profile" />
    </AppShell>
  )
}

export default ProfilePage
