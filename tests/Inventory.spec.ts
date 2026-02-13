import { test, expect, Page } from "@playwright/test";
import { InventoryPage } from "../pages/inventoryPage";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/checkoutPage";

test.describe.configure({ mode: "serial" });

test.describe("Inventory & Cart", () => {
  let page: Page;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  const TEST_ITEM = {
    name: "Sauce Labs Backpack",
    testId: "sauce-labs-backpack",
    description:
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
    price: "$29.99",
    thankyou: "Thank you for your order!",
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.goto();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("User is able to login and view the inventory page", async () => {
    await inventoryPage.assertOnInventoryPage();
    await inventoryPage.assertHeaderVisible();
    await inventoryPage.assertPageTitle("Products");
    await inventoryPage.assertItemCount(6);
    await inventoryPage.assertSortDropdownVisible();
    await inventoryPage.assertCartCount(0);
  });

  test("User is able to view item details on the inventory page", async () => {
    await inventoryPage.assertItemDetails(
      TEST_ITEM.name,
      TEST_ITEM.description,
      TEST_ITEM.price
    );
    await inventoryPage.assertAddToCartButtonVisible(TEST_ITEM.name);
  });

  test("User is able to add an item to the cart", async () => {
    await inventoryPage.addItemAndVerify(TEST_ITEM.name);
  });

  test("User is able to remove an item from the cart", async () => {
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertCheckoutButtonVisible();
    await cartPage.assertContinueShoppingButtonVisible();
    await cartPage.assertCartItemCount(1);
    await cartPage.assertItemDetails(TEST_ITEM.name, TEST_ITEM.price, "1");
    await cartPage.assertCartCount(1);
    await cartPage.removeItem(TEST_ITEM.testId);
    await cartPage.assertItemNotVisible(TEST_ITEM.name);
    await cartPage.assertCartEmpty();
  });

  test("User is able to complete the checkout process", async () => {
    await cartPage.continueShopping();
    await inventoryPage.addItemAndVerify(TEST_ITEM.name);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.assertOnCheckoutPage();
    await checkoutPage.fillDetails("John", "Test", "123@gmail.to");
    await checkoutPage.clickContinue();
    await checkoutPage.assertOnOverviewPage();
    await checkoutPage.assertItemDetails(TEST_ITEM.name, TEST_ITEM.price);
    await checkoutPage.assertPaymentAndShippingVisible();
    await checkoutPage.assertPriceSummaryVisible();
    await checkoutPage.assertSubtotal(TEST_ITEM.price);
    await checkoutPage.clickFinish();
    await checkoutPage.assertOrderCompleteText(TEST_ITEM.thankyou);
    await checkoutPage.assertBackHomeButtonVisible();
    await inventoryPage.assertPageTitle("Checkout: Complete!");
  });
});
