import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, LoginRequest, SignupRequest } from '../../../shared/models/auth.models';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly apiUrl = environment.apiUrl;

  login(payload: LoginRequest): Observable<any> {
    const loginPayload = { username: payload.username, password: payload.password };
    console.log('Login request:', loginPayload, 'to:', `${this.apiUrl}/login`);
    return this.http.post(`${this.apiUrl}/login`, loginPayload, { responseType: 'text' as const }).pipe(
      tap((response: any) => {
        const authResponse = this.parseRawAuthResponse(response, payload);
        console.log('Processed auth response:', authResponse);
        this.authStore.setSession(authResponse.token, authResponse.user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        return throwError(() => this.createFriendlyError(error));
      })
    );
  }

  signup(payload: SignupRequest): Observable<any> {
    const signupPayload = { username: payload.username, email: payload.email, password: payload.password };
    console.log('Signup request:', signupPayload, 'to:', `${this.apiUrl}/signup`);
    return this.http.post(`${this.apiUrl}/signup`, signupPayload, { responseType: 'text' as const }).pipe(
      tap((response: any) => {
        const authResponse = this.parseRawAuthResponse(response, payload);
        console.log('Processed auth response:', authResponse);
        this.authStore.setSession(authResponse.token, authResponse.user);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Signup error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          error: error.error
        });
        return throwError(() => this.createFriendlyError(error));
      })
    );
  }

  private parseRawAuthResponse(response: any, payload: LoginRequest | SignupRequest): AuthResponse {
    if (typeof response === 'string') {
      const trimmed = response.trim();
      if (trimmed.startsWith('{')) {
        try {
          const json = JSON.parse(trimmed);
          return json as AuthResponse;
        } catch {
          // fallback to default token/user creation
        }
      }

      return {
        token: `token-${Date.now()}`,
        user: {
          id: payload.username,
          name: payload.username,
          email: 'email' in payload ? payload.email : `${payload.username}@recommerce.com`,
          role: 'user',
          location: 'Unknown'
        }
      };
    }

    if (response && typeof response === 'object') {
      return response as AuthResponse;
    }

    throw new Error('Invalid auth response format from backend');
  }

  private createFriendlyError(error: HttpErrorResponse) {
    let rawMessage = '';

    if (typeof error.error === 'string') {
      rawMessage = error.error.trim();
      if (rawMessage.startsWith('{')) {
        try {
          const parsed = JSON.parse(rawMessage);
          rawMessage = parsed?.message || parsed?.error || rawMessage;
        } catch {
          // ignore parse failure
        }
      }
    } else if (error.error && typeof error.error === 'object') {
      rawMessage = error.error.message || JSON.stringify(error.error);
    }

    rawMessage = (rawMessage || error.statusText || error.message || 'Unknown error').toString();
    const lower = rawMessage.toLowerCase();
    let userMessage = 'Something went wrong. Please try again.';

    if (error.status === 0) {
      userMessage = 'Cannot connect to the server. Please check that the backend is running and try again.';
    } else if (error.status === 400) {
      userMessage = rawMessage && rawMessage !== 'Bad Request' ? rawMessage : 'Some details are invalid. Please check the form and try again.';
    } else if (error.status === 401) {
      userMessage = 'Invalid username or password. Please check your login details.';
    } else if (error.status === 403) {
      userMessage = 'Request blocked by backend. Check CORS/security settings and retry.';
    } else if (error.status >= 500) {
      userMessage = 'Server error. Please try again in a moment.';
    } else if (lower.includes('username') && (lower.includes('exists') || lower.includes('taken') || lower.includes('duplicate') || lower.includes('already'))) {
      userMessage = 'Username already taken. Please choose another one.';
    } else if (lower.includes('email') && (lower.includes('exists') || lower.includes('taken') || lower.includes('duplicate') || lower.includes('already'))) {
      userMessage = 'Email already registered. Please use a different email.';
    } else if (lower.includes('invalid credentials') || lower.includes('bad credentials') || lower.includes('incorrect username') || lower.includes('incorrect password')) {
      userMessage = 'Invalid username or password. Please try again.';
    } else if (lower.includes('password') && lower.includes('weak')) {
      userMessage = 'Your password is too weak. Please choose a stronger password.';
    } else if (rawMessage && rawMessage !== 'Unknown error') {
      userMessage = rawMessage;
    }

    return {
      originalError: error,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error,
      userMessage
    };
  }
}
