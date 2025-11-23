# 🔐 TÓM TẮT LUỒNG AUTHENTICATION

## 📋 Tổng quan

Hệ thống sử dụng **JWT (JSON Web Token)** với 2 loại token:
- **Access Token**: Hết hạn sau 1 ngày (mặc định)
- **Refresh Token**: Hết hạn sau 7 ngày (mặc định)

## 🔄 Các luồng chính

### 1. 📝 ĐĂNG KÝ (Register)

**Endpoint**: `POST /api/auth/register`

**Flow:**
```
1. User gửi thông tin: email, password, fullName (optional)
2. Backend kiểm tra:
   - Email đã tồn tại? → Throw error
   - Hash password bằng bcrypt (salt rounds: 10)
   - Generate verification token (32 bytes hex, hết hạn sau 7 ngày)
3. Tạo user trong DB với:
   - role = "USER" (mặc định)
   - emailVerified = false
   - emailVerificationToken = token
   - emailVerificationExpires = now + 7 days
4. Gửi email verification (qua Resend API)
5. Trả về user info (không có password, không có role) + message
```

**Response:**
```json
{
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "fullName": "John Doe",
    "emailVerified": false
  },
  "message": "Registration successful! Please check your email to verify your account."
}
```

**Lưu ý**: 
- Tất cả user mới đều có role = "USER" (mặc định)
- Role không được trả về trong API response để bảo mật
```

---

### 2. ✉️ XÁC THỰC EMAIL (Email Verification)

**Endpoint**: `GET /api/auth/verify-email?token=xxx`

**Flow:**
```
1. User click link trong email (chứa token)
2. Backend tìm user theo emailVerificationToken
3. Kiểm tra:
   - Token hợp lệ? → Throw "Invalid token"
   - Email đã verify? → Throw "Email already verified"
   - Token hết hạn? → Throw "Token expired"
4. Update user:
   - emailVerified = true
   - emailVerificationToken = null
   - emailVerificationExpires = null
5. Trả về success message
```

**Response:**
```json
{
  "message": "Email verified successfully!"
}
```

**Lưu ý**: User phải verify email trước khi có thể login!

---

### 3. 🔄 GỬI LẠI EMAIL XÁC THỰC (Resend Verification)

**Endpoint**: `POST /api/auth/resend-verification`

**Flow:**
```
1. User gửi email
2. Backend kiểm tra:
   - Email tồn tại? → Throw "Email not found"
   - Email đã verify? → Throw "Email already verified"
3. Generate token mới (hết hạn sau 7 ngày)
4. Update user với token mới
5. Gửi email verification mới
6. Trả về success message
```

---

### 4. 🔑 ĐĂNG NHẬP (Login)

**Endpoint**: `POST /api/auth/login`

**Flow:**
```
1. User gửi email + password
2. LocalStrategy.validate() được gọi:
   - Tìm user theo email
   - Kiểm tra emailVerified = true? → Throw "Email not verified"
   - So sánh password với bcrypt.compare()
   - Trả về user (không có password)
3. Generate tokens:
   - Access Token: JWT với payload { sub: userId, email }
   - Refresh Token: JWT với JWT_REFRESH_SECRET
4. Trả về user info + tokens
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Lưu ý**: Role không được trả về trong response để bảo mật

**Lưu ý**: 
- Frontend lưu cả 2 tokens vào localStorage (qua Zustand store)
- Access token được gắn vào header: `Authorization: Bearer <token>`

---

### 5. 🔄 LÀM MỚI TOKEN (Refresh Token)

**Endpoint**: `POST /api/auth/refresh`

**Flow:**
```
1. User gửi refreshToken
2. Backend verify refreshToken với JWT_REFRESH_SECRET
3. Lấy userId từ payload
4. Tìm user trong DB
5. Generate tokens mới (access + refresh)
6. Trả về tokens mới + user info
```

**Response:**
```json
{
  "accessToken": "new_token...",
  "refreshToken": "new_refresh_token...",
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Lưu ý**: Role không được trả về trong response

**Lưu ý**: 
- Frontend tự động refresh khi access token hết hạn (qua Axios interceptor)
- Refresh token cũng được refresh mỗi lần

---

### 6. 🛡️ BẢO VỆ ROUTE (Protected Routes)

**Guard**: `JwtAuthGuard`

**Flow:**
```
1. Request đến protected route
2. JwtStrategy.validate() được gọi:
   - Extract token từ header: Authorization: Bearer <token>
   - Verify token với JWT_SECRET
   - Extract payload { sub: userId, email }
   - Trả về { userId, email }
