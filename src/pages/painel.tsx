import type { NextPage } from 'next';

import { PersonalizationDashboard } from '../presentation/personalization';
import { AppShell, ReinforcedFeedback } from '../presentation/shared';
import { useTimedFeedback } from '../presentation/shared/hooks/useTimedFeedback';
import { usePreferenceStore } from '../stores/preferences/usePreferenceStore';

const DashboardPage: NextPage = () => {
  const preferences = usePreferenceStore((state) => state.preferences);
  const {
    feedback: feedbackMessage,
    isFeedbackVisible,
    showFeedback,
  } = useTimedFeedback<string>();

  return (
    <AppShell
      activeRoute='/painel'
      contextualContent={
        <ReinforcedFeedback
          reinforcedFeedback={
            preferences.reinforcedFeedback && isFeedbackVisible
          }
          subtitle={feedbackMessage ?? ''}
          title='Preferências salvas'
        />
      }
      navigationMode={preferences.navigationMode}
      subtitle='Ajuste legibilidade, contraste, espaçamento, complexidade da navegação, feedback e confirmações.'
      title='Deixe o SeniorEase confortável para você'
    >
      <PersonalizationDashboard
        onFeedbackMessageChange={showFeedback}
      />
    </AppShell>
  );
};

export default DashboardPage;
