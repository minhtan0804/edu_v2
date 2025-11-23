# 📚 API DOCUMENTATION

**Base URL**: `http://localhost:3000/api` (Development)  
**Swagger Docs**: `http://localhost:3000/api-docs`

---

## 🔐 Authentication Endpoints

### 1. Register
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: ❌ No
- **Description**: Đăng ký user mới
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe" // optional
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "clxxx",
        "email": "user@example.com",
        "fullName": "John Doe",
        "emailVerified": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      "message": "Registration successful! Please check your email to verify your account."
    }
  }
  ```

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: ❌ No
- **Description**: Đăng nhập user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400,
      "refreshExpiresIn": 604800,
      "user": {
        "id": "clxxx",
        "email": "user@example.com",
        "fullName": "John Doe"
      }
    }
  }
  ```

### 3. Refresh Token
- **Endpoint**: `POST /api/auth/refresh`
- **Auth Required**: ❌ No
- **Description**: Làm mới access token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**: Tương tự như Login response

### 4. Verify Email
- **Endpoint**: `GET /api/auth/verify-email?token=xxx`
- **Auth Required**: ❌ No
- **Description**: Xác thực email từ link trong email
- **Query Params**: `token` (string)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Email verified successfully! You can now log in."
    }
  }
  ```

### 5. Resend Verification Email
- **Endpoint**: `POST /api/auth/resend-verification`
- **Auth Required**: ❌ No
- **Description**: Gửi lại email xác thực
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Verification email has been resent. Please check your inbox."
    }
  }
  ```

---

## 👥 User Management Endpoints (Admin Only)

### 1. Get All Users
- **Endpoint**: `GET /api/users`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Lấy danh sách users với pagination
- **Query Params**:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `search` (string, optional) - Search by email or fullName
  - `role` (enum: USER | INSTRUCTOR | ADMIN, optional)
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "clxxx",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "USER",
        "emailVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 100,
      "totalPages": 10
    }
  }
  ```

### 2. Get User By ID
- **Endpoint**: `GET /api/users/:id`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Lấy thông tin user theo ID

### 3. Update User
- **Endpoint**: `PUT /api/users/:id`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Cập nhật thông tin user
- **Request Body**:
  ```json
  {
    "email": "newemail@example.com", // optional
    "fullName": "Jane Doe", // optional
    "role": "INSTRUCTOR" // optional
  }
  ```

### 4. Delete User
- **Endpoint**: `DELETE /api/users/:id`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Xóa user (không thể xóa chính mình)

---

## 📁 Category Endpoints

### 1. Create Category
- **Endpoint**: `POST /api/categories`
- **Auth Required**: ✅ Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "Healthcare",
    "slug": "healthcare",
    "description": "Healthcare courses" // optional
  }
  ```

### 2. Get All Categories
- **Endpoint**: `GET /api/categories`
- **Auth Required**: ✅ Yes (Authenticated)
- **Description**: Lấy danh sách tất cả categories

### 3. Get Category By ID
- **Endpoint**: `GET /api/categories/:id`
- **Auth Required**: ✅ Yes (Authenticated)

### 4. Update Category
- **Endpoint**: `PUT /api/categories/:id`
- **Auth Required**: ✅ Yes (Admin)

### 5. Delete Category
- **Endpoint**: `DELETE /api/categories/:id`
- **Auth Required**: ✅ Yes (Admin)

---

## 📚 Course Endpoints (Admin Only)

### 1. Create Course
- **Endpoint**: `POST /api/courses`
- **Auth Required**: ✅ Yes (Admin)
- **Request Body**:
  ```json
  {
    "title": "Introduction to Healthcare",
    "slug": "introduction-to-healthcare",
    "description": "Learn the basics...",
    "thumbnail": "https://example.com/thumb.jpg",
    "price": 99.99,
    "categoryId": "clxxx"
  }
  ```

### 2. Get All Courses
- **Endpoint**: `GET /api/courses`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Lấy danh sách courses với category và counts

### 3. Get Course By ID
- **Endpoint**: `GET /api/courses/:id`
- **Auth Required**: ✅ Yes (Admin)
- **Description**: Lấy course với sections và lessons

### 4. Update Course
- **Endpoint**: `PUT /api/courses/:id`
- **Auth Required**: ✅ Yes (Admin)

### 5. Delete Course
- **Endpoint**: `DELETE /api/courses/:id`
- **Auth Required**: ✅ Yes (Admin)