3. Request.user được set = { userId, email }
4. Controller/Service có thể dùng request.user
```

**Ví dụ sử dụng:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  // req.user = { userId: 'xxx', email: 'user@example.com' }
  return this.userService.getProfile(req.user.userId);
}
```

---

### 7. 👮 PHÂN QUYỀN (Role-Based Access)

**Guard**: `RolesGuard` + `@Roles()` decorator

**Flow:**
```
1. Route được bảo vệ bởi JwtAuthGuard + RolesGuard
2. RolesGuard.canActivate():
   - Lấy required roles từ @Roles() decorator
   - Lấy userId từ request.user
   - Query DB để lấy role của user
   - Kiểm tra user.role có trong required roles?
   - Nếu không → Throw 403 Forbidden
```

**Ví dụ:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Post('categories')
createCategory() {
  // Chỉ ADMIN mới được truy cập
}
```

---

## 🔐 Security Features

### Password Security
- **Hashing**: bcrypt với salt rounds = 10
- **Validation**: Minimum 6 characters

### Token Security
- **Access Token**: 
  - Secret: `JWT_SECRET`
  - Expires: 1 day (configurable)
  - Payload: `{ sub: userId, email }` (không chứa role)
  
- **Refresh Token**:
  - Secret: `JWT_REFRESH_SECRET` (khác với access token)
  - Expires: 7 days (configurable)
  - Payload: `{ sub: userId, email }` (không chứa role)

### Role Security
- **Không expose role**: Role không được trả về trong bất kỳ API response nào
- **Authorization**: Role vẫn được lưu trong DB và dùng cho `RolesGuard` để kiểm tra quyền truy cập
- **Default role**: Tất cả user mới đều có role = "USER" (không thể chọn khi register)

### Email Verification
- **Token**: 32 bytes random hex string
- **Expires**: 7 days
- **One-time use**: Token bị xóa sau khi verify

### Auto Cleanup
- **Cron Job**: Chạy mỗi ngày lúc 2 AM
- **Xóa**: Users chưa verify email sau 7 ngày

---

## 📊 Database Schema

### User Model
```prisma
model User {
  id                       String    @id @default(cuid())
  email                    String    @unique
  password                 String    // Hashed với bcrypt
  fullName                 String?
  role                     UserRole  @default(USER) // USER | INSTRUCTOR | ADMIN
  emailVerified            Boolean   @default(false)
  emailVerificationToken   String?   @unique
  emailVerificationExpires DateTime?
  createdAt                DateTime  @default(now())
  updatedAt                DateTime  @updatedAt
}
```

---

## 🔄 Frontend Flow

### 1. Register
```
1. User điền form → Submit
2. Gọi POST /api/auth/register
3. Lưu user vào store (không lưu tokens)
4. Hiển thị message: "Check your email"
5. User click link trong email → Verify
```

### 2. Login
```
1. User điền email + password → Submit
2. Gọi POST /api/auth/login
3. Lưu tokens + user vào Zustand store (persist localStorage)
4. Redirect đến trang chủ
```

### 3. Auto Refresh Token
```
1. Axios interceptor bắt 401 error
2. Gọi POST /api/auth/refresh với refreshToken
3. Lưu tokens mới
4. Retry request ban đầu
```

### 4. Protected Routes
```
1. PrivateRoute component check authStore.user
2. Nếu không có user → Redirect đến /login
3. Nếu có user → Render component
```

---

## 🚨 Error Handling

### Common Errors

| Status | Error | Nguyên nhân |
|--------|-------|-------------|
| 401 | Invalid credentials | Email/password sai |
| 401 | Email not verified | Chưa verify email |
| 401 | Email already exists | Email đã đăng ký |
| 400 | Invalid token | Token không hợp lệ |
| 400 | Token expired | Token hết hạn |
| 400 | Email already verified | Email đã verify rồi |
| 403 | Forbidden | Không đủ quyền |

---

## 📝 API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Đăng ký user mới |
| POST | `/api/auth/login` | ❌ | Đăng nhập |
| POST | `/api/auth/refresh` | ❌ | Refresh tokens |
| GET | `/api/auth/verify-email` | ❌ | Verify email |
| POST | `/api/auth/resend-verification` | ❌ | Gửi lại email verification |

---

## 🔧 Configuration

### Environment Variables
```env
JWT_SECRET=your_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
RESEND_API_KEY=re_xxx (optional)
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

## ✅ Checklist khi implement

- [x] Register với email verification
- [x] Login với JWT tokens
- [x] Refresh token mechanism
- [x] Email verification flow
- [x] Resend verification email
- [x] Protected routes với JwtAuthGuard
- [x] Role-based access với RolesGuard
- [x] Auto cleanup unverified users
- [x] Password hashing với bcrypt
- [x] Token expiration handling

