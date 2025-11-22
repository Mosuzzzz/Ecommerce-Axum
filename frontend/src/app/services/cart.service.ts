import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  private cartItemsSubject: BehaviorSubject<CartItem[]>;
  public cartItems$: Observable<CartItem[]>;

  constructor() {
    // Load cart from localStorage on init
    const savedCart = this.loadCartFromStorage();
    this.cartItemsSubject = new BehaviorSubject<CartItem[]>(savedCart);
    this.cartItems$ = this.cartItemsSubject.asObservable();
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  private saveCartToStorage(cart: CartItem[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCartCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      // Product already in cart, increase quantity
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      
      // Ensure quantity doesn't exceed 99
      if (updatedCart[existingItemIndex].quantity > 99) {
        updatedCart[existingItemIndex].quantity = 99;
      }
      
      this.updateCart(updatedCart);
      console.log(`Updated quantity for ${product.name}. New quantity: ${updatedCart[existingItemIndex].quantity}`);
    } else {
      // New product, add to cart
      const newItem: CartItem = { product, quantity: Math.min(quantity, 99) };
      const updatedCart = [...currentCart, newItem];
      this.updateCart(updatedCart);
      console.log(`Added ${product.name} to cart. Quantity: ${quantity}`);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.updateCart(updatedCart);
    console.log(`Removed product ID ${productId} from cart`);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    if (quantity > 99) {
      quantity = 99;
    }

    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    );
    
    this.updateCart(updatedCart);
    console.log(`Updated quantity for product ID ${productId}. New quantity: ${quantity}`);
  }

  clearCart(): void {
    this.updateCart([]);
    console.log('Cart cleared');
  }

  private updateCart(cart: CartItem[]): void {
    this.cartItemsSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  getCurrentCartValue(): CartItem[] {
    return this.cartItemsSubject.value;
  }
}
