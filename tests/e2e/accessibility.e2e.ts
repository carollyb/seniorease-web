import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test';

const PREFERENCE_STORAGE_NAME = 'seniorease-preferences:v1';

const dashboardViewports = [
  { label: 'desktop', size: { width: 1440, height: 900 } },
  { label: 'tablet', size: { width: 834, height: 1194 } },
  { label: 'mobile', size: { width: 390, height: 844 } },
];

const guidedStepViewports = [
  { label: 'desktop', size: { width: 1440, height: 900 } },
  { label: 'tablet', size: { width: 834, height: 1194 } },
];

const dashboardTitle = 'Deixe o SeniorEase confortável para você';

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
}

async function expectInsideViewport(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded();

  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();

  if (!box || !viewport) {
    return;
  }

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
}

async function expectPreferencePillsNotClipped(page: Page) {
  const clippedPills = await page
    .locator('[data-testid^="preference-pill-"] .MuiFormControlLabel-label')
    .evaluateAll((labels) =>
      labels
        .filter((label) => {
          return (
            label.scrollWidth - label.clientWidth > 1 ||
            label.scrollHeight - label.clientHeight > 1
          );
        })
        .map((label) => label.textContent?.trim() ?? 'unnamed pill'),
    );

  expect(clippedPills).toEqual([]);
}

async function attachFigmaViewportScreenshot(
  testInfo: TestInfo,
  page: Page,
  name: string,
) {
  const screenshotPath = testInfo.outputPath(`${name}.png`);

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    document.querySelectorAll('nextjs-portal').forEach((element) => {
      element.remove();
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(50);
  await page.screenshot({ fullPage: true, path: screenshotPath });
  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}

async function isFocused(locator: Locator) {
  return locator
    .evaluate((element) => element === document.activeElement)
    .catch(() => false);
}

async function tabTo(page: Page, locator: Locator, maxTabs = 20) {
  for (let tabCount = 0; tabCount < maxTabs; tabCount += 1) {
    if (await isFocused(locator)) {
      return;
    }

    await page.keyboard.press('Tab');
  }

  await expect(locator).toBeFocused();
}

async function createActivity(page: Page, title: string) {
  await page.getByRole('button', { name: 'Nova tarefa' }).click();
  await expect(page.getByRole('form', { name: 'Nova tarefa' })).toBeVisible();

  await page.getByLabel('Título da tarefa').fill(title);
  await page.getByLabel('Lembrete em linguagem simples').fill('hoje as 18h');
  await page.getByLabel('Primeiro passo').fill('Separar documentos');
  await page.getByRole('button', { name: 'Salvar tarefa' }).click();

  await expect(
    page.getByRole('heading', { exact: true, name: title }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: `Passos de ${title}` }),
  ).toBeVisible();
}

test('opens activities as the application landing page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/atividades$/);
  await expect(
    page.getByRole('navigation', { name: 'SeniorEase' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Atividades' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('changes font size and persists Zustand preferences after reload', async ({
  page,
}) => {
  await page.goto('/painel');

  const heading = page.getByRole('heading', {
    level: 1,
    name: dashboardTitle,
  });
  await expect(heading).toBeVisible();
  const initialFontSize = await heading.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  );

  await page.getByLabel('Muito grande').check();
  await expect(page.getByRole('status')).toContainText(
    'Preferência salva: tamanho do texto Muito grande.',
  );
  await expect(
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  ).toHaveAttribute('data-state', 'selected');

  const updatedFontSize = await heading.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  );
  expect(updatedFontSize).toBeGreaterThan(initialFontSize);

  await expect
    .poll(() =>
      page.evaluate((storageName) => {
        return window.localStorage.getItem(storageName);
      }, PREFERENCE_STORAGE_NAME),
    )
    .toContain('extraLarge');

  await page.reload();

  await expect(page.getByLabel('Muito grande')).toBeChecked();
  await expect(
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  ).toHaveAttribute('data-state', 'selected');
});

