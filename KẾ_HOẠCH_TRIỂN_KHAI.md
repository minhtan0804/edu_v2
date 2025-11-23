# KẾ HOẠCH TRIỂN KHAI DỰ ÁN CHI TIẾT

**Dự án**: Nền tảng EdTech Giáo dục Sức khỏe (Healthcare)

**Kiến trúc**: React 19 (Vite) + NestJS + Prisma

**Mục tiêu**: Phân rã Công việc (WBS), đảm bảo thời lượng mỗi task không quá 4 giờ làm việc.

---

## ✅ GIAI ĐOẠN 1: NỀN TẢNG BE & FE (TUẦN 1 - 3) - ĐÃ HOÀN THÀNH (95%)

### 1.1. Backend (NestJS) Setup ✅

- [x] **Task 1.1.1: Init & Config (3h):**

  - ✅ Cài đặt NestJS, tạo project cơ sở.
  - ✅ Cấu hình ConfigModule (cho biến môi trường), PrismaModule.
  - ✅ Kết nối đến database bằng việc chạy bộ Prisma migrate.

- [x] **Task 1.1.2: Prisma Schema - Core (2h):**

  - ✅ Thiết kế schema cho bảng `User`, `Category`, `Course`, `Lesson`, `Section`, `Enrollment`, `Order`, `Note`, `UserProgress`.

- [x] **Task 1.1.3: AuthModule (4h):**

  - ✅ Cài đặt packages `@nestjs/passport`, `@nestjs/jwt`, `passport-local`, `passport-jwt`, `bcrypt`.
  - ✅ Xây dựng `AuthService` với các phương thức signToken.
  - ✅ Xây dựng `LocalStrategy` (cho login) và `JwtStrategy` (cho bảo vệ route).

- [x] **Task 1.1.4: Auth Endpoints (4h):**

  - ✅ Code `AuthController`, viết endpoint `/auth/register` (hash password, lưu user).
  - ✅ Viết endpoint `/auth/login` (validate, trả về access_token và refresh_token).
  - ✅ Viết endpoint `/auth/refresh` (refresh token logic).
  - ✅ Viết endpoint `/auth/verify-email` (email verification).
  - ✅ Viết endpoint `/auth/resend-verification` (resend verification email).

- [x] **Task 1.1.5: CORS & Security (2h):**

  - ✅ Cấu hình `enableCors()` trong `main.ts` để cho phép FE dev (localhost) và production (Vercel) gọi.
  - ✅ Cấu hình Global `ValidationPipe`, `TransformInterceptor`, `HttpExceptionFilter`.
  - ✅ Standardized API response format (Discriminated Union).
  - ⚠️ Helmet chưa được thêm (có thể thêm sau).

- [x] **Task 1.1.6: Email Service (3h):**
  - ✅ Tích hợp Resend API cho email service.
  - ✅ Email verification flow với token 7 ngày.
  - ✅ Cron job cleanup unverified users sau 7 ngày.

### 1.2. Frontend (React 19) Setup ✅

- [x] **Task 1.2.1: Init & Styling (2h):**

  - ✅ Khởi tạo Vite (React 19).
  - ✅ Cài đặt Tailwind CSS và cấu hình `tailwind.config.js`.
  - ⚠️ Shadcn/UI chưa được init (có thể thêm sau khi cần).

- [x] **Task 1.2.2: API Client (2h):**

  - ✅ Cài đặt `axios`.
  - ✅ Tạo `api.ts` (axios instance) với `baseURL` trỏ đến BE.
  - ✅ Viết interceptor tự động gắn `Authorization: Bearer <token>` vào header nếu có token.

- [x] **Task 1.2.3: State Management (3h):**

  - ✅ Cài đặt `Zustand` và `zustand/middleware` (persist).
  - ✅ Tạo `authStore.ts` (lưu `accessToken`, `refreshToken`, `user`, các action `login`, `logout`).

- [x] **Task 1.2.4: Auth UI (3h):**

  - ✅ Code Form Đăng nhập và Đăng ký (dùng `react-hook-form` + `zod` để validate).
  - ✅ UI Forgot Password, Reset Password.
  - ✅ UI Verify Email, Resend Verification.
  - ✅ Responsive design cho mobile.
  - ✅ Sử dụng `lucide-react` icons.
  - ✅ Design system với color palette (orange/peach theme).

- [x] **Task 1.2.5: Auth Flow (3h):**

  - ✅ Gọi API register/login từ Auth UI.
  - ✅ Khi thành công, gọi action `login` của `authStore` để lưu token vào State và LocalStorage.
  - ✅ Xử lý redirect sau khi login/logout.
  - ✅ Refresh token logic với Axios interceptors.
  - ✅ Email verification flow.

