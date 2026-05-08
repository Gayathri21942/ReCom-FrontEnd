import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'recommerce_cart';
  private readonly cartState = signal<string[]>(this.readStoredCart());
  readonly items = this.cartState.asReadonly();
  readonly count = computed(() => this.cartState().length);

  add(productId: string) {
    const current = this.cartState();
    if (!current.includes(productId)) {
      const next = [...current, productId];
      this.cartState.set(next);
      this.storeCart(next);
    }
  }

  remove(productId: string) {
    const current = this.cartState();
    const next = current.filter((id) => id !== productId);
    this.cartState.set(next);
    this.storeCart(next);
  }

  isInCart(productId: string) {
    return this.cartState().includes(productId);
  }

  toggle(productId: string) {
    if (this.isInCart(productId)) {
      this.remove(productId);
    } else {
      this.add(productId);
    }
  }

  private readStoredCart() {
    if (typeof localStorage === 'undefined') return [];

    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]') as string[];
    } catch {
      return [];
    }
  }

  private storeCart(items: string[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }
}
