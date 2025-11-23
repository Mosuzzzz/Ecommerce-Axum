# Authentication & Cart System Documentation

## Overview
ระบบ Authentication และ Cart ที่ปรับปรุงใหม่ มีการแยกตะกร้าสินค้าตาม user และรองรับ JWT Token + Refresh Token

## Features

### 1. JWT Token Authentication
- **Access Token**: มีอายุ 1 ชั่วโมง (3600 วินาที)
- **Refresh Token**: มีอายุ 7 วัน (604800 วินาที)
- ระบบจะตรวจสอบ token อัตโนมัติเมื่อเริ่มแอพ
- หาก Access Token หมดอายุ จะใช้ Refresh Token ต่ออายุอัตโนมัติ

### 2. User-Specific Shopping Cart
- แต่ละ user มีตะกร้าสินค้าแยกกัน
- ตะกร้าจะถูกเก็บใน localStorage ด้วย key: `cart_{userId}`
- Guest users ใช้ key: `cart_guest`
- เมื่อ login/logout ตะกร้าจะเปลี่ยนตามอัตโนมัติ

### 3. User Address Management
- บันทึกที่อยู่จัดส่งของ user อัตโนมัติ
- Auto-fill ที่อยู่เมื่อ checkout ครั้งถัดไป
- สามารถแก้ไขหรือลบที่อยู่ที่บันทึกได้
- ที่อยู่จะถูกเก็บไว้กับข้อมูล user

## Implementation Details

### AuthService

#### New Methods

```typescript
// Get current access token
getAccessToken(): string | null

// Get current refresh token  
getRefreshToken(): string | null

// Refresh access token using refresh token
refreshAccessToken(): boolean

// Save user's shipping address
saveUserAddress(address: UserAddress): boolean

// Get user's saved address
getUserAddress(): UserAddress | null

// Clear user's saved address
clearUserAddress(): boolean
```

#### New Interfaces

```typescript
interface UserAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}
```

#### Token Storage
- `auth_token` - Access Token
- `refresh_token` - Refresh Token
- `currentUser` - User information

#### Token Format (Mock JWT)
```
header.payload.signature
```

**Payload includes:**
- `sub`: User ID
- `username`: Username
- `role`: User role (admin/user)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

### CartService

#### New Methods

```typescript
// Set current user ID to load their cart
setUserId(userId: string | null): void
```

#### Cart Storage Keys
- User cart: `cart_{userId}` (e.g., `cart_user_1234567890`)
- Guest cart: `cart_guest`
- Admin cart: `cart_admin`

### Workflow

#### Login Flow
```
1. User enters credentials
2. AuthService validates credentials
3. Generate Access Token + Refresh Token
4. Store tokens and user info in localStorage
5. CartService loads user's cart using userId
6. Redirect to appropriate page
```

#### Logout Flow
```
1. User clicks logout
2. Clear user's cart from localStorage
3. Remove tokens and user info
4. CartService switches to guest cart
5. Redirect to home page
```

#### Token Refresh Flow
```
1. App starts or token expires
2. Check Access Token validity
3. If expired, use Refresh Token to get new Access Token
4. If Refresh Token also expired, logout user
5. Update tokens in localStorage
```

## Usage Examples

### Check if user is authenticated
```typescript
if (this.authService.isLoggedIn) {
  // User is logged in
}
```

### Get current access token
```typescript
const token = this.authService.getAccessToken();
// Use token in HTTP headers
```

### Manually refresh token
```typescript
const success = this.authService.refreshAccessToken();
if (success) {
  // Token refreshed successfully
} else {
  // Refresh failed, user logged out
}
```

### Load user's cart
```typescript
const user = this.authService.currentUserValue;
if (user) {
  this.cartService.setUserId(user.id);
}
```

### Save user address
```typescript
const address: UserAddress = {
  fullName: 'John Doe',
  address: '123 Main St',
  city: 'Bangkok',
  postalCode: '10110',
  phone: '0812345678'
};
this.authService.saveUserAddress(address);
```

