import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-admin',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './admin.component.html',
  standalone: true,
})
export class Admin implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  showForm: boolean = false;
  successMessage: string | null = null;

  // Form fields
  newProduct = {
    name: '',
    description: '',
    price: 0,
    image_url: ''
  };

  constructor(
    private productService: ProductService,
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
        this.error = this.t('admin.errorLoad');
        console.error('Error loading products:', err);
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.resetForm();
      this.successMessage = null;
    }
  }

  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      image_url: ''
    };
  }

  onSubmit() {
    if (!this.newProduct.name || !this.newProduct.description || 
        this.newProduct.price <= 0 || !this.newProduct.image_url) {
      this.error = this.t('admin.fillAllFields');
      return;
    }

    this.loading = true;
    this.error = null;

    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        console.log('Product created:', product);
        this.successMessage = `${this.t('admin.productAdded')}`;
        this.loading = false;
        this.showForm = false;
        this.resetForm();
        this.loadProducts();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.t('admin.errorAdd');
        console.error('Error creating product:', err);
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`${this.t('admin.confirmDelete')} "${product.name}" ${this.t('admin.confirmDeleteQuestion')}`)) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.productService.deleteProduct(product.id).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = `${this.t('admin.productDeleted')}`;
          this.loadProducts();
          
          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
          }, 3000);
        } else {
          this.error = this.t('admin.cannotDelete');
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = this.t('admin.errorDelete');
        console.error('Error deleting product:', err);
        this.cdr.detectChanges();
      }
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }
}
