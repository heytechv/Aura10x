import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CollectionPage } from './pages/CollectionPage';
import { ensureTestUser, deleteTestUser } from './utils/auth';

test.describe('Collection Management', () => {
  let loginPage: LoginPage;
  let collectionPage: CollectionPage;
  let testUser: { email: string; password: string; user?: any };

  test.beforeEach(async ({ page }) => {
    // Ensure test user exists
    testUser = await ensureTestUser();
    console.log(`Using test user: ${testUser.email}`);

    loginPage = new LoginPage(page);
    collectionPage = new CollectionPage(page);
  });

  test.afterEach(async () => {
    if (testUser?.user?.id) {
      await deleteTestUser(testUser.user.id);
    }
  });

  test('should allow user to add perfume to collection', async ({ page }) => {
    // Debug requests
    page.on('request', request => console.log('>>', request.method(), request.url()));
    page.on('response', response => console.log('<<', response.status(), response.url()));

    // 1. Login
    await loginPage.goto();

    // Wait for successful login response and navigation update
    const loginResponsePromise = page.waitForResponse(response => 
      response.url().includes('/api/auth/signin')
    );

    await loginPage.login(testUser.email, testUser.password);
    const response = await loginResponsePromise;

    if (response.status() !== 200) {
      // Log error details for debugging
      const body = await response.text();
      console.error(`Login failed with status ${response.status()}: ${body}`);
      throw new Error(`Login failed with status ${response.status()}`);
    }
    
    // Verify login by checking if logout button is visible in navigation
    await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 10000 });
    
    // 2. Navigate to Collection (if not already there)
    await collectionPage.goto();
    await expect(page).toHaveURL(/.*\/collection/);
    
    // 3. Open Add Modal
    await collectionPage.openAddModal();
    
    // 4. Search for perfume
    const searchQuery = 'Chanel';
    // Start waiting for the search response BEFORE triggering the search
    const searchResponsePromise = page.waitForResponse(response =>
      response.url().includes(`/api/perfumes?q=${searchQuery}`) && response.status() === 200
    );
    await collectionPage.modal.search(searchQuery);
    await searchResponsePromise; // Wait for the search to complete

    // 5. Get first result ID
    const perfumeId = await collectionPage.modal.getFirstResultId();
    console.log(`Adding perfume with ID: ${perfumeId}`);
    
    // 6. Add to collection
    await collectionPage.modal.addPerfume(perfumeId);
    
    // 7. Verify button state change
    const card = collectionPage.modal.getPerfumeCard(perfumeId);
    expect(await card.getAddButtonText()).toBe('W kolekcji');
    expect(await card.isAddButtonDisabled()).toBe(true);

    // 8. Close Modal
    await collectionPage.modal.close();
    
    // 9. Verify in Collection Grid
    await collectionPage.verifyPerfumeInCollection(perfumeId);
  });
});
