import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-products',
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './products.component.html',
  standalone: true,
})
export class Products implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  addedToCartMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 0) {
          this.error = this.t('products.errorConnect');
        } else if (err.status === 404) {
          this.error = this.t('products.errorNotFound');
        } else if (err.status >= 500) {
          this.error = this.t('products.errorServer');
        } else {
          this.error = this.t('products.errorLoad');
        }

        console.error('Error loading products:', err);
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.addedToCartMessage = `${this.t('products.addedToCart')}`;
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.addedToCartMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  t(key: string): string {
    return this.langService.translate(key);
  }
}
