import { Page, expect } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;

  private readonly usernameInput = () =>
    this.page.locator('[data-test="username"]');
  private readonly passwordInput = () =>
    this.page.locator('[data-test="password"]');
  private readonly loginButton = () =>
    this.page.locator('[data-test="login-button"]');
  private readonly errorMessage = () =>
    this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async enterUsername(username: string) {
    await this.usernameInput().fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async clickLogin() {
    await this.loginButton().click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
  }

  async assertLoginButtonVisible() {
    await expect(this.loginButton()).toBeVisible();
  }

  async assertErrorMessage(message: string) {
    await expect(this.errorMessage()).toBeVisible();
    await expect(this.errorMessage()).toContainText(message);
  }
}
