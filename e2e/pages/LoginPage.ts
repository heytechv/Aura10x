import { type Page, type Locator } from '@playwright/test';
import { Navigation } from './components/Navigation';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly navigation: Navigation;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test-id="login-email-input"]');
    this.passwordInput = page.locator('[data-test-id="login-password-input"]');
    this.submitButton = page.locator('[data-test-id="login-submit-btn"]');
    this.navigation = new Navigation(page);
  }

  async goto() {
    await this.page.goto('/login');
    // Wait for hydration to complete (client:load components)
    // networkidle is usually sufficient for React to attach event listeners
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    // Ensure button is ready
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }
}
