import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MOCK_PRODUCTS } from '../../../shared/data/mock-products';
import { Product, ProductFilters, ProductListResponse, ProductPayload } from '../../../shared/models/product.models';
import { AuthStore } from '../../auth/data/auth.store';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl = environment.apiUrl;
  private readonly localProducts = new BehaviorSubject<Product[]>(MOCK_PRODUCTS);

  getProducts(filters: ProductFilters): Observable<ProductListResponse> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(() => this.localProducts.pipe(delay(250))),
      map((products) => this.applyFilters(products, filters))
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(catchError(() => this.localProducts.pipe(delay(250))));
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(() => this.localProducts.pipe(map((products) => products.find((product) => product.id === id))))
    );
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, payload).pipe(
      catchError(() => {
        const user = this.authStore.user();
        const product: Product = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          seller: { id: user?.id || 'seller-demo', name: user?.name || 'You' },
          ...payload,
          condition: payload.condition as Product['condition']
        };
        this.localProducts.next([product, ...this.localProducts.value]);
        return of(product).pipe(delay(250));
      })
    );
  }

  updateProduct(id: string, payload: ProductPayload): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, payload).pipe(
      catchError(() => {
        const updated = this.localProducts.value.map((item) =>
          item.id === id ? { ...item, ...payload, condition: payload.condition as Product['condition'] } : item
        );
        this.localProducts.next(updated);
        return of(updated.find((item) => item.id === id) as Product).pipe(delay(250));
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(() => {
        this.localProducts.next(this.localProducts.value.filter((item) => item.id !== id));
        return of(void 0).pipe(delay(200));
      })
    );
  }

  getMyListings(): Observable<Product[]> {
    const userId = this.authStore.user()?.id || 'seller-1';
    return this.localProducts.pipe(map((products) => products.filter((product) => product.seller.id === userId)));
  }

  private applyFilters(products: Product[], filters: ProductFilters): ProductListResponse {
    const query = filters.query.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const minPrice = Number(filters.minPrice);
    const maxPrice = Number(filters.maxPrice);

    const filtered = products.filter((product) => {
      const searchable = `${product.title} ${product.description} ${product.category} ${product.condition} ${product.location} ${product.seller.name}`.toLowerCase();
      const matchesQuery = !query || searchable.includes(query);
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesLocation = !location || product.location.toLowerCase().includes(location);
      const matchesMin = filters.minPrice === null || Number.isNaN(minPrice) || product.price >= minPrice;
      const matchesMax = filters.maxPrice === null || Number.isNaN(maxPrice) || product.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesLocation && matchesMin && matchesMax;
    });

    const start = filters.pageIndex * filters.pageSize;
    return { items: filtered.slice(start, start + filters.pageSize), total: filtered.length };
  }
}
