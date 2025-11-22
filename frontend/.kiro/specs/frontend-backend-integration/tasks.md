# Implementation Plan

- [x] 1. Setup HttpClient in Angular application
  - เพิ่ม `provideHttpClient()` ใน app.config.ts providers
  - ตรวจสอบว่า HttpClient พร้อมใช้งานใน application
  - _Requirements: 3.1_

- [x] 2. Add CORS support to backend
  - เพิ่ม tower-http dependency ใน Cargo.toml
  - Import และ configure CorsLayer ใน main.rs
  - ตั้งค่า allowed origins (localhost:4200), methods (GET, POST, OPTIONS), และ headers (Content-Type)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 2.1 Write property test for CORS headers completeness
  - **Property 2: CORS headers completeness**
  - **Validates: Requirements 2.1, 2.4, 2.5**

- [ ]* 2.2 Write unit tests for CORS configuration
  - Test OPTIONS preflight request
  - Test requests from localhost:4200 are accepted
  - _Requirements: 2.2, 2.3_

- [x] 3. Update Product Service to use real API
  - Import HttpClient และ inject ใน constructor
  - แก้ไข getProducts() method ให้ส่ง HTTP GET request ไปที่ backend
  - เพิ่ม error handling และ logging
  - รักษา toggle mechanism สำหรับสลับระหว่าง mock data และ real API
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 4.1, 5.1, 5.2, 5.3_

- [ ]* 3.1 Write property test for JSON parsing consistency
  - **Property 3: JSON parsing consistency**
  - **Validates: Requirements 3.3**

- [ ]* 3.2 Write property test for API response field completeness
  - **Property 1: API response field completeness**
  - **Validates: Requirements 1.2, 3.5**

- [ ]* 3.3 Write property test for data structure consistency across modes
  - **Property 6: Data structure consistency across modes**
  - **Validates: Requirements 5.4, 5.5**

- [ ]* 3.4 Write unit tests for Product Service
  - Test service initialization with correct base URL
  - Test getProducts() makes GET request to /api/products
  - Test mock data mode returns data without HTTP calls
  - Test real API mode makes HTTP calls
  - Test toggle between modes
  - _Requirements: 1.5, 3.1, 3.2, 5.1, 5.2, 5.3_

- [x] 4. Add loading and error states to Product Carousel
  - เพิ่ม loading boolean property
  - เพิ่ม error string property
  - แก้ไข ngOnInit() ให้ set loading = true ก่อนเรียก API
  - จัดการ error callback และ set error message
  - Set loading = false เมื่อได้ response (success หรือ error)
  - _Requirements: 1.3, 4.2, 4.3, 4.4, 6.1, 6.2_

- [ ]* 4.1 Write property test for error status code handling
  - **Property 4: Error status code handling**
  - **Validates: Requirements 4.3**

- [ ]* 4.2 Write property test for error logging context
  - **Property 5: Error logging context**
  - **Validates: Requirements 4.5**

- [ ]* 4.3 Write unit tests for error handling
  - Test error message displays on API failure
  - Test loading indicator shows during load
  - Test loading indicator hides after load
  - Test backend unreachable scenario
  - _Requirements: 1.3, 4.1, 4.2, 4.4, 6.1, 6.2_

- [x] 5. Update Product Carousel template
  - เพิ่ม loading indicator (spinner หรือ skeleton) ที่แสดงเมื่อ loading = true
  - เพิ่ม error message display ที่แสดงเมื่อ error มีค่า
  - เพิ่ม empty state message เมื่อ products.length === 0 และไม่ loading
  - ตรวจสอบว่า product list แสดงเมื่อมีข้อมูล
  - _Requirements: 1.2, 1.4, 6.1, 6.2, 6.3_

- [ ]* 5.1 Write unit test for empty state display
  - Test empty state message displays when no products
  - _Requirements: 6.3_

- [x] 6. Test integration between frontend and backend
  - Start backend server (cargo run)
  - Start frontend dev server (ng serve)
  - ตรวจสอบว่า products โหลดจาก backend API สำเร็จ
  - ตรวจสอบว่า CORS headers ถูกต้องใน browser DevTools
  - ทดสอบ error scenarios (stop backend, ดู error message)
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ]* 6.1 Write property test for concurrent request handling
  - **Property 7: Concurrent request handling**
  - **Validates: Requirements 6.5**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
