import { test, expect } from '@playwright/test';

test.describe('Game Setup + RPS (Two-Page Flow)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('settings form saves, enables Start Game, and navigates; greeting + theme apply', async ({ page }) => {
    await page.goto('/');

    // Fill valid form
    await page.fill('#player-name', 'Alex');
    // pick first avatar (wizard)
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.selectOption('#difficulty', 'hard');
    await page.check('#theme-toggle'); // dark

    await page.click('#save-settings');

    // Greeting & theme on settings page
    await expect(page.locator('[data-testid="greeting"]')).toContainText('Alex');
    await expect(page.locator('body')).toHaveClass(/theme-dark/);

    // LocalStorage structure
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('game.settings')!));
    expect(saved).toMatchObject({
      name: 'Alex',
      avatar: expect.any(String),
      difficulty: 'hard',
      theme: 'dark'
    });

    // Start Game becomes enabled and navigates to game page
    await expect(page.locator('#start-game')).toBeEnabled();
    await page.click('#start-game');
    await expect(page).toHaveURL(/.*\/game\.html$/);

    // On the game page, greeting and difficulty render
    await expect(page.locator('[data-testid="greeting"]')).toContainText('Alex');
    await expect(page.locator('#current-difficulty')).toHaveText('hard');
  });

  test('form prepopulates from localStorage on reload (settings page)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#player-name', 'Sam');
    await page.click('label.avatar-option:has(input[value="knight"])');
    await page.selectOption('#difficulty', 'normal');
    await page.uncheck('#theme-toggle');
    await page.click('#save-settings');

    await page.reload();

    await expect(page.locator('#player-name')).toHaveValue('Sam');
    await expect(page.locator('[data-testid="greeting"]')).toContainText('Sam');
    await expect(page.locator('#start-game')).toBeEnabled();
  });

  test('playing rounds updates scoreboard and history (game page)', async ({ page }) => {
    // Prepare valid settings on settings page
    await page.goto('/');
    await page.fill('#player-name', 'Kai');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    // Go to game page
    await page.click('#start-game');
    await expect(page).toHaveURL(/.*\/game\.html$/);

    const rockBtn = page.locator('[data-move="rock"]');
    await rockBtn.click();
    await expect(page.locator('#history li').first()).toContainText(/Player\(rock\) vs CPU\(/);

    // After several rounds, totals should sum
    for (let i = 0; i < 4; i++) await page.locator('[data-move="paper"]').click();

    const p = parseInt(await page.locator('#score-player').innerText(), 10);
    const c = parseInt(await page.locator('#score-cpu').innerText(), 10);
    const t = parseInt(await page.locator('#score-ties').innerText(), 10);
    expect(p + c + t).toBeGreaterThanOrEqual(5);
  });

  test('reset game clears scores and history but keeps settings (game page)', async ({ page }) => {
    await page.goto('/');
    await page.fill('#player-name', 'Mia');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    await page.click('#start-game');
    await expect(page).toHaveURL(/.*\/game\.html$/);

    await page.click('[data-move="scissors"]');
    await page.click('#reset-game');

    await expect(page.locator('#score-player')).toHaveText('0');
    await expect(page.locator('#history li')).toHaveCount(0);

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('game.settings')!));
    expect(saved.name).toBe('Mia');
  });

  test('highscores persists on beforeunload and can be cleared (game page)', async ({ page, context }) => {
    await page.goto('/');
    await page.fill('#player-name', 'Avi');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    await page.click('#start-game');
    await expect(page).toHaveURL(/.*\/game\.html$/);

    // Ensure at least one round is played so a record is stored on unload
    await page.click('[data-move="rock"]');

    // Simulate unload by reloading the game page
    await page.reload();

    // Open a new page to verify highscores
    const newPage = await context.newPage();
    await newPage.goto('/game.html');
    await newPage.reload();

    const listCount = await newPage.locator('#highscores li').count();
    expect(listCount).toBeGreaterThanOrEqual(1);

    await newPage.click('#clear-highscores');
    await expect(newPage.locator('#highscores li')).toHaveCount(0);
  });
});
