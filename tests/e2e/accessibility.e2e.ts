import { expect, test, type Locator, type Page } from '@playwright/test'

const PREFERENCE_STORAGE_NAME = 'seniorease-preferences:v1'

const dashboardViewports = [
  { label: 'desktop', size: { width: 1440, height: 900 } },
  { label: 'tablet', size: { width: 834, height: 1194 } },
  { label: 'mobile', size: { width: 390, height: 844 } },
]

const guidedStepViewports = [
  { label: 'desktop', size: { width: 1440, height: 900 } },
  { label: 'tablet', size: { width: 834, height: 1194 } },
]

const dashboardTitle = 'Deixe o SeniorEase confortável para você'

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )

  expect(overflow).toBeLessThanOrEqual(1)
}

async function isFocused(locator: Locator) {
  return locator
    .evaluate((element) => element === document.activeElement)
    .catch(() => false)
}

async function tabTo(page: Page, locator: Locator, maxTabs = 20) {
  for (let tabCount = 0; tabCount < maxTabs; tabCount += 1) {
    if (await isFocused(locator)) {
      return
    }

    await page.keyboard.press('Tab')
  }

  await expect(locator).toBeFocused()
}

function handleNextDialog(page: Page, action: 'accept' | 'dismiss') {
  return new Promise<string>((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message()

      if (action === 'accept') {
        await dialog.accept()
      } else {
        await dialog.dismiss()
      }

      resolve(message)
    })
  })
}

async function createActivity(page: Page, title: string) {
  await page.getByRole('button', { name: 'Criar atividade' }).click()
  await expect(page.getByRole('form', { name: 'Nova atividade' })).toBeVisible()

  await page.getByLabel('Titulo da atividade').fill(title)
  await page
    .getByLabel('Lembrete em linguagem simples')
    .fill('hoje as 18h')
  await page.getByLabel('Primeiro passo').fill('Separar documentos')
  await page.getByRole('button', { name: 'Salvar atividade' }).click()

  await expect(
    page.getByRole('heading', { exact: true, name: title }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: `Passos de ${title}` }),
  ).toBeVisible()
}

test('changes font size and persists Zustand preferences after reload', async ({
  page,
}) => {
  await page.goto('/')

  const heading = page.getByRole('heading', {
    level: 1,
    name: dashboardTitle,
  })
  await expect(heading).toBeVisible()
  const initialFontSize = await heading.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  )

  await page.getByLabel('Muito grande').check()
  await expect(page.getByRole('status')).toContainText(
    'Preferência salva: tamanho do texto Muito grande.',
  )
  await expect(
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  ).toHaveAttribute('data-state', 'selected')

  const updatedFontSize = await heading.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  )
  expect(updatedFontSize).toBeGreaterThan(initialFontSize)

  await expect
    .poll(() =>
      page.evaluate((storageName) => {
        return window.localStorage.getItem(storageName)
      }, PREFERENCE_STORAGE_NAME),
    )
    .toContain('extraLarge')

  await page.reload()

  await expect(page.getByLabel('Muito grande')).toBeChecked()
  await expect(
    page.getByTestId('preference-pill-fontScale-extraLarge'),
  ).toHaveAttribute('data-state', 'selected')
})

test('creates and completes an activity with guided steps and live feedback', async ({
  page,
}) => {
  const activityTitle = 'Enviar relatorio semanal'

  await page.goto('/atividades')
  await createActivity(page, activityTitle)

  await page.getByLabel('Passo 1 de 1: Separar documentos').check()
  await expect(page.getByText('1 de 1 passos revisados.')).toBeVisible()

  const dialogMessage = handleNextDialog(page, 'accept')
  await page
    .getByRole('button', { name: `Concluir atividade ${activityTitle}` })
    .click()

  await expect(dialogMessage).resolves.toBe(
    'Concluir esta atividade e mover para o historico?',
  )

  await expect(page.getByRole('status')).toContainText(
    `Atividade concluida: ${activityTitle}. Ela foi movida para o historico.`,
  )
  await expect(
    page
      .getByRole('list', { name: 'Historico de atividades concluidas' })
      .getByText(activityTitle),
  ).toBeVisible()
})

