import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Product } from '../../../shared/models/product.models';
import { ProductsService } from '../data/products.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <section class="dashboard">
      <div class="header">
        <h1>My listings</h1>
        <a mat-flat-button color="primary" routerLink="/sell">
          <mat-icon>add_circle</mat-icon>
          Add new listing
        </a>
      </div>
      <div class="listings">
        @for (item of listings(); track item.id) {
          <mat-card class="listing-card">
            <div class="listing-image">
              <img [src]="item.images[0]?.url" [alt]="item.title" />
              @if (item.isActive) {
                <span class="status-badge active">Active</span>
              } @else {
                <span class="status-badge sold">Sold</span>
              }
            </div>
            <div class="listing-content">
              <h3>{{ item.title }}</h3>
              <p class="listing-meta">{{ item.location }} · {{ item.createdAt | date : 'short' }}</p>
              <p class="listing-price">₹{{ item.price | number:'1.0-0' }}</p>
              <p class="listing-condition">{{ item.condition | titlecase }}</p>
              <div class="listing-actions">
                <a mat-button [routerLink]="['/edit', item.id]">
                  <mat-icon>edit</mat-icon>
                  Edit
                </a>
                <button mat-button color="warn" (click)="delete(item.id)">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </div>
            </div>
          </mat-card>
        } @empty {
          <mat-card class="empty-state">
            <mat-icon>inventory_2</mat-icon>
            <h3>No listings yet</h3>
            <p>Start selling by creating your first listing</p>
            <a mat-flat-button color="primary" routerLink="/sell">
              <mat-icon>add_circle</mat-icon>
              Create Listing
            </a>
          </mat-card>
        }
      </div>
    </section>
  `,
  styles: [`.dashboard{padding:2rem 1rem;max-width:1200px;margin:0 auto}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.header h1{margin:0;font-size:1.75rem}.listings{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem}.listing-card{display:grid;grid-template-columns:auto 1fr;gap:1rem;overflow:hidden}.listing-image{position:relative;width:140px;height:140px;border-radius:12px;overflow:hidden;background:#f1f5f9;flex-shrink:0}.listing-image img{width:100%;height:100%;object-fit:cover}.status-badge{position:absolute;top:.5rem;right:.5rem;padding:.35rem .75rem;border-radius:20px;font-size:.75rem;font-weight:700;text-transform:uppercase}.status-badge.active{background:#d1fae5;color:#065f46}.status-badge.sold{background:#fee2e2;color:#7f1d1d}.listing-content{display:flex;flex-direction:column;justify-content:space-between}.listing-content h3{margin:0;font-size:1.1rem;color:#0f172a}.listing-meta{margin:.25rem 0;color:#64748b;font-size:.9rem}.listing-price{margin:.5rem 0;color:#0f766e;font-weight:700;font-size:1.25rem}.listing-condition{margin:0;color:#94a3b8;font-size:.9rem}.listing-actions{display:flex;gap:.5rem;margin-top:.5rem}.listing-actions a,.listing-actions button{min-width:auto}.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem;text-align:center;grid-column:1/-1}.empty-state mat-icon{font-size:3rem;width:3rem;height:3rem;color:#cbd5e1;margin-bottom:1rem}.empty-state h3{margin:0;color:#0f172a}.empty-state p{color:#64748b;margin:.5rem 0 1rem}@media(max-width:620px){.header{flex-direction:column;gap:1rem;align-items:flex-start}.listing-card{grid-template-columns:1fr}.listing-image{width:100%;height:200px}.listings{grid-template-columns:1fr}}`]
})
export class MyListingsPageComponent {
  private readonly productsService = inject(ProductsService);
  readonly listings = signal<Product[]>([]);

  constructor() {
    this.load();
  }

  delete(id: string) {
    this.productsService.deleteProduct(id).subscribe(() => this.load());
  }

  private load() {
    this.productsService.getMyListings().subscribe((items) => this.listings.set(items));
  }
}
