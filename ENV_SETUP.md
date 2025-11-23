# Hướng dẫn cấu hình Environment Variables

## 🐳 Setup Database với Docker (Khuyến nghị)

### Bước 1: Tạo file environment cho Docker

```bash
# Tạo file docker-compose.env từ template
cp docker-compose.env.example docker-compose.env
```

Chỉnh sửa `docker-compose.env` nếu cần (mặc định đã đủ để chạy).

### Bước 2: Khởi động PostgreSQL

```bash
# Khởi động database
docker-compose up -d postgres

# Xem logs
docker-compose logs -f postgres

# Dừng database
docker-compose down

# Dừng và xóa data (⚠️ Cẩn thận!)
docker-compose down -v
```

### Bước 3: Kết nối database

Sau khi khởi động, database sẽ chạy tại:

- **Host**: `localhost`
- **Port**: `5432` (hoặc port bạn cấu hình)
- **Database**: `edutech_db` (hoặc tên bạn cấu hình)
- **User**: `postgres` (hoặc user bạn cấu hình)
- **Password**: `postgres` (hoặc password bạn cấu hình)

### Bước 4: Cấu hình DATABASE_URL trong backend/.env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edutech_db?schema=public"
```

### Optional: Sử dụng pgAdmin

pgAdmin sẽ chạy tại `http://localhost:5050` (hoặc port bạn cấu hình).

Đăng nhập với:

- Email: `admin@edutech.com` (hoặc email bạn cấu hình)
- Password: `admin` (hoặc password bạn cấu hình)

Để kết nối đến PostgreSQL trong pgAdmin:

- Host: `postgres` (tên service trong docker-compose)
- Port: `5432`
- Database: `edutech_db`
- Username: `postgres`
- Password: `postgres`

---

## Backend (.env)

Tạo file `.env` trong thư mục `backend/` dựa trên `backend/.env.example`.

### Biến bắt buộc:

1. **DATABASE_URL** - Connection string PostgreSQL

   **Nếu dùng Docker (khuyến nghị):**

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edutech_db?schema=public"
   ```

   **Nếu dùng PostgreSQL local:**

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/edutech_db?schema=public"
   ```

   **Nếu dùng Supabase/Railway:**

   ```env
   DATABASE_URL="postgresql://postgres.xxxxx:password@host:port/postgres"
   ```

2. **JWT_SECRET** - Secret key cho JWT access token (tối thiểu 32 ký tự)

   ```bash
   # Tạo secret key:
   openssl rand -base64 32
   ```

3. **JWT_REFRESH_SECRET** - Secret key cho JWT refresh token (khác với JWT_SECRET)

   ```bash
   # Tạo secret key:
   openssl rand -base64 32
   ```

4. **PORT** - Port chạy server (mặc định: 3000)

5. **FRONTEND_URL** - URL frontend để cấu hình CORS

### Biến tùy chọn:

- **JWT_EXPIRES_IN** - Thời gian hết hạn access token (mặc định: 1d)
- **JWT_REFRESH_EXPIRES_IN** - Thời gian hết hạn refresh token (mặc định: 7d)
- **NODE_ENV** - Môi trường (development/production)
- **BUNNY_API_KEY**, **BUNNY_LIBRARY_ID**, **BUNNY_SECURITY_KEY** - Cho video storage (cần khi implement upload)

### Email Service (Resend - Khuyến nghị):

1. **RESEND_API_KEY** - API Key từ Resend (bắt đầu bằng `re_`)

   - Đăng ký tại: https://resend.com/signup
   - Lấy API Key tại: https://resend.com/api-keys
   - Free tier: 3,000 email/tháng

2. **RESEND_FROM_EMAIL** - Email người gửi

   - Development/Testing: `onboarding@resend.dev` (không cần verify)
   - Production: `noreply@yourdomain.com` (cần verify domain)

   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

   **Lưu ý:**

   - Nếu không set `RESEND_API_KEY`, email sẽ fail và log URL trong development mode
   - Free tier đủ cho dev/test (3,000 email/tháng)
   - Production nên verify domain để dùng email custom

### Email Service (SMTP - Alternative):

