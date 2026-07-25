import type { NextPage } from 'next';

import { ActivityOrganizer } from '../presentation/activities';
import { AppShell } from '../presentation/shared';
import { usePreferenceStore } from '@/stores/preferences';

const ActivitiesPage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences);

  return (
    <AppShell
      activeRoute='/atividades'
      navigationMode={preferences.navigationMode}
      title='Hoje'
    >
      <ActivityOrganizer mode={preferences.navigationMode} />
    </AppShell>
  );
};

export default ActivitiesPage;
