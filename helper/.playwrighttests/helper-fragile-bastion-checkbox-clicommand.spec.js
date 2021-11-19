const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

test('networkpolicy-test-defaul-is-azure', async ({ page }) => {
 
  await page.goto('http://localhost:3000/Aks-Construction');
  
  //Is the CLI textarea there and visible?
  const cliboxvis = await page.isVisible('[data-testid="deploy-deploycmd"]');
  expect(cliboxvis).toBeTruthy();
  
  //It shouldn't yet contain the bastion text
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  var clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).not.toContainText('bastion');

  //But i am expecting customvnet to be there
  await expect(clitextbox).toContainText('custom_vnet=true')

  // Click the 4rd Tab in the portal Navigation Pivot (networking) 
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(4)')


  await page.waitForSelector('[data-testid="network-bastion-Checkbox"]')
  const bastioncheckbox = await page.$('[data-testid="network-bastion-Checkbox"]')
  expect(bastioncheckbox).not.toBeChecked();

  //await page.waitForSelector('[data-testid="network-bastion-subnet"]')
  const bastionsubnet = await page.$('[data-testid="network-bastion-subnet"]')
  //expect(bastionsubnet).toBeVisible();
  //expect(bastionsubnet).not.toBeEditable();

  //Enable Bastion
  //await page.click('[data-testid="network-bastion-Checkbox"]')
 
  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).not.toContainText('bastion');

  //But i am expecting bastion to be there
  await expect(clitextbox).toContainText('bastion=true')

});