test('supports keyboard access, skip link focus, and dialog focus return', async ({
  page,
}) => {
  const activityTitle = 'Revisar contrato'

  await page.goto('/atividades')

  const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' })
  await tabTo(page, skipLink, 4)
  await expect(skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.getByRole('main', { name: 'Atividades' })).toBeFocused()

  const createButton = page.getByRole('button', { name: 'Criar atividade' })
  await tabTo(page, createButton)
  await page.keyboard.press('Enter')
  await expect(page.getByRole('form', { name: 'Nova atividade' })).toBeVisible()

  await tabTo(page, page.getByLabel('Titulo da atividade'), 6)
  await page.keyboard.type(activityTitle)
  await page.keyboard.press('Tab')
  await page.keyboard.type('amanha de manha')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Ler a primeira pagina')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('button', { name: 'Salvar atividade' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: `Passos de ${activityTitle}` }),
  ).toBeVisible()

  const completeButton = page.getByRole('button', {
    name: `Concluir atividade ${activityTitle}`,
  })
  await completeButton.focus()
  await expect(completeButton).toBeFocused()

  const dialogMessage = handleNextDialog(page, 'dismiss')
  await page.keyboard.press('Enter')

  await expect(dialogMessage).resolves.toBe(
    'Concluir esta atividade e mover para o historico?',
  )

  await expect(completeButton).toBeFocused()
  await expect(
    page.getByRole('heading', { name: `Passos de ${activityTitle}` }),
  ).toBeVisible()
})

test('exposes ARIA landmarks, labels, helper text, and reduced-motion behavior', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByRole('navigation', { name: 'SeniorEase' })).toBeVisible()
  await expect(page.getByRole('main', { name: dashboardTitle })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Painel' }),
  ).toHaveAttribute('aria-current', 'page')

  await expect(
    page.getByRole('radiogroup', { name: 'Tamanho do texto' }),
  ).toHaveAttribute('aria-describedby', /.+/)
  await expect(
    page.getByRole('switch', { name: 'Feedback reforçado' }),
  ).toHaveAttribute('aria-describedby', /.+/)
  await expect(page.getByRole('status')).toContainText(
    'Seu layout do SeniorEase continuará assim na próxima vez que você voltar.',
  )

  await page.goto('/configuracoes')
  const transitionDuration = await page
    .locator('[data-testid="figma-pill-switch-remindersEnabled"] span[aria-hidden="true"]')
    .evaluate((element) =>
      Number.parseFloat(window.getComputedStyle(element).transitionDuration),
    )

  expect(transitionDuration).toBeLessThanOrEqual(0.001)
})

for (const viewport of dashboardViewports) {
  test(`renders dashboard layout at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport.size)
    await page.goto('/')

    await expect(
      page.getByRole('heading', { level: 1, name: dashboardTitle }),
    ).toBeVisible()
    await expect(
      page.getByRole('main', { name: dashboardTitle }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'SeniorEase' }),
    ).toBeVisible()
    await expect(
      page.getByRole('radiogroup', { name: 'Tamanho do texto' }),
    ).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test(`renders activities layout at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport.size)
    await page.goto('/atividades')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Atividades' }),
    ).toBeVisible()
    await expect(page.getByRole('main', { name: 'Atividades' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Organizador de atividades' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Criar atividade' })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })
}

for (const viewport of guidedStepViewports) {
  test(`renders guided steps at the ${viewport.label} Figma viewport without overflow`, async ({
    page,
  }) => {
    const activityTitle = `Conferir agenda ${viewport.label}`

    await page.setViewportSize(viewport.size)
    await page.goto('/atividades')
    await createActivity(page, activityTitle)

    await expect(
      page.getByRole('list', { name: `Passos de ${activityTitle}` }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: `Concluir atividade ${activityTitle}` }),
    ).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })
}