- [x] **Task 1.2.6: Route Protection (3h):**

  - ✅ Tạo component `PrivateRoute` (hoặc Wrapper) kiểm tra user trong `authStore`.
  - ✅ Cấu hình `react-router-dom` với `createBrowserRouter` và `RouterProvider`.
  - ✅ Lazy loading cho pages.
  - ✅ Layout system (AuthLayout, AuthenticatedLayout).

- [x] **Task 1.2.7: Internationalization (i18n) (4h):**

  - ✅ Setup `react-i18next` với Vietnamese và English.
  - ✅ Auto-detect browser language.
  - ✅ Language switcher component.
  - ✅ Type-safe i18n keys với TypeScript module augmentation.

- [x] **Task 1.2.8: Toast Notifications (1h):**

  - ✅ Tích hợp `react-toastify` thay thế `alert()`.
  - ✅ Toast notifications cho tất cả auth actions.

- [x] **Task 1.2.9: API Structure Refactoring (3h):**

  - ✅ Modular API structure (`api/auth/auth.service.ts`).
  - ✅ Centralized Axios instance với interceptors.
  - ✅ Standardized API response format integration.
  - ✅ Type-safe API helpers (`isSuccessResponse`, `isErrorResponse`, etc.).

- [x] **Task 1.2.10: Code Quality (2h):**
  - ✅ ESLint + Prettier setup cho frontend.
  - ✅ ESLint + Prettier setup cho backend.
  - ✅ Import sorting với `simple-import-sort`.
  - ✅ Unused imports detection.

---

## 📋 GIAI ĐOẠN 2: BUILDER & PLAYER CORE (TUẦN 4 - 7) - CHƯA BẮT ĐẦU

### 2.1. Admin UI (FE) & Uploads (Tuần 4)

- [ ] **Task 2.1.1: Admin Layout (FE) (3h):**

  - Tạo layout Admin (Sidebar, Header), dùng `PrivateRoute` và check `role` để bảo vệ.

- [ ] **Task 2.1.2: Admin Category UI (FE) (3h):**

  - Trang CRUD Category (dùng TanStack Table hoặc Table của Shadcn), gọi API (1.3.2).

- [ ] **Task 2.1.3: Course Builder UI (FE) (4h):**

  - Form tạo/sửa khóa học (Tab thông tin chung), gọi API (1.3.3).

- [ ] **Task 2.1.4: UploadModule (BE) (4h):**

  - **Quan trọng:** Viết API `POST /upload/signed-url-video` (dùng cho Bunny).
  - API này tạo chữ ký bảo mật (dùng API key của Bunny) và trả về URL cho phép FE upload trực tiếp.

- [ ] **Task 2.1.5: Video Upload (FE) (4h):**

  - Component Upload: (1) Gọi API (2.1.4), (2) Nhận URL, (3) Upload file (PUT) thẳng lên Bunny.net, (4) Lưu Bunny Video ID về DB của mình.

- [ ] **Task 2.1.6: Lesson D&D UI (FE) (4h):**
  - Cài `dnd-kit`.
  - Làm giao diện kéo thả Section/Lesson trong trang Admin, gọi API update `position` (1.3.4).

### 2.2. Secure Player (BE) (Tuần 5)

- [ ] **Task 2.2.1: Player API - Content (BE) (4h):**

  - API `GET /courses/:id/content` (Dùng `JwtAuthGuard`).
  - **Logic:** Kiểm tra xem user đã mua khóa học chưa (check bảng `Enrollment`).
  - Nếu đã mua, trả về toàn bộ cấu trúc Section/Lesson (không kèm link video).

- [ ] **Task 2.2.2: Player API - Security (BE) (3h):**

  - API `GET /lessons/:id/video` (Bảo vệ bằng Guard + Check Enrollment).
  - **Logic:** Lấy Video ID, tạo **Signed URL** (Token Auth) của Bunny.net (dùng Security Key ở bước 1) và trả về cho FE. Link này chỉ sống 1-2h.

- [ ] **Task 2.2.3: Player API - PDF (BE) (3h):**

  - API `GET /lessons/:id/document` (Check Enrollment).
  - **Logic:** Đọc file PDF từ S3/R2 private bucket, trả về file dạng `ArrayBuffer` (không lộ URL).

- [ ] **Task 2.2.4: Progress API (BE) (3h):**
  - API `POST /lessons/:id/complete`.
  - Logic: Ghi vào bảng `UserProgress` (user_id, lesson_id, is_completed).

### 2.3. Player UI (FE) (Tuần 6)

