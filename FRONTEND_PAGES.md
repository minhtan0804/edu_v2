# 🖥️ FRONTEND PAGES DOCUMENTATION

**Base URL**: `http://localhost:5173` (Development)

---

## 📄 Public Pages (Không cần đăng nhập)

### 1. Login Page
- **Route**: `/login`
- **Path Constant**: `PATHS.LOGIN`
- **Component**: `LoginPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Form đăng nhập (email, password)
  - Validation với Zod
  - Link đến Register page
  - Language switcher
  - Forgot password link
  - Auto redirect nếu đã đăng nhập
- **Flow**:
  1. User nhập email/password
  2. Submit → Gọi `POST /api/auth/login`
  3. Lưu tokens vào cookies với expiration
  4. Redirect đến `/` (Home)

### 2. Register Page
- **Route**: `/register`
- **Path Constant**: `PATHS.REGISTER`
- **Component**: `RegisterPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Form đăng ký (email, password, fullName optional)
  - Validation với Zod
  - Link đến Login page
  - Language switcher
- **Flow**:
  1. User nhập thông tin
  2. Submit → Gọi `POST /api/auth/register`
  3. Redirect đến `/check-email` với email trong state

### 3. Check Email Page
- **Route**: `/check-email`
- **Path Constant**: `PATHS.CHECK_EMAIL`
- **Component**: `CheckEmailPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Hiển thị thông báo check email
  - Hiển thị email đã đăng ký
  - Button "Resend Verification"
  - Button "Login"
  - Redirect về `/register` nếu không có email (prevent direct access)
- **Flow**:
  1. Nhận email từ location.state
  2. Hiển thị thông báo
  3. User click "Resend" → Navigate đến `/resend-verification`
  4. User click "Login" → Navigate đến `/login`

### 4. Verify Email Page
- **Route**: `/verify-email?token=xxx`
- **Path Constant**: `PATHS.VERIFY_EMAIL`
- **Component**: `VerifyEmailPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Sử dụng React Query để gọi API
  - Loading state
  - Success state với auto redirect sau 3s
  - Error handling → Redirect đến error page
- **Flow**:
  1. User click link trong email (có token)
  2. React Query gọi `GET /api/auth/verify-email?token=xxx`
  3. Success → Hiển thị success message → Auto redirect đến `/login` sau 3s
  4. Error → Redirect đến `/verify-email/error` với error message

### 5. Verify Email Error Page
- **Route**: `/verify-email/error`
- **Path Constant**: `PATHS.VERIFY_EMAIL_ERROR`
- **Component**: `VerifyEmailErrorPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Hiển thị error message từ location.state
  - Button "Back to Login"
  - Link "Resend Verification"
- **Flow**:
  1. Nhận error message từ location.state
  2. Hiển thị error
  3. User click "Back to Login" → Navigate đến `/login`
  4. User click "Resend Verification" → Navigate đến `/resend-verification`

### 6. Resend Verification Page
- **Route**: `/resend-verification`
- **Path Constant**: `PATHS.RESEND_VERIFICATION`
- **Component**: `ResendVerificationPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Form nhập email
  - Pre-fill email từ location.state nếu có
  - Validation
- **Flow**:
  1. User nhập email
  2. Submit → Gọi `POST /api/auth/resend-verification`
  3. Success → Toast notification
  4. Redirect đến `/check-email` với email

