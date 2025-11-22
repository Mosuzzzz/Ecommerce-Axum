import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf, RouterLink],
  templateUrl: './product-detail.component.html',
  standalone: true,
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading: boolean = false;
  error: string | null = null;
  quantity: number = 1;
  addedToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(parseInt(productId));
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.product = products.find(p => p.id === id) || null;
        this.loading = false;
        if (!this.product) {
          this.error = 'ไม่พบสินค้า';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'ไม่สามารถโหลดข้อมูลสินค้าได้';
        console.error('Error loading product:', err);
        this.cdr.detectChanges();
      }
    });
  }

  increaseQuantity() {
    if (this.quantity < 99) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.addedToCart = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.addedToCart = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  buyNow() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/checkout']);
    }
  }
}
