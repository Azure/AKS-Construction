19 lines (12 sloc)  796 Bytes
   
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.PLAYTESTURL;

test('vote-test', async ({ page }) => {

  const { chromium } = require('playwright');
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const navigationPromise = page.waitForNavigation()

  await page.goto(BASE_URL)

  await page.setViewportSize({ width: 1616, height: 991 })

  await navigationPromise

  await page.waitForSelector('#container > #form > center > #form > .button2')
  await page.click('#container > #form > center > #form > .button2')

  await navigationPromise

  await page.waitForSelector('#container > #form > center > #form > .button1')
  await page.click('#container > #form > center > #form > .button1')

  await navigationPromise

  await page.waitForSelector('#container > #form > center > #form > .button1')
  await page.click('#container > #form > center > #form > .button1')

  await navigationPromise

  await page.waitForSelector('#container > #form > center > #form > .button1')
  await page.click('#container > #form > center > #form > .button1')

  await navigationPromise

  await page.waitForSelector('#results')
  await page.click('#results')

});
