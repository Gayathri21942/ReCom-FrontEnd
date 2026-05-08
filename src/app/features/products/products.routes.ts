import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/home-page.component').then((m) => m.HomePageComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail-page.component').then((m) => m.ProductDetailPageComponent) }
];