---

## 📑 Section Endpoints (Admin Only)

### 1. Create Section
- **Endpoint**: `POST /api/sections`
- **Auth Required**: ✅ Yes (Admin)
- **Request Body**:
  ```json
  {
    "title": "Introduction",
    "position": 0,
    "courseId": "clxxx"
  }
  ```

### 2. Get All Sections
- **Endpoint**: `GET /api/sections?courseId=xxx`
- **Auth Required**: ✅ Yes (Admin)
- **Query Params**: `courseId` (optional)

### 3. Get Section By ID
- **Endpoint**: `GET /api/sections/:id`
- **Auth Required**: ✅ Yes (Admin)

### 4. Update Section
- **Endpoint**: `PUT /api/sections/:id`
- **Auth Required**: ✅ Yes (Admin)

### 5. Delete Section
- **Endpoint**: `DELETE /api/sections/:id`
- **Auth Required**: ✅ Yes (Admin)

---

## 📖 Lesson Endpoints (Admin Only)

### 1. Create Lesson
- **Endpoint**: `POST /api/lessons`
- **Auth Required**: ✅ Yes (Admin)
- **Request Body**:
  ```json
  {
    "title": "Introduction to Healthcare Basics",
    "position": 0,
    "videoId": "bunny-video-id-123",
    "documentUrl": "https://example.com/doc.pdf",
    "sectionId": "clxxx"
  }
  ```

### 2. Get All Lessons
- **Endpoint**: `GET /api/lessons?sectionId=xxx`
- **Auth Required**: ✅ Yes (Admin)
- **Query Params**: `sectionId` (optional)

### 3. Get Lesson By ID
- **Endpoint**: `GET /api/lessons/:id`
- **Auth Required**: ✅ Yes (Admin)

### 4. Update Lesson
- **Endpoint**: `PUT /api/lessons/:id`
- **Auth Required**: ✅ Yes (Admin)

### 5. Delete Lesson
- **Endpoint**: `DELETE /api/lessons/:id`
- **Auth Required**: ✅ Yes (Admin)

---

## 👨‍🏫 Instructor Endpoints

### 1. Submit Verification
- **Endpoint**: `POST /api/instructor/verification`
- **Auth Required**: ✅ Yes (INSTRUCTOR)
- **Request Body**:
  ```json
  {
    "bio": "Experienced healthcare professional...",
    "specialization": "Cardiology",
    "experience": "10 years...",
    "education": "MD from...",
    "certificates": "Board certified..."
  }
  ```

### 2. Get My Verification
- **Endpoint**: `GET /api/instructor/verification/my`
- **Auth Required**: ✅ Yes (INSTRUCTOR)
- **Description**: Lấy thông tin verification của chính mình

### 3. Get Pending Verifications
- **Endpoint**: `GET /api/instructor/verification/pending`
- **Auth Required**: ✅ Yes (ADMIN)
- **Description**: Lấy danh sách verification đang chờ duyệt

### 4. Verify Instructor
- **Endpoint**: `PUT /api/instructor/verification/verify`
- **Auth Required**: ✅ Yes (ADMIN)
- **Request Body**:
  ```json
  {
    "userId": "clxxx",
    "isVerified": true
  }
  ```

---

## 🏥 Health Check

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Auth Required**: ❌ No
- **Description**: Kiểm tra health của API và database
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 12345,
    "database": "connected",
    "environment": "development"
  }
  ```

### 2. API Info
- **Endpoint**: `GET /api`
- **Auth Required**: ❌ No
- **Description**: Thông tin cơ bản về API

---

## 📝 Response Format

Tất cả API responses đều theo format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... } // Optional, chỉ có khi có pagination
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE", // Optional
    "details": { ... } // Optional, cho validation errors
  }
}
```

---

## 🔒 Authentication

### Headers
```
Authorization: Bearer <access_token>
```

### Token Expiration
- **Access Token**: 24 hours (configurable via `JWT_EXPIRES_IN`)
- **Refresh Token**: 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`)

### Roles
- **USER**: Default role, có thể mua và học khóa học
- **INSTRUCTOR**: Có thể submit verification, sau khi được verify có thể tạo khóa học
- **ADMIN**: Full access, quản lý tất cả resources

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation error) |
| 401 | Unauthorized (Invalid token or credentials) |
| 403 | Forbidden (Insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