test('applies the mobile-equivalent Alto contrast and restores it after reload', async ({
  page,
}) => {
  await page.goto('/painel');

  await page.getByRole('radio', { name: 'Alto' }).click();
  await expect(page.getByRole('radio', { name: 'Alto' })).toBeChecked();

  await expect
    .poll(() =>
      page.evaluate((storageName) => {
        return window.localStorage.getItem(storageName);
      }, PREFERENCE_STORAGE_NAME),
    )
    .toContain('maximum');

  const highContrastColors = await page.evaluate(() => {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const bodyStyles = window.getComputedStyle(document.body);

    return {
      background: bodyStyles.backgroundColor,
      cardBorder: rootStyles
        .getPropertyValue('--seniorease-card-border')
        .trim(),
      focus: rootStyles.getPropertyValue('--seniorease-focus').trim(),
      selectedBackground: rootStyles
        .getPropertyValue('--seniorease-selected-background')
        .trim(),
      text: bodyStyles.color,
    };
  });

  expect(highContrastColors).toEqual({
    background: 'rgb(255, 255, 255)',
    cardBorder: '#000000',
    focus: '#000000',
    selectedBackground: '#000000',
    text: 'rgb(0, 0, 0)',
  });

  await page.reload();

  await expect(page.getByRole('radio', { name: 'Alto' })).toBeChecked();
  await expect
    .poll(() =>
      page.evaluate(() =>
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--seniorease-selected-background')
          .trim(),
      ),
    )
    .toBe('#000000');
});

test('creates and completes an activity with guided steps and history', async ({
  page,
}) => {
  const activityTitle = 'Enviar relatorio semanal';

  await page.goto('/atividades');
  await createActivity(page, activityTitle);

  await page.getByLabel('Passo 1 de 1: Separar documentos').check();
  await expect(page.getByText('1 de 1 passos revisados.')).toBeVisible();

  await page
    .getByRole('button', { name: `Concluir atividade ${activityTitle}` })
    .click();

  const confirmationDialog = page.getByRole('dialog', {
    name: 'Confirmar conclusão',
  });

  await expect(confirmationDialog).toBeVisible();
  await expect(confirmationDialog).toContainText(activityTitle);
  await confirmationDialog.getByRole('button', { name: 'Concluir' }).click();

  await expect(
    page
      .getByRole('list', { name: 'Histórico de atividades concluidas' })
      .getByText(activityTitle),
  ).toBeVisible();
});

test('supports keyboard access, skip link focus, and dialog focus return', async ({
  page,
}) => {
  const activityTitle = 'Revisar contrato';

  await page.goto('/atividades');

  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
  await tabTo(page, skipLink, 4);
  await expect(skipLink).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.getByRole('main', { name: 'Hoje' })).toBeFocused();

  const createButton = page.getByRole('button', { name: 'Nova tarefa' });
  await tabTo(page, createButton);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('form', { name: 'Nova tarefa' })).toBeVisible();

  await tabTo(page, page.getByLabel('Título da tarefa'), 6);
  await page.keyboard.type(activityTitle);
  await page.keyboard.press('Tab');
  await page.keyboard.type('amanha de manha');
  await page.keyboard.press('Tab');
  await page.keyboard.type('Ler a primeira pagina');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Salvar tarefa' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: `Passos de ${activityTitle}` }),
  ).toBeVisible();

  const completeButton = page.getByRole('button', {
    name: `Concluir atividade ${activityTitle}`,
  });
  await completeButton.focus();
  await expect(completeButton).toBeFocused();

  await page.keyboard.press('Enter');

  const confirmationDialog = page.getByRole('dialog', {
    name: 'Confirmar conclusão',
  });
  const cancelButton = confirmationDialog.getByRole('button', {
    name: 'Cancelar',
  });

  await expect(confirmationDialog).toBeVisible();
  await expect(cancelButton).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(confirmationDialog).toBeHidden();
  await expect(completeButton).toBeFocused();
  await expect(
    page.getByRole('heading', { name: `Passos de ${activityTitle}` }),
  ).toBeVisible();
});