Nếu muốn dùng SMTP thay vì Resend, cần cập nhật code và set:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@edutech.com
```

## Frontend (.env)

Tạo file `.env` trong thư mục `frontend/` dựa trên `frontend/.env.example`.

### Biến bắt buộc:

1. **VITE_API_URL** - URL của backend API
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Lưu ý:

- Tất cả biến môi trường trong Vite phải có prefix `VITE_` để được expose ra client
- Sau khi thay đổi `.env`, cần restart dev server

## Quick Start

### 1. Setup Database với Docker:

```bash
# Tạo file docker-compose.env
cp docker-compose.env.example docker-compose.env

# Khởi động PostgreSQL
docker-compose up -d postgres

# Kiểm tra database đã chạy
docker-compose ps
```

### 2. Setup Backend:

```bash
cd backend
cp .env.example .env
# Chỉnh sửa .env:
# - DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edutech_db?schema=public"
# - Tạo JWT_SECRET và JWT_REFRESH_SECRET
# - (Optional) RESEND_API_KEY nếu muốn gửi email thật

# Generate Prisma Client
pnpm prisma:generate

# Chạy migrations
pnpm prisma:migrate

# Start dev server
pnpm start:dev
```

**Lưu ý về Email:**

- Nếu không set `RESEND_API_KEY`: Email sẽ fail nhưng log URL trong development (không mất phí)
- Nếu set `RESEND_API_KEY`: Email sẽ được gửi thật qua Resend (free tier: 3,000/tháng)

### 3. Setup Frontend:

```bash
cd frontend
cp .env.example .env
# Chỉnh sửa .env:
# - VITE_API_URL=http://localhost:3000

# Start dev server
pnpm dev
```

## Docker Commands Reference

```bash
# Khởi động database
docker-compose up -d postgres

# Khởi động database + pgAdmin
docker-compose up -d

# Xem logs
docker-compose logs -f postgres

# Dừng services
docker-compose down

# Dừng và xóa volumes (⚠️ Xóa hết data!)
docker-compose down -v

# Restart database
docker-compose restart postgres

# Kiểm tra status
docker-compose ps

# Vào container PostgreSQL
docker exec -it edutech-postgres psql -U postgres -d edutech_db
```

## Security Notes

⚠️ **QUAN TRỌNG:**

- Không commit file `.env` vào Git (đã có trong `.gitignore`)
- Sử dụng `.env.example` làm template
- Trong production, sử dụng secret management service (Vercel/Railway/Render có built-in)
- JWT_SECRET và JWT_REFRESH_SECRET phải là chuỗi ngẫu nhiên mạnh (tối thiểu 32 ký tự)
- Không chia sẻ file `.env` công khai

## Production Checklist

- [ ] Đổi tất cả secret keys
- [ ] Cấu hình DATABASE_URL cho production database
- [ ] Cấu hình FRONTEND_URL cho production domain
- [ ] Set NODE_ENV=production
- [ ] Cấu hình Bunny.net credentials (nếu dùng)
- [ ] Cấu hình file storage (S3/R2) nếu dùng
- [ ] Cấu hình payment gateway nếu dùng
- [ ] Cấu hình Resend API key và verify domain (nếu dùng email service)

## Email Service Setup (Resend)

### Development/Testing (Miễn phí):

1. Đăng ký tài khoản Resend: https://resend.com/signup
2. Lấy API Key: Dashboard → API Keys → Create API Key
3. Copy API key (bắt đầu bằng `re_`)
4. Thêm vào `.env`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

### Production:

1. Verify domain của bạn trong Resend Dashboard
2. Cập nhật `.env`:
   ```env
   RESEND_API_KEY=re_your_production_api_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### Chi phí:

- **Free Tier**: 3,000 email/tháng (đủ cho dev/test và MVP nhỏ)
- **Pro Plan**: $20/tháng (50,000 email) - khi cần scale

### Fallback trong Development:

Nếu không set `RESEND_API_KEY`, hệ thống sẽ:

- Log verification URL ra console (không mất phí)
- Cho phép test verification flow bằng cách copy URL
- Không throw error trong development mode
