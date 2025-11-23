# Interfaces & Types Structure

Cấu trúc interfaces và types được tổ chức theo từng module để dễ quản lý và mở rộng.

## Cấu trúc thư mục

```
interfaces/
├── common.ts        # Common types dùng chung (User, BaseResponse, Pagination, etc.)
├── auth.ts          # Auth-related types
├── index.ts         # Export tất cả interfaces
└── README.md        # Tài liệu này
```

## Common Types (`common.ts`)

Các types được sử dụng chung trong toàn bộ ứng dụng:

- `User` - User entity
- `UserRole` - User role type ("USER" | "ADMIN")
- `BaseResponse` - Base API response với message
- `PaginationParams` - Pagination parameters
- `PaginatedResponse<T>` - Paginated API response
- `RefreshTokenResponse` - Refresh token response

## Module-specific Types

### Auth (`auth.ts`)

- Request types: `LoginRequest`, `RegisterRequest`, `ForgotPasswordRequest`, etc.
- Response types: `LoginResponse`, `RegisterResponse`, etc.

## Cách sử dụng

### Import từ common

```typescript
import type { User, UserRole, BaseResponse } from "@/interfaces/common";
```

### Import từ module cụ thể

```typescript
import type { LoginRequest, LoginResponse } from "@/interfaces/auth";
```

### Import tất cả

```typescript
import type { User, LoginRequest, LoginResponse } from "@/interfaces";
```

## Thêm module mới

Khi cần thêm module mới (ví dụ: course, user, order):

1. Tạo file mới: `interfaces/course.ts`
2. Export types từ file đó
3. Export từ `interfaces/index.ts`

### Ví dụ: Course Types

```typescript
// interfaces/course.ts
import type { BaseResponse, PaginatedResponse } from "./common";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  // ...
}

export interface GetCoursesRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
}

export interface GetCoursesResponse extends PaginatedResponse<Course> {}

// interfaces/index.ts
export * from "./course";
```

## Best Practices

1. **Common types**: Đặt vào `common.ts` nếu được sử dụng ở nhiều module
2. **Module-specific types**: Đặt vào file riêng của module
3. **Extend BaseResponse**: Sử dụng `extends BaseResponse` cho các response types
4. **Use type aliases**: Sử dụng `type` cho unions, `interface` cho objects
5. **Export từ index**: Luôn export từ `index.ts` để import dễ dàng

