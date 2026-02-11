import { Page, expect } from "@playwright/test";

export class CartPage {
  private readonly page: Page;

  private readonly cartBadge = () =>
    this.page.locator('[data-test="shopping-cart-badge"]');
  private readonly cartItems = () => this.page.locator(".cart_item");
  private readonly checkoutButton = () =>
    this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = () =>
    this.page.locator('[data-test="continue-shopping"]');
  private readonly cartTitle = () => this.page.locator('[data-test="title"]');

  constructor(page: Page) {
    this.page = page;
  }

  private getCartItem(name: string) {
    return this.page.locator(".cart_item").filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: name,
      }),
    });
  }

  async removeItem(itemTestId: string) {
    await this.page.locator(`[data-test="remove-${itemTestId}"]`).click();
  }

  async checkout() {
    await this.checkoutButton().click();
  }

  async continueShopping() {
    await this.continueShoppingButton().click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge();
    if (await badge.isVisible()) {
      return parseInt((await badge.textContent()) || "0");
    }
    return 0;
  }

  async assertOnCartPage() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.cartTitle()).toHaveText("Your Cart");
  }

  async assertItemVisible(name: string) {
    await expect(this.getCartItem(name)).toBeVisible();
  }

  async assertItemNotVisible(name: string) {
    await expect(this.getCartItem(name)).not.toBeVisible();
  }

  async assertItemDetails(name: string, price: string, quantity: string) {
    const item = this.getCartItem(name);
    await expect(item).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-name"]')).toHaveText(
      name
    );
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(
      price
    );
    await expect(item.locator('[data-test="item-quantity"]')).toHaveText(
      quantity
    );
  }

  async assertCartItemCount(count: number) {
    await expect(this.cartItems()).toHaveCount(count);
  }

  async assertCheckoutButtonVisible() {
    await expect(this.checkoutButton()).toBeVisible();
  }

  async assertContinueShoppingButtonVisible() {
    await expect(this.continueShoppingButton()).toBeVisible();
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

  async assertCartEmpty() {
    await expect(this.cartItems()).toHaveCount(0);
    await expect(this.cartBadge()).not.toBeVisible();
  }
}
