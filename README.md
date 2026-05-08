# Recommerce

Recommerce is an Angular marketplace frontend for buying and selling second-hand products. It includes product discovery, product detail pages, user authentication, seller listing management, wishlist actions, and a simple buyer-seller chat experience.

The app is built with Angular standalone components, Angular Material, signals, lazy-loaded feature routes, and mock-data fallbacks so the UI can run even when a backend API is not available.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Application Routes](#application-routes)
- [Architecture Overview](#architecture-overview)
- [Backend and Environment Configuration](#backend-and-environment-configuration)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Build](#build)

## Features

- Product browsing with search, category, location, and price filters.
- Product detail view with seller and listing information.
- Create, edit, and delete product listings for authenticated users.
- Authentication screens for login and signup.
- Role-based access for regular users and admins.
- Local auth session storage using `localStorage`.
- Auth-protected routes for selling, editing, listings, and chat.
- Admin product management for listing CRUD.
- Wishlist toggle support with a live count in the app shell.
- Simple chat thread and message state for buyer-seller conversations.
- API integration with graceful local mock fallback for development.
- Demo catalog with 720 generated products, 120 products per category.

## Tech Stack

- Angular `21.2.x`
- Angular CLI `21.2.x`
- Angular Material / CDK `21.2.x`
- TypeScript `5.9.x`
- RxJS `7.8.x`
- Vitest via Angular unit-test builder
- npm `11.8.0`

## Project Structure

```text
Recommerce/
|-- public/
|   `-- favicon.ico
|-- src/
|   |-- app/
|   |   |-- core/
|   |   |   |-- guards/
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
|   |   |   `-- products/
|   |   |       |-- data/
|   |   |       |   |-- products.service.ts
|   |   |       |   `-- wishlist.service.ts
|   |   |       |-- pages/
|   |   |       |   |-- home-page.component.*
|   |   |       |   |-- my-listings-page.component.ts
|   |   |       |   |-- product-detail-page.component.ts
|   |   |       |   `-- product-form-page.component.ts
|   |   |       `-- products.routes.ts
|   |   |-- shared/
|   |   |   |-- constants/
|   |   |   |   `-- categories.ts
|   |   |   |-- data/
|   |   |   |   `-- mock-products.ts
|   |   |   |-- models/
|   |   |   |   |-- auth.models.ts
|   |   |   |   |-- chat.models.ts
|   |   |   |   `-- product.models.ts
|   |   |   `-- ui/
|   |   |       `-- product-card.component.ts
|   |   |-- app.config.ts
|   |   |-- app.routes.ts
|   |   |-- app.ts
|   |   |-- app.html
|   |   `-- app.css
|   |-- environments/
|   |   |-- environment.ts
|   |   `-- environment.prod.ts
|   |-- index.html
|   |-- main.ts
|   `-- styles.css
|-- angular.json
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- tsconfig.app.json
`-- tsconfig.spec.json
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js compatible with Angular 21
- npm 11 or newer
- Angular CLI 21, optional globally

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm start
```

The app runs at:

```text
http://localhost:4200/
```

Angular will reload the browser automatically when source files change.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the Angular development server. |
| `npm run build` | Builds the production application into `dist/`. |
| `npm run watch` | Builds in development mode and watches for changes. |
| `npm test` | Runs unit tests using the Angular unit-test builder. |
| `npm run ng` | Runs Angular CLI commands through the local CLI. |

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Product discovery home page. |
| `/product/:id` | Public | Product detail page. |
| `/auth/login` | Public | Login page. |
| `/auth/signup` | Public | Signup page. |
| `/sell` | Authenticated | Create a new product listing. |
| `/edit/:id` | Authenticated | Edit an existing product listing. |
| `/my-listings` | Authenticated | View and manage the current user's listings. |
| `/chat` | Authenticated | Buyer-seller chat page. |
| `/admin/products` | Admin | View, edit, and delete all product listings. |
| `**` | Public | Redirects unknown routes to `/`. |

## Architecture Overview

### App Shell

The root component in `src/app/app.ts` owns the main application shell. It renders the toolbar, navigation, router outlet, authentication state, logout action, and wishlist count.

### Core Layer

The `core` folder contains app-wide behavior:

- `auth.guard.ts` protects authenticated routes.
- `admin.guard.ts` protects admin-only routes.
- `auth.interceptor.ts` attaches the bearer token to outgoing HTTP requests when a user is logged in.

### Feature Modules

Each feature keeps its route definitions, page components, and feature-specific data services together:

- `features/auth` handles login, signup, and session persistence.
- `features/products` handles browsing, filtering, product CRUD, and wishlist state.
- `features/chat` handles local chat threads and messages.

### Demo Access Rules

Guests can browse products and product detail pages. Login is required to sell products, manage listings, and contact sellers for buying.

In demo fallback mode, login with `admin@recommerce.com` and any password of at least six characters to open admin product management at `/admin/products`. Any other valid email logs in as a regular user.

### Shared Layer

The `shared` folder contains reusable UI, constants, mock data, and TypeScript models used across multiple features.

### State Management

This project uses Angular signals and services for local state:

- `AuthStore` stores the current token and user profile.
- `WishlistService` stores favorite product IDs.
- `ChatService` stores demo chat threads and messages.
- `ProductsService` keeps local product state when the backend is unavailable.

## Backend and Environment Configuration

Environment files live in `src/environments/`.

Development configuration:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  apiBaseUrl: 'http://localhost:8089/loan'
};
```

The product and auth services use `environment.apiUrl` for HTTP calls.

Expected API endpoints include:

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `POST /auth/login`
- `POST /auth/signup`

If those requests fail, the app falls back to local mock/demo behavior. This makes the frontend usable while backend services are still being developed.

The fallback catalog is generated from `src/app/shared/data/mock-products.ts` and includes 120 products for each configured category.

## Development Workflow

1. Create or update models in `src/app/shared/models`.
2. Add feature-specific data access in `src/app/features/<feature>/data`.
3. Add pages in `src/app/features/<feature>/pages`.
4. Register lazy routes in the feature route file.
5. Add shared UI components to `src/app/shared/ui` only when they are reused across features.
6. Keep route protection in `core/guards` and request-level behavior in `core/interceptors`.

## Testing

Run unit tests with:

```bash
npm test
```

The default app spec is located at:

```text
src/app/app.spec.ts
```

Add focused tests beside the component or service they cover.

## Build

Create a production build with:

```bash
npm run build
```

Build output is written to:

```text
dist/
```

Production builds use the `production` configuration in `angular.json`, including output hashing and budget checks.
