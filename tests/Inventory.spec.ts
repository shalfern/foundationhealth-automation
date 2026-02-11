import { test, expect, Page } from "@playwright/test";
import { InventoryPage } from "../pages/inventoryPage";
import { CartPage } from "../pages/cartPage";

test.describe.configure({ mode: "serial" });

test.describe("Inventory & Cart", () => {
  let page: Page;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  const TEST_ITEM = {
    name: "Sauce Labs Backpack",
    testId: "sauce-labs-backpack",
    description:
      "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.",
    price: "$29.99",
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

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
    await inventoryPage.assertCartCount(0);
    await inventoryPage.addItemToCart(TEST_ITEM.name);
    await inventoryPage.assertCartCount(1);
    await inventoryPage.assertRemoveButtonVisible(TEST_ITEM.name);
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
});
