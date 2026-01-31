import { type Page, type Locator } from '@playwright/test';

export class Navigation {
  readonly page: Page;
  readonly collectionLink: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.collectionLink = page.locator('[data-test-id="nav-collection-link"]');
    this.loginButton = page.locator('[data-test-id="nav-login-btn"]');
    this.logoutButton = page.locator('[data-test-id="nav-logout-btn"]');
  }

  async goToCollection() {
    await this.collectionLink.click();
  }

  async goToLogin() {
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
