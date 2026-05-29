import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../data/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <section class="auth-page">
      <mat-card>
        <div class="auth-header">
          <div class="auth-icon"><mat-icon>lock_open</mat-icon></div>
          <div>
            <h1>Welcome back</h1>
            <p>Login to manage listings, cart, orders, and chats.</p>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="inline-error" role="alert">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" autocomplete="username" />
            <mat-error *ngIf="form.get('username')?.hasError('required')">Username is required.</mat-error>
            <mat-error *ngIf="form.get('username')?.hasError('minlength')">Username must be at least 3 characters.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password" />
            <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required.</mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">Password must be at least 6 characters.</mat-error>
          </mat-form-field>
          <div class="captcha-box">
            <div class="captcha-label">Enter the text below to verify you're human</div>
            <div class="captcha-challenge">{{ captchaChallenge() }}</div>
            <button mat-stroked-button type="button" (click)="refreshCaptcha()">Refresh</button>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Captcha</mat-label>
            <input matInput formControlName="captcha" autocomplete="off" />
            <mat-error *ngIf="form.get('captcha')?.hasError('required')">Captcha is required.</mat-error>
            <mat-error *ngIf="form.get('captcha')?.hasError('mismatch')">Captcha does not match.</mat-error>
          </mat-form-field>
          <button class="login-button" mat-flat-button type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="18" />
              <span>Signing in...</span>
            } @else {
              <span class="button-content"><mat-icon>login</mat-icon> Login</span>
            }
          </button>
        </form>
        <p>No account? <a routerLink="/auth/signup">Create one</a></p>
      </mat-card>
    </section>
  `,
  styles: [`.auth-page{display:grid;place-items:center;min-height:calc(100vh - 120px);padding:2rem;background:linear-gradient(180deg,#f8fafc,#eef7f4)}.auth-page mat-card{width:min(100%,440px);padding:1.75rem;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 18px 42px rgba(15,23,42,.12)}.auth-header{display:flex;gap:1rem;align-items:center;margin-bottom:1.25rem}.auth-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:#ccfbf1;color:#115e59}.auth-icon mat-icon{font-size:1.6rem;width:1.6rem;height:1.6rem}h1{margin:0;color:#0f172a;font-size:1.8rem}p{color:#64748b}.auth-header p{margin:.25rem 0 0}.inline-error{display:flex;align-items:flex-start;gap:.75rem;margin:0 0 1rem;padding:.9rem 1rem;border-radius:10px;background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-weight:600}.inline-error mat-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex:0 0 auto}form{display:grid;gap:1rem}.captcha-box{display:grid;grid-template-columns:1fr auto;gap:.75rem;align-items:center;padding:.85rem;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc}.captcha-label{grid-column:1/-1;font-size:.9rem;color:#475569}.captcha-challenge{font-family:monospace;font-size:1.2rem;letter-spacing:.14em;padding:.65rem .8rem;border-radius:8px;background:#fff;border:1px solid #cbd5e1;color:#111827;font-weight:800;display:inline-block}.login-button{height:48px;border-radius:12px;background:#0f766e!important;color:#fff!important;font-weight:800;box-shadow:0 10px 22px rgba(15,118,110,.24)}.button-content{display:inline-flex;align-items:center;justify-content:center}.button-content mat-icon{font-size:1rem;width:1rem;height:1rem;margin-right:.35rem}.login-button mat-spinner{margin-right:.5rem}a{font-weight:700;color:#0f766e}`]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  readonly loading = signal(false);
  readonly captchaChallenge = signal('');
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', [Validators.required]]
  });

  constructor() {
    this.refreshCaptcha();
  }

  submit() {
    this.errorMessage.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Please fix the highlighted fields before logging in.');
      return;
    }

    const typedCaptcha = this.form.get('captcha')?.value?.trim();
    if (typedCaptcha !== this.captchaChallenge()) {
      this.form.get('captcha')?.setErrors({ mismatch: true });
      this.errorMessage.set('Captcha does not match. Please enter the new code shown below.');
      this.snackBar.open('Captcha does not match. Please try again.', 'Close', { duration: 2500 });
      this.refreshCaptcha();
      return;
    }

    this.loading.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Logged in successfully', 'Close', { duration: 2500 });
        this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/');
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Login error:', err);
        const errorMsg = this.getErrorMessage(err, 'Login failed. Please try again.');
        this.errorMessage.set(errorMsg);
        this.snackBar.open(errorMsg, 'Close', { duration: 4000 });
        this.refreshCaptcha();
      }
    });
  }

  refreshCaptcha() {
    this.captchaChallenge.set(this.generateCaptchaValue());
    this.form.get('captcha')?.reset();
  }

  private generateCaptchaValue() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private getErrorMessage(error: any, fallback: string) {
    return error?.userMessage || error?.error?.message || error?.message || error?.statusText || fallback;
  }
}
