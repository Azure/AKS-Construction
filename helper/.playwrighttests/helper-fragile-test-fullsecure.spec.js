const { test, expect } = require('@playwright/test');

test('ingress-options-test', async ({ page }) => {
  
  await page.goto('http://localhost:3000/Aks-Construction');

  // Select most secure option (firewall & private link)
  await page.click('data-testid=portalnav-presets-secure-private-Checkbox')
  

  // Click the 2nd Tab in the portal Navigation Pivot (cluster) 
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)');
  // Reduce Costs , no seperate system pool
  // https://github.com/microsoft/playwright/issues/10176
  await page.check('input[data-testid=cluster-systempool-none]')
  

  // Click the 3rd Tab in the portal Navigation Pivot (addons) 
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(3)');
  
  // enable & populate external DNS
  await page.check('data-testid=addons-dns')
  await page.fill('data-testid=addons-dnsZoneId', '/subscriptions/95efa97a-9b5d-4f74-9f75-a3396e23344d/resourceGroups/kh-common/providers/Microsoft.Network/dnszones/labhome.biz');

  // enable cert manager
  await page.check('data-testid=addons-certMan')
  await page.fill('data-testid=addons-certEmail', 'bamail@emales.com');

  // Now lets get the deployment script
  // Click the 1nd Tab in the portal Navigation Pivot (deploy) 
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)');
  await page.inputValue('data-testid=deploy-deploycmd')

});
