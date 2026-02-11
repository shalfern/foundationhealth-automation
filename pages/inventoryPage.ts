import { Page, expect } from "@playwright/test";

export class InventoryPage {
  private readonly page: Page;

  private readonly appLogo = () => this.page.locator(".app_logo");
  private readonly pageTitle = () => this.page.locator('[data-test="title"]');
  private readonly cartBadge = () =>
    this.page.locator('[data-test="shopping-cart-badge"]');
  private readonly cartLink = () =>
    this.page.locator('[data-test="shopping-cart-link"]');
  private readonly inventoryItems = () => this.page.locator(".inventory_item");
  private readonly sortDropdown = () =>
    this.page.locator('[data-test="product-sort-container"]');

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/inventory.html");
    await this.page.waitForLoadState("networkidle");
  }

  private getItem(name: string) {
    return this.page.locator(".inventory_item").filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: name,
      }),
    });
  }

  async addItemToCart(itemName: string) {
    const item = this.getItem(itemName);
    await item.locator("button", { hasText: "Add to cart" }).click();
  }

  async goToCart() {
    await this.cartLink().click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge();
    if (await badge.isVisible()) {
      return parseInt((await badge.textContent()) || "0");
    }
    return 0;
  }

  async assertHeaderVisible() {
    await this.appLogo().waitFor({ state: "visible", timeout: 10000 });
    await expect(this.appLogo()).toHaveText("Swag Labs");
  }

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  async assertPageTitle(title: string) {
    await expect(this.pageTitle()).toHaveText(title);
  }

  async assertItemCount(count: number) {
    await expect(this.inventoryItems()).toHaveCount(count);
  }

  async assertSortDropdownVisible() {
    await expect(this.sortDropdown()).toBeVisible();
  }

  async assertItemDetails(name: string, description: string, price: string) {
    const item = this.getItem(name);
    await expect(item).toBeVisible({ timeout: 10000 });
    await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(
      name
    );
    await expect(item.locator('[data-test="inventory-item-desc"]')).toHaveText(
      description
    );
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(
      price
    );
  }

  async assertAddToCartButtonVisible(itemName: string) {
    const item = this.getItem(itemName);
    await expect(
      item.locator("button", { hasText: "Add to cart" })
    ).toBeVisible();
  }

  async assertRemoveButtonVisible(itemName: string) {
    const item = this.getItem(itemName);
    await expect(item.locator("button", { hasText: "Remove" })).toBeVisible();
  }

  async assertCartCount(expectedCount: number) {
    const badge = this.cartBadge();
    if (expectedCount === 0) {
      await expect(badge).not.toBeVisible();
    } else {
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(String(expectedCount));
    }
  }
}
