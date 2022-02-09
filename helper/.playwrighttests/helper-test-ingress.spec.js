const { test, expect } = require('@playwright/test');

test('ingress-options-test', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 3rd Tab in the portal Navigation Pivot (addons)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(3)');

  // Expect appgwKVIntegration Checkbox to be visible, and checked!
  expect (await page.isChecked('[data-testid="addons-ingress-appgwKVIntegration-Checkbox"]')).toBeTruthy()

  // Now click Operations Principles=none
  await page.click('[data-testid="portalnav-presets-ops-none-Checkbox"]')

  // Expect the AppGateway option for KeyVault integration to disappear
  expect (await page.isVisible('[data-testid="addons-ingress-appgwKVIntegration-Checkbox"]')).toBeFalsy()

});
