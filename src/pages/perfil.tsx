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
      subtitle="Estado atual das preferências de acessibilidade em linguagem clara."
      title="Resumo do perfil"
    >
      <ProfileSettings mode="profile" />
    </AppShell>
  )
}

export default ProfilePage
