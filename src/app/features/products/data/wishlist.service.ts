import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'recommerce_favorites';
  private readonly favoritesState = signal<string[]>(this.readStoredFavorites());
  readonly favorites = this.favoritesState.asReadonly();
  readonly count = computed(() => this.favoritesState().length);

  toggle(productId: string) {
    const current = this.favoritesState();
    const next = current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId];
    this.favoritesState.set(next);
    this.storeFavorites(next);
  }

  isFavorite(productId: string) {
    return this.favoritesState().includes(productId);
  }

  private readStoredFavorites() {
    if (typeof localStorage === 'undefined') return [];

    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]') as string[];
    } catch {
      return [];
    }
  }

  private storeFavorites(favorites: string[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
  }
}
