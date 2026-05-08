import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../data/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <section class="auth-page">
      <mat-card>
        <h1>Welcome back</h1>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline"><mat-label>Username</mat-label><input matInput formControlName="username" /></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Password</mat-label><input matInput type="password" formControlName="password" /></mat-form-field>
          <div class="captcha-box">
            <div class="captcha-label">Enter the text below to verify you're human</div>
            <div class="captcha-challenge">{{ captchaChallenge() }}</div>
            <button mat-stroked-button type="button" (click)="refreshCaptcha()">Refresh</button>
          </div>
          <mat-form-field appearance="outline"><mat-label>Captcha</mat-label><input matInput formControlName="captcha" autocomplete="off" /></mat-form-field>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) { <mat-spinner diameter="18" /> } @else { Login }
          </button>
        </form>
        <p>No account? <a routerLink="/auth/signup">Create one</a></p>
      </mat-card>
    </section>
  `,
  styles: [`.auth-page{display:grid;place-items:center;padding:2rem}.auth-page mat-card{width:min(100%,420px);padding:1.5rem}form{display:grid;gap:1rem}.captcha-box{display:grid;gap:.5rem;padding:.75rem;border:1px solid rgba(0,0,0,.12);border-radius:8px;background:#fafafa}.captcha-label{font-size:.9rem;color:#555}.captcha-challenge{font-family:monospace;font-size:1.1rem;letter-spacing:.12em;padding:.5rem;border-radius:6px;background:#fff;border:1px solid rgba(0,0,0,.12);display:inline-block}`]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);
  readonly loading = signal(false);
  readonly captchaChallenge = signal('');

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', [Validators.required]]
  });

  constructor() {
    this.refreshCaptcha();
  }

  submit() {
    if (this.form.invalid) return;

    const typedCaptcha = this.form.get('captcha')?.value?.trim();
    if (typedCaptcha !== this.captchaChallenge()) {
      this.form.get('captcha')?.setErrors({ mismatch: true });
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