### Get saved address
```typescript
const savedAddress = this.authService.getUserAddress();
if (savedAddress) {
  // Auto-fill form with saved address
  this.shippingInfo = { ...savedAddress };
}
```

### Clear saved address
```typescript
this.authService.clearUserAddress();
```

## Security Considerations

### Current Implementation (Mock)
⚠️ **This is a MOCK implementation for development/demo purposes**

- Tokens are generated client-side
- No real encryption or signing
- Tokens stored in localStorage (vulnerable to XSS)

### Production Recommendations

1. **Backend Token Generation**
   - Generate tokens on backend server
   - Use proper JWT libraries (e.g., jsonwebtoken)
   - Sign tokens with secret key

2. **Secure Storage**
   - Consider using HttpOnly cookies for tokens
   - Implement CSRF protection
   - Use secure, httpOnly, sameSite flags

3. **Token Validation**
   - Validate tokens on backend for every request
   - Implement token blacklist for logout
   - Use short-lived access tokens (5-15 minutes)

4. **HTTPS Only**
   - Always use HTTPS in production
   - Never send tokens over HTTP

5. **Additional Security**
   - Implement rate limiting
   - Add brute force protection
   - Log authentication attempts
   - Implement 2FA for sensitive operations

## Testing

### Test Accounts

**Admin:**
- Username: `admin`
- Password: `admin123`
- Cart Key: `cart_admin`

**Regular User (after registration):**
- Username: `user`
- Password: `user123`
- Cart Key: `cart_user_{generated_id}`

### Test Scenarios

1. **Login with different users**
   - Login as user1
   - Add items to cart
   - Logout
   - Login as user2
   - Verify cart is empty
   - Login as user1 again
   - Verify cart items are restored

2. **Token expiration**
   - Login
   - Wait for token to expire (or manually expire in localStorage)
   - Perform an action
   - Verify token is refreshed automatically

3. **Guest to User cart**
   - Add items as guest
   - Login
   - Verify cart switches to user's cart
   - Logout
   - Verify cart switches back to guest cart

## Migration from Old System

### Changes Required

1. **No code changes needed for existing components**
   - CartService API remains the same
   - AuthService API is backward compatible

2. **Automatic migration**
   - Old `shopping_cart` key will be ignored
   - Users will start with empty carts
   - Each user builds their own cart

3. **Optional: Migrate guest cart**
   ```typescript
   // On first login, optionally merge guest cart
   const guestCart = localStorage.getItem('cart_guest');
   if (guestCart) {
     // Merge with user cart
   }
   ```

## API Integration (Future)

When connecting to real backend:

### Login Endpoint
```typescript
POST /api/auth/login
Body: { username, password }
Response: { 
  user: User,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}
```

### Refresh Token Endpoint
```typescript
POST /api/auth/refresh
Headers: { Authorization: Bearer {refreshToken} }
Response: {
  accessToken: string,
  refreshToken: string,
  expiresIn: number
}
```

### Cart Endpoints
```typescript
GET /api/cart
Headers: { Authorization: Bearer {accessToken} }
Response: { items: CartItem[] }

POST /api/cart/items
Headers: { Authorization: Bearer {accessToken} }
Body: { productId, quantity }

DELETE /api/cart/items/:productId
Headers: { Authorization: Bearer {accessToken} }
```

## Troubleshooting

### Cart not loading after login
- Check browser console for errors
- Verify userId is set correctly
- Check localStorage for cart key

### Token expired immediately
- Check system time is correct
- Verify token generation logic
- Check expiration calculation

### Cart items disappear
- Verify correct userId is being used
- Check localStorage quota not exceeded
- Ensure logout doesn't clear wrong cart

## Future Enhancements

1. **Backend Integration**
   - Real JWT token generation
   - Server-side cart storage
   - Token validation middleware

2. **Cart Sync**
   - Sync cart across devices
   - Merge guest cart on login
   - Real-time cart updates

3. **Security**
   - Implement proper JWT
   - Add token rotation
   - Implement session management

4. **Features**
   - Remember me functionality
   - Social login integration
   - Multi-device logout

---

**Last Updated**: 2024-11-23
**Version**: 2.0.0
