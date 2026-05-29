import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../data/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <section class="auth-page">
      <mat-card>
        <div class="auth-header">
          <div class="auth-icon"><mat-icon>person_add</mat-icon></div>
          <div>
            <h1>Create account</h1>
            <p>Start selling, saving favorites, and tracking orders.</p>
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
            <mat-hint>Min 3 characters</mat-hint>
            <mat-error *ngIf="form.get('username')?.hasError('required')">Username is required.</mat-error>
            <mat-error *ngIf="form.get('username')?.hasError('minlength')">Username must be at least 3 characters.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
            <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required.</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Enter a valid email address.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
            <mat-hint>Min 6 characters</mat-hint>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required.</mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">Password must be at least 6 characters.</mat-error>
          </mat-form-field>
          <button class="signup-button" mat-flat-button type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="18" />
              <span>Creating...</span>
            } @else {
              <span class="button-content"><mat-icon>person_add</mat-icon> Sign up</span>
            }
          </button>
        </form>
        <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
      </mat-card>
    </section>
  `,
  styles: [`.auth-page{display:grid;place-items:center;min-height:calc(100vh - 120px);padding:2rem;background:linear-gradient(180deg,#f8fafc,#eef7f4)}.auth-page mat-card{width:min(100%,460px);padding:1.75rem;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 18px 42px rgba(15,23,42,.12)}.auth-header{display:flex;gap:1rem;align-items:center;margin-bottom:1.25rem}.auth-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:14px;background:#e0f2fe;color:#075985}.auth-icon mat-icon{font-size:1.6rem;width:1.6rem;height:1.6rem}h1{margin:0;color:#0f172a;font-size:1.8rem}p{color:#64748b}.auth-header p{margin:.25rem 0 0}.inline-error{display:flex;align-items:flex-start;gap:.75rem;margin:0 0 1rem;padding:.9rem 1rem;border-radius:10px;background:#fef2f2;color:#991b1b;border:1px solid #fecaca;font-weight:600}.inline-error mat-icon{font-size:1.25rem;width:1.25rem;height:1.25rem;flex:0 0 auto}form{display:grid;gap:1rem}.signup-button{height:48px;border-radius:12px;background:#0f766e!important;color:#fff!important;font-weight:800;box-shadow:0 10px 22px rgba(15,118,110,.24)}.button-content{display:inline-flex;align-items:center;justify-content:center}.button-content mat-icon{font-size:1rem;width:1rem;height:1rem;margin-right:.35rem}.signup-button mat-spinner{margin-right:.5rem}a{font-weight:700;color:#0f766e}`]
})
export class SignupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    this.errorMessage.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage.set('Please fix the highlighted fields before creating your account.');
      return;
    }
    this.loading.set(true);
    this.authService.signup(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.snackBar.open('Account created', 'Close', { duration: 2500 });
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Signup error:', err);
        const errorMsg = this.getErrorMessage(err, 'Signup failed. Please try again.');
        this.errorMessage.set(errorMsg);
        this.snackBar.open(errorMsg, 'Close', { duration: 4000 });
      }
    });
  }

  private getErrorMessage(error: any, fallback: string) {
    return error?.userMessage || error?.error?.message || error?.message || error?.statusText || fallback;
  }
}
