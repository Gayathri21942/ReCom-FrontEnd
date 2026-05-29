import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../shared/services/payment.service';
import { AuthStore } from '../auth/data/auth.store';
import { Order } from '../../shared/models/payment.models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule],
  template: `
    <section class="orders-container">
      <div class="header">
        <h1>My Orders</h1>
        <p class="subtitle">Track and manage your purchases</p>
      </div>

      @if (orders().length === 0) {
        <mat-card class="empty-state">
          <mat-icon>shopping_cart</mat-icon>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start shopping to see your orders here.</p>
          <a mat-flat-button color="primary" routerLink="/">
            <mat-icon>shopping_bag</mat-icon>
            Continue Shopping
          </a>
        </mat-card>
      } @else {
        <mat-tab-group>
          <mat-tab label="Active Orders">
            <div class="orders-grid">
              @for (order of getActiveOrders(); track order.id) {
                <mat-card class="order-card">
                  <div class="order-header">
                    <div class="order-id">
                      <span class="label">Order ID:</span>
                      <span class="value">{{ order.id }}</span>
                    </div>
                    <span class="status-badge" [class]="order.status">
                      {{ order.status | titlecase }}
                    </span>
                  </div>

                  <div class="order-details">
                    <div class="detail-row">
                      <span class="label">Product:</span>
                      <span class="value">{{ order.productTitle }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Amount:</span>
                      <span class="amount">₹{{ order.amount | number:'1.0-0' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Tracking:</span>
                      <span class="value">{{ order.trackingNumber }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">ETA:</span>
                      <span class="value">{{ order.estimatedDelivery | date : 'mediumDate' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Payment:</span>
                      <span class="value">
                        @if (order.payment.method === 'cod') {
                          <mat-icon class="method-icon">local_shipping</mat-icon>
                          Cash on Delivery
                        } @else {
                          <mat-icon class="method-icon">phone_android</mat-icon>
                          UPI
                        }
                        - {{ order.payment.status | titlecase }}
                      </span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Placed on:</span>
                      <span class="value">{{ order.createdAt | date : 'short' }}</span>
                    </div>
                  </div>

                  <div class="order-timeline">
                    @for (event of order.trackingEvents; track event.label) {
                    <div class="timeline-step" [class.active]="event.completed">
                      <div class="timeline-dot">
                        <mat-icon>{{ event.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                      </div>
                      <span>{{ event.label }}</span>
                      <small>{{ event.timestamp | date : 'MMM d' }}</small>
                    </div>
                    }
                  </div>

                  <div class="order-actions">
                    <button mat-button>
                      <mat-icon>message</mat-icon>
                      Contact Seller
                    </button>
                    <button mat-button>
                      <mat-icon>info</mat-icon>
                      View Details
                    </button>
                    <button mat-flat-button color="primary" (click)="markAsDelivered(order.id)">
                      <mat-icon>done_all</mat-icon>
                      Mark Delivered
                    </button>
                  </div>
                </mat-card>
              }
            </div>
          </mat-tab>

          <mat-tab label="Completed Orders">
            <div class="orders-grid">
              @for (order of getCompletedOrders(); track order.id) {
                <mat-card class="order-card completed">
                  <div class="order-header">
                    <div class="order-id">
                      <span class="label">Order ID:</span>
                      <span class="value">{{ order.id }}</span>
                    </div>
                    <span class="status-badge completed">
                      <mat-icon>check_circle</mat-icon>
                      Delivered
                    </span>
                  </div>

                  <div class="order-details">
                    <div class="detail-row">
                      <span class="label">Product:</span>
                      <span class="value">{{ order.productTitle }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Amount Paid:</span>
                      <span class="amount">₹{{ order.amount | number:'1.0-0' }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Tracking:</span>
                      <span class="value">{{ order.trackingNumber }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Payment:</span>
                      <span class="value">
                        @if (order.payment.method === 'cod') {
                          <mat-icon class="method-icon">local_shipping</mat-icon>
                          Cash on Delivery
                        } @else {
                          <mat-icon class="method-icon">phone_android</mat-icon>
                          UPI
                        }
                        - {{ order.payment.status | titlecase }}
                      </span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Delivered on:</span>
                      <span class="value">{{ order.updatedAt | date : 'short' }}</span>
                    </div>
                  </div>

                  <div class="order-timeline">
                    @for (event of order.trackingEvents; track event.label) {
                    <div class="timeline-step active">
                      <div class="timeline-dot">
                        <mat-icon>check_circle</mat-icon>
                      </div>
                      <span>{{ event.label }}</span>
                      <small>{{ event.timestamp | date : 'MMM d' }}</small>
                    </div>
                    }
                  </div>

                  <div class="order-actions">
                    <button mat-flat-button color="primary" (click)="downloadInvoice(order)">
                      <mat-icon>picture_as_pdf</mat-icon>
                      Invoice
                    </button>
                    <button mat-button>
                      <mat-icon>rate_review</mat-icon>
                      Leave Review
                    </button>
                    <button mat-button>
                      <mat-icon>repeat</mat-icon>
                      Buy Again
                    </button>
                  </div>
                </mat-card>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      }
    </section>
  `,
  styles: [
    `
      .orders-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .header {
        margin-bottom: 2rem;
      }

      .header h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        color: #0f172a;
      }

      .subtitle {
        margin: 0;
        color: #64748b;
        font-size: 1rem;
      }

      .empty-state {
        padding: 3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .empty-state mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #cbd5e1;
      }

      .empty-state h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.25rem;
      }

      .empty-state p {
        margin: 0;
        color: #64748b;
        max-width: 400px;
      }

      ::ng-deep .mat-mdc-tab-labels {
        background: #f8fafc;
        border-bottom: 2px solid #e2e8f0;
      }

      .orders-grid {
        padding: 2rem 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 1.5rem;
      }

      .order-card {
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid #e2e8f0;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .order-id {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .label {
        font-size: 0.85rem;
        color: #64748b;
        text-transform: uppercase;
        font-weight: 600;
      }

      .value {
        font-size: 0.95rem;
        color: #0f172a;
        font-weight: 500;
      }

      .amount {
        font-size: 1.1rem;
        font-weight: 700;
        color: #0f766e;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .status-badge.confirmed {
        background: #dbeafe;
        color: #0c4a6e;
      }

      .status-badge.processing {
        background: #fef3c7;
        color: #78350f;
      }

      .status-badge.completed {
        background: #d1fae5;
        color: #065f46;
      }

      .status-badge mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .order-details {
        margin-bottom: 1.5rem;
        display: grid;
        gap: 0.75rem;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;
      }

      .detail-row .value {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .method-icon {
        font-size: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
        color: #1976d2;
      }

      .order-timeline {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        position: relative;
      }

      .order-timeline::before {
        content: '';
        position: absolute;
        top: 1.5rem;
        left: 0;
        right: 0;
        height: 2px;
        background: #e2e8f0;
        z-index: 0;
      }

      .timeline-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        position: relative;
        z-index: 1;
        font-size: 0.8rem;
        color: #94a3b8;
        text-align: center;
      }

      .timeline-step.active {
        color: #0f766e;
      }

      .timeline-step small {
        color: #64748b;
        font-size: 0.75rem;
      }

      .timeline-dot {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #e2e8f0;
      }

      .timeline-step.active .timeline-dot {
        background: #d1fae5;
        border-color: #10b981;
      }

      .timeline-dot mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
        color: #94a3b8;
      }

      .timeline-step.active .timeline-dot mat-icon {
        color: #10b981;
      }

      .order-actions {
        display: flex;
        gap: 0.5rem;
        border-top: 1px solid #e2e8f0;
        padding-top: 1rem;
      }

      .order-actions button {
        flex: 1;
        font-size: 0.85rem;
      }

      .order-card.completed {
        background: #f0fdf4;
        border-color: #bbf7d0;
      }

      @media (max-width: 768px) {
        .orders-grid {
          grid-template-columns: 1fr;
        }

        .order-timeline {
          flex-direction: column;
          gap: 1rem;
        }

        .order-timeline::before {
          display: none;
        }

        .order-actions {
          flex-direction: column;
        }

        .order-actions button {
          width: 100%;
        }
      }
    `
  ]
})
export class MyOrdersComponent {
  private readonly paymentService = inject(PaymentService);
  private readonly authStore = inject(AuthStore);

