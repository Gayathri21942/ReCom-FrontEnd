import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Product } from '../../../shared/models/product.models';
import { ProductsService } from '../data/products.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <section class="dashboard">
      <div class="header">
        <h1>My listings</h1>
        <a mat-flat-button color="primary" routerLink="/sell">Add new listing</a>
      </div>
      <div class="listings">
        @for (item of listings(); track item.id) {
          <mat-card>
            <h3>{{ item.title }}</h3>
            <p>{{ item.location }} . Rs {{ item.price }}</p>
            <div class="actions">
              <a mat-button [routerLink]="['/edit', item.id]">Edit</a>
              <button mat-button color="warn" (click)="delete(item.id)">Delete</button>
            </div>
          </mat-card>
        } @empty {
          <mat-card>You have not posted any listings yet.</mat-card>
        }
      </div>
    </section>
  `,
  styles: [`.dashboard{padding:1rem}.header{display:flex;justify-content:space-between;align-items:center}.listings{display:grid;gap:1rem}.actions{display:flex;gap:.5rem}`]
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
