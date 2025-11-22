# Design Document

## Overview

การออกแบบนี้จะเชื่อมต่อ Angular frontend application กับ Rust/Axum backend API โดยใช้ Angular HttpClient สำหรับทำ HTTP requests และเพิ่ม CORS middleware ใน backend เพื่อให้สามารถรับ requests จาก frontend ได้ ระบบจะรองรับทั้งโหมด development (mock data) และ production (real API)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────┐
│   Angular Frontend (Port 4200)     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Product Carousel           │  │
│  │   Component                  │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│  ┌────────────▼─────────────────┐  │
│  │   Product Service            │  │
│  │   (HttpClient)               │  │
│  └────────────┬─────────────────┘  │
│               │                     │
└───────────────┼─────────────────────┘
                │ HTTP GET /api/products
                │
┌───────────────▼─────────────────────┐
│   Rust/Axum Backend (Port 8080)    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   CORS Middleware            │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│  ┌────────────▼─────────────────┐  │
│  │   Routes Handler             │  │
│  │   GET /api/products          │  │
│  └────────────┬─────────────────┘  │
│               │                     │
│  ┌────────────▼─────────────────┐  │
│  │   Diesel ORM                 │  │
│  └────────────┬─────────────────┘  │
│               │                     │
└───────────────┼─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│   PostgreSQL Database               │
│   (products table)                  │
└─────────────────────────────────────┘
```

### Communication Flow

1. User เปิดหน้าเว็บ → ProductCarousel component โหลด
2. Component เรียก ProductService.getProducts()
3. ProductService ส่ง HTTP GET request ไปที่ http://localhost:8080/api/products
4. Backend CORS middleware ตรวจสอบและอนุญาต request
5. Routes handler ดึงข้อมูลจาก database ผ่าน Diesel ORM
6. Backend ส่ง JSON response กลับพร้อม CORS headers
7. ProductService แปลง JSON เป็น Product objects
8. Component แสดงสินค้าใน UI

## Components and Interfaces

### Frontend Components

#### 1. Product Service (Modified)

**Location**: `frontend/src/app/services/product.service.ts`

**Responsibilities**:
- จัดการ HTTP requests ไปยัง backend API
- แปลง response data เป็น Product objects
- จัดการ errors และ retry logic
- รองรับการสลับระหว่าง mock data และ real API

**Key Methods**:
```typescript
class ProductService {
  private apiUrl: string;
  private useMockData: boolean;
  
  getProducts(): Observable<Product[]>
  // ส่ง GET request ไปที่ /api/products
  // คืนค่า Observable ของ Product array
}
```

#### 2. Product Carousel Component (Modified)

**Location**: `frontend/src/app/components/product-carousel/product-carousel.ts`

**Responsibilities**:
- แสดง loading state ขณะรอข้อมูล
- แสดง error message เมื่อเกิดข้อผิดพลาด
- แสดง empty state เมื่อไม่มีสินค้า
- Render สินค้าที่ได้จาก API

**State Management**:
```typescript
class ProductCarousel {
  products: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
}
```

#### 3. App Config (Modified)

**Location**: `frontend/src/app/app.config.ts`

**Responsibilities**:
- ให้ HttpClient provider สำหรับทั้ง application
- ตั้งค่า interceptors ถ้าจำเป็น

### Backend Components

#### 1. CORS Middleware

**Location**: `backend/src/main.rs` (หรือไฟล์ middleware แยก)

**Responsibilities**:
- เพิ่ม CORS headers ในทุก response
- จัดการ preflight OPTIONS requests
- อนุญาต origins, methods, และ headers ที่จำเป็น

**Configuration**:
```rust
CorsLayer::new()
  .allow_origin("http://localhost:4200".parse::<HeaderValue>().unwrap())
  .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
  .allow_headers([CONTENT_TYPE, AUTHORIZATION])
```

#### 2. Routes Handler (Existing)

**Location**: `backend/src/routes.rs`

**Current Endpoints**:
- `GET /api/products` - ดึงรายการสินค้าทั้งหมด
- `POST /api/products` - เพิ่มสินค้าใหม่ (ใช้ในอนาคต)

**No changes needed** - endpoints ที่มีอยู่ใช้งานได้แล้ว

## Data Models

### Product Interface (Frontend)

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}
```

### Product Struct (Backend)

