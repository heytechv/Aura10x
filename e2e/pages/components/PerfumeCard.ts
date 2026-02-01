import { type Locator, expect } from "@playwright/test";

export class PerfumeCard {
  readonly cardLocator: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly loadingSpinner: Locator;

  constructor(cardLocator: Locator) {
    this.cardLocator = cardLocator;
    this.addButton = cardLocator.locator('[data-test-id="card-add-btn"]');
    this.removeButton = cardLocator.locator('[data-test-id="card-remove-btn"]');
    // The Loader2 component from lucide-react gets a class 'animate-spin'
    this.loadingSpinner = cardLocator.locator(".animate-spin");
  }

  async add() {
    await this.addButton.click();
    // After clicking, wait for the loading spinner to disappear.
    // This confirms the async operation is complete.
    await this.loadingSpinner.waitFor({ state: "hidden" });
  }

  async remove() {
    await this.removeButton.click();
  }

  async isVisible() {
    await expect(this.cardLocator).toBeVisible();
  }

  async getAddButtonText() {
    return await this.addButton.innerText();
  }

  async isAddButtonDisabled() {
    return await this.addButton.isDisabled();
  }
}
