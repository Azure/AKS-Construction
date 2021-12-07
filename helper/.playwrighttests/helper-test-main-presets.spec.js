const { test, expect } = require('@playwright/test');

test('reference-screengrabs', async ({ page }) => {
  
  await page.goto('http://localhost:3000/Aks-Construction');
  
  await page.screenshot({ path: 'alwaysscreengrabs/standard-config.png', fullPage: true })


  await page.goto('http://localhost:3000/Aks-Construction?entScale=1&entscale=sandbox');
  
  await page.screenshot({ path: 'alwaysscreengrabs/entscale-config.png', fullPage: true })
  
});
