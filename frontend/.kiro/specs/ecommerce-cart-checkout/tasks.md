# Implementation Plan

- [ ] 1. Create Cart Service
  - สร้าง CartService พร้อม BehaviorSubject สำหรับ cart state
  - Implement addToCart, removeFromCart, updateQuantity, clearCart methods
  - เพิ่ม localStorage persistence
  - สร้าง CartItem interface
  - _Requirements: 2.1, 2.5, 3.5, 8.1, 8.2_

- [ ] 2. Update Product Carousel to use Cart Service
  - Inject CartService ใน ProductCarousel component
  - เชื่อมต่อ "Add to Cart" button กับ CartService.addToCart()
  - เพิ่ม success notification เมื่อเพิ่มสินค้าสำเร็จ
  - _Requirements: 2.1, 2.2_

- [ ] 3. Implement Cart Drawer UI
  - สร้าง cart drawer component ที่ slide in จากขวา
  - แสดงรายการสินค้าในตะกร้า พร้อมรูป ชื่อ ราคา จำนวน
  - เพิ่ม quantity controls (+/- buttons)
  - แสดง cart total
  - เพิ่มปุ่ม "Remove" สำหรับแต่ละสินค้า
  - เพิ่ม empty state เมื่อตะกร้าว่าง
  - เพิ่มปุ่ม "Checkout"
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Add Cart Badge to Navbar
  - เพิ่ม cart icon พร้อม badge แสดงจำนวนสินค้า
  - Subscribe to CartService.getCartCount()
  - อัปเดต badge เมื่อ cart เปลี่ยนแปลง
  - ซ่อน badge เมื่อตะกร้าว่าง
  - เพิ่ม click handler เพื่อเปิด cart drawer
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Enhance Auth Service for User Registration
  - เพิ่ม register() method ใน AuthService
  - สร้าง User interface พร้อม id, username, email, role
  - เก็บ users array ใน localStorage
  - ตรวจสอบ duplicate username
  - สร้าง unique user ID
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 6. Create Register Page
  - สร้าง register component พร้อม form
  - เพิ่ม fields: username, email, password, confirm password
  - Validate form inputs
  - เชื่อมต่อกับ AuthService.register()
  - แสดง error messages
  - Redirect to login หลัง register สำเร็จ
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 7. Update Login Page for Users
  - แก้ไข login page ให้รองรับทั้ง admin และ user
  - เพิ่มลิงก์ไปหน้า register
  - อัปเดต UI ให้เหมาะกับทั้ง 2 role
  - _Requirements: 1.4_

- [ ] 8. Create Order Service
  - สร้าง OrderService
  - Implement createOrder() method
  - สร้าง Order และ ShippingInfo interfaces
  - Generate unique order IDs
  - เก็บ orders ใน localStorage (แยกตาม userId)
  - Implement getUserOrders() method
  - _Requirements: 5.3, 5.5, 6.1_

- [ ] 9. Create Checkout Page
  - สร้าง checkout component
  - เพิ่ม authentication guard
  - สร้าง shipping information form
  - Validate form inputs (required fields, formats)
  - แสดง order summary (items, total)
  - เชื่อมต่อกับ OrderService.createOrder()
  - Clear cart หลังสร้าง order สำเร็จ
  - แสดง order confirmation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 10. Create Orders History Page
  - สร้าง orders component
  - เพิ่ม authentication guard
  - ดึง orders จาก OrderService.getUserOrders()
  - แสดง order list พร้อม date, total, status
  - เพิ่ม order detail view
  - Sort orders by date (newest first)
  - เพิ่ม empty state เมื่อไม่มี orders
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 11. Create Products Page
  - สร้าง products component แยกจาก home
  - ย้าย product grid จาก home มาที่นี่
  - เพิ่ม "Add to Cart" button สำหรับแต่ละสินค้า
  - แสดง loading state
  - เชื่อมต่อกับ CartService
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Update Routes and Navigation
  - เพิ่ม routes: /products, /checkout, /orders, /register
  - เพิ่ม guards สำหรับ protected routes
  - อัปเดต navbar links
  - เพิ่ม "Products" และ "Orders" links
  - _Requirements: All_

- [ ] 13. Implement Cart Persistence
  - ตรวจสอบว่า cart save/load จาก localStorage ถูกต้อง
  - Test cart restoration หลัง browser refresh
  - Implement cart merge เมื่อ user login (optional)
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 14. Add Notifications System
  - สร้าง notification service
  - เพิ่ม toast notifications
  - แสดง success message เมื่อเพิ่มสินค้าลงตะกร้า
  - แสดง error messages
  - Auto-dismiss หลัง 3 วินาที
  - _Requirements: 2.2_

- [ ] 15. Polish UI/UX
  - เพิ่ม animations สำหรับ cart drawer
  - ปรับปรุง responsive design
  - เพิ่ม loading states ทุกที่
  - ตรวจสอบ accessibility
  - เพิ่ม empty states ทุกหน้า
  - _Requirements: All_

- [ ] 16. Final Testing and Integration
  - ทดสอบ complete user flow: browse → add to cart → checkout → order
  - ทดสอบ cart persistence
  - ทดสอบ authentication flow
  - ทดสอบ order history
  - แก้ไข bugs ที่พบ
  - _Requirements: All_
