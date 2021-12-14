const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

test('azurevote-catswin', async ({ page }) => {
  console.log('http://' + process.env.APPIP);
  await page.goto('http://' + process.env.APPIP)

  //Click reset button
  await page.waitForSelector('#container > #form > center > #form > .button3')
  await page.click('#container > #form > center > #form > .button3')

  //Click Vote for Cats x3
  i=0
  while (i < 3) {
    await page.waitForSelector('#container > #form > center > #form > .button1')
    await page.click('#container > #form > center > #form > .button1')
    i++;
  }

  //Click Vote for Dogs x1
  await page.waitForSelector('#container > #form > center > #form > .button2')
  await page.click('#container > #form > center > #form > .button2')

  //Check the results div
  const results = await page.$('#results')
  await expect('#results').toBeVisible
  console.log(await results.innerText());
  if (await results.innerText() != 'Cats - 3 | Dogs - 1') {
    throw "Incorrect result"
  }

});
