const { test, expect } = require('@playwright/test');
test('test', async ({ page }) => {
  await page.waitForSelector('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('.ms-Stack > div > .itemContainer-177 > div > .ms-Stack')
  await page.click('.ms-Stack > div > .itemContainer-177 > div > .ms-Stack')

  await page.waitForSelector('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')
  await page.click('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')

  await page.waitForSelector('#ChoiceGroupLabel63-appgw')
  await page.click('#ChoiceGroupLabel63-appgw')

  await page.waitForSelector('.ms-Stack > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text > .css-114')
  await page.click('.ms-Stack > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text > .css-114')

  await page.waitForSelector('#Toggle0')
  await page.click('#Toggle0')

  await page.waitForSelector('.ms-DocumentCard:nth-child(2) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-DocumentCard:nth-child(2) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('#ChoiceGroupLabel63-none')
  await page.click('#ChoiceGroupLabel63-none')

  await page.waitForSelector('#ChoiceGroupLabel63-appgw')
  await page.click('#ChoiceGroupLabel63-appgw')

  await page.waitForSelector('#ChoiceGroupLabel108-Detection')
  await page.click('#ChoiceGroupLabel108-Detection')

  await page.waitForSelector('#ChoiceGroupLabel108-Prevention')
  await page.click('#ChoiceGroupLabel108-Prevention')
});
