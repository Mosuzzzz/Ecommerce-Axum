# Requirements Document

## Introduction

ระบบนี้จะเชื่อมต่อ Angular frontend กับ Rust/Axum backend API เพื่อให้สามารถดึงข้อมูลสินค้าจริงจากฐานข้อมูล PostgreSQL แทนการใช้ mock data และจัดการ CORS เพื่อให้ frontend และ backend สามารถสื่อสารกันได้อย่างปลอดภัย

## Glossary

- **Frontend Application**: แอปพลิเคชัน Angular ที่ทำงานบน port 4200
- **Backend API**: เซิร์ฟเวอร์ Rust/Axum ที่ทำงานบน port 8080
- **CORS**: Cross-Origin Resource Sharing - กลไกความปลอดภัยที่อนุญาตให้ frontend เรียกใช้ API จาก origin ที่ต่างกัน
- **Product Service**: Angular service ที่จัดการการเรียก API เกี่ยวกับสินค้า
- **HTTP Client**: Angular HttpClient module สำหรับทำ HTTP requests
- **API Endpoint**: URL path ที่ backend เปิดให้เรียกใช้งาน

## Requirements

### Requirement 1

**User Story:** ในฐานะผู้ใช้ ฉันต้องการเห็นสินค้าจริงจากฐานข้อมูล เพื่อให้ฉันสามารถดูข้อมูลสินค้าที่ถูกต้องและเป็นปัจจุบัน

#### Acceptance Criteria

1. WHEN the Frontend Application loads the product list THEN the Frontend Application SHALL fetch products from the Backend API endpoint
2. WHEN the Backend API returns product data THEN the Frontend Application SHALL display all product fields including id, name, description, price, and image_url
3. WHEN the Backend API request fails THEN the Frontend Application SHALL display an error message to the user
4. WHEN products are successfully loaded THEN the Frontend Application SHALL render them in the product carousel component
5. WHEN the Frontend Application makes API requests THEN the Frontend Application SHALL use the correct Backend API base URL

### Requirement 2

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้ backend รองรับ CORS เพื่อให้ frontend สามารถเรียกใช้ API ได้โดยไม่มีปัญหาด้านความปลอดภัย

#### Acceptance Criteria

1. WHEN the Frontend Application sends a request to the Backend API THEN the Backend API SHALL include appropriate CORS headers in the response
2. WHEN the Frontend Application sends a preflight OPTIONS request THEN the Backend API SHALL respond with allowed origins, methods, and headers
3. WHEN the Backend API receives requests from localhost:4200 THEN the Backend API SHALL accept and process those requests
4. WHEN the Backend API sets CORS headers THEN the Backend API SHALL allow GET and POST methods
5. WHEN the Backend API sets CORS headers THEN the Backend API SHALL allow Content-Type and other necessary headers

### Requirement 3

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้ Product Service จัดการ HTTP requests อย่างถูกต้อง เพื่อให้สามารถสื่อสารกับ backend ได้อย่างมีประสิทธิภาพ

#### Acceptance Criteria

1. WHEN the Product Service is initialized THEN the Product Service SHALL configure HttpClient with the Backend API base URL
2. WHEN the Product Service calls getProducts THEN the Product Service SHALL send a GET request to /api/products endpoint
3. WHEN the Backend API returns a response THEN the Product Service SHALL parse the JSON response into Product objects
4. WHEN the HTTP request encounters an error THEN the Product Service SHALL propagate the error to the calling component
5. WHEN the Product Service receives product data THEN the Product Service SHALL validate that all required fields are present

### Requirement 4

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้มีการจัดการ error ที่ดี เพื่อให้สามารถ debug และแก้ไขปัญหาได้ง่าย

#### Acceptance Criteria

1. WHEN an HTTP request fails THEN the Frontend Application SHALL log the error details to the console
2. WHEN the Backend API is unreachable THEN the Frontend Application SHALL display a user-friendly error message
3. WHEN the Backend API returns an error status code THEN the Frontend Application SHALL handle the error appropriately
4. WHEN network errors occur THEN the Frontend Application SHALL provide feedback to the user
5. WHEN errors are logged THEN the Frontend Application SHALL include relevant context such as endpoint URL and error type

### Requirement 5

**User Story:** ในฐานะนักพัฒนา ฉันต้องการให้มีการตั้งค่าที่ยืดหยุ่น เพื่อให้สามารถสลับระหว่าง mock data และ real API ได้ง่าย

#### Acceptance Criteria

1. WHEN the Product Service is configured THEN the Product Service SHALL provide a way to toggle between mock data and real API
2. WHEN using mock data mode THEN the Product Service SHALL return mock products without making HTTP requests
3. WHEN using real API mode THEN the Product Service SHALL make actual HTTP requests to the Backend API
4. WHEN the environment changes THEN the Product Service SHALL use the appropriate API URL for that environment
5. WHEN switching between modes THEN the Product Service SHALL maintain consistent Product interface structure

### Requirement 6

**User Story:** ในฐานะผู้ใช้ ฉันต้องการให้การโหลดข้อมูลเป็นไปอย่างราบรื่น เพื่อให้ประสบการณ์การใช้งานดี

#### Acceptance Criteria

1. WHEN products are being loaded THEN the Frontend Application SHALL display a loading indicator
2. WHEN products finish loading THEN the Frontend Application SHALL hide the loading indicator
3. WHEN the product list is empty THEN the Frontend Application SHALL display an appropriate empty state message
4. WHEN products load successfully THEN the Frontend Application SHALL transition smoothly from loading to displaying products
5. WHEN multiple requests are made THEN the Frontend Application SHALL handle concurrent requests appropriately
