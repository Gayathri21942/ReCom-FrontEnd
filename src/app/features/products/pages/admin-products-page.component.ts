import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Product } from '../../../shared/models/product.models';
import { ProductsService } from '../data/products.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <section class="admin-page">
      <div class="header">
        <div>
          <p class="eyebrow">Admin control</p>
          <h1>Product management</h1>
        </div>
        <a mat-flat-button color="primary" routerLink="/sell">
          <mat-icon>add</mat-icon>
          Add product
        </a>
      </div>

      <div class="product-table">
        @for (item of products(); track item.id) {
          <mat-card class="product-row">
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.category }} . {{ item.location }} . Seller: {{ item.seller.name }}</p>
            </div>
            <strong>{{ item.price | currency : 'INR' : 'symbol' : '1.0-0' }}</strong>
            <div class="actions">
              <a mat-button [routerLink]="['/product', item.id]">View</a>
              <a mat-button color="primary" [routerLink]="['/edit', item.id]">Edit</a>
              <button mat-button color="warn" (click)="delete(item.id)">Delete</button>
            </div>
          </mat-card>
        } @empty {
          <mat-card class="empty-card">No products available.</mat-card>
        }
      </div>
    </section>
  `,
  styles: [`
    .admin-page{padding:1rem}
    .header{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem}
    .eyebrow{text-transform:uppercase;letter-spacing:.08em;color:#52606d;font-size:.8rem;margin:0}
    h1{margin:.25rem 0 0}
    .product-table{display:grid;gap:.75rem}
    .product-row{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:1rem;padding:1rem}
    .product-row h3{margin:0 0 .25rem}
    .product-row p{margin:0;color:#52606d}
    .actions{display:flex;gap:.5rem;flex-wrap:wrap}
    .empty-card{padding:1rem;text-align:center}
    @media(max-width:800px){.header,.product-row{grid-template-columns:1fr}.header{align-items:flex-start}.actions{justify-content:flex-start}}
  `]
})
export class AdminProductsPageComponent {
  private readonly productsService = inject(ProductsService);
  private readonly snackBar = inject(MatSnackBar);
  readonly products = signal<Product[]>([]);

  constructor() {
    this.load();
  }

  delete(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.snackBar.open('Product deleted', 'Close', { duration: 2500 });
        this.load();
      },
      error: () => this.snackBar.open('Unable to delete product', 'Close', { duration: 2500 })
    });
  }

  private load() {
    this.productsService.getAllProducts().subscribe((items) => this.products.set(items));
  }
}
