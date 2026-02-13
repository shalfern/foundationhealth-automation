import { Page, expect } from "@playwright/test";

export class CheckoutPage {
  private readonly page: Page;

  private readonly firstName = () =>
    this.page.locator('[data-test="firstName"]');
  private readonly lastName = () => this.page.locator('[data-test="lastName"]');
  private readonly postalCode = () =>
    this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = () =>
    this.page.locator('[data-test="continue"]');
  private readonly pageTitle = () => this.page.locator('[data-test="title"]');
  private readonly itemName = () =>
    this.page.locator('[data-test="inventory-item-name"]');
  private readonly itemPrice = () =>
    this.page.locator('[data-test="inventory-item-price"]');
  private readonly paymentInfo = () =>
    this.page.locator('[data-test="payment-info-value"]');
  private readonly shippingInfo = () =>
    this.page.locator('[data-test="shipping-info-value"]');
  private readonly subtotal = () =>
    this.page.locator('[data-test="subtotal-label"]');
  private readonly tax = () => this.page.locator('[data-test="tax-label"]');
  private readonly total = () => this.page.locator('[data-test="total-label"]');
  private readonly finishButton = () =>
    this.page.locator('[data-test="finish"]');
  private readonly thankyouText = () =>
    this.page.locator('[data-test="complete-header"]');
  private readonly backHomeButton = () =>
    this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    this.page = page;
  }

  async fillDetails(first: string, last: string, zip: string) {
    await this.firstName().fill(first);
    await this.lastName().fill(last);
    await this.postalCode().fill(zip);
  }

  async clickContinue() {
    await this.continueButton().click();
  }

  async clickFinish() {
    await this.finishButton().click();
  }

  async assertOnCheckoutPage() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async assertOnOverviewPage() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.pageTitle()).toHaveText("Checkout: Overview");
  }

  async assertItemDetails(name: string, price: string) {
    await expect(this.itemName()).toHaveText(name);
    await expect(this.itemPrice()).toHaveText(price);
  }

  async assertPaymentAndShippingVisible() {
    await expect(this.paymentInfo()).toBeVisible();
    await expect(this.shippingInfo()).toBeVisible();
  }

  async assertPriceSummaryVisible() {
    await expect(this.subtotal()).toBeVisible();
    await expect(this.tax()).toBeVisible();
    await expect(this.total()).toBeVisible();
  }

  async assertSubtotal(price: string) {
    await expect(this.subtotal()).toContainText(price);
  }

  async assertFinishButtonVisible() {
    await expect(this.finishButton()).toBeVisible();
  }

  async assertOrderCompleteText(thankyou: string) {
    await expect(this.thankyouText()).toContainText(thankyou);
  }

  async assertBackHomeButtonVisible() {
    await expect(this.backHomeButton()).toBeVisible();
  }
}
