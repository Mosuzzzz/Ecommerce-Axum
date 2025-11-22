import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CartService, CartItem } from '../services/cart.service';
import { OrderService, ShippingInfo } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './checkout.component.html',
  standalone: true,
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  loading: boolean = false;
  error: string = '';
  orderCreated: boolean = false;
  orderId: string = '';

  shippingInfo: ShippingInfo = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Load cart
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0 && !this.orderCreated) {
        this.router.navigate(['/']);
      }
      this.cdr.detectChanges();
    });

    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    this.error = '';

    // Validation
    if (!this.shippingInfo.fullName || !this.shippingInfo.address || 
        !this.shippingInfo.city || !this.shippingInfo.postalCode || 
        !this.shippingInfo.phone) {
      this.error = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      return;
    }

    if (!this.isValidPhone(this.shippingInfo.phone)) {
      this.error = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
      return;
    }

    if (this.cartItems.length === 0) {
      this.error = 'ตะกร้าสินค้าว่างเปล่า';
      return;
    }

    this.loading = true;

    // Create order
    setTimeout(() => {
      const userId = this.authService.currentUserValue?.id || '';
      const order = this.orderService.createOrder(userId, this.cartItems, this.shippingInfo);
      
      this.orderId = order.id;
      this.orderCreated = true;
      this.loading = false;
      
      // Clear cart
      this.cartService.clearCart();
      
      this.cdr.detectChanges();
    }, 1000);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }
}
