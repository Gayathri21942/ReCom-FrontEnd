import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { PaymentService } from '../../shared/services/payment.service';

export interface CheckoutDialogData {
  productId: string;
  productTitle: string;
  price: number;
  sellerName: string;
  buyerId: string;
  sellerId: string;
}

const UPI_ID_PATTERN = /^[a-zA-Z0-9._-]+@(upi|ybl|okaxis|okhdfcbank|oksbi|okicici|paytm|ibl|axl)$/;

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="checkout-container">
      <mat-dialog-content>
        <h2>Checkout</h2>

        <!-- Order Summary -->
        <mat-card class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-item">
            <span>Product:</span>
            <strong>{{ data.productTitle }}</strong>
          </div>
          <div class="summary-item">
            <span>Seller:</span>
            <span>{{ data.sellerName }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span>Total Amount:</span>
            <strong>₹{{ data.price | number:'1.0-0' }}</strong>
          </div>
        </mat-card>

        <!-- Payment Method Selection -->
        <div class="payment-section">
          <h3>Select Payment Method</h3>

          <div class="payment-options">
            <!-- UPI Option -->
            <mat-card
              class="payment-option"
              [class.selected]="paymentMethod() === 'upi'"
              (click)="selectPaymentMethod('upi')"
            >
              <div class="option-header">
                <mat-icon class="option-icon">phone_android</mat-icon>
                <div>
                  <h4>UPI Payment</h4>
                  <p>Pay instantly using UPI</p>
                </div>
              </div>
              <input type="radio" [checked]="paymentMethod() === 'upi'" />
            </mat-card>

            <!-- Cash on Delivery Option -->
            <mat-card
              class="payment-option"
              [class.selected]="paymentMethod() === 'cod'"
              (click)="selectPaymentMethod('cod')"
            >
              <div class="option-header">
                <mat-icon class="option-icon">local_shipping</mat-icon>
                <div>
                  <h4>Cash on Delivery</h4>
                  <p>Pay when you receive the product</p>
                </div>
              </div>
              <input type="radio" [checked]="paymentMethod() === 'cod'" />
            </mat-card>
          </div>
        </div>

        <!-- UPI Payment Form -->
        @if (paymentMethod() === 'upi') {
          <form [formGroup]="upiForm" class="payment-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>UPI ID</mat-label>
              <input matInput formControlName="upiId" placeholder="yourname@upi" autocomplete="off" />
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="upiForm.get('upiId')?.hasError('required')">UPI ID is required</mat-error>
              <mat-error *ngIf="upiForm.get('upiId')?.hasError('pattern')">Use a valid UPI suffix like @upi, @ybl, or @okaxis</mat-error>
            </mat-form-field>

            <div class="upi-banks">
              <p class="info-text">Supported UPI handles include @upi, @ybl, @okaxis, @paytm, @ibl, and @axl.</p>
            </div>
          </form>
        }

        <!-- COD Info -->
        @if (paymentMethod() === 'cod') {
          <mat-card class="cod-info">
            <mat-icon>info</mat-icon>
            <div class="cod-info-text">
              <h4>Cash on Delivery</h4>
              <p>The product will be delivered to your address. You can pay the amount (₹{{ data.price | number:'1.0-0' }}) directly to the delivery partner.</p>
              <ul>
                <li>Estimated delivery: 3-5 business days</li>
                <li>No hidden charges</li>
                <li>Easy returns if needed</li>
              </ul>
            </div>
          </mat-card>
        }

        <!-- Terms & Conditions -->
        <div class="terms-section">
          <mat-checkbox [checked]="agreeTerms()" (change)="agreeTerms.set($event.checked!)">
            I agree to the terms and conditions
          </mat-checkbox>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cancel()">Cancel</button>
        <button
          mat-flat-button
          color="primary"
          (click)="proceedToPayment()"
          [disabled]="!canProceed() || processing()"
        >
          @if (processing()) {
            <mat-spinner diameter="20"></mat-spinner>
            Processing...
          } @else {
            {{ paymentMethod() === 'upi' ? 'Confirm UPI Payment' : 'Confirm Order' }}
          }
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .checkout-container {
        min-width: 500px;
        padding: 1rem;
      }

      h2 {
        margin: 0 0 1.5rem;
        color: #0f172a;
        font-size: 1.5rem;
      }

      h3 {
        margin: 0 0 1rem;
        color: #0f172a;
        font-size: 1.1rem;
      }

      h4 {
        margin: 0;
        color: #0f172a;
        font-size: 1rem;
      }

      p {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
      }

      /* Order Summary */
      .order-summary {
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border-radius: 12px;
        background: #f8fafc;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        color: #475569;
      }

      .summary-item.total {
        font-size: 1.1rem;
        font-weight: 600;
        color: #0f172a;
        padding-top: 0.5rem;
      }

      .summary-divider {
        height: 1px;
        background: #e2e8f0;
        margin: 0.75rem 0;
      }

      /* Payment Section */
      .payment-section {
        margin-bottom: 2rem;
      }

      .payment-options {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .payment-option {
        padding: 1.25rem;
        border-radius: 12px;
        cursor: pointer;
        border: 2px solid #e2e8f0;
        transition: all 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      .payment-option:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }

      .payment-option.selected {
        border-color: #1976d2;
        background: #eff6ff;
      }

      .option-header {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        flex: 1;
      }

      .option-icon {
        color: #1976d2;
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        margin-top: 0.25rem;
      }

      .payment-option input[type='radio'] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      /* UPI Form */
      .payment-form {
        margin-bottom: 1.5rem;
      }

      .full-width {
        width: 100%;
      }

      .upi-banks {
        padding: 1rem;
        background: #e3f2fd;
        border-radius: 8px;
        margin-top: 1rem;
      }

      .info-text {
        color: #0d47a1;
        font-weight: 500;
        margin: 0;
      }

      /* COD Info */
      .cod-info {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;
        border-radius: 12px;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        margin-bottom: 1.5rem;
      }

      .cod-info mat-icon {
        color: #16a34a;
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
      }

      .cod-info-text {
        flex: 1;
      }

      .cod-info-text h4 {
        color: #166534;
        margin-bottom: 0.5rem;
      }

      .cod-info-text p {
        color: #166534;
        margin-bottom: 0.75rem;
      }

      .cod-info-text ul {
        margin: 0.75rem 0 0;
        padding-left: 1.25rem;
        color: #166534;
      }

      .cod-info-text li {
        margin: 0.35rem 0;
        font-size: 0.9rem;
      }

      /* Terms Section */
      .terms-section {
        padding: 1rem 0;
        border-top: 1px solid #e2e8f0;
        margin-bottom: 1rem;
      }

      mat-dialog-actions {
        padding: 1rem 0 0;
        border-top: 1px solid #e2e8f0;
        gap: 0.75rem;
      }

      @media (max-width: 600px) {
        .checkout-container {
          min-width: auto;
          width: 100%;
        }
      }
    `
  ]
})
export class CheckoutDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<CheckoutDialogComponent>);

  readonly data = inject<CheckoutDialogData>(MAT_DIALOG_DATA);
  readonly paymentMethod = signal<'upi' | 'cod'>('upi');
  readonly processing = signal(false);
  readonly agreeTerms = signal(false);

  readonly upiForm = this.fb.nonNullable.group({
    upiId: [
      '',
      [
        Validators.required,
            Validators.pattern(UPI_ID_PATTERN)
      ]
    ]
  });

  readonly canProceed = (): boolean => {
    return (
      this.agreeTerms() &&
      (this.paymentMethod() === 'cod' || this.upiForm.valid)
    );
  };

  selectPaymentMethod(method: 'upi' | 'cod') {
    this.paymentMethod.set(method);
  }

  proceedToPayment() {
    this.upiForm.markAllAsTouched();
    if (!this.canProceed()) return;

    this.processing.set(true);

    if (this.paymentMethod() === 'upi') {
      this.processUPI();
    } else {
      this.processCOD();
    }
  }

  private processUPI() {
    const upiId = this.upiForm.get('upiId')?.value || '';

    this.paymentService
      .processUPIPayment(
        this.data.price,
        upiId,
        this.data.productId,
        this.data.productTitle,
        this.data.buyerId,
        this.data.sellerId
      )
      .subscribe({
        next: (response) => {
          this.processing.set(false);

          if (response.status === 'success') {
            this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
            this.dialogRef.close({
              success: true,
              method: 'upi',
              transactionId: response.transactionId
            });
          } else {
            this.snackBar.open('Payment failed. Please try again.', 'Close', {
              duration: 3000
            });
          }
        },
        error: () => {
          this.processing.set(false);
          this.snackBar.open('Payment processing error.', 'Close', { duration: 3000 });
        }
      });
  }

  private processCOD() {
    this.paymentService
      .processCODOrder(
        this.data.price,
        this.data.productId,
        this.data.productTitle,
        this.data.buyerId,
        this.data.sellerId
      )
      .subscribe({
        next: (response) => {
          this.processing.set(false);
          this.snackBar.open('Order confirmed!', 'Close', { duration: 3000 });
          this.dialogRef.close({
            success: true,
            method: 'cod',
            orderId: response.orderId,
            estimatedDelivery: response.estimatedDelivery
          });
        },
        error: () => {
          this.processing.set(false);
          this.snackBar.open('Order creation failed.', 'Close', { duration: 3000 });
        }
      });
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }
}
