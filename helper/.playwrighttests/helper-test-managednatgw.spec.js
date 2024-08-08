const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

test('default-outbound-option-to-be-load-balancer', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 4th Tab in the portal Navigation Pivot (network)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(4)');

  //Check default value
  const dropdown = await page.waitForSelector('[data-testid="net-aksEgressType"]')
  await expect(dropdown).toBeVisible()
  await expect(dropdown).toMatchText('Load Balancer')

});

test('managed-natgw-option-is-now-the-prod-default', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 4th Tab in the portal Navigation Pivot (network)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(4)');

  //Change default value
  const dropdown = await page.waitForSelector('[data-testid="net-aksEgressType"]')
  await expect(dropdown).toBeVisible()
  await expect(dropdown).toMatchText('NAT Gateway')

  // Click the 1st Tab in the portal Navigation Pivot (network)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)');

  // Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).not.toContainText('managedNatGateway')

});

 //TODO: Change value and check (this is a real pain with the DropDown control)