  readonly orders = signal<Order[]>([]);

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    const userId = this.authStore.user()?.id || 'buyer-demo';
    this.paymentService.getBuyerOrders(userId).subscribe((orders) => {
      this.orders.set(orders);
    });
  }

  getActiveOrders(): Order[] {
    return this.orders().filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  }

  getCompletedOrders(): Order[] {
    return this.orders().filter((o) => o.status === 'completed');
  }

  isCompleted(order: Order): boolean {
    return order.status === 'completed';
  }

  markAsDelivered(orderId: string) {
    this.paymentService.completeOrder(orderId).subscribe((updatedOrder) => {
      if (!updatedOrder) return;

      this.orders.set(this.orders().map((order) => (order.id === orderId ? updatedOrder : order)));
    });
  }

  downloadInvoice(order: Order) {
    if (order.status !== 'completed') return;

    const user = this.authStore.user();
    const invoiceNumber = `INV-${order.id}`;
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const orderDate = this.formatDate(order.createdAt);
    const deliveredDate = this.formatDate(order.updatedAt || order.createdAt);
    const paymentMethod = order.payment.method === 'cod' ? 'Cash on Delivery' : 'UPI';
    const transactionId = order.payment.transactionId || 'Not applicable';
    const amount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(order.amount);

    const lines = [
      'RECOMMERCE INVOICE',
      `Invoice No: ${invoiceNumber}`,
      `Invoice Date: ${invoiceDate}`,
      '',
      'Buyer',
      `Name: ${user?.name || order.buyerId}`,
      `Email: ${user?.email || 'Email not available'}`,
      `Buyer ID: ${order.buyerId}`,
      '',
      'Seller',
      `Seller ID: ${order.sellerId}`,
      'Marketplace: Recommerce verified seller',
      '',
      'Order Details',
      `Order ID: ${order.id}`,
      `Product: ${order.productTitle}`,
      `Tracking Number: ${order.trackingNumber}`,
      `Order Date: ${orderDate}`,
      `Delivered Date: ${deliveredDate}`,
      '',
      'Payment Details',
      `Payment Method: ${paymentMethod}`,
      `Payment Status: ${order.payment.status.toUpperCase()}`,
      `Transaction ID: ${transactionId}`,
      `Total Paid: ${amount}`,
      '',
      'This is a computer-generated invoice for your completed Recommerce order.'
    ];

    this.downloadPdf(`${invoiceNumber}.pdf`, lines);
  }

  private formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private downloadPdf(fileName: string, lines: string[]) {
    const pdf = this.createSimplePdf(lines);
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  private createSimplePdf(lines: string[]): string {
    const contentLines = [
      'BT',
      '/F1 18 Tf',
      '50 790 Td',
      `(${this.escapePdf(lines[0] || 'Invoice')}) Tj`,
      '/F1 11 Tf',
      ...lines.slice(1).flatMap((line) => ['0 -18 Td', `(${this.escapePdf(line)}) Tj`]),
      'ET'
    ];
    const stream = contentLines.join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      `5 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    for (const object of objects) {
      offsets.push(pdf.length);
      pdf += object;
    }

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, '0')} 00000 n \n`).join('');
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return pdf;
  }

  private escapePdf(value: string): string {
    return value
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }
}
