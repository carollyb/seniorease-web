import type { NextPage } from 'next'

import { PersonalizationDashboard } from '../presentation/personalization'
import { AppShell } from '../presentation/shared'
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore'

const HomePage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences)

  return (
    <AppShell
      activeRoute="/"
      navigationMode={preferences.navigationMode}
      subtitle="Adjust readability, contrast, spacing, navigation complexity, feedback, and confirmations."
      title="Make SeniorEase comfortable for you"
    >
      <PersonalizationDashboard />
    </AppShell>
  )
}

export default HomePage
