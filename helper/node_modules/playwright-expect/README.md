# playwright-expect [![Test](https://github.com/elaichenkov/playwright-expect/actions/workflows/tests.yml/badge.svg)](https://github.com/elaichenkov/playwright-expect/actions/workflows/tests.yml)

The `playwright-expect` is an assertion library for TypeScript and JavaScript intended for use with a test runner such as [Jest](https://jestjs.io/) or [Playwright Test](https://playwright.dev/). It lets you write better assertions for end-to-end testing.

# Motivation
***TL;DR:***
> [expect-playwright](https://github.com/playwright-community/expect-playwright) is a great library, but it contains a few methods.

[playwright-expect](https://github.com/elaichenkov/playwright-expect) is a great library too, with all major methods and extra features such as waits, ignore case sensitive, trim. All in all, It has everything that you demand to accomplish end-to-end testing needs.

***Please, read more about [motivation and main features](https://elaichenkov.medium.com/expect-more-with-playwright-expect-5eb4e23d3916).***

# Key Features
* rich and easy to use;
* exhaustive messages and diff highlights;
* can ignore case sensitive and trim values before asserting;
* waits for expectation to succeed;
* works in Jest and Playwright Test;
* built-in types for TypeScript and JavaScript autocompletion.

# Usage

## Install
```sh
npm i -D playwright-expect
```
## Playwright Test - TypeScript
```typescript
// playwright.config.ts
import { expect } from '@playwright/test';
import { matchers } from 'playwright-expect';

// add custom matchers
expect.extend(matchers);
```
## Playwright Test - JavaScript
```typescript
// playwright.config.js
const { expect } = require('@playwright/test');
const { matchers } = require('playwright-expect');

// add custom matchers
expect.extend(matchers);
```


# [API](https://elaichenkov.github.io/playwright-expect/modules.html)

> Please, read [API](https://elaichenkov.github.io/playwright-expect/modules.html) documentation
 
* [toBeDisabled](https://elaichenkov.github.io/playwright-expect/modules/tobedisabled.html)
* [toBeEnabled](https://elaichenkov.github.io/playwright-expect/modules/tobeenabled.html)
* [toBeChecked](https://elaichenkov.github.io/playwright-expect/modules/tobechecked.html)
* [toBeFocused](https://elaichenkov.github.io/playwright-expect/modules/tobefocused.html)
* [toBeVisible](https://elaichenkov.github.io/playwright-expect/modules/tobevisible.html)
* [toContainText](https://elaichenkov.github.io/playwright-expect/modules/tocontaintext.html)
* [toContainTitle](https://elaichenkov.github.io/playwright-expect/modules/tocontaintitle.html)
* [toContainUrl](https://elaichenkov.github.io/playwright-expect/modules/tocontainurl.html)
* [toContainValue](https://elaichenkov.github.io/playwright-expect/modules/tocontainvalue.html)
* [toHaveCount](https://elaichenkov.github.io/playwright-expect/modules/tohavecount.html)
* [toHaveText](https://elaichenkov.github.io/playwright-expect/modules/tohavetext.html)
* [toHaveTitle](https://elaichenkov.github.io/playwright-expect/modules/tohavetitle.html)
* [toHaveUrl](https://elaichenkov.github.io/playwright-expect/modules/tohaveurl.html)
* [toHaveValue](https://elaichenkov.github.io/playwright-expect/modules/tohavevalue.html)
* [toMatchText](https://elaichenkov.github.io/playwright-expect/modules/tomatchtext.html)

# Examples

> All methods, which expects element can accept element in three ways:
> 1. [page, selector] (*recommended*) 
> 2. ElementHandle
> 3. Promise\<ElementHandle>
## Use `toHaveText` to check that element's text equals to the expected

```typescript
// Using ElementHandle
const title = await page.$('h1');

await expect(title).toHaveText('Home');

// Using Promise<ElementHandle>
await expect(page.$('h1')).toHaveText('Home');

// Using an array of page and selector. Furthermore, you can pass options such as ignoreCase and trim
await expect([page, 'h1']).toHaveText('home', { ignoreCase: true });

// Even more, you can wait for the element before asserting
await expect([page, '.notification']).toHaveText('Success', { timeout: 15000 });

// Also, it could be useful to fail fast, by default it waits for the 10 seconds
await expect([page, '.notification']).toHaveText('success', { timeout: 1000, trim: true });
```
> NOTE:
> You can wait for the element only using the [page, selector] approach

## Use `toBeVisible` to check that element is visible
```typescript
// Using ElementHandle
const button = await page.$('#next');

await expect(title).toBeVisible();

// Using Promise<ElementHandle>
await expect(page.$('#next')).toBeVisible(true); // true here is optional

// Using an array of page and selector
await expect([page, '#next']).toBeVisible(false);
```


## Use `toBeEnabled` and `toBeDisabled` to check that element is enabled/disabled

```typescript
// Using ElementHandle
const button = await page.$('#next');

await expect(title).toBeEnabled();

// Using Promise<ElementHandle>
await expect(page.$('#next')).toBeEnabled();

// Using an array of page and selector
await expect([page, '#next']).toBeEnabled(false);

// Also, you can use `not` to verify opposite
await expect([page, '#next']).not.toBeEnabled();

// Even more, you can check that element is disabled
await expect(page.$('#next')).toBeDisabled();
```

## Use `toHaveUrl` and `toContainUrl` to check that page's url equals or contains the expected url
```typescript
await expect(page).toHaveUrl('https://duckduckgo.com/');

// Also, you can wait for the url
await expect(page).toHaveUrl('https://duckduckgo.com/', { timeout: 5000 });

await expect(page).toContainUrl('duck');
```
## Use `toHaveTitle` or `toContainTitle` to check that page's title equals or contains the expected title

```typescript
await expect(page).toHaveTitle('DuckDuckGo — Privacy, simplified.');

await expect(page).toContainTitle('Privacy');

// ignore case sensitive
await expect(page).toContainTitle('privacy', {ignoreCase: true});
```
# Author
Yevhen Laichenkov <elaichenkov@gmail.com>
# Inspired by
[expect-playwright](https://github.com/playwright-community/expect-playwright)

[expect-webdriverio](https://github.com/webdriverio/expect-webdriverio)
