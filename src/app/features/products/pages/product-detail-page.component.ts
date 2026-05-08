import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.models';
import { AuthStore } from '../../auth/data/auth.store';
import { ProductsService } from '../data/products.service';
import { WishlistService } from '../data/wishlist.service';
import { CartService } from '../data/cart.service';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatSnackBarModule],
  template: `
    @if (product()) {
      <section class="detail-page">
        <img [src]="product()!.images[0]?.url || fallbackImage" [alt]="product()!.title" />
        <mat-card>
          <div class="detail-header">
            <div>
              <h1>{{ product()!.title }}</h1>
              <p class="detail-meta">{{ product()!.location }} · {{ product()!.createdAt | date : 'mediumDate' }}</p>
            </div>
            <button class="favorite-chip" mat-stroked-button (click)="wishlist.toggle(product()!.id)">
              <mat-icon>{{ wishlist.isFavorite(product()!.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
              {{ wishlist.isFavorite(product()!.id) ? 'Saved' : 'Save' }}
            </button>
          </div>

          <h2>{{ product()!.price | currency : 'INR' : 'symbol' : '1.0-0' }}</h2>
          <p>{{ product()!.description }}</p>
          <mat-chip-set>
            <mat-chip>{{ product()!.category | titlecase }}</mat-chip>
            <mat-chip>{{ product()!.condition }}</mat-chip>
            <mat-chip>{{ product()!.location }}</mat-chip>
          </mat-chip-set>

          <div class="actions">
            <button class="action-button buy-now" mat-flat-button color="primary" (click)="buyNow()">
              <span class="button-icon" aria-hidden="true">🛒</span>
              Buy Now
            </button>
            <button class="action-button add-cart" mat-stroked-button color="accent" (click)="toggleCart()">
              <span class="button-icon" aria-hidden="true">🛍️</span>
              {{ cart.isInCart(product()!.id) ? 'In Cart' : 'Add cart' }}
            </button>
          </div>
        </mat-card>
      </section>
    } @else {
      <mat-card class="loading-card">Loading product...</mat-card>
    }
  `,
  styles: [`.detail-page{display:grid;grid-template-columns:1.2fr 1fr;gap:1rem;padding:1rem}img{width:100%;border-radius:24px;object-fit:cover}.actions{display:flex;gap:1rem;margin-top:1rem}.button-icon{display:inline-flex;align-items:center;margin-right:.4rem;font-size:1.05rem}.loading-card{margin:1rem;padding:2rem}@media(max-width:900px){.detail-page{grid-template-columns:1fr}}`]
})
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authStore = inject(AuthStore);
  private readonly productsService = inject(ProductsService);
  readonly wishlist = inject(WishlistService);
  readonly cart = inject(CartService);
  readonly product = signal<Product | undefined>(undefined);
  readonly fallbackImage = 'https://via.placeholder.com/800x520?text=Recommerce';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.productsService.getProductById(id).subscribe((product) => this.product.set(product));
  }

  buyNow() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Please login to buy or contact the seller.', 'Close', { duration: 3000 });
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    this.snackBar.open('Ready to buy — continue to chat with the seller.', 'Close', { duration: 3000 });
    window.open('/chat', '_blank');
  }


  toggleCart() {
    if (!this.product()) return;

    this.cart.toggle(this.product()!.id);
    this.snackBar.open(
      this.cart.isInCart(this.product()!.id) ? 'Added to cart' : 'Removed from cart',
      'Close',
      { duration: 2500 }
    );
  }
}
