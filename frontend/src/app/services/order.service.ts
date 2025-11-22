import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartItem } from './cart.service';

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ORDERS_STORAGE_KEY = 'user_orders';

  constructor() {}

  private getStoredOrders(): Order[] {
    try {
      const orders = localStorage.getItem(this.ORDERS_STORAGE_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  createOrder(userId: string, cartItems: CartItem[], shippingInfo: ShippingInfo): Order {
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: this.generateOrderId(),
      userId,
      items: cartItems,
      shippingInfo,
      total,
      status: 'pending',
      createdAt: new Date()
    };

    const orders = this.getStoredOrders();
    orders.push(newOrder);
    this.saveOrders(orders);

    console.log('Order created:', newOrder.id);
    return newOrder;
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const allOrders = this.getStoredOrders();
    const userOrders = allOrders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return of(userOrders);
  }

  getOrderById(orderId: string): Observable<Order | null> {
    const orders = this.getStoredOrders();
    const order = orders.find(o => o.id === orderId);
    return of(order || null);
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}
