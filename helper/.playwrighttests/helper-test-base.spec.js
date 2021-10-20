const { test, expect } = require('@playwright/test');

test('test', async ({ page }) => {
  
  await page.goto('http://localhost:3000/Aks-Construction');
  
  const visible = await page.isVisible('#mainContent');
  expect(visible).toBeTruthy();
});
