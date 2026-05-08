import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PRODUCT_CATEGORIES } from '../../../shared/constants/categories';
import { INDIAN_STATES } from '../../../shared/constants/indian-states';
import { Product } from '../../../shared/models/product.models';
import { ProductCardComponent } from '../../../shared/ui/product-card.component';
import { ProductsService } from '../data/products.service';
import { WishlistService } from '../data/wishlist.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule, MatPaginatorModule, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styles: [`
    .hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(280px,.6fr);gap:1rem;margin:1rem;padding:2rem;align-items:center;background:linear-gradient(120deg,#123c69 0%,#1b998b 48%,#f46036 100%);color:#fff;border-radius:18px;box-shadow:0 16px 34px rgba(18,60,105,.22)}
    .hero h1{font-size:clamp(2rem,4vw,4rem);line-height:1.02;margin:.25rem 0}
    .eyebrow{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0 0 .4rem}
    .eyebrow.dark{color:#64748b}
    .subcopy{max-width:44rem;color:rgba(255,255,255,.9);font-size:1.05rem}
    .hero-actions{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.25rem}
    .hero-topline{display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:1.25rem}
    .hero-pill{display:inline-flex;align-items:center;gap:.5rem;padding:.65rem 1rem;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);font-size:.9rem;font-weight:700;color:#f8fafc}
    .hero-pill mat-icon{font-size:1rem}
    .hero-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-top:1.5rem}
    .hero-stat{display:grid;gap:.3rem;padding:1rem;border-radius:16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18)}
    .hero-stat strong{font-size:1.3rem}
    .hero-stat span{color:rgba(255,255,255,.8)}
    .deal-card{background:#fff;color:#172554;border-radius:18px;padding:1.5rem;box-shadow:0 18px 36px rgba(15,23,42,.14)}
    .deal-card .deal-icon{display:inline-flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:1rem;background:#f1f5f9;color:#0f172a;margin-bottom:1rem}
    .deal-card span{display:inline-block;background:#facc15;color:#1f2937;border-radius:999px;padding:.35rem .75rem;font-size:.78rem;font-weight:800}
    .deal-card strong{display:block;margin:.85rem 0;font-size:1.8rem;line-height:1.05}
    .deal-card p{margin:0 0 1rem;color:#475569;font-size:1rem}
    .deal-card ul{margin:0;padding-left:1.25rem;color:#475569}
    .deal-card li{margin:.45rem 0}
    .category-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.75rem;margin:1rem}
    .category-tile{border:0;border-radius:14px;background:#fff;padding:1rem .75rem;box-shadow:0 8px 22px rgba(15,23,42,.08);font-weight:800;color:#25324b;cursor:pointer}
    .category-tile span{display:grid;place-items:center;width:2rem;height:2rem;margin:0 auto .5rem;border-radius:50%;background:#e0f2fe;color:#075985}
    .category-tile.selected{background:#172554;color:#fff}
    .category-tile.selected span{background:#facc15;color:#1f2937}
    .filters-card{margin:1rem;padding:1rem;border-radius:16px}
    .filters-heading,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:.75rem}
    .section-heading{margin:1.25rem 1rem .25rem}
    .section-heading h2{margin:0;color:#172554}
    .filters-grid{display:grid;grid-template-columns:2fr repeat(4,minmax(150px,1fr));gap:1rem}
    .product-grid{padding:1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1rem}
    .status-card,.centered{margin:1rem;padding:2rem;text-align:center}
    .favorites-section{padding:0 1rem 1rem}
    .favorites-section .product-grid{padding:0}
    @media(max-width:900px){.hero{grid-template-columns:1fr}.filters-grid{grid-template-columns:1fr 1fr}}
    @media(max-width:620px){.hero{margin:0;border-radius:0;padding:1.5rem}.filters-grid{grid-template-columns:1fr}.section-heading{align-items:flex-start;flex-direction:column}}
  `]
})
export class HomePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productsService = inject(ProductsService);
  readonly wishlist = inject(WishlistService);
  readonly categories = PRODUCT_CATEGORIES;
  readonly states = INDIAN_STATES;
  readonly loading = signal(true);
  readonly error = signal('');
  readonly products = signal<Product[]>([]);
  readonly allLoadedProducts = signal<Product[]>([]);
  readonly total = signal(0);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(6);
  readonly pageSizeOptions = [6, 12, 18, 36];

  readonly filtersForm = this.fb.nonNullable.group({
    query: [''],
    category: [''],
    location: [''],
    minPrice: [null as number | null],
    maxPrice: [null as number | null]
  });

  readonly favoriteProducts = computed(() => this.allLoadedProducts().filter((product) => this.wishlist.isFavorite(product.id)));

  constructor() {
    this.loadFavoritesSource();
    this.filtersForm.valueChanges.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.pageIndex.set(0);
      this.loadProducts();
    });
    this.loadProducts();
  }

  changePage(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  selectCategory(category: string) {
    this.filtersForm.patchValue({ category });
  }

  clearFilters() {
    this.filtersForm.reset({
      query: '',
      category: '',
      location: '',
      minPrice: null,
      maxPrice: null
    });
  }

  private loadProducts() {
    this.loading.set(true);
    this.error.set('');
    this.productsService.getProducts({
      query: this.filtersForm.value.query || '',
      category: this.filtersForm.value.category || '',
      location: this.filtersForm.value.location || '',
      minPrice: this.filtersForm.value.minPrice ?? null,
      maxPrice: this.filtersForm.value.maxPrice ?? null,
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize()
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.products.set(response.items);
        this.total.set(response.total);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load products right now.');
      }
    });

  }

  private loadFavoritesSource() {
    this.productsService.getAllProducts().subscribe((items) => this.allLoadedProducts.set(items));
  }
}
