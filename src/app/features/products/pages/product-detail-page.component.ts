import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.models';
import { ImageGalleryComponent } from '../../../shared/ui/image-gallery.component';
import { CheckoutDialogComponent } from '../../checkout/checkout-dialog.component';
import { AuthStore } from '../../auth/data/auth.store';
import { ProductsService } from '../data/products.service';
import { WishlistService } from '../data/wishlist.service';
import { CartService } from '../data/cart.service';

@Component({
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, MatSnackBarModule, MatDialogModule, ImageGalleryComponent],
  template: `
    @if (product()) {
      <section class="detail-page">
        <div class="gallery-section">
          <app-image-gallery [images]="product()!.images"></app-image-gallery>
        </div>

        <mat-card class="details-card">
          <div class="detail-header">
            <div class="title-section">
              <h1>{{ product()!.title }}</h1>
              <p class="detail-meta">{{ product()!.location }} · {{ product()!.createdAt | date : 'mediumDate' }}</p>
            </div>
            <button class="favorite-chip" mat-stroked-button (click)="wishlist.toggle(product()!.id)">
              <mat-icon>{{ wishlist.isFavorite(product()!.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
              {{ wishlist.isFavorite(product()!.id) ? 'Saved' : 'Save' }}
            </button>
          </div>

          <div class="price-section">
            <h2 class="price">{{ product()!.price | currency : 'INR' : 'symbol' : '1.0-0' }}</h2>
            @if (product()!.condition) {
              <span class="condition-badge" [class]="product()!.condition">{{ product()!.condition | titlecase }}</span>
            }
          </div>

          <div class="description-section">
            <h3>About this item</h3>
            <p>{{ product()!.description }}</p>
          </div>

          <mat-chip-set>
            <mat-chip>{{ product()!.category | titlecase }}</mat-chip>
            <mat-chip>{{ product()!.condition | titlecase }}</mat-chip>
            <mat-chip>{{ product()!.location }}</mat-chip>
          </mat-chip-set>

          <div class="seller-section">
            <div class="seller-info">
              <div class="seller-avatar">{{ product()!.seller.name.charAt(0).toUpperCase() }}</div>
              <div class="seller-details">
                <h3>{{ product()!.seller.name }}</h3>
                <p class="seller-meta">
                  @if (product()!.seller.rating !== undefined) {
                    <span class="rating">
                      <mat-icon>star</mat-icon>
                      {{ product()!.seller.rating }}/5
                    </span>
                  }
                  @if (product()!.seller.totalListings !== undefined) {
                    <span class="listings">{{ product()!.seller.totalListings }} listings</span>
                  }
                  @if (product()!.seller.responseTime) {
                    <span class="response">Response: {{ product()!.seller.responseTime }}</span>
                  }
                </p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="action-button buy-now" mat-flat-button color="primary" (click)="buyNow()">
              <span class="button-icon" aria-hidden="true">🛒</span>
              Buy Now
            </button>
            <button class="action-button add-cart" mat-stroked-button color="accent" (click)="toggleCart()">
              <span class="button-icon" aria-hidden="true">🛍️</span>
              {{ cart.isInCart(product()!.id) ? 'In Cart' : 'Add to Cart' }}
            </button>
            <button class="action-button contact" mat-stroked-button (click)="contactSeller()">
              <mat-icon>mail</mat-icon>
              Contact Seller
            </button>
          </div>
        </mat-card>
      </section>
    } @else {
      <mat-card class="loading-card">
        <mat-icon class="loading-spinner">hourglass_empty</mat-icon>
        <p>Loading product...</p>
      </mat-card>
    }
  `,
  styles: [`.detail-page{display:grid;grid-template-columns:1.2fr 1fr;gap:2rem;padding:2rem}.gallery-section{border-radius:16px;overflow:hidden}.details-card{border-radius:14px}.detail-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1.5rem}.title-section h1{margin:0;font-size:1.75rem;color:#0f172a}.title-section p{margin:.5rem 0 0;color:#64748b}.detail-meta{margin:.5rem 0 0;color:#64748b;font-size:.95rem}.favorite-chip{border-radius:999px}.price-section{display:flex;align-items:center;gap:1rem;margin:1.5rem 0}.price{margin:0;font-size:2rem;color:#0f766e;font-weight:700}.condition-badge{display:inline-block;padding:.5rem 1rem;border-radius:8px;font-size:.85rem;font-weight:600;text-transform:uppercase}.condition-badge.new{background:#d1fae5;color:#065f46}.condition-badge.like-new{background:#dbeafe;color:#0c4a6e}.condition-badge.good{background:#fef3c7;color:#78350f}.condition-badge.fair{background:#fee2e2;color:#7f1d1d}.description-section{margin:1.5rem 0}.description-section h3{margin:0 0 .75rem;color:#0f172a;font-size:1.1rem}.description-section p{margin:0;color:#475569;line-height:1.6}.seller-section{margin:2rem 0;padding:1.5rem;border-radius:12px;background:#f8fafc}.seller-info{display:flex;align-items:center;gap:1rem}.seller-avatar{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#1976d2;color:#fff;font-weight:700;font-size:1.25rem;flex-shrink:0}.seller-details h3{margin:0;color:#0f172a;font-size:1.05rem}.seller-meta{margin:.5rem 0 0;color:#64748b;font-size:.9rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center}.seller-meta span{display:flex;align-items:center;gap:.25rem}.seller-meta mat-icon{font-size:1rem;width:1rem;height:1rem}.rating{color:#f59e0b}.actions{display:flex;flex-direction:column;gap:.75rem;margin-top:2rem}.action-button{width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem}.buy-now{background:#0f766e;font-weight:600}.button-icon{display:inline-flex;align-items:center;margin-right:.4rem;font-size:1.05rem}.loading-card{margin:2rem;padding:3rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem}.loading-spinner{font-size:2.5rem;width:2.5rem;height:2.5rem;animation:spin .6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}@media(max-width:900px){.detail-page{grid-template-columns:1fr;gap:1.5rem;padding:1rem}.seller-meta{flex-direction:column;gap:.5rem;align-items:flex-start}.actions{flex-direction:row}.action-button{flex:1}}`]
  })
export class ProductDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
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

    const product = this.product();
    if (!product) return;

    const user = this.authStore.user();
    const dialogRef = this.dialog.open(CheckoutDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        sellerName: product.seller.name,
        buyerId: user?.id || 'buyer-demo',
        sellerId: product.seller.id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        const method = result.method === 'upi' ? 'UPI' : 'Cash on Delivery';
        this.snackBar.open(`Order placed successfully via ${method}!`, 'Close', { duration: 4000 });
        // Navigate to orders page (create if needed)
        this.router.navigate(['/my-orders']);
      }
    });
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

  contactSeller() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Please login to contact the seller.', 'Close', { duration: 3000 });
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const product = this.product();
    if (!product) return;

    this.snackBar.open(`Opening chat with ${product.seller.name}...`, 'Close', { duration: 2500 });
    window.open(`/chat?sellerId=${product.seller.id}&productId=${product.id}`, '_blank');
  }
}
