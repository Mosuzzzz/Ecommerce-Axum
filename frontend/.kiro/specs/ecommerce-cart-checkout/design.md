# Design Document

## Overview

ระบบ E-commerce Shopping Cart & Checkout ที่สมบูรณ์แบบ ประกอบด้วย user authentication, shopping cart management, checkout process, และ order tracking โดยใช้ Angular services สำหรับ state management และ localStorage สำหรับ persistence

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Angular Frontend                           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Products   │  │     Cart     │  │   Orders    │  │
│  │     Page     │  │    Drawer    │  │    Page     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         │                  │                  │         │
│  ┌──────▼──────────────────▼──────────────────▼──────┐ │
│  │              Services Layer                        │ │
│  │  - AuthService (User Login/Register)              │ │
│  │  - CartService (Cart Management)                  │ │
│  │  - OrderService (Order Creation & History)        │ │
│  │  - ProductService (Product Data)                  │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │   localStorage  │
                  │  - Cart State   │
                  │  - User Session │
                  └─────────────────┘
```

### Data Flow

**Adding to Cart:**
1. User clicks "Add to Cart" → ProductCarousel/ProductsPage
2. Component calls CartService.addToCart(product)
3. CartService updates cart state
4. CartService persists to localStorage
5. CartService emits new cart state
6. Cart badge updates automatically

**Checkout Process:**
1. User clicks "Checkout" → Cart Drawer
2. System checks if user is logged in
3. If not logged in → redirect to login
4. If logged in → show checkout form
5. User fills shipping info → submit
6. OrderService creates order
7. Cart is cleared
8. User sees order confirmation

## Components and Interfaces

### Services

#### 1. CartService

**Location**: `frontend/src/app/services/cart.service.ts`

**Responsibilities**:
- Manage cart items (add, remove, update quantity)
- Calculate cart totals
- Persist cart to localStorage
- Emit cart state changes

**Key Methods**:
```typescript
class CartService {
  private cartItems: BehaviorSubject<CartItem[]>
  
  addToCart(product: Product, quantity: number): void
  removeFromCart(productId: number): void
  updateQuantity(productId: number, quantity: number): void
  clearCart(): void
  getCartItems(): Observable<CartItem[]>
  getCartTotal(): Observable<number>
  getCartCount(): Observable<number>
}
```

**Data Model**:
```typescript
interface CartItem {
  product: Product;
  quantity: number;
}
```

#### 2. OrderService

**Location**: `frontend/src/app/services/order.service.ts`

**Responsibilities**:
- Create orders from cart
- Store orders in localStorage (simulate backend)
- Retrieve user's order history
- Calculate order totals

**Key Methods**:
```typescript
class OrderService {
  createOrder(cartItems: CartItem[], shippingInfo: ShippingInfo): Order
  getUserOrders(userId: string): Observable<Order[]>
  getOrderById(orderId: string): Observable<Order>
}
```

**Data Models**:
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}
```

#### 3. AuthService (Enhanced)

**Location**: `frontend/src/app/services/auth.service.ts`

**Enhancements**:
- Support user registration
- Separate admin and user roles
- Store user profiles

**Key Methods**:
```typescript
class AuthService {
  register(username: string, email: string, password: string): boolean
  login(username: string, password: string): boolean
  logout(): void
  getCurrentUser(): Observable<User | null>
  isAuthenticated(): boolean
}
```

**Data Model**:
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
```

### Components

#### 1. Products Page

**Location**: `frontend/src/app/page/products.component.ts`

**Responsibilities**:
- Display all products in grid layout
- Show "Add to Cart" button for each product
- Handle add to cart action
- Show success notifications

#### 2. Cart Drawer

**Location**: `frontend/src/app/components/cart-drawer/cart-drawer.ts`

**Responsibilities**:
- Display cart items
- Allow quantity changes
- Show cart total
- Provide checkout button
- Toggle open/close

**State**:
```typescript
class CartDrawer {
  isOpen: boolean
  cartItems: CartItem[]
  cartTotal: number
  cartCount: number
}
```

#### 3. Checkout Page

**Location**: `frontend/src/app/page/checkout.component.ts`

**Responsibilities**:
- Display checkout form
- Validate shipping information
- Create order on submit
- Show order confirmation

#### 4. Orders Page

**Location**: `frontend/src/app/page/orders.component.ts`

**Responsibilities**:
- Display user's order history
- Show order details
- Filter/sort orders

#### 5. Register Page

**Location**: `frontend/src/app/page/register.component.ts`

**Responsibilities**:
- Display registration form
- Validate user input
- Create new user account
- Redirect to login after success

## Data Models

### Complete Data Models

```typescript
// Product (existing)
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// Cart Item
interface CartItem {
  product: Product;
  quantity: number;
}

// User
interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed in real app
  role: 'admin' | 'user';
  createdAt: Date;
}

// Shipping Info
interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

