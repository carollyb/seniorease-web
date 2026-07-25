import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import { createSeniorEaseTheme } from '../../../theme/createSeniorEaseTheme';
import { ReinforcedFeedback } from './ReinforcedFeedback';

function renderFeedback(reinforcedFeedback: boolean) {
  return render(
    <ThemeProvider theme={createSeniorEaseTheme()}>
      <ReinforcedFeedback
        reinforcedFeedback={reinforcedFeedback}
        subtitle='A tarefa foi adicionada à lista de hoje.'
        title='Tarefa salva com sucesso!'
      />
    </ThemeProvider>,
  );
}

describe('ReinforcedFeedback', () => {
  it('renders reusable title and subtitle in a polite status region', () => {
    renderFeedback(true);

    const status = screen.getByRole('status');

    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('aria-atomic')).toBe('true');
    expect(
      screen.getByRole('heading', { name: 'Tarefa salva com sucesso!' }),
    ).not.toBeNull();
    expect(
      screen.getByText('A tarefa foi adicionada à lista de hoje.'),
    ).not.toBeNull();
  });

  it('renders nothing when reinforced feedback is disabled', () => {
    const { container } = renderFeedback(false);

    expect(container.childElementCount).toBe(0);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
