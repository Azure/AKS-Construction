const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

test('azurevote-catswin', async ({ page }) => {
  console.log('http://' + process.env.APPIP);
  await page.goto('http://' + process.env.APPIP)

  //Click Vote for Cats x3
  i=0
  while (i < 4) {
    await page.waitForSelector('#container > #form > center > #form > .button1')
    await page.click('#container > #form > center > #form > .button1')
    await navigationPromise
    i++;
  }

  //Click Vote for Dogs x1
  await page.waitForSelector('#container > #form > center > #form > .button2')
  await page.click('#container > #form > center > #form > .button2')
  await navigationPromise

  await page.waitForSelector('#results')
  await expect('#results').not.toContainText('Cats - 3 | Dogs - 1');

});
