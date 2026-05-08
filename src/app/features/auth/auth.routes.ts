import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login-page.component').then((m) => m.LoginPageComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup-page.component').then((m) => m.SignupPageComponent) }
];
