import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { CODOrderResponse, Order, PaymentMethod, UPIPaymentResponse } from '../models/payment.models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly storageKey = 'recommerce_orders';
  private orders: Order[] = this.readStoredOrders();

  /**
   * Process UPI payment through dummy gateway
   */
  processUPIPayment(
    amount: number,
    upiId: string,
    productId: string,
    productTitle: string,
    buyerId: string,
    sellerId: string
  ): Observable<UPIPaymentResponse> {
    // Simulate UPI payment processing (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;
    const transactionId = `UPI${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

    if (isSuccess) {
      this.createOrder({
        amount,
        productId,
        productTitle,
        buyerId,
        sellerId,
        method: 'upi',
        paymentStatus: 'success',
        transactionId
      });
    }

    return of<UPIPaymentResponse>({
      transactionId,
      upiId,
      status: isSuccess ? 'success' : 'failed',
      amount,
      timestamp: new Date().toISOString()
    }).pipe(delay(2000)); // Simulate payment processing delay
  }

  /**
   * Process Cash on Delivery order
   */
  processCODOrder(
    amount: number,
    productId: string,
    productTitle: string,
    buyerId: string,
    sellerId: string
  ): Observable<CODOrderResponse> {
    const order = this.createOrder({
      amount,
      productId,
      productTitle,
      buyerId,
      sellerId,
      method: 'cod',
      paymentStatus: 'pending'
    });

    return of<CODOrderResponse>({
      orderId: order.id,
      status: 'confirmed',
      estimatedDelivery: order.estimatedDelivery,
      totalAmount: amount,
      message: `Your order for ${productTitle} has been confirmed. Payment to be made upon delivery.`
    }).pipe(delay(1500)); // Simulate order creation delay
  }

  /**
   * Get all orders for a buyer
   */
  getBuyerOrders(buyerId: string): Observable<Order[]> {
    return of(this.orders.filter((order) => order.buyerId === buyerId));
  }

  /**
   * Get all orders for a seller
   */
  getSellerOrders(sellerId: string): Observable<Order[]> {
    return of(this.orders.filter((order) => order.sellerId === sellerId));
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId: string): Observable<Order | undefined> {
    return of(this.orders.find((order) => order.id === orderId));
  }

  completeOrder(orderId: string): Observable<Order | undefined> {
    const completedAt = new Date().toISOString();
    const orderIndex = this.orders.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return of(undefined);
    }

    const existing = this.orders[orderIndex];
    const completedOrder: Order = {
      ...existing,
      status: 'completed',
      updatedAt: completedAt,
      payment: {
        ...existing.payment,
        status: existing.payment.method === 'cod' ? 'success' : existing.payment.status
      },
      trackingEvents: existing.trackingEvents.map((event) => ({
        ...event,
        completed: true
      }))
    };

    this.orders = this.orders.map((order) => (order.id === orderId ? completedOrder : order));
    this.storeOrders();
    return of(completedOrder).pipe(delay(250));
  }

  /**
   * Verify UPI transaction (dummy verification)
   */
  verifyUPITransaction(transactionId: string): Observable<{ valid: boolean; message: string }> {
    // Dummy verification - always returns valid for demo
    return of({
      valid: true,
      message: 'Transaction verified successfully'
    }).pipe(delay(1000));
  }

  private createOrder(details: {
    amount: number;
    productId: string;
    productTitle: string;
    buyerId: string;
    sellerId: string;
    method: PaymentMethod;
    paymentStatus: 'pending' | 'success';
    transactionId?: string;
  }): Order {
    const now = new Date();
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
    const trackingNumber = `RCM${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const deliveryDays = 3 + Math.floor(Math.random() * 3);
    const estimatedDeliveryDate = new Date(now);
    estimatedDeliveryDate.setDate(now.getDate() + deliveryDays);

    const packedAt = new Date(now);
    packedAt.setDate(now.getDate() + 1);
    const shippedAt = new Date(now);
    shippedAt.setDate(now.getDate() + 2);
    const outForDeliveryAt = new Date(estimatedDeliveryDate);
    outForDeliveryAt.setDate(estimatedDeliveryDate.getDate() - 1);

    const order: Order = {
      id: orderId,
      productId: details.productId,
      productTitle: details.productTitle,
      buyerId: details.buyerId,
      sellerId: details.sellerId,
      amount: details.amount,
      status: 'confirmed',
      payment: {
        method: details.method,
        amount: details.amount,
        status: details.paymentStatus,
        transactionId: details.transactionId,
        timestamp: now.toISOString()
      },
      trackingNumber,
      estimatedDelivery: estimatedDeliveryDate.toISOString().split('T')[0],
      trackingEvents: [
        {
          label: 'Order confirmed',
          description: 'Seller received your order details.',
          timestamp: now.toISOString(),
          completed: true
        },
        {
          label: 'Packed by seller',
          description: 'Item will be inspected and packed.',
          timestamp: packedAt.toISOString(),
          completed: false
        },
        {
          label: 'Shipped',
          description: 'Package will leave the seller location.',
          timestamp: shippedAt.toISOString(),
          completed: false
        },
        {
          label: 'Out for delivery',
          description: 'Delivery partner will contact you.',
          timestamp: outForDeliveryAt.toISOString(),
          completed: false
        }
      ],
      createdAt: now.toISOString()
    };

    this.orders.unshift(order);
    this.storeOrders();
    return order;
  }

  private readStoredOrders(): Order[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Order[];
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }

  private storeOrders() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.orders));
    }
  }
}