```rust
struct Product {
  id: i32,
  name: String,
  description: String,
  price: f64,
  image_url: String,
}
```

**Data Mapping**: JSON serialization/deserialization จะทำโดย serde (backend) และ Angular HttpClient (frontend) โดยอัตโนมัติ

## Error Handling

### Frontend Error Handling

1. **Network Errors**:
   - ตรวจจับ network failures (backend ไม่ทำงาน, ไม่มี internet)
   - แสดง error message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"

2. **HTTP Errors**:
   - 404: "ไม่พบข้อมูลสินค้า"
   - 500: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์"
   - อื่นๆ: แสดง status code และ message

3. **Data Validation Errors**:
   - ตรวจสอบว่า response มี required fields ครบ
   - แสดง warning ถ้าข้อมูลไม่สมบูรณ์

### Backend Error Handling

1. **Database Errors**:
   - จับ Diesel errors และแปลงเป็น HTTP 500
   - Log error details สำหรับ debugging

2. **CORS Errors**:
   - ถ้า origin ไม่ได้รับอนุญาต ให้ reject request
   - Log attempted origins สำหรับ security monitoring

## Testing Strategy

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Correctness Properties


#### Property Reflection

หลังจากวิเคราะห์ acceptance criteria แล้ว เราพบว่ามี properties บางตัวที่ซ้ำซ้อนหรือสามารถรวมกันได้:

**Redundancies Identified**:
1. Properties 1.2 และ 3.5 ทั้งคู่ test การมี required fields - สามารถรวมเป็น property เดียว
2. Properties 5.4 และ 5.5 ทั้งคู่เกี่ยวกับความสอดคล้องของ Product structure - สามารถรวมกัน
3. Properties 2.1, 2.4, และ 2.5 ทั้งหมดเกี่ยวกับ CORS headers - สามารถรวมเป็น property เดียวที่ครอบคลุม

**Properties to Keep**:
- API response parsing และ validation (รวม 1.2 + 3.5)
- CORS headers completeness (รวม 2.1 + 2.4 + 2.5)
- Error handling across status codes (4.3)
- Error logging with context (4.5)
- Data consistency across modes (รวม 5.4 + 5.5)
- Concurrent request handling (6.5)

### Correctness Properties

Property 1: API response field completeness
*For any* product returned from the Backend API, the Product object SHALL contain all required fields: id, name, description, price, and image_url with valid non-null values
**Validates: Requirements 1.2, 3.5**

Property 2: CORS headers completeness
*For any* HTTP request from the Frontend Application to the Backend API, the response SHALL include Access-Control-Allow-Origin, Access-Control-Allow-Methods (including GET and POST), and Access-Control-Allow-Headers (including Content-Type)
**Validates: Requirements 2.1, 2.4, 2.5**

Property 3: JSON parsing consistency
*For any* valid JSON response from the Backend API, parsing the response SHALL produce Product objects that match the JSON structure without data loss
**Validates: Requirements 3.3**

Property 4: Error status code handling
*For any* HTTP error status code (4xx or 5xx) returned by the Backend API, the Frontend Application SHALL handle the error and provide appropriate feedback without crashing
**Validates: Requirements 4.3**

Property 5: Error logging context
*For any* error that occurs during API communication, the logged error SHALL include the endpoint URL, error type, and timestamp
**Validates: Requirements 4.5**

Property 6: Data structure consistency across modes
*For any* product data, whether retrieved from mock data or real API, the Product interface structure SHALL remain identical with the same field names and types
**Validates: Requirements 5.4, 5.5**

Property 7: Concurrent request handling
*For any* set of concurrent HTTP requests to the Backend API, each request SHALL complete independently without interfering with other requests, and all responses SHALL be correctly matched to their respective requests
**Validates: Requirements 6.5**

### Unit Testing

Unit tests จะครอบคลุม:

1. **Product Service Tests**:
   - Service initialization with correct base URL (1.5, 3.1)
   - getProducts() makes GET request to /api/products (3.2)
   - Mock data mode returns data without HTTP calls (5.2)
   - Real API mode makes HTTP calls (5.3)
   - Toggle between modes works correctly (5.1)

2. **Component Tests**:
   - ProductCarousel loads products on init (1.1, 1.4)
   - Loading indicator shows during load (6.1)
   - Loading indicator hides after load (6.2)
   - Error message displays on API failure (1.3, 4.1, 4.4)
   - Empty state displays when no products (6.3 - edge case)

