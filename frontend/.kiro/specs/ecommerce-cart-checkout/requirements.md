# Requirements Document

## Introduction

ระบบ E-commerce ที่สมบูรณ์แบบสำหรับให้ผู้ใช้สามารถเลือกซื้อสินค้า เพิ่มลงตะกร้า และทำการสั่งซื้อได้จริง รวมถึงระบบ authentication สำหรับ user ทั่วไป (แยกจาก admin)

## Glossary

- **Cart**: ตะกร้าสินค้าที่เก็บสินค้าที่ผู้ใช้เลือก
- **User Account**: บัญชีผู้ใช้ทั่วไป (ไม่ใช่ admin)
- **Checkout**: กระบวนการสั่งซื้อและชำระเงิน
- **Order**: คำสั่งซื้อที่สร้างหลังจาก checkout
- **Cart Service**: Service ที่จัดการตะกร้าสินค้า
- **Order Service**: Service ที่จัดการคำสั่งซื้อ

## Requirements

### Requirement 1

**User Story:** ในฐานะผู้ใช้ ฉันต้องการสร้าง account ของตัวเอง เพื่อให้สามารถซื้อสินค้าและติดตามคำสั่งซื้อได้

#### Acceptance Criteria

1. WHEN a user visits the registration page THEN the system SHALL display a form with username, email, password, and confirm password fields
2. WHEN a user submits valid registration data THEN the system SHALL create a new user account and store it
3. WHEN a user submits a registration with an existing username THEN the system SHALL display an error message
4. WHEN a user logs in with valid credentials THEN the system SHALL authenticate the user and create a session
5. WHEN a user logs out THEN the system SHALL clear the session and redirect to home page

### Requirement 2

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเพิ่มสินค้าลงตะกร้า เพื่อให้สามารถซื้อหลายรายการพร้อมกันได้

#### Acceptance Criteria

1. WHEN a user clicks "Add to Cart" on a product THEN the system SHALL add the product to the cart
2. WHEN a product is added to cart THEN the system SHALL display a success notification
3. WHEN a user views the cart THEN the system SHALL display all products with quantity and total price
4. WHEN a user changes product quantity in cart THEN the system SHALL update the total price immediately
5. WHEN a user removes a product from cart THEN the system SHALL remove it and update the total

### Requirement 3

**User Story:** ในฐานะผู้ใช้ ฉันต้องการดูตะกร้าสินค้าของฉัน เพื่อให้สามารถตรวจสอบและแก้ไขก่อนสั่งซื้อ

#### Acceptance Criteria

1. WHEN a user opens the cart drawer THEN the system SHALL display all cart items with images, names, prices, and quantities
2. WHEN the cart is empty THEN the system SHALL display an empty state message
3. WHEN a user increases quantity THEN the system SHALL update the quantity and recalculate the total
4. WHEN a user decreases quantity to zero THEN the system SHALL remove the item from cart
5. WHEN cart items change THEN the system SHALL persist the cart state

### Requirement 4

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเห็นจำนวนสินค้าในตะกร้า เพื่อให้รู้ว่ามีสินค้ากี่รายการ

#### Acceptance Criteria

1. WHEN products are in the cart THEN the system SHALL display a badge with the total item count on the cart icon
2. WHEN a product is added THEN the system SHALL increment the cart badge count
3. WHEN a product is removed THEN the system SHALL decrement the cart badge count
4. WHEN the cart is empty THEN the system SHALL hide the cart badge
5. WHEN the page reloads THEN the system SHALL restore the correct cart count

### Requirement 5

**User Story:** ในฐานะผู้ใช้ ฉันต้องการทำการสั่งซื้อสินค้า เพื่อให้ได้รับสินค้าที่ต้องการ

#### Acceptance Criteria

1. WHEN a user clicks "Checkout" THEN the system SHALL require user authentication
2. WHEN an authenticated user proceeds to checkout THEN the system SHALL display a checkout form with shipping information
3. WHEN a user submits valid checkout information THEN the system SHALL create an order
4. WHEN an order is created THEN the system SHALL clear the cart and display order confirmation
5. WHEN an order is created THEN the system SHALL store the order with user information, products, and total price

### Requirement 6

**User Story:** ในฐานะผู้ใช้ ฉันต้องการดูประวัติคำสั่งซื้อของฉัน เพื่อให้สามารถติดตามสถานะและตรวจสอบได้

#### Acceptance Criteria

1. WHEN a logged-in user visits the orders page THEN the system SHALL display all their orders
2. WHEN displaying orders THEN the system SHALL show order date, total price, and status
3. WHEN a user clicks on an order THEN the system SHALL display order details with all products
4. WHEN a user has no orders THEN the system SHALL display an empty state message
5. WHEN orders are loaded THEN the system SHALL sort them by date (newest first)

### Requirement 7

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเห็นหน้า Products ที่แสดงสินค้าทั้งหมด เพื่อให้สามารถเลือกซื้อได้ง่าย

#### Acceptance Criteria

1. WHEN a user visits the products page THEN the system SHALL display all available products in a grid
2. WHEN displaying products THEN the system SHALL show product image, name, description, and price
3. WHEN a user clicks on a product THEN the system SHALL display product details
4. WHEN viewing product details THEN the system SHALL show an "Add to Cart" button
5. WHEN products are loading THEN the system SHALL display a loading indicator

### Requirement 8

**User Story:** ในฐานะผู้ใช้ ฉันต้องการให้ตะกร้าสินค้าถูกเก็บไว้ เพื่อให้สามารถกลับมาซื้อต่อได้ภายหลัง

#### Acceptance Criteria

1. WHEN a user adds products to cart THEN the system SHALL persist the cart to localStorage
2. WHEN a user closes the browser THEN the system SHALL save the cart state
3. WHEN a user returns to the site THEN the system SHALL restore the cart from localStorage
4. WHEN a user logs in THEN the system SHALL merge localStorage cart with user's saved cart
5. WHEN a user completes checkout THEN the system SHALL clear the persisted cart
