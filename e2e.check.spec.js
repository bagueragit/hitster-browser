import { test, expect } from '@playwright/test';

async function runChecks(page, baseURL) {
  const evidences = [];
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Hitster Local')).toBeVisible();
  evidences.push('app loaded');

  await expect(page.getByLabel('Jogadores')).toBeVisible();
  evidences.push('campo Jogadores visível');

  await page.getByRole('button', { name: 'Entrar na sessão' }).click();
  await expect(page.getByText('Qual é o ano da música?')).toBeVisible();
  evidences.push('sessão iniciada em modo jogo');

  await expect(page.getByPlaceholder('Ex: 1998')).toBeVisible();
  evidences.push('input palpite de ano visível');

  const scoreBefore = await page.locator('.score-chip').innerText();
  await page.getByRole('button', { name: 'Próxima rodada' }).click();
  await page.waitForTimeout(200);
  const scoreAfter = await page.locator('.score-chip').innerText();
  const before = Number((scoreBefore.match(/Jogador\s*(\d+)/) || [])[1]);
  const after = Number((scoreAfter.match(/Jogador\s*(\d+)/) || [])[1]);
  expect(after).not.toBe(before);
  evidences.push(`alternância jogador ok (${before} -> ${after})`);

  await page.getByRole('button', { name: 'Sair da sessão' }).click();
  await page.getByRole('button', { name: 'DJ (celular)' }).click();
  await page.getByRole('button', { name: 'Entrar na sessão' }).click();
  await expect(page.getByRole('link', { name: 'Abrir no Spotify' })).toBeVisible();
  evidences.push('modo DJ e botão Abrir no Spotify ok');

  await page.screenshot({ path: `evidence-${baseURL.includes('localhost') ? 'local' : 'prod'}.png`, fullPage: true });
  return evidences;
}

test('produção', async ({ page }) => {
  const evidences = await runChecks(page, 'https://bagueragit.github.io/hitster-browser/');
  console.log('EVIDENCE(prod):', evidences.join(' | '));
});

test('local preview', async ({ page }) => {
  const evidences = await runChecks(page, 'http://127.0.0.1:4173/');
  console.log('EVIDENCE(local):', evidences.join(' | '));
});
