import type expect from 'expect';

type Options = {
  textMethod?: 'textContent' | 'innerText';
  ignoreCase?: boolean;
  trim?: boolean;
  timeout?: number;
  state?: 'visible' | 'attached';
};

type PageWaitForUrlOptions = {
  timeout: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
};

declare global {
  namespace PlaywrightTest {
    namespace jest {
      type Matchers<R> = PlaywrightTest.Matchers<R>;
    }
    interface Matchers<R> extends expect.Matchers<R> {
      /** Playwright default helpers */
      not: PlaywrightTest.Matchers<R>;
      resolves: PlaywrightTest.Matchers<Promise<R>>;
      rejects: PlaywrightTest.Matchers<Promise<R>>;

      /** Custom matchers */
      /**
       * Use `toHaveText` function when you want to check that an element's text is equal to the expected text
       *
       * @example
       * ```typescript
       * // Asserting ignoring case sensitive
       * await expect([page, 'input']).toHaveText('success message', { ignoreCase: true });
       *
       * // Trimming before asserting
       * await expect([page, 'input']).toHaveText('Success message', { trim: true });
       *
       * // Waiting for the element for 15s
       * await expect([page, 'input']).toHaveText('Success message', { timeout: 15000 })
       * ```
       */
      toHaveText(expectedText: string, options?: Options): Promise<R>;
      /**
       * Use `toContainText` function when you want to check that an element's text contains the expected string or substring
       *
       * @example
       * ```typescript
       * // Asserting ignoring case sensitive
       * await expect(page.$('.alert')).toContainText('success', {ignoreCase: true});
       * // Trimming before asserting
       * await expect(page.$('.alert')).toContainText('success', { trim: true });
       * // Waiting for the element for 15s
       * await expect(page.$('.alert')).toContainText('success', { timeout: 15000 })
       * ```
       */
      toContainText(expectedText: string, options?: Options): Promise<R>;
      /**
       * Use `toMatchText` function when you want to check that an element's text matches the expected text with regular expression
       *
       * @example
       * ```typescript
       * await expect([page, '.alert']).toMatchText(/[S|s]uccess/);
       * ```
       */
      toMatchText(expectedPattern: RegExp | string, options?: Options): Promise<R>;
      /**
       * Use `toHaveUrl` function when you want to check that page's url is equal to the expected url
       *
       * @example
       * ```typescript
       * await expect(page).toHaveUrl('https://example.com/');
       *
       * // Waiting for the url for 15s before asserting
       * await expect(page).toHaveUrl('https://example.com/', { timeout: 15000 })
       * ```
       */
      toHaveUrl(expectedUrl: RegExp | string, options?: PageWaitForUrlOptions): Promise<R>;
      /**
       * Use `toContainUrl` function when you want to check that page's url contains the expected url
       *
       * @example
       * ```typescript
       * await expect(page).toContainUrl('example');
       *
       * // Waiting for the url for 15s before asserting
       * await expect(page).toContainUrl('example', { timeout: 15000 });
       * ```
       */
      toContainUrl(expectedUrl: RegExp | string, options?: PageWaitForUrlOptions): Promise<R>;
      /**
       * Use `toHaveTitle` function when you want to check that page's title is equal to the expected title
       *
       * @example
       * ```typescript
       * await expect(page).toHaveTitle('Documentation');
       *
       * // Asserting ignoring case sensitive
       * await expect(page).toHaveTitle('documentation', { ignoreCase: true });
       * ```
       */
      toHaveTitle(expectedTitle: string, options?: Options): Promise<R>;
      /**
       * Use `toContainTitle` function when you want to check that page's title contains the expected title
       *
       * @example
       * ```typescript
       * await expect(page).toContainTitle('doc');
       *
       * // Asserting ignoring case sensitive
       * await expect(page).toContainTitle('doc', { ignoreCase: true });
       * ```
       */
      toContainTitle(expectedTitle: string, options?: Options): Promise<R>;
      /**
       * Use `toBeFocused` function when you want to check that an element is focused
       *
       * @example
       * ```typescript
       * await expect([page, '.btn']).toBeFocused(true);
       *
       * // Opposite: use false as parameter or not as property
       * await expect([page, '.btn']).not.toBeFocused();
       * ```
       */
      toBeFocused(expectedState?: boolean, options?: Options): Promise<R>;
      /**
       * Use `toHaveValue` function when you want to check that an element's value is equal to the expected value
       *
       * @example
       * ```typescript
       * // Asserting ignoring case sensitive
       * await expect([page, 'input']).toHaveValue('value', { ignoreCase: true });
       *
       * // Trimming before asserting
       * await expect([page, 'input']).toHaveValue('value', { trim: true });
       *
       * // Waiting for the element for 15s
       * await expect([page, 'input']).toHaveValue('value', { timeout: 15000 });
       * ```
       */
      toHaveValue(expectedValue: string, options?: Options): Promise<R>;
      /**
       * Use `toContainValue` function when you want to check that an element's value contains the expected string or substring
       *
       * @example
       * ```typescript
       * // Asserting ignoring case sensitive
       * await expect([page, 'input']).toContainValue('val', { ignoreCase: true });
       *
       * // Trimming before asserting
       * await expect([page, 'input']).toContainValue('val', { trim: true });
       *
       * // Waiting for the element for 15s
       * await expect([page, 'input']).toContainValue('val', { timeout: 15000 });
       * ```
       */
      toContainValue(expectedValue: string, options?: Options): Promise<R>;
      /**
       * Use `toBeEnabled` function when you want to check that an element is enabled
       *
       * @example
       * ```typescript
       * await expect([page, '.btn']).toBeEnabled(true);
       *
       * // Opposite: use false as parameter or not as property
       * await expect([page, '.btn']).toBeEnabled(false);
       * ```
       */
      toBeEnabled(expectedState?: boolean, options?: Options): Promise<R>;
      /**
       * Use `toBeChecked` function when you want to check that an element is checked
       *
       * @example
       * ```typescript
       * await expect([page, '#checkbox']).toBeChecked();
       *
       * // Opposite: use false as parameter or not as property
       * await expect([page, '#checkbox']).toBeChecked(false);
       * ```
       */
      toBeChecked(expectedState?: boolean, options?: Options): Promise<R>;
      /**
       * Use `toBeDisabled` function when you want to check that an element is disabled
       *
       * @example
       * ```typescript
       * await expect([page, '.btn']).toBeDisabled();
       *
       * // Opposite: use false as parameter or not as property
       * await expect([page, '.btn']).not.toBeDisabled();
       * ```
       */
      toBeDisabled(expectedState?: boolean, options?: Options): Promise<R>;
      /**
       * Use `toBeVisible` function when you want to check that an element is visible
       *
       * @example
       * ```typescript
       * await expect([page, '.btn']).toBeVisible();
       *
       * // Opposite: use false as parameter or not as property
       * await expect([page, '.btn']).toBeVisible(false);
       * ```
       */
      toBeVisible(expectedState?: boolean, options?: Options): Promise<R>;
      /**
       * Use `toHaveCount` function when you want to check that an elements length is equal to the expected length
       *
       * @example
       * ```typescript
       * await expect([page, 'img']).toHaveCount(3);
       *
       * // Opposite
       * await expect([page, 'img']).not.toHaveCount(3);
       * ```
       */
      toHaveCount(expectedCount: number): Promise<R>;

      /** Playwright default matchers */
      toMatchSnapshot(options?: { name?: string; threshold?: number }): R;
      toMatchSnapshot(name: string, options?: { threshold?: number }): R;
    }
  }
}

export const matchers;
