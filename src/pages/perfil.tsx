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
      subtitle="Revise as preferencias salvas para leitura, contraste e seguranca."
      title="Perfil"
    >
      <ProfileSettings mode="profile" withShellNavigation={false} />
    </AppShell>
  )
}

export default ProfilePage
