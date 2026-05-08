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
        <h1>Create account</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline"><mat-label>Username</mat-label><input matInput formControlName="username" /><mat-hint>Min 3 characters</mat-hint></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Password</mat-label><input matInput type="password" formControlName="password" /><mat-hint>Min 6 characters</mat-hint></mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="18" /> } @else { Sign up }
          </button>
        </form>
        <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
      </mat-card>
    </section>
  `,
  styles: [`.auth-page{display:grid;place-items:center;padding:2rem}.auth-page mat-card{width:min(100%,460px);padding:1.5rem}form{display:grid;gap:1rem}`]
})
export class SignupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) return;
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
        this.snackBar.open(errorMsg, 'Close', { duration: 4000 });
      }
    });
  }

  private getErrorMessage(error: any, fallback: string) {
    return error?.userMessage || error?.error?.message || error?.message || error?.statusText || fallback;
  }
}
