const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('test', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Wait for the stack
  const stackops='[data-testid="stackops"]';
  await page.waitForSelector(stackops)

  //Save the contents of the az cmd box to file
  const pageHtml = await page.content();

  console.log(pageHtml);
  fs.writeFileSync('localsite.html', pageHtml);

});