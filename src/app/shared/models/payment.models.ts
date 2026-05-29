export type PaymentMethod = 'cod' | 'upi';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

export interface TrackingEvent {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  transactionId?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  timestamp: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: OrderStatus;
  payment: PaymentDetails;
  trackingNumber: string;
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
  deliveryAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckoutData {
  productId: string;
  productTitle: string;
  price: number;
  sellerName: string;
  quantity: number;
}

export interface UPIPaymentResponse {
  transactionId: string;
  upiId: string;
  status: 'success' | 'failed';
  amount: number;
  timestamp: string;
}

export interface CODOrderResponse {
  orderId: string;
  status: 'confirmed';
  estimatedDelivery: string;
  totalAmount: number;
  message: string;
}
