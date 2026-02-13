## Setup

1. Clone the repository
   git clone https://github.com/shalfern/foundationhealth-automation.git
   cd foundationhealth-automation

2. Install dependencies
   npm install

3. Install Playwright browsers
   npx playwright install

4.  Create `.env` file
    .env

   Then update `.env` with credentials:
   ```
 LOGIN_USERNAME=standard_user
 LOGIN_PASSWORD=secret_sauce


## Run Tests

4. npx playwright test --headed (see test run on the browser)

## Notes
- Tests run in serial mode sharing a single browser session.
- Test Flow: Login → browse → add to cart → remove from cart.
- Complete Checkout flow
- Invalid Login Scenarios

## ToDo
- Create a common/ or utils/ folder for shared methods used across multiple page objects.
- Complete checkout flow (checkout → fill details → confirm → order complete)
- Add multiple items to cart and verify total
- Cancel order during checkout and verify cart is preserved
- Verify "Continue Shopping" button returns to inventory from cart
- Sort products by name and price (A-Z, Z-A, low-high, high-low)
- Verify other types of login behaviors, error states
- Verify session timeout behaviour
- Notifications on receipts
