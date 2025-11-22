import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-carousel',
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './product-carousel.html',
  styleUrl: './product-carousel.css',
})
export class ProductCarousel implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  addedToCartMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Component received products:', products);
        this.products = products;
        this.loading = false;
        console.log('Loading set to false, products count:', this.products.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        
        // Determine user-friendly error message based on error type
        if (err.status === 0) {
          this.error = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า backend กำลังทำงานอยู่';
        } else if (err.status === 404) {
          this.error = 'ไม่พบข้อมูลสินค้า';
        } else if (err.status >= 500) {
          this.error = 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง';
        } else {
          this.error = `เกิดข้อผิดพลาด: ${err.message || 'ไม่สามารถโหลดสินค้าได้'}`;
        }

        console.error('Error loading products:', err);
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product, 1);
    this.addedToCartMessage = `เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`;
    this.cdr.detectChanges();
    
    // Clear message after 3 seconds
    setTimeout(() => {
      this.addedToCartMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
