import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../models/product.models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="product-card">
      <a [routerLink]="['/product', product.id]" class="image-wrap">
        <span class="deal-badge">Deal</span>
        <img [src]="product.images[0]?.url || fallbackImage" [alt]="product.title" />
      </a>
      <mat-card-content>
        <div class="price-row">
          <strong>{{ product.price | currency : 'INR' : 'symbol' : '1.0-0' }}</strong>
          <button
            class="favorite-button"
            mat-icon-button
            type="button"
            [class.selected]="favorite"
            [attr.aria-label]="favorite ? 'Remove from favorites' : 'Add to favorites'"
            (click)="toggleFavorite($event)"
          >
            <span aria-hidden="true" [innerHTML]="favorite ? '&#9829;' : '&#9825;'"></span>
          </button>
        </div>
        <a class="title" [routerLink]="['/product', product.id]">{{ product.title }}</a>
        <p>{{ product.location }} . {{ product.createdAt | date : 'mediumDate' }}</p>
        <mat-chip-set>
          <mat-chip>{{ product.category | titlecase }}</mat-chip>
          <mat-chip>{{ product.condition }}</mat-chip>
        </mat-chip-set>
        <div class="card-actions">
          <button class="buy-button" mat-flat-button type="button" [routerLink]="['/product', product.id]" [queryParams]="{ action: 'buy' }">
            <span class="buy-icon" aria-hidden="true">🛒</span>
            Buy
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .product-card{height:100%;border-radius:14px;overflow:hidden;border:1px solid rgba(15,23,42,.08);box-shadow:0 10px 24px rgba(15,23,42,.08);transition:transform .18s ease,box-shadow .18s ease}
    .product-card:hover{transform:translateY(-3px);box-shadow:0 16px 34px rgba(15,23,42,.14)}
    .image-wrap{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:#f2f4f5}
    .deal-badge{position:absolute;top:.75rem;left:.75rem;z-index:1;background:#f97316;color:#fff;border-radius:999px;padding:.25rem .6rem;font-size:.75rem;font-weight:900}
    img{width:100%;height:100%;object-fit:cover}
    .price-row{display:flex;justify-content:space-between;align-items:center}
    .price-row strong{font-size:1.25rem;color:#0f766e}
    .favorite-button{color:#64748b;font-size:1.55rem;line-height:1;background:#fff7ed}
    .favorite-button.selected{color:#e11d48;background:#ffe4e6}
    .title{display:inline-block;margin:.4rem 0;color:#102a43;font-weight:700;text-decoration:none}
    p{color:#52606d;margin:0 0 .7rem}
    .card-actions{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:1rem}
    .buy-button{background:#facc15;color:#1f2937}
    .buy-button.mat-flat-button{box-shadow:none}
    .buy-icon{display:inline-flex;align-items:center;margin-right:.35rem;font-size:1rem}
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() favorite = false;
  @Output() favoriteToggled = new EventEmitter<string>();

  readonly fallbackImage = 'https://via.placeholder.com/640x480?text=Recommerce';

  toggleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggled.emit(this.product.id);
  }
}
