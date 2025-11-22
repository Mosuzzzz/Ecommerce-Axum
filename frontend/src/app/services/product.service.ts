import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor and GPS',
    price: 399.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand with adjustable height',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 59.99,
    image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop'
  },
  {
    id: 7,
    name: 'Webcam HD',
    description: '1080p HD webcam with auto-focus and built-in microphone',
    price: 89.99,
    image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop'
  },
  {
    id: 8,
    name: 'Phone Case',
    description: 'Protective phone case with military-grade drop protection',
    price: 24.99,
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products'; // Rust/Axum backend
  private useMockData = false; // Toggle to switch between mock and real API

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.useMockData) {
      console.log('Using mock data');
      return of(MOCK_PRODUCTS);
    }

    console.log(`Fetching products from ${this.apiUrl}`);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        console.log(`Successfully loaded ${products.length} products from API`);
        // Validate that all required fields are present
        products.forEach((product, index) => {
          if (!product.id || !product.name || !product.description || 
              product.price === undefined || !product.image_url) {
            console.warn(`Product at index ${index} is missing required fields:`, product);
          }
        });
      }),
      catchError((error) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] Error fetching products from ${this.apiUrl}:`, {
          url: this.apiUrl,
          errorType: error.name || 'Unknown',
          status: error.status,
          message: error.message,
          error
        });
        throw error;
      })
    );
  }

  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    console.log(`Creating product at ${this.apiUrl}`, product);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((newProduct) => {
        console.log('Product created successfully:', newProduct);
      }),
      catchError((error) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] Error creating product:`, {
          url: this.apiUrl,
          errorType: error.name || 'Unknown',
          status: error.status,
          message: error.message,
          error
        });
        throw error;
      })
    );
  }

  deleteProduct(productId: number): Observable<boolean> {
    console.log(`Deleting product ${productId}`);
    return this.http.delete<boolean>(`${this.apiUrl}/${productId}`).pipe(
      tap((success) => {
        console.log(`Product ${productId} deleted:`, success);
      }),
      catchError((error) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] Error deleting product:`, {
          url: `${this.apiUrl}/${productId}`,
          errorType: error.name || 'Unknown',
          status: error.status,
          message: error.message,
          error
        });
        throw error;
      })
    );
  }
}
