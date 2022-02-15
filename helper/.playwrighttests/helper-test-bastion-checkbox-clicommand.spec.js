const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox

test('networkpolicy-test-defaul-is-azure', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Is the CLI textarea there and visible?
  const cliboxvis = await page.isVisible('[data-testid="deploy-deploycmd"]');
  expect(cliboxvis).toBeTruthy();

  //It shouldn't yet contain the bastion text
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).not.toContainText('bastion');

  //But i am expecting customvnet to be there
  await expect(clitextbox).toContainText('custom_vnet=true')

  // Click the 4rd Tab in the portal Navigation Pivot (networking)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(4)')

  //Inspect the bastion checkbox
  await page.waitForSelector('[data-testid="network-bastion-Checkbox"]')
  const bastioncheckbox = await page.$('[data-testid="network-bastion-Checkbox"]')
  await expect(bastioncheckbox).not.toBeChecked();
  await expect(bastioncheckbox).toBeVisible();

  //Enable Bastion Checkbox
  //await page.click('[data-testid="network-bastion-Checkbox"]')  //This doesn't work.. :(
  //await page.check('[data-testid="network-bastion-Checkbox"]')  //This doesn't work.. :(
  //await bastioncheckbox.check()  //This doesn't work.. :(
  //await page.click('.ms-StackItem:nth-child(6) > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark') //This works
  //await page.click('[data-testid="network-bastion-Checkbox"] + label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark') //works
  await page.click('[data-testid="network-bastion-Checkbox"]' + chk)
  await expect(bastioncheckbox).toBeChecked();

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //The setting for bastion should be there now
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).toContainText('bastion');
});
