import { Injectable, computed, signal } from '@angular/core';
import { UserProfile } from '../../../shared/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly tokenState = signal<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem('recommerce_token') : null);
  private readonly userState = signal<UserProfile | null>(
    typeof localStorage !== 'undefined' && localStorage.getItem('recommerce_user')
      ? JSON.parse(localStorage.getItem('recommerce_user') as string)
      : null
  );

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenState());
  readonly isAdmin = computed(() => this.userState()?.role === 'admin');

  setSession(token: string, user: UserProfile) {
    this.tokenState.set(token);
    this.userState.set(user);
    localStorage.setItem('recommerce_token', token);
    localStorage.setItem('recommerce_user', JSON.stringify(user));
  }

  logout() {
    this.tokenState.set(null);
    this.userState.set(null);
    localStorage.removeItem('recommerce_token');
    localStorage.removeItem('recommerce_user');
  }
}