// Order
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
```

## State Management

### Cart State

**Storage**: BehaviorSubject + localStorage

**Flow**:
1. CartService maintains cart state in BehaviorSubject
2. Components subscribe to cart changes
3. Every cart modification persists to localStorage
4. On app init, cart loads from localStorage

### User State

**Storage**: BehaviorSubject + localStorage

**Flow**:
1. AuthService maintains user state
2. Login/Register updates user state
3. User session persists to localStorage
4. On app init, user loads from localStorage

### Order State

**Storage**: localStorage (simulating backend)

**Flow**:
1. Orders stored in localStorage by userId
2. OrderService retrieves orders for current user
3. New orders append to existing orders array

## Error Handling

### Cart Operations

1. **Add to Cart Failures**:
   - Show error notification
   - Log error to console
   - Don't modify cart state

2. **Quantity Validation**:
   - Minimum quantity: 1
   - Maximum quantity: 99
   - Show validation message

### Checkout Process

1. **Authentication Required**:
   - Redirect to login if not authenticated
   - Preserve cart state during redirect
   - Return to checkout after login

2. **Form Validation**:
   - All fields required
   - Email format validation
   - Phone number format validation
   - Postal code format validation

3. **Order Creation Failures**:
   - Show error message
   - Keep cart intact
   - Allow retry

## Testing Strategy

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Correctness Properties

Property 1: Cart total consistency
*For any* cart state, the total price SHALL equal the sum of (product.price × quantity) for all items in the cart
**Validates: Requirements 2.4, 3.3**

Property 2: Cart persistence
*For any* cart state, after saving to localStorage and reloading, the restored cart SHALL contain the same items with the same quantities
**Validates: Requirements 8.1, 8.2, 8.3**

Property 3: Cart count accuracy
*For any* cart state, the cart count badge SHALL display the sum of all item quantities
**Validates: Requirements 4.1, 4.2, 4.3**

Property 4: Order creation completeness
*For any* valid checkout submission, the created order SHALL contain all cart items, shipping information, and correct total price
**Validates: Requirements 5.3, 5.5**

Property 5: User authentication state
*For any* user session, after logout and login with same credentials, the user SHALL have the same id and role
**Validates: Requirements 1.4, 1.5**

Property 6: Cart quantity bounds
*For any* cart item, the quantity SHALL always be between 1 and 99 inclusive
**Validates: Requirements 2.4, 3.3**

Property 7: Order history integrity
*For any* user, their order history SHALL only contain orders created by that user
**Validates: Requirements 6.1, 6.2**

### Unit Testing

Unit tests will cover:

1. **CartService Tests**:
   - Add product to empty cart
   - Add duplicate product (increases quantity)
   - Remove product from cart
   - Update quantity
   - Clear cart
   - Calculate total
   - Persist and restore from localStorage

2. **OrderService Tests**:
   - Create order from cart
   - Generate unique order IDs
   - Store order in localStorage
   - Retrieve user orders
   - Filter orders by user

3. **AuthService Tests**:
   - Register new user
   - Reject duplicate username
   - Login with valid credentials
   - Reject invalid credentials
   - Logout clears session

4. **Component Tests**:
   - Cart drawer opens/closes
   - Product adds to cart
   - Checkout requires authentication
   - Order confirmation displays

### Property-Based Testing

We will use **fast-check** library for property-based testing in TypeScript.

**Configuration**: Each property test will run minimum 100 iterations.

**Test Tagging**: Format: `// Feature: ecommerce-cart-checkout, Property X: [description]`

## Implementation Notes

### Phase 1: Cart System
1. Create CartService
2. Update ProductCarousel to use CartService
3. Implement Cart Drawer UI
4. Add cart badge to navbar

### Phase 2: User Authentication
1. Enhance AuthService for user registration
2. Create Register page
3. Update Login page for users
4. Add authentication guards

### Phase 3: Checkout & Orders
1. Create OrderService
2. Build Checkout page
3. Implement order creation
4. Build Orders history page

### Phase 4: Products Page
1. Create dedicated Products page
2. Move product grid from home
3. Add product detail view (optional)

## UI/UX Considerations

### Cart Drawer
- Slide in from right side
- Overlay with backdrop
- Smooth animations
- Mobile responsive

### Notifications
- Toast notifications for cart actions
- Success: green
- Error: red
- Duration: 3 seconds

### Loading States
- Skeleton loaders for products
- Spinner for checkout submission
- Disabled buttons during loading

### Empty States
- Empty cart message with CTA
- No orders message with shop link
- Clear, friendly messaging

## Security Considerations

### Client-Side Only (Current Implementation)

**Note**: This is a demo implementation using localStorage. In production:
- Passwords should be hashed
- Use backend API for authentication
- Implement JWT tokens
- Use HTTPS
- Add CSRF protection

### Current Security Measures

1. **Password Storage**:
   - Stored in localStorage (demo only)
   - Should use backend + hashing in production

2. **Session Management**:
   - localStorage for session
   - Auto-logout on browser close (optional)

3. **Route Protection**:
   - Guards for authenticated routes
   - Redirect to login when needed

## Performance Considerations

### Cart Operations
- Debounce quantity changes (300ms)
- Batch localStorage writes
- Memoize cart calculations

### Product Loading
- Lazy load product images
- Virtual scrolling for large lists (future)
- Cache product data

### Order History
- Paginate orders (future)
- Load recent orders first
- Lazy load order details