### 7. Forgot Password Page
- **Route**: `/forgot-password`
- **Path Constant**: `PATHS.FORGOT_PASSWORD`
- **Component**: `ForgotPasswordPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Form nhập email
  - Validation
- **Status**: ⚠️ UI đã có, API chưa implement

### 8. Reset Password Page
- **Route**: `/reset-password`
- **Path Constant**: `PATHS.RESET_PASSWORD`
- **Component**: `ResetPasswordPage`
- **Layout**: `AuthLayout`
- **Features**:
  - Form reset password với password strength indicator
  - Validation
- **Status**: ⚠️ UI đã có, API chưa implement

---

## 🔒 Protected Pages (Cần đăng nhập)

### 1. Home Page
- **Route**: `/`
- **Path Constant**: `PATHS.HOME`
- **Component**: `HomePage`
- **Layout**: `AuthenticatedLayout`
- **Guard**: `PrivateRoute`
- **Features**:
  - Dashboard placeholder
  - Hiển thị khi user đã đăng nhập
- **Status**: ⚠️ Placeholder, cần implement content

### 2. Instructor Verification Page
- **Route**: `/instructor/verification`
- **Path Constant**: `PATHS.INSTRUCTOR_VERIFICATION`
- **Component**: `InstructorVerificationPage`
- **Layout**: `AuthenticatedLayout`
- **Guard**: `PrivateRoute` + Role check (INSTRUCTOR)
- **Features**:
  - Form submit verification (bio, specialization, experience, education, certificates)
  - Load existing verification data
  - Update verification
  - Hiển thị status (verified/pending)
- **Flow**:
  1. Check user role = INSTRUCTOR
  2. Load existing verification từ `GET /api/instructor/verification/my`
  3. User submit → Gọi `POST /api/instructor/verification`
  4. Success → Toast notification

### 3. NotFound Page
- **Route**: `*` (catch-all)
- **Component**: `NotFound`
- **Features**:
  - 404 error page
  - Link về Home

---

## 🎨 Layouts

### AuthLayout
- **Usage**: Cho các public pages (login, register, etc.)
- **Features**:
  - Header với logo và language switcher
  - Footer với copyright và privacy policy link
  - Clean, centered layout

### AuthenticatedLayout
- **Usage**: Cho các protected pages
- **Features**:
  - Header với navigation
  - Sidebar (có thể thêm sau)
  - Main content area
  - Footer

---

## 🧭 Navigation Flow

### Registration Flow
```
/register → /check-email → (click link in email) → /verify-email → /login
```

### Login Flow
```
/login → (success) → /
```

### Verification Flow
```
/verify-email?token=xxx → (success) → /login
/verify-email?token=xxx → (error) → /verify-email/error → /login or /resend-verification
```

### Instructor Flow
```
/ → /instructor/verification → (submit) → (pending/verified status)
```

---

## 🔐 Route Protection

### PrivateRoute Component
- **Location**: `src/components/PrivateRoute.tsx`
- **Logic**:
  1. Check `authStore.isAuthenticated()`
  2. Nếu chưa đăng nhập → Redirect đến `/login`
  3. Nếu đã đăng nhập → Render children

### Role-based Protection
- **Implementation**: Check trong component (ví dụ: InstructorVerificationPage)
- **Logic**:
  1. Check `user.role` từ `authStore`
  2. Nếu không đúng role → Redirect hoặc hiển thị error

---

## 📱 Responsive Design

Tất cả pages đều responsive:
- **Mobile**: Stack layout, smaller fonts
- **Tablet**: Adjusted spacing
- **Desktop**: Full layout với optimal spacing

---

## 🌐 Internationalization

Tất cả pages đều hỗ trợ i18n:
- **Languages**: Vietnamese (vi), English (en)
- **Auto-detect**: Browser language
- **Language Switcher**: Available trong header
- **Translation Keys**: Type-safe với TypeScript

---

## 🎯 State Management

### Auth Store (Zustand)
- **Location**: `src/store/authStore.ts`
- **Storage**: Cookies (với expiration)
- **State**:
  - `accessToken`
  - `refreshToken`
  - `user`
- **Actions**:
  - `login()`: Lưu tokens và user
  - `logout()`: Xóa tokens và user
  - `isAuthenticated()`: Check authentication status

---

## 📦 Dependencies

### Core
- React 19
- React Router v6
- Zustand (State management)
- React Query (Data fetching)

### Forms
- React Hook Form
- Zod (Validation)

### UI
- Tailwind CSS
- Lucide React (Icons)
- React Toastify (Notifications)

### i18n
- react-i18next

### Utils
- dayjs (Date handling)
- js-cookie (Cookie management)
- axios (HTTP client)

