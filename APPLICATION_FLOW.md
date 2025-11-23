# 🔄 APPLICATION FLOW DOCUMENTATION

Tài liệu mô tả các luồng chính trong ứng dụng EdTech Healthcare Platform.

---

## 1. 📝 Registration Flow

### Mô tả
User đăng ký tài khoản mới, nhận email verification, và xác thực email.

### Flow Diagram
```
User → Register Page
  ↓
Nhập thông tin (email, password, fullName)
  ↓
Submit → POST /api/auth/register
  ↓
Backend:
  - Hash password
  - Tạo user với emailVerified = false
  - Generate verification token (24h)
  - Gửi email verification
  ↓
Response: User info + message
  ↓
Frontend: Redirect → /check-email (với email trong state)
  ↓
Check Email Page:
  - Hiển thị thông báo check email
  - Hiển thị email đã đăng ký
  - Button "Resend Verification"
  - Button "Login"
  ↓
User click link trong email → /verify-email?token=xxx
  ↓
Verify Email Page:
  - React Query gọi GET /api/auth/verify-email?token=xxx
  ↓
Backend:
  - Tìm user theo token
  - Check token expired (24h)
  - Check email đã verify chưa
  - Update emailVerified = true
  - Xóa token (prevent reuse)
  ↓
Success → Redirect → /login (sau 3s)
Error → Redirect → /verify-email/error
```

### Key Points
- Token chỉ tồn tại 24 giờ
- Token chỉ dùng được 1 lần (bị xóa sau khi verify)
- Email phải được verify trước khi login
- User có thể resend verification email

---

## 2. 🔑 Login Flow

### Mô tả
User đăng nhập vào hệ thống, nhận tokens và được redirect đến dashboard.

### Flow Diagram
```
User → Login Page
  ↓
Nhập email/password
  ↓
Submit → POST /api/auth/login
  ↓
Backend:
  - Validate credentials
  - Check emailVerified = true
  - Generate access token (24h)
  - Generate refresh token (7d)
  ↓
Response: Tokens + User info + expiresIn
  ↓
Frontend:
  - Lưu tokens vào cookies với expiration
  - Lưu user vào Zustand store
  - Redirect → / (Home)
```

### Key Points
- Email phải được verify
- Tokens lưu trong cookies với expiration
- Access token hết hạn sau 24h
- Refresh token hết hạn sau 7d
- Auto refresh token khi access token hết hạn (Axios interceptor)

---

## 3. 🔄 Token Refresh Flow

### Mô tả
Tự động refresh access token khi hết hạn.

### Flow Diagram
```
API Request với expired access token
  ↓
Backend: 401 Unauthorized
  ↓
Axios Interceptor:
  - Bắt 401 error
  - Check có refreshToken không
  ↓
POST /api/auth/refresh (với refreshToken)
  ↓
Backend:
  - Verify refresh token
  - Generate tokens mới
  ↓
Response: New tokens + expiresIn
  ↓
Frontend:
  - Lưu tokens mới vào cookies
  - Retry original request với token mới
```

### Key Points
- Tự động xử lý, user không cần làm gì
- Nếu refresh token hết hạn → Logout và redirect đến /login
- Chỉ retry 1 lần để tránh infinite loop

---

## 4. 👨‍🏫 Instructor Verification Flow

### Mô tả
User với role INSTRUCTOR submit thông tin để được verify bởi Admin.

### Flow Diagram
```
INSTRUCTOR User → /instructor/verification
  ↓
Check role = INSTRUCTOR
  ↓
Load existing verification:
  GET /api/instructor/verification/my
  ↓
Display form với data (nếu có)
  ↓
User submit verification:
  POST /api/instructor/verification
  {
    bio, specialization, experience, education, certificates
  }
  ↓
Backend:
  - Lưu/update verification với isVerified = false
  ↓
Response: Verification data
  ↓
Frontend: Hiển thị status "Pending"
  ↓
Admin → GET /api/instructor/verification/pending
  ↓
Admin review và verify:
  PUT /api/instructor/verification/verify
  {
    userId, isVerified: true
  }
  ↓
Backend:
  - Update isVerified = true
  - Set verifiedAt, verifiedBy
  ↓
INSTRUCTOR có thể tạo courses (sau khi implement)
```

### Key Points
- Chỉ INSTRUCTOR mới có thể submit verification
- Chỉ ADMIN mới có thể verify
- Verification status: pending → verified

---

## 5. 🛡️ Protected Route Flow

### Mô tả
Kiểm tra authentication trước khi cho phép truy cập protected pages.

### Flow Diagram
```
User navigate → Protected Route
  ↓
PrivateRoute Component:
  - Check authStore.isAuthenticated()
  ↓
Not authenticated?
  → Redirect → /login
  ↓
Authenticated?
  → Render page
  ↓
Page có role requirement?
  - Check user.role
  ↓
Role không đúng?
  → Redirect hoặc show error
  ↓
Role đúng?
  → Render content
```