- [ ] **Task 2.3.1: Player Layout (FE) (3h):**

  - Cắt layout trang học (Sidebar cố định bên trái, Content bên phải). Responsive cho mobile (dùng Drawer).

- [ ] **Task 2.3.2: Player Data Fetching (FE) (3h):**

  - Gọi API (2.2.1) lấy cấu trúc bài học, render ra Sidebar (dạng Accordion).
  - Xử lý highlight bài đang học, đánh dấu tick "hoàn thành".

- [ ] **Task 2.3.3: Video Player (FE) (4h):**

  - Component Video: (1) Gọi API (2.2.2) lấy signed URL -> (2) Render Player (dùng Iframe của Bunny). (3) Bắt sự kiện `onEnded` -> (4) Gọi API (2.2.4) đánh dấu hoàn thành.

- [ ] **Task 2.3.4: PDF Viewer (FE) (4h):**

  - Component PDF: (1) Gọi API (2.2.3) -> (2) Nhận `ArrayBuffer` -> (3) Render lên `<canvas>` dùng `react-pdf`. (4) Thêm nút Paging.

- [ ] **Task 2.3.5: Anti-Copy (FE) (2h):**
  - Áp dụng CSS `user-select: none` và JS chặn `contextmenu` (chuột phải) trên vùng hiển thị PDF.

### 2.4. Note System (Tuần 7)

- [ ] **Task 2.4.1: NoteModule (BE) (4h):**

  - Code module CRUD cho `Notes` (API: `POST /notes`, `GET /notes/lesson/:id`, `GET /notes/my-all`, `DELETE /notes/:id`). Bảo vệ tất cả bằng Guard.

- [ ] **Task 2.4.2: Note UI (FE) (3h):**

  - UI nhập ghi chú (Textarea hoặc Tiptap Editor) + Nút "Lưu tại [timestamp]".

- [ ] **Task 2.4.3: Note Capture (FE) (3h):**

  - Lấy `currentTime` từ video, gọi API `POST /notes` (2.4.1) kèm `timestamp` và `content`.

- [ ] **Task 2.4.4: Note List (FE) (3h):**

  - Tab bên cạnh bài học, gọi API `GET /notes/lesson/:id` (2.4.1), render list note.

- [ ] **Task 2.4.5: Note Seek (FE) (2h):**

  - Xử lý logic click vào note -> `video.seekTo(timestamp)`.

- [ ] **Task 2.4.6: "My Notes" Page (FE) (4h):**
  - Trang tổng hợp (gọi API `GET /notes/my-all`), Filter (theo khóa học).
  - Xử lý link `?t=...` (Deep linking) để nhảy về bài học.

---

## 📋 GIAI ĐOẠN 3: E-COMMERCE (TUẦN 8 - 10) - CHƯA BẮT ĐẦU

### 3.1. Public Pages (Tuần 8)

- [ ] **Task 3.1.1: Public API (BE) (4h):**

  - Tạo các API _public_ (không cần Auth) cho Trang chủ, Chi tiết khóa học (preview, ẩn nội dung), Search.

- [ ] **Task 3.1.2: Home Page (FE) (3h):**

  - Code UI trang chủ (Hero, List khóa học), gọi API (3.1.1).

- [ ] **Task 3.1.3: Course Detail Page (FE) (4h):**

  - Code UI trang chi tiết khóa học, Syllabus (preview), gọi API (3.1.1).

- [ ] **Task 3.1.4: Search & Filter (FE) (4h):**
  - UI Filter (Category, Price), gọi API search với query params.

### 3.2. Cart & Checkout (Tuần 9)

- [ ] **Task 3.2.1: Cart Store (FE) (3h):**

  - Dùng `Zustand` + `persist` (LocalStorage) để quản lý giỏ hàng (FE only): `addToCart`, `removeFromCart`.

- [ ] **Task 3.2.2: Cart/Checkout UI (FE) (3h):**

  - UI trang giỏ hàng và trang thanh toán (Form thông tin).

- [ ] **Task 3.2.3: OrderModule (BE) (4h):**

  - API `POST /orders` (Tạo đơn hàng `PENDING` từ giỏ hàng FE gửi lên).

- [ ] **Task 3.2.4: Payment UI (FE) (3h):**
  - Gọi API (3.2.3) -> Nhận tổng tiền -> Tạo mã VietQR (dùng `react-qr-code`) với nội dung chuyển khoản là `ORDER_ID`.

### 3.3. Payment Logic (Tuần 10)

- [ ] **Task 3.3.1: Payment Webhook (BE) (4h):**

  - (Nếu dùng cổng tự động như PayOS) Code API Webhook nhận tín hiệu "Đã thanh toán".

