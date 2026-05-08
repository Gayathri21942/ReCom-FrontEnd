import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadChildren: () => import('./features/chat/chat.routes').then((m) => m.CHAT_ROUTES)
  },
  {
    path: 'sell',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-form-page.component').then((m) => m.ProductFormPageComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/product-form-page.component').then((m) => m.ProductFormPageComponent)
  },
  {
    path: 'my-listings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/products/pages/my-listings-page.component').then((m) => m.MyListingsPageComponent)
  },
  {
    path: 'admin/products',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/products/pages/admin-products-page.component').then((m) => m.AdminProductsPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