### Key Points
- Tất cả protected routes đều qua PrivateRoute
- Role-based access được check trong component
- Redirect về /login nếu chưa đăng nhập

---

## 6. 📧 Email Verification Flow (Detailed)

### Mô tả
Chi tiết về email verification process.

### Flow Diagram
```
Registration → Email sent với link:
  /verify-email?token=32-byte-hex-string
  ↓
User click link
  ↓
Frontend: VerifyEmailPage
  - Extract token từ URL
  - React Query: GET /api/auth/verify-email?token=xxx
  ↓
Backend: AuthService.verifyEmail()
  1. Tìm user theo emailVerificationToken
  2. Check user exists? → Error: "Invalid token"
  3. Check emailVerified = true? → Error: "Email already verified"
  4. Check token expired? → Error: "Token expired"
  5. Update: emailVerified = true, token = null
  ↓
Success:
  - Frontend: Show success → Redirect /login (3s)
  ↓
Error:
  - Frontend: Redirect /verify-email/error với error message
```

### Key Points
- Token chỉ tồn tại 24 giờ
- Token chỉ dùng được 1 lần
- Email đã verify không thể verify lại
- Error messages rõ ràng cho user

---

## 7. 🔐 API Request Flow (With Auth)

### Mô tả
Flow khi gọi API có authentication.

### Flow Diagram
```
Frontend: API Request
  ↓
Axios Request Interceptor:
  - Check skipAuth flag?
  - Nếu không: Thêm Authorization header
  - Header: Authorization: Bearer <accessToken>
  ↓
Backend: Request đến
  ↓
JwtAuthGuard:
  - Extract token từ header
  - Verify token với JWT_SECRET
  - Extract payload { userId, email }
  - Set request.user = { userId, email }
  ↓
RolesGuard (nếu có):
  - Lấy required roles từ @Roles() decorator
  - Query DB để lấy user.role
  - Check user.role có trong required roles?
  ↓
Role đúng?
  → Continue to controller
  ↓
Role sai?
  → 403 Forbidden
```

### Key Points
- Token được tự động attach vào header
- Guards chạy theo thứ tự: JwtAuthGuard → RolesGuard
- request.user có sẵn trong controller/service

---

## 8. 🚪 Logout Flow

### Mô tả
User đăng xuất khỏi hệ thống.

### Flow Diagram
```
User click Logout
  ↓
authStore.logout()
  ↓
Frontend:
  - Xóa tokens từ cookies
  - Xóa user từ Zustand store
  - Clear React Query cache (optional)
  ↓
Redirect → /login
```

### Key Points
- Tokens được xóa hoàn toàn
- User state được clear
- Redirect về login page

---

## 9. 🔄 Resend Verification Flow

### Mô tả
User yêu cầu gửi lại email verification.

### Flow Diagram
```
User → /resend-verification
  ↓
Nhập email (hoặc pre-fill từ state)
  ↓
Submit → POST /api/auth/resend-verification
  ↓
Backend:
  - Tìm user theo email
  - Check email đã verify? → Error
  - Generate token mới (24h)
  - Update user với token mới
  - Gửi email verification mới
  ↓
Response: Success message
  ↓
Frontend:
  - Toast notification
  - Redirect → /check-email với email
```

### Key Points
- Token cũ bị thay thế bằng token mới
- Email đã verify không thể resend
- Token mới cũng có thời hạn 24h

---

## 10. 📊 Data Flow (React Query)

### Mô tả
Flow khi sử dụng React Query để fetch data.

### Flow Diagram
```
Component mount
  ↓
useQuery hook
  ↓
Check cache:
  - Data có trong cache?
  - Data còn fresh? (staleTime)
  ↓
Cache hit + fresh?
  → Return cached data
  ↓
Cache miss hoặc stale?
  → Fetch từ API
  ↓
Loading state → Show loading UI
  ↓
API Response:
  - Success → Update cache → Return data
  - Error → Return error → Show error UI
```

### Key Points
- Automatic caching
- Automatic refetching (configurable)
- Loading và error states tự động
- Prevent duplicate calls (đặc biệt với StrictMode)

---

## 📝 Notes

### Security Best Practices
1. **Tokens**: Lưu trong cookies với httpOnly (có thể thêm sau)
2. **Role**: Không expose trong API responses
3. **Password**: Hash với bcrypt (salt rounds: 10)
4. **Email Verification**: Token chỉ dùng 1 lần, hết hạn sau 24h

### Error Handling
- Tất cả errors đều có message rõ ràng
- Frontend hiển thị errors qua toast notifications
- API errors có format chuẩn với code và details

### Performance
- React Query caching giảm số lượng API calls
- Lazy loading cho pages
- Code splitting với React.lazy