- [ ] **Task 3.3.2: Admin Payment (FE) (3h):**

  - (Nếu duyệt tay) Code trang Admin quản lý đơn hàng (`PENDING`), Nút "Duyệt".

- [ ] **Task 3.3.3: EnrollmentModule (BE) (4h):**

  - Logic "Kích hoạt khóa học": Khi Order chuyển sang `PAID` (do Webhook hoặc Admin duyệt tay) -> Tự động `INSERT` vào bảng `enrollments`.

- [ ] **Task 3.3.4: Enrollment Check (BE) (2h):**
  - Cập nhật các API Guard (như 2.2.1) để kiểm tra bảng `enrollments` cho đúng.

---

## 📋 GIAI ĐOẠN 4: HOÀN THIỆN (TUẦN 11 - 12) - CHƯA BẮT ĐẦU

### 4.1. User Dashboard (Tuần 11)

- [ ] **Task 4.1.1: My Courses API (BE) (3h):**

  - API `GET /my-courses` (Join `enrollments` và `courses`).

- [ ] **Task 4.1.2: My Courses UI (FE) (3h):**

  - Code UI trang "Khóa học của tôi" (Grid Card, Progress bar), gọi API (4.1.1).

- [ ] **Task 4.1.3: Progress Logic (BE/FE) (4h):**

  - (Nên tính ở BE) Cập nhật API (4.1.1) để trả về % hoàn thành (Join với bảng `UserProgress`).

- [ ] **Task 4.1.4: Certificate (FE) (4h):**
  - Tạo Template chứng chỉ (HTML/CSS).
  - Khi user click (sau khi 100%), dùng `html2canvas` hoặc `jspdf` để export file PDF/PNG có tên user.

### 4.2. Deployment & Testing (Tuần 12)

- [ ] **Task 4.2.1: Dockerize NestJS (BE) (3h):**

  - Viết `Dockerfile` chuẩn (multi-stage build) cho app NestJS + Prisma.
  - Viết `docker-compose.yml` cho dev local.

- [ ] **Task 4.2.2: Deploy BE (3h):**

  - Tạo project trên Railway/Render, kết nối Git Repo.
  - Cấu hình biến môi trường, đảm bảo Prisma migrate chạy khi deploy.

- [ ] **Task 4.2.3: Deploy FE (1h):**

  - Deploy React App lên Vercel.
  - Cấu hình biến môi trường `API_URL` trỏ đến BE production.

- [ ] **Task 4.2.4: E2E Test (4h):**

  - Tự test luồng: Đăng ký -> Mua hàng (duyệt tay) -> Vào học -> Xem Video -> Ghi chú.
  - Kiểm tra bảo mật (thử truy cập link video trực tiếp).

- [ ] **Task 4.2.5: Final Polish (3h):**
  - Review lỗi responsive, lỗi UI nhỏ, favicon, title.

---

## 📝 GHI CHÚ

### Các task còn thiếu trong Giai đoạn 1:

1. **Task 1.3.1 - 1.3.5**: Admin Foundation (BE) - UserModule, CategoryModule, CourseModule, LessonModule, Admin Guard

   - ⏳ Cần implement tiếp theo

2. **Helmet**: Security headers chưa được thêm vào backend

   - ⚠️ Có thể thêm sau

3. **Shadcn/UI**: Chưa được init
   - ⚠️ Có thể thêm khi cần build UI components

### Tiến độ chi tiết:

**Backend (NestJS):**

- ✅ Core setup: 100%
- ✅ Auth Module: 100%
- ✅ Email Service: 100%
- ✅ API Response Format: 100%
- ✅ Code Quality (ESLint/Prettier): 100%
- ⏳ Admin Modules: 0%

**Frontend (React 19):**

- ✅ Core setup: 100%
- ✅ Auth UI: 100%
- ✅ Routing: 100%
- ✅ State Management: 100%
- ✅ i18n: 100%
- ✅ API Client: 100%
- ✅ Code Quality (ESLint/Prettier): 100%
- ⏳ Admin UI: 0%

### Hướng dẫn tiếp theo:

1. **Ưu tiên cao:** Hoàn thành các Admin Modules (Task 1.3.1 - 1.3.5)

   - UserModule (CRUD users)
   - CategoryModule (CRUD categories)
   - CourseModule (CRUD courses)
   - LessonModule (CRUD lessons)
   - Admin Guard (role-based access)

2. **Tiếp theo:** Bắt đầu Giai đoạn 2: Builder & Player Core

   - Admin UI cho Course Builder
   - Upload Module cho videos
   - Secure Player API

3. **Testing:** Setup database và test các API hiện tại
   - Test auth flow end-to-end
   - Test email verification
   - Test refresh token logic
