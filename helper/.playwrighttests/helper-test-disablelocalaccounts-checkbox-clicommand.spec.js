const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox

test('networkpolicy-test-defaul-is-azure', async ({ page }) => {

  await page.goto('http://localhost:3000/Aks-Construction');

  //Is the CLI textarea there and visible?
  const cliboxvis = await page.isVisible('[data-testid="deploy-deploycmd"]');
  expect(cliboxvis).toBeTruthy();

  //Check settings is there for default config
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).toContainText('aksDisableLocalAccounts')
  await expect(clitextbox).toContainText('enable_aad=true')

  // Click the 2nd Tab in the portal Navigation Pivot (cluster details)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)')

  //Inspect the checkbox
  await page.waitForSelector('[data-testid="cluster-localaccounts-Checkbox"]')
  const checkbox = await page.$('[data-testid="cluster-localaccounts-Checkbox"]')
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toBeVisible();

  //Disable the Checkbox
  await page.click('[data-testid="cluster-localaccounts-Checkbox"]' + chk)
  await expect(checkbox).not.toBeChecked();

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //The setting should have disappeared now
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).not.toContainText('aksDisableLocalAccounts');
});
