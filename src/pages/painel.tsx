import type { NextPage } from 'next';

import { PersonalizationDashboard } from '../presentation/personalization';
import { AppShell } from '../presentation/shared';
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore';

const DashboardPage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences);

  return (
    <AppShell
      activeRoute='/painel'
      navigationMode={preferences.navigationMode}
      subtitle='Ajuste legibilidade, contraste, espaçamento, complexidade da navegação, feedback e confirmações.'
      title='Deixe o SeniorEase confortável para você'
    >
      <PersonalizationDashboard />
    </AppShell>
  );
};

export default DashboardPage;