3. **Backend CORS Tests**:
   - OPTIONS preflight request returns correct headers (2.2)
   - Requests from localhost:4200 are accepted (2.3)

4. **Edge Cases**:
   - Backend unreachable scenario (4.2)
   - Empty product list (6.3)

### Property-Based Testing

เราจะใช้ **fast-check** library สำหรับ property-based testing ใน TypeScript/Angular และ **proptest** สำหรับ Rust backend

**Configuration**: แต่ละ property test จะรัน minimum 100 iterations

**Test Tagging**: แต่ละ property test จะมี comment ที่ reference correctness property:
```typescript
// Feature: frontend-backend-integration, Property 1: API response field completeness
```

**Property Test Implementation**:

1. **Property 1 - API response field completeness**:
   - Generate random product JSON responses
   - Parse each response
   - Verify all required fields exist and are non-null

2. **Property 2 - CORS headers completeness**:
   - Generate random valid HTTP requests
   - Send to backend
   - Verify all required CORS headers are present

3. **Property 3 - JSON parsing consistency**:
   - Generate random valid Product JSON
   - Parse to Product object
   - Serialize back to JSON
   - Verify data matches original (round-trip)

4. **Property 4 - Error status code handling**:
   - Generate random error status codes (400-599)
   - Simulate API errors with those codes
   - Verify app handles each without crashing

5. **Property 5 - Error logging context**:
   - Generate random error scenarios
   - Trigger errors
   - Verify logs contain URL, type, and timestamp

6. **Property 6 - Data structure consistency**:
   - Generate random product data
   - Get same data from both mock and API modes
   - Verify structure is identical

7. **Property 7 - Concurrent request handling**:
   - Generate random number of concurrent requests (1-20)
   - Send all simultaneously
   - Verify all complete and responses match requests

## Implementation Notes

### Frontend Changes Required

1. **app.config.ts**:
   - เพิ่ม `provideHttpClient()` ใน providers array

2. **product.service.ts**:
   - Import HttpClient
   - Inject HttpClient ใน constructor
   - แก้ไข getProducts() ให้เรียก HTTP API
   - เพิ่ม error handling

3. **product-carousel.ts**:
   - เพิ่ม loading state
   - เพิ่ม error state
   - แก้ไข template ให้แสดง loading/error states

### Backend Changes Required

1. **Cargo.toml**:
   - เพิ่ม dependency: `tower-http = { version = "0.5", features = ["cors"] }`

2. **main.rs**:
   - Import CORS layer จาก tower-http
   - เพิ่ม CORS middleware ใน router
   - Configure allowed origins, methods, headers

### Environment Configuration

**Development**:
- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- CORS: อนุญาต localhost:4200

**Production** (future):
- ใช้ environment variables สำหรับ API URL
- CORS: อนุญาตเฉพาะ production domain

## Security Considerations

1. **CORS Configuration**:
   - Development: อนุญาตเฉพาะ localhost:4200
   - Production: ต้องระบุ domain ที่ชัดเจน ห้ามใช้ wildcard (*)

2. **Error Messages**:
   - ไม่เปิดเผย sensitive information ใน error messages
   - Log detailed errors ใน server-side เท่านั้น

3. **Input Validation**:
   - Backend ต้อง validate ข้อมูลทั้งหมดก่อน process
   - Frontend validate เพื่อ UX แต่ไม่ใช่ security layer

## Performance Considerations

1. **HTTP Connection Pooling**:
   - Angular HttpClient ใช้ connection pooling โดยอัตโนมัติ

2. **Response Caching** (future enhancement):
   - พิจารณาใช้ HTTP caching headers
   - Cache products ใน frontend สำหรับ short period

3. **Loading States**:
   - แสดง loading indicator ทันทีเมื่อเริ่ม request
   - ป้องกัน multiple simultaneous requests ถ้าไม่จำเป็น

## Monitoring and Debugging

1. **Frontend Logging**:
   - Log ทุก API request/response ใน development mode
   - Log เฉพาะ errors ใน production

2. **Backend Logging**:
   - Log incoming requests with timestamp
   - Log errors with full context
   - Monitor CORS-related errors

3. **Network Tab**:
   - ใช้ browser DevTools Network tab เพื่อ debug
   - ตรวจสอบ request/response headers
   - ดู response payload
