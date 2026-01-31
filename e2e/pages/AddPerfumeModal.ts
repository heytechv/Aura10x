import { type Page, type Locator, expect } from '@playwright/test';
import { PerfumeCard } from './components/PerfumeCard';

export class AddPerfumeModal {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly resultsGrid: Locator;
  readonly skeletonCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('[data-test-id="modal-search-input"]');
    this.resultsGrid = page.locator('[data-test-id="modal-results-grid"]');
    this.skeletonCards = page.locator('[data-test-id="skeleton-card"]');
  }

  async waitForLoad() {
    // Wait for the skeletons to appear first (indicates loading has started)
    await this.skeletonCards.first().waitFor({ state: 'visible' });
    // Then wait for them to disappear (indicates loading has finished)
    await this.skeletonCards.first().waitFor({ state: 'hidden' });
  }

  async search(query: string) {
    // Wait for the initial list of perfumes to load before allowing a search
    await this.waitForLoad();
    await this.searchInput.fill(query);
  }

  async getFirstResultId(): Promise<string> {
      // After searching, the grid updates. We must wait for the results to be visible.
      // We expect at least one card to be present.
      const firstCard = this.resultsGrid.locator('[data-test-id^="perfume-card-"]').first();
      await firstCard.waitFor({ state: 'visible' });
      const testId = await firstCard.getAttribute('data-test-id');
      if (!testId) throw new Error('First card has no data-test-id');
      return testId.replace('perfume-card-', '');
  }

  getPerfumeCard(perfumeId: string): PerfumeCard {
      const cardLocator = this.resultsGrid.locator(`[data-test-id="perfume-card-${perfumeId}"]`);
      return new PerfumeCard(cardLocator);
  }

  async addPerfume(perfumeId: string) {
      const card = this.getPerfumeCard(perfumeId);
      await card.add();
  }

  async close() {
      await this.page.keyboard.press('Escape');
  }
}
