# Backend - EdTech Healthcare Platform

NestJS Backend API cho nền tảng giáo dục sức khỏe.

## Setup

1. Cài đặt dependencies:
```bash
pnpm install
```

2. Tạo file `.env` (copy từ `.env.example`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/edutech_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BUNNY_API_KEY=your-bunny-api-key
BUNNY_LIBRARY_ID=your-library-id
BUNNY_SECURITY_KEY=your-security-key
```

3. Generate Prisma Client:
```bash
pnpm prisma:generate
```

4. Chạy migrations:
```bash
pnpm prisma:migrate
```

5. Chạy dev server:
```bash
pnpm start:dev
```

## API Endpoints

### Auth
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập

## Scripts

- `pnpm start:dev` - Chạy dev server với hot reload
- `pnpm build` - Build production
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Chạy migrations
- `pnpm prisma:studio` - Mở Prisma Studio

