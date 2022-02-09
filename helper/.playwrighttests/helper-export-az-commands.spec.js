const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('test', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Select the Private Cluster preset
  const privateClusterPresetCheckboxSelector='.ms-Stack:nth-child(6) > .ms-DocumentCard:nth-child(3) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark';
  await page.waitForSelector(privateClusterPresetCheckboxSelector)
  await page.click(privateClusterPresetCheckboxSelector)

  //Change the name of the resource group
  await page.waitForSelector('#azResourceGroup')
  await page.click('#azResourceGroup')
  await page.fill('#azResourceGroup', 'Automation-Actions-AksPublishCI')

  //Save the contents of the az cmd box to file
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  const azcmdManagedPrivate =await clitextboxrevisted.innerText();
  console.log(azcmdManagedPrivate);
  fs.writeFileSync('azcmd-managed-private.sh', azcmdManagedPrivate);

});
