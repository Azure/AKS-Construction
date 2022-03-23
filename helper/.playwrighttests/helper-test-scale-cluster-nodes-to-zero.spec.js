const { test, expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);

const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox
const sliderFirstBubbleSelector='[data-testid="cluster-agentCount-slider"] .ms-Slider-line .ms-Slider-thumb:first-child';
const sliderSelector='[data-testid="cluster-agentCount-slider"]';

test('scale-can-be-set-to-zero-by-default', async ({ page }) => {

  await page.goto('http://localhost:3000/AKS-Construction');

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextbox = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextbox).toBeVisible()
  await expect(clitextbox).not.toContainText('agentCount')

  // Click the 2nd Tab in the portal Navigation Pivot (cluster details)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)');

  //Scale to zero
  await page.waitForSelector(sliderFirstBubbleSelector);
  const agentCountSlider = await page.$(sliderFirstBubbleSelector);
  await page.click(sliderFirstBubbleSelector);
  await page.mouse.down();
  await page.mouse.move(-100,0);
  await page.mouse.up();
  //await page.screenshot({ path: 'alwaysscreengrabs/scale-debug-slider.png', fullPage: true });

  //const agentCountSlideParent = await agentCountSlider.$('xpath=..')
  //console.log(await agentCountSlideParent.innerHTML());

  const agentCountSliderLocator = page.locator(sliderFirstBubbleSelector);
  await expect(agentCountSliderLocator).toHaveAttribute("aria-valuenow", "0");

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).toBeVisible()
  await expect(clitextboxrevisted).toContainText('agentCount=0')

});

test('manual-scale-prevents-autoscale-from-zero', async ({ page }) => {

  const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 2nd Tab in the portal Navigation Pivot (cluster details)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)');

  //Scale to zero
  await page.waitForSelector(sliderFirstBubbleSelector)
  const agentCountSlider = await page.$(sliderFirstBubbleSelector)
  await page.click(sliderFirstBubbleSelector);
  await page.mouse.down();
  await page.mouse.move(-100,0);
  await page.mouse.up();

  const agentCountSliderLocator = page.locator(sliderFirstBubbleSelector);
  await expect(agentCountSliderLocator).toHaveAttribute("aria-valuenow", "0");

  //Turn off AutoScale
  //Need to select the sibling element because of this choicebox mess
  const manualScaleSelector ='[data-testid="cluster-manual-scale"]  + .ms-ChoiceField-field'
  await page.waitForSelector(manualScaleSelector);
  const manualScale =await page.$(manualScaleSelector);
  await expect(manualScale).not.toBeChecked();
  await page.click(manualScaleSelector);
  await expect(manualScale).toBeChecked();

  //MinScale should have jumped back to 1, and the slider will have become a simple slider
  await page.waitForSelector(sliderSelector);
  const agentCountSliderLocator2 = page.locator(sliderSelector);
  await expect(agentCountSliderLocator2).toHaveAttribute("aria-valuenow", "1");

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).toBeVisible()
  await expect(clitextboxrevisted).toContainText('agentCount=1')

});


test('no-user-pool-prevents-autoscale-from-zero', async ({ page }) => {

  const chk = '+ label > .ms-Checkbox-checkbox > .ms-Checkbox-checkmark' //dom hack to get to the checkbox

  await page.goto('http://localhost:3000/AKS-Construction');

  // Click the 2nd Tab in the portal Navigation Pivot (cluster details)
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(2)');

  //Scale to zero
  await page.waitForSelector(sliderFirstBubbleSelector)
  const agentCountSlider = await page.$(sliderFirstBubbleSelector)
  await page.click(sliderFirstBubbleSelector);
  await page.mouse.down();
  await page.mouse.move(-100,0);
  await page.mouse.up();

  const agentCountSliderLocator = page.locator(sliderFirstBubbleSelector);
  await expect(agentCountSliderLocator).toHaveAttribute("aria-valuenow", "0");

  //No separate system pool
  //Need to select the sibling element
  const sysPoolSelector ='[data-testid="cluster-systempool-none"]  + .ms-ChoiceField-field'
  await page.waitForSelector(sysPoolSelector);
  const noSysPool =await page.$(sysPoolSelector);
  await expect(noSysPool).not.toBeChecked();
  await page.click(sysPoolSelector);
  await expect(noSysPool).toBeChecked();

  //MinScale should have jumped back to 1, and the slider will have become a simple slider
  await page.waitForSelector(sliderFirstBubbleSelector);
  const agentCountSliderLocator3 = page.locator(sliderFirstBubbleSelector);
  console.log(await agentCountSliderLocator3.innerHTML());
  await expect(agentCountSliderLocator3).toHaveAttribute("aria-valuenow", "1");

  //Go back to the deploy tab.
  await page.click('[data-testid="portalnav-Pivot"] > button:nth-child(1)')

  //Check parameter is absent
  await page.waitForSelector('[data-testid="deploy-deploycmd"]')
  const clitextboxrevisted = await page.$('[data-testid="deploy-deploycmd"]')
  await expect(clitextboxrevisted).toBeVisible()
  //console.log(await clitextboxrevisted.textContent());
  await expect(clitextboxrevisted).toContainText('agentCount=1')

});