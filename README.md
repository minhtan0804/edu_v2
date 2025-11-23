# EdTech Healthcare Platform

Nền tảng giáo dục sức khỏe với tính năng bảo mật nội dung cao.

## Tech Stack

### Backend

- **Framework**: NestJS
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: Passport.js (JWT + Local)
- **Validation**: class-validator, class-transformer

### Frontend

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM

## Cấu trúc dự án

```
edu_v2/
├── backend/          # NestJS Backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── prisma/   # Prisma service
│   │   └── ...
│   └── prisma/       # Prisma schema
│
└── frontend/         # React Frontend
    ├── src/
    │   ├── api/      # API client
    │   ├── store/    # Zustand stores
    │   ├── pages/    # Pages
    │   └── ...
    └── ...
```

## Setup

### 🐳 Database với Docker (Khuyến nghị)

1. Tạo file environment cho Docker:

```bash
cp docker-compose.env.example docker-compose.env
```

2. Khởi động PostgreSQL:

```bash
# Chỉ khởi động database
docker-compose up -d postgres

# Hoặc khởi động database + pgAdmin (quản lý DB qua web)
docker-compose up -d
```

3. Kiểm tra database đã chạy:

```bash
docker-compose ps
```

Database sẽ chạy tại `localhost:5432` với:

- Database: `edutech_db`
- User: `postgres`
- Password: `postgres`

pgAdmin (nếu khởi động) sẽ chạy tại `http://localhost:5050`

### Backend

1. Cài đặt dependencies:

```bash
cd backend
pnpm install
```

2. Tạo file `.env` từ `.env.example` và cấu hình:

```env
# Nếu dùng Docker (khuyến nghị)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edutech_db?schema=public"
JWT_SECRET=your-secret-key  # Tạo với: openssl rand -base64 32
JWT_REFRESH_SECRET=your-refresh-secret-key  # Tạo với: openssl rand -base64 32
PORT=3000
FRONTEND_URL=http://localhost:5173
```

3. Chạy Prisma migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

4. Chạy server:

```bash
pnpm start:dev
```

### Frontend

1. Cài đặt dependencies:

```bash
cd frontend
pnpm install
```

2. Tạo file `.env`:

```env
VITE_API_URL=http://localhost:3000
```

3. Chạy dev server:

```bash
pnpm dev
```

## Tính năng đã hoàn thành

### Giai đoạn 1: Nền tảng (Tuần 1-3)

- ✅ Backend setup (NestJS + Prisma)
- ✅ Prisma Schema (User, Category, Course, Lesson, Section, Enrollment, Order, Note)
- ✅ AuthModule (Register, Login, JWT)
- ✅ CORS & Security
- ✅ Frontend setup (React 19 + Vite)
- ✅ API Client với interceptors
- ✅ Zustand authStore
- ✅ Auth UI (Login, Register)
- ✅ Route Protection

## Tính năng sắp tới

Xem file `KẾ_HOẠCH_TRIỂN_KHAI.md` để biết chi tiết các task tiếp theo.

## Scripts

### Database (Docker)

- `docker-compose up -d postgres` - Khởi động PostgreSQL
- `docker-compose down` - Dừng database
- `docker-compose logs -f postgres` - Xem logs
- `docker-compose ps` - Kiểm tra status
- `./scripts/db-start.sh` - Script khởi động (Linux/Mac)
- `./scripts/db-stop.sh` - Script dừng (Linux/Mac)
- `./scripts/db-reset.sh` - Script reset database (⚠️ Xóa data)

### Backend

- `pnpm start:dev` - Chạy dev server
- `pnpm build` - Build production
- `pnpm prisma:migrate` - Chạy migrations
- `pnpm prisma:studio` - Mở Prisma Studio

### Frontend

- `pnpm dev` - Chạy dev server
- `pnpm build` - Build production
- `pnpm preview` - Preview production build

## Tài liệu chi tiết

- **Environment Variables**: Xem `ENV_SETUP.md`
- **Kế hoạch triển khai**: Xem `KẾ_HOẠCH_TRIỂN_KHAI.md`
