// e2e/tests/helpers/LocalStorage.ts
import type { BrowserContext } from '@playwright/test';
import config from '../../playwright.config';

export class LocalStorage {
  private context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  get localStorage() {
    return this.context.storageState().then((storage) => {
      const origin = storage.origins.find(({ origin }) => origin === config.use?.baseURL);
      if (origin) {
        return origin.localStorage.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {});
      }
      return {};
    });
  }
}
