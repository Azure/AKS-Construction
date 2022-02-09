const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox

test('disablelocalaccounts-not-present-by-on-simple-config', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Configure presets
  await page.waitForSelector('[data-testid="portalnav-presets-secure-low-Checkbox"]')
  await page.click('[data-testid="portalnav-presets-secure-low-Checkbox"]')

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).not.toContainText('AksDisableLocalAccounts')
  await expect(clitextbox).not.toContainText('enable_aad=true')

});

test('disablelocalaccounts-is-present-by-on-default-config', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Is the CLI textarea there and visible?
  //const cliboxvis = await page.isVisible('[data-testid="deploy-deploycmd"]');
  //expect(cliboxvis).toBeTruthy();

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).toContainText('AksDisableLocalAccounts')
  await expect(clitextbox).toContainText('enable_aad=true')

  // Click the 2nd Tab in the portal Navigation Pivot (cluster details)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)')

  // Click to toggle AAD integration Checkbox
  await page.waitForSelector('#cluster-userauth-ChoiceGroup .ms-ChoiceFieldGroup-flexContainer .ms-ChoiceField:nth-child(2) input')
  await page.check('#cluster-userauth-ChoiceGroup .ms-ChoiceFieldGroup-flexContainer .ms-ChoiceField:nth-child(2) input')


  //Inspect the checkbox
  await page.waitForSelector('[data-testid="cluster-localaccounts-Checkbox"]')
  const checkbox2 = await page.$('[data-testid="cluster-localaccounts-Checkbox"]')
  await expect(checkbox2).toBeChecked();
  await expect(checkbox2).toBeVisible();

  //Disable the Checkbox
  await page.click('[data-testid="cluster-localaccounts-Checkbox"]' + chk)
  await expect(checkbox2).not.toBeChecked();

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //The setting should have disappeared now
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).not.toContainText('AksDisableLocalAccounts');
});
