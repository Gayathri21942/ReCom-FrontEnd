# Recommerce Frontend

Recommerce is an Angular marketplace frontend for buying and selling second-hand products. It includes product discovery, realistic mock listings, authentication screens, seller listing management, wishlist and cart persistence, checkout, order tracking, completed-order invoices, and a lightweight buyer-seller chat experience.

The app is built with Angular standalone components, Angular Material, Angular signals, lazy-loaded routes, local demo state, and HTTP fallbacks so the UI remains usable even when a backend API is unavailable.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Routes](#routes)
- [User Flows](#user-flows)
- [State and Persistence](#state-and-persistence)
- [Backend Configuration](#backend-configuration)
- [Mock Data](#mock-data)
- [Authentication](#authentication)
- [Orders and Invoices](#orders-and-invoices)
- [Image Uploads](#image-uploads)
- [Testing](#testing)
- [Production Build](#production-build)
- [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)

## Features

- Home page with product search, category filters, location filter, price filters, pagination, and category shortcuts.
- Product cards with realistic category images, favorite action, and buy navigation.
- Product detail page with image gallery, seller details, wishlist toggle, cart toggle, buy flow, and seller contact entry point.
- Authentication pages for login and signup with inline validation and clearer error messages.
- CAPTCHA check on login.
- Authenticated sell form for creating listings.
- Edit listing page for listing owners and admins.
- My Listings page for seller-owned products.
- Admin Products page protected by admin guard.
- Wishlist/Favorites persisted in browser storage with a header count and home-page section.
- Cart persisted in browser storage with a header count and home-page section.
- Checkout dialog with UPI and Cash on Delivery payment methods.
- UPI ID validation for suffixes such as `@upi`, `@ybl`, `@okaxis`, `@paytm`, `@ibl`, and `@axl`.
- Orders persisted after refresh using browser storage.
- My Orders page with Active Orders and Completed Orders tabs.
- Mark Delivered action to move active orders into completed orders.
- Completed order invoice download as a PDF file.
- Local chat page for buyer-seller conversations.
- Mock-data fallback for products and demo flows when API calls fail.

## Tech Stack

- Angular `21.2.x`
- Angular CLI `21.2.x`
- Angular Material / CDK `21.2.x`
- TypeScript `5.9.x`
- RxJS `7.8.x`
- npm `11.8.0`
- Vitest / Angular unit-test builder

## Project Structure

```text
ReCom-FrontEnd/
|-- public/
|-- src/
|   |-- app/
|   |   |-- core/
|   |   |   |-- guards/
|   |   |   |   |-- admin.guard.ts
|   |   |   |   `-- auth.guard.ts
|   |   |   `-- interceptors/
|   |   |       `-- auth.interceptor.ts
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |   |-- data/
|   |   |   |   |   |-- auth.service.ts
|   |   |   |   |   `-- auth.store.ts
|   |   |   |   |-- pages/
|   |   |   |   |   |-- login-page.component.ts
|   |   |   |   |   `-- signup-page.component.ts
|   |   |   |   `-- auth.routes.ts
|   |   |   |-- chat/
|   |   |   |   |-- data/
|   |   |   |   |   `-- chat.service.ts
|   |   |   |   |-- pages/
|   |   |   |   |   `-- chat-page.component.ts
|   |   |   |   `-- chat.routes.ts
|   |   |   |-- checkout/
|   |   |   |   `-- checkout-dialog.component.ts
|   |   |   |-- orders/
|   |   |   |   `-- my-orders.component.ts
|   |   |   `-- products/
|   |   |       |-- data/
|   |   |       |   |-- cart.service.ts
|   |   |       |   |-- products.service.ts
|   |   |       |   `-- wishlist.service.ts
|   |   |       |-- pages/
|   |   |       |   |-- admin-products-page.component.ts
|   |   |       |   |-- home-page.component.html
|   |   |       |   |-- home-page.component.ts
|   |   |       |   |-- my-listings-page.component.ts
|   |   |       |   |-- product-detail-page.component.ts
|   |   |       |   `-- product-form-page.component.ts
|   |   |       `-- products.routes.ts
|   |   |-- shared/
|   |   |   |-- constants/
|   |   |   |   |-- categories.ts
|   |   |   |   `-- indian-states.ts
|   |   |   |-- data/
|   |   |   |   `-- mock-products.ts
|   |   |   |-- models/
|   |   |   |   |-- auth.models.ts
|   |   |   |   |-- chat.models.ts
|   |   |   |   |-- payment.models.ts
|   |   |   |   `-- product.models.ts
|   |   |   |-- services/
|   |   |   |   |-- image.service.ts
|   |   |   |   `-- payment.service.ts
|   |   |   `-- ui/
|   |   |       |-- image-gallery.component.ts
|   |   |       `-- product-card.component.ts
|   |   |-- app.config.ts
|   |   |-- app.css
|   |   |-- app.html
|   |   |-- app.routes.ts
|   |   |-- app.spec.ts
|   |   `-- app.ts
|   |-- environments/
|   |   |-- environment.prod.ts
|   |   `-- environment.ts
|   |-- index.html
|   |-- main.ts
|   `-- styles.css
|-- angular.json
|-- package.json
|-- package-lock.json
|-- tsconfig.app.json
|-- tsconfig.json
`-- tsconfig.spec.json
```

## Prerequisites

Install these before running the project:

- Node.js compatible with Angular 21
- npm 11 or newer
- Angular CLI 21, optional globally because the local CLI is available through npm scripts

Check versions:

```bash
node --version
npm --version
```

## Installation

Install dependencies:

```bash
npm install
```

## Running Locally

Start the Angular development server:

```bash
npm start
```

Default URL:

```text
http://localhost:4200/
```

The dev server uses the development configuration and reloads when source files change.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts `ng serve` in development mode. |
| `npm run build` | Builds the production app into `dist/Recommerce`. |
| `npm run watch` | Runs a development build in watch mode. |
| `npm test` | Runs unit tests through the Angular unit-test builder. |
| `npm run ng` | Runs Angular CLI commands through the local CLI. |

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page with product discovery, filters, favorites, and cart sections. |
| `/product/:id` | Public | Product detail page with gallery, seller details, wishlist, cart, checkout, and contact actions. |
| `/auth/login` | Public | Login page with username, password, CAPTCHA, inline validation, and friendly errors. |
| `/auth/signup` | Public | Signup page with username, email, password, inline validation, and friendly errors. |
| `/sell` | Authenticated | Create a new product listing with image upload. |
| `/edit/:id` | Authenticated | Edit an existing listing. Only owner or admin can edit. |
| `/my-listings` | Authenticated | View and manage listings owned by the current user. |
| `/my-orders` | Authenticated | View active and completed orders, mark delivered, and download invoices. |
| `/chat` | Authenticated | Chat page for buyer-seller messages. |
| `/admin/products` | Admin | Admin product management page. |
| `**` | Public | Redirects unknown routes to `/`. |

## User Flows

### Browse and Filter Products

1. Open `/`.
2. Search by keyword.
3. Filter by category, location, minimum price, and maximum price.
4. Use pagination to browse more listings.
5. Click a product card to view details.

### Favorite Products

1. Click the heart button on a product card or product detail page.
2. The Favorites count in the header updates.
3. Favorites appear in the home page Favorites section.
4. Favorites survive refresh because they are saved to `localStorage`.

### Add Products to Cart

1. Open a product detail page.
2. Click Add to Cart.
3. The Cart count in the header updates.
4. Cart products appear in the home page Cart section.
5. Cart survives refresh because it is saved to `localStorage`.

### Sell a Product

1. Login.
2. Open `/sell`.
3. Enter title, price, category, condition, location, and description.
4. Upload at least one product image.
5. Publish the listing.
6. The listing appears in My Listings and local product state when backend fallback is used.

### Checkout and Orders

1. Login.
2. Open a product detail page.
3. Click Buy Now.
4. Select UPI or Cash on Delivery.
5. For UPI, enter a valid UPI ID such as `name@upi`, `name@ybl`, or `name@okaxis`.
6. Confirm payment/order.
7. The app navigates to My Orders.
8. The order appears under Active Orders.

### Complete an Order

1. Open `/my-orders`.
2. In Active Orders, click Mark Delivered.
3. The order status changes to `completed`.
4. COD payment is marked as `success`.
5. Tracking steps are marked complete.
6. The order moves to Completed Orders.
7. The updated order is persisted in `localStorage`.

### Download Invoice

1. Open `/my-orders`.
2. Go to Completed Orders.
3. Click Invoice.
4. A PDF file downloads directly, named like `INV-ORDER_ID.pdf`.

## State and Persistence

The app uses Angular services and signals for local state.

| Service | Purpose | Persistence |
| --- | --- | --- |
| `AuthStore` | Current token and user profile. | `localStorage` |
| `WishlistService` | Favorite product IDs. | `localStorage` |
| `CartService` | Cart product IDs. | `localStorage` |
| `PaymentService` | Orders, payment responses, tracking, invoice source data. | `localStorage` |
| `ProductsService` | Product list and CRUD fallback state. | In-memory fallback |
| `ChatService` | Demo chat threads and messages. | In-memory demo state |

Important browser storage keys:

| Key | Contents |
| --- | --- |
| `recommerce_token` | Auth token. |
| `recommerce_user` | Serialized user profile. |
| `recommerce_favorites` | Favorite product IDs. |
| `recommerce_cart` | Cart product IDs. |
| `recommerce_orders` | Completed and active order data. |

To reset local demo data, clear the browser's local storage for the app origin.

## Backend Configuration

Environment files are in `src/environments/`.

Development:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8989/recom',
  apiBaseUrl: 'http://localhost:8989/recom'
};
```

Production:

```ts
export const environment = {
  production: true,
  apiUrl: '/api',
  apiBaseUrl: '/api'
};
```

The app currently uses `environment.apiUrl` for product and auth HTTP calls.

Expected backend endpoints:

| Method | Endpoint | Used By |
| --- | --- | --- |
| `GET` | `/products` | Load product list. |
| `GET` | `/products/:id` | Load product details. |
| `POST` | `/products` | Create product listing. |
| `PUT` | `/products/:id` | Update product listing. |
| `DELETE` | `/products/:id` | Delete product listing. |
| `POST` | `/login` | Login. |
| `POST` | `/signup` | Signup. |

With the development API URL, these become:

```text
http://localhost:8989/recom/products
http://localhost:8989/recom/login
http://localhost:8989/recom/signup
```

If product API requests fail, the app falls back to local mock products. Auth requests produce friendly errors when the backend is unavailable or returns invalid credentials.

## Mock Data

Mock products live in:

```text
src/app/shared/data/mock-products.ts
```

The mock catalog includes:

- Mobiles
- Cars
- Electronics
- Furniture
- Fashion
- Property

Each category has generated products, realistic image URLs, price ranges, conditions, sellers, and Indian states as locations.

Category options live in:

```text
src/app/shared/constants/categories.ts
```

Location options live in:

```text
src/app/shared/constants/indian-states.ts
```

## Authentication

Login page:

- Username is required.
- Password is required.
- Password must be at least 6 characters.
- CAPTCHA must match the displayed challenge.
- Errors are shown inline and with snackbar feedback.

Signup page:

- Username is required and must be at least 3 characters.
- Email is required and must be valid.
- Password is required and must be at least 6 characters.
- Errors are shown inline and with snackbar feedback.

Auth state is saved by `AuthStore` in browser storage.

Route protection:

- `authGuard` protects logged-in-only routes.
- `adminGuard` protects `/admin/products`.
- `auth.interceptor.ts` attaches the stored bearer token to outgoing HTTP requests.

## Orders and Invoices

Payment and order behavior is managed by:

```text
src/app/shared/services/payment.service.ts
```

Order model:

```text
src/app/shared/models/payment.models.ts
```

Checkout behavior:

- UPI payments simulate a 90% success rate.
- COD orders are created with pending payment status.
- Successful UPI payments create an order with success payment status.
- Orders include tracking number, estimated delivery date, tracking events, product title, buyer ID, seller ID, amount, payment details, and status.

Order statuses:

- `confirmed`
- `processing`
- `completed`
- `cancelled`
- `pending`

Active Orders tab shows orders that are not completed or cancelled.

Completed Orders tab shows orders with:

```ts
status === 'completed'
```

Invoice behavior:

- Invoice button appears only on completed orders.
- Clicking Invoice downloads a PDF directly.
- The generated PDF is dependency-free and created in the browser.
- PDF contains invoice number, buyer details, seller ID, order details, tracking number, payment method, payment status, transaction ID, and total paid.

## Image Uploads

Image validation is handled by:

```text
src/app/shared/services/image.service.ts
```

Rules:

- Accepted formats: JPEG, PNG, WebP, GIF.
- Maximum size: 5 MB per image.
- Maximum count: 5 images per listing.
- Sell form requires at least one image before submit.
- Uploaded images are converted to data URLs for local preview and local fallback listing creation.

## Testing

Run tests:

```bash
npm test
```

The starter app spec is:

```text
src/app/app.spec.ts
```

Recommended test coverage areas:

- Auth validation and error states.
- Product filtering.
- Cart and wishlist persistence.
- Checkout UPI validation.
- Order completion.
- Invoice download generation.

## Production Build

Run:

```bash
npm run build
```

Build output:

```text
dist/Recommerce
```

Production configuration in `angular.json` includes:

- `environment.ts` replaced with `environment.prod.ts`
- Output hashing
- Initial bundle budget warning at `500kB`
- Initial bundle budget error at `1MB`
- Component style budget warning at `4kB`
- Component style budget error at `8kB`

## Troubleshooting

### Backend Is Not Running

If the backend is unavailable:

- Product pages use local mock data fallback.
- Login/signup show friendly connection errors.
- Local UI features such as favorites, cart, orders, and invoices still work in browser storage.

### Clear Demo State

If the UI has stale cart, favorite, auth, or order data, clear local storage in the browser dev tools.

Storage keys:

```text
recommerce_token
recommerce_user
recommerce_favorites
recommerce_cart
recommerce_orders
```

### Git Dubious Ownership

On Windows, Git may report:

```text
fatal: detected dubious ownership in repository
```

Fix by marking the repo as safe:

```bash
git config --global --add safe.directory C:/Users/Akshay/Downloads/ReCom-FrontEnd
```

### Angular Build Access Denied

In restricted or sandboxed Windows environments, Angular may fail with:

```text
Cannot read directory "../..": Access is denied.
Could not resolve "src/main.ts"
Could not resolve "src/styles.css"
```

This is usually an environment permission issue, not an application code issue. Run the build in a normal terminal with access to the project directory.

## Development Notes

- The app uses standalone Angular components instead of NgModules.
- Routes are lazy-loaded where practical.
- Keep feature-specific state inside each feature's `data` folder.
- Put reusable types in `src/app/shared/models`.
- Put reusable UI in `src/app/shared/ui`.
- Put reusable services in `src/app/shared/services`.
- Avoid adding dependencies unless they simplify a real workflow.
- The invoice PDF is intentionally dependency-free.
- Product and auth backend integration should match the endpoints documented above.
- For production-grade invoices, move invoice generation to the backend so invoice numbers, tax rules, and audit records are authoritative.
