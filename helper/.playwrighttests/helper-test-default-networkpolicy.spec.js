const { test, expect } = require('@playwright/test');

test('networkpolicy-test-defaul-is-azure', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 3rd Tab in the portal Navigation Pivot (addons)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(3)');

  // Expect azure network policy to be checked!
  expect (await page.isChecked('[data-testid="addons-netpolicy-azure"]')).toBeTruthy()

});
