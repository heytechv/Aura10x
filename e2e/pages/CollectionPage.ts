import { type Page, type Locator, expect } from "@playwright/test";
import { AddPerfumeModal } from "./AddPerfumeModal";
import { PerfumeCard } from "./components/PerfumeCard";
import { Navigation } from "./components/Navigation";

export class CollectionPage {
  readonly page: Page;
  readonly addPerfumeButton: Locator;
  readonly emptyStateAddButton: Locator;
  readonly collectionGrid: Locator;
  readonly modal: AddPerfumeModal;
  readonly navigation: Navigation;

  constructor(page: Page) {
    this.page = page;
    this.addPerfumeButton = page.locator('[data-test-id="collection-add-btn"]');
    this.emptyStateAddButton = page.locator('[data-test-id="empty-state-add-btn"]');
    this.collectionGrid = page.locator('[data-test-id="collection-grid"]');
    this.modal = new AddPerfumeModal(page);
    this.navigation = new Navigation(page);
  }

  async goto() {
    await this.page.goto("/collection");
  }

  async openAddModal() {
    if (await this.emptyStateAddButton.isVisible()) {
      await this.emptyStateAddButton.click();
    } else {
      await this.addPerfumeButton.click();
    }
    // After clicking, wait for the modal's search input to be visible
    // This confirms the modal is open and ready for interaction.
    await this.modal.searchInput.waitFor({ state: "visible" });
  }

  getPerfumeCard(perfumeId: string): PerfumeCard {
    const cardLocator = this.collectionGrid.locator(`[data-test-id="perfume-card-${perfumeId}"]`);
    return new PerfumeCard(cardLocator);
  }

  async verifyPerfumeInCollection(perfumeId: string) {
    const card = this.getPerfumeCard(perfumeId);
    await card.isVisible();
  }
}
