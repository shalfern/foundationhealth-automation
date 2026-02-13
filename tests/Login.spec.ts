import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Error Handling", () => {
  let loginPage: LoginPage;

  const VALID_USERNAME = process.env.LOGIN_USERNAME!;
  const VALID_PASSWORD = process.env.LOGIN_PASSWORD!;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Should show error when logging in with locked out user", async () => {
    await loginPage.login("locked_out_user", VALID_PASSWORD);
    await loginPage.assertOnLoginPage();
    await loginPage.assertErrorMessage(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  test("Should show error when logging in with empty string", async () => {
    await loginPage.login("", "");
    await loginPage.assertOnLoginPage();
    await loginPage.assertErrorMessage("Epic sadface: Username is required");
  });

  test("Should show error when logging in with invalid password", async () => {
    await loginPage.login(VALID_USERNAME, "test123");
    await loginPage.assertOnLoginPage();
    await loginPage.assertErrorMessage(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });
});