test('exposes ARIA landmarks, labels, helper text, and reduced-motion behavior', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/painel');

  await expect(
    page.getByRole('navigation', { name: 'SeniorEase' }),
  ).toBeVisible();
  await expect(page.getByRole('main', { name: dashboardTitle })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Painel' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await expect(
    page.getByRole('radiogroup', { name: 'Tamanho do texto' }),
  ).toHaveAttribute('aria-describedby', /.+/);
  await expect(
    page.getByRole('switch', { name: 'Feedback reforçado' }),
  ).toHaveAttribute('aria-describedby', /.+/);
  await expect(page.getByRole('status')).toContainText(
    'Seu layout do SeniorEase continuará assim na próxima vez que você voltar.',
  );

  await page.goto('/configuracoes');
  const transitionDuration = await page
    .locator(
      '[data-testid="figma-pill-switch-remindersEnabled"] span[aria-hidden="true"]',
    )
    .evaluate((element) =>
      Number.parseFloat(window.getComputedStyle(element).transitionDuration),
    );

  expect(transitionDuration).toBeLessThanOrEqual(0.001);
});

test('keeps primary controls usable with largest font size and increased spacing', async ({
  page,
}, testInfo) => {
  const activityTitle = 'Atividade com texto grande';

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/painel');

  await page.getByLabel('Muito grande').check();
  await page.getByLabel('Extra amplo').check();

  await expect(
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  ).toHaveAttribute('data-state', 'selected');
  await expect(
    page.getByTestId('preference-pill-spacingLevel-extraWide'),
  ).toHaveAttribute('data-state', 'selected');
  await expect(page.getByRole('status')).toContainText(
    'Preferência salva: espaçamento Extra amplo.',
  );

  await expectNoHorizontalOverflow(page);
  await expectPreferencePillsNotClipped(page);
  await expectInsideViewport(
    page,
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  );
  await expectInsideViewport(
    page,
    page.getByTestId('preference-pill-spacingLevel-extraWide'),
  );

  await page.goto('/atividades');
  await expectNoHorizontalOverflow(page);
  await expectInsideViewport(
    page,
    page.getByRole('button', { name: 'Nova tarefa' }),
  );

  await createActivity(page, activityTitle);
  await expectNoHorizontalOverflow(page);
  await expectInsideViewport(
    page,
    page.getByRole('button', { name: `Concluir atividade ${activityTitle}` }),
  );
  await attachFigmaViewportScreenshot(
    testInfo,
    page,
    'mobile-stress-font-spacing',
  );
});

for (const viewport of dashboardViewports) {
  test(`renders dashboard layout at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport.size);
    await page.goto('/painel');

    await expect(
      page.getByRole('heading', { level: 1, name: dashboardTitle }),
    ).toBeVisible();
    await expect(
      page.getByRole('main', { name: dashboardTitle }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'SeniorEase' }),
    ).toBeVisible();
    await expect(
      page.getByRole('radiogroup', { name: 'Tamanho do texto' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await attachFigmaViewportScreenshot(
      testInfo,
      page,
      `dashboard-${viewport.label}`,
    );
  });

  test(`renders activities layout at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport.size);
    await page.goto('/atividades');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Hoje' }),
    ).toBeVisible();
    await expect(page.getByRole('main', { name: 'Hoje' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Sem tarefas para hoje' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Nova tarefa' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await attachFigmaViewportScreenshot(
      testInfo,
      page,
      `activities-${viewport.label}`,
    );
  });
}

for (const viewport of guidedStepViewports) {
  test(`renders guided steps at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }, testInfo) => {
    const activityTitle = `Conferir agenda ${viewport.label}`;

    await page.setViewportSize(viewport.size);
    await page.goto('/atividades');
    await createActivity(page, activityTitle);

    await expect(
      page.getByRole('list', { name: `Passos de ${activityTitle}` }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: `Concluir atividade ${activityTitle}` }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await attachFigmaViewportScreenshot(
      testInfo,
      page,
      `guided-steps-${viewport.label}`,
    );
  });
}
