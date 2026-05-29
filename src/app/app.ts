import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { AuthStore } from './features/auth/data/auth.store';
import { CartService } from './features/products/data/cart.service';
import { WishlistService } from './features/products/data/wishlist.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatChipsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);

  readonly user = this.authStore.user;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly isAdmin = this.authStore.isAdmin;
  readonly cartCount = this.cartService.count;
  readonly wishlistCount = computed(() => this.wishlistService.favorites().length);

  logout() {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}
