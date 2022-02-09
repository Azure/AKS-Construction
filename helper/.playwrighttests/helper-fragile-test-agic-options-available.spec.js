const { test, expect } = require('@playwright/test');

test('test', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  await page.waitForSelector('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')
  await page.click('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')

  await page.waitForSelector('#ChoiceGroupLabel63-appgw')
  await page.click('#ChoiceGroupLabel63-appgw')

  await page.screenshot({ path: 'failscreengrabs/simple-simple-addons.png', fullPage: true })

  await page.waitForSelector('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(3) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(3) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(3) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(3) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('#ChoiceGroupLabel63-none')
  await page.click('#ChoiceGroupLabel63-none')

  await page.waitForSelector('#ChoiceGroupLabel63-appgw')
  await page.click('#ChoiceGroupLabel63-appgw')

  await page.waitForSelector('#ChoiceGroupLabel92-Detection')
  await page.click('#ChoiceGroupLabel92-Detection')

  await page.waitForSelector('#ChoiceGroupLabel92-Prevention')
  await page.click('#ChoiceGroupLabel92-Prevention')

  await page.screenshot({ path: 'failscreengrabs/managed-private-addons.png', fullPage: true })

  //testing to see if prevention/detection are there for simple-simple
  await page.waitForSelector('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(2) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')
  await page.click('.ms-Stack:nth-child(4) > .ms-DocumentCard:nth-child(1) > .ms-DocumentCardDetails > .ms-Checkbox > .ms-Checkbox-label > .ms-Checkbox-text')

  await page.waitForSelector('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')
  await page.click('#Pivot9-Tab2 > .ms-Button-flexContainer > span > .ms-Pivot-linkContent > .ms-Pivot-text')

  await page.waitForSelector('#ChoiceGroupLabel63-appgw')
  await page.click('#ChoiceGroupLabel63-appgw')

  //await page.waitForSelector('#ChoiceGroupLabel92-Prevention')
  const visible = await page.isVisible('#ChoiceGroupLabel92-Prevention');
  expect(visible).toBeFalsy();
});
