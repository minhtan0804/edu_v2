# API Services Structure

Cấu trúc API được tổ chức theo từng module để dễ quản lý và mở rộng.

## Cấu trúc thư mục

```
api/
├── api.ts                 # Axios instance với interceptors
├── index.ts               # Export tất cả services
├── auth/
│   ├── auth.service.ts    # Auth API services
│   └── index.ts           # Export auth services
└── README.md              # Tài liệu này
```

## Cách sử dụng

### Import service

```typescript
// Import từng service cụ thể
import { authService } from "@/api/auth";

// Hoặc import từ index
import { authService } from "@/api";
```

### Sử dụng trong component

```typescript
import { authService } from "@/api/auth";

// Login
const response = await authService.login({
  email: "user@example.com",
  password: "password123"
});

// Register
const response = await authService.register({
  email: "user@example.com",
  password: "password123",
  fullName: "John Doe"
});
```

## Thêm module mới

Khi cần thêm module mới (ví dụ: course, user, order):

1. Tạo folder mới: `api/course/`
2. Tạo service file: `api/course/course.service.ts`
3. Tạo index file: `api/course/index.ts`
4. Export từ `api/index.ts`

### Ví dụ: Course Service

```typescript
// api/course/course.service.ts
import { api } from "../api";

export const courseService = {
  getAll: async () => {
    const response = await api.get("/courses");
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
};

// api/course/index.ts
export * from "./course.service";

// api/index.ts
export * from "./course";
```

## Type Safety

Tất cả services đều có TypeScript types cho request và response:

```typescript
import { authService, type LoginRequest, type LoginResponse } from "@/api/auth";

const loginData: LoginRequest = {
  email: "user@example.com",
  password: "password123"
};

const response: LoginResponse = await authService.login(loginData);
```

