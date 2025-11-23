# Hướng dẫn Setup Resend Email Service

## Tổng quan

Dự án đã được cấu hình để sử dụng **Resend** làm email service. Resend cung cấp:
- ✅ Free tier: 3,000 email/tháng
- ✅ API đơn giản, dễ sử dụng
- ✅ Deliverability tốt
- ✅ Dashboard để theo dõi

## Bước 1: Đăng ký Resend

1. Truy cập: https://resend.com/signup
2. Đăng ký tài khoản (miễn phí)
3. Xác thực email

## Bước 2: Lấy API Key

1. Đăng nhập vào Dashboard: https://resend.com/emails
2. Vào **API Keys**: https://resend.com/api-keys
3. Click **Create API Key**
4. Đặt tên (ví dụ: "Development" hoặc "Production")
5. Copy API Key (bắt đầu bằng `re_`)
   - ⚠️ **Lưu ý**: Chỉ hiển thị 1 lần, hãy lưu lại ngay!

## Bước 3: Cấu hình Environment Variables

Thêm vào `backend/.env`:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Giải thích:

- **RESEND_API_KEY**: API key bạn vừa copy từ Resend Dashboard
- **RESEND_FROM_EMAIL**: 
  - Development/Testing: `onboarding@resend.dev` (không cần verify)
  - Production: `noreply@yourdomain.com` (cần verify domain trước)

## Bước 4: Test Email

1. Khởi động backend:
   ```bash
   cd backend
   pnpm start:dev
   ```

2. Đăng ký tài khoản mới qua API hoặc frontend
3. Kiểm tra email inbox (hoặc spam folder)
4. Nếu không nhận được, kiểm tra console logs

## Development Mode (Không cần API Key)

Nếu bạn **KHÔNG** set `RESEND_API_KEY` trong `.env`:
- Email sẽ fail (vì không có API key)
- Nhưng trong development mode, hệ thống sẽ:
  - Log verification URL ra console
  - Không throw error
  - Cho phép bạn copy URL để test verification flow

→ **Không mất phí, an toàn cho dev/test**

## Production Setup

### 1. Verify Domain (Bắt buộc cho production)

1. Vào Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Nhập domain của bạn (ví dụ: `edutech.com`)
4. Thêm DNS records theo hướng dẫn:
   - SPF record
   - DKIM record
   - DMARC record (optional)
5. Đợi verify (thường mất vài phút đến vài giờ)

### 2. Cập nhật Environment Variables

```env
RESEND_API_KEY=re_your_production_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Chi phí

### Free Tier (Đủ cho dev/test và MVP nhỏ)
- **3,000 email/tháng** - Miễn phí vĩnh viễn
- Không cần credit card
- Đủ cho:
  - Development & Testing
  - MVP với < 100 users/tháng
  - Email verification, notifications

### Pro Plan (Khi cần scale)
- **$20/tháng** - 50,000 email
- **$80/tháng** - 200,000 email
- Có analytics, webhooks, và support tốt hơn

## Troubleshooting

### Email không được gửi

1. **Kiểm tra API Key**:
   - Đảm bảo API key đúng format (bắt đầu bằng `re_`)
   - Kiểm tra API key chưa bị revoke

2. **Kiểm tra From Email**:
   - Development: Phải dùng `onboarding@resend.dev`
   - Production: Domain phải được verify

3. **Kiểm tra Logs**:
   ```bash
   # Xem logs trong console
   # Nếu có lỗi, sẽ hiển thị chi tiết
   ```

4. **Kiểm tra Resend Dashboard**:
   - Vào https://resend.com/emails
   - Xem logs và error messages

### Email vào Spam

- Verify domain (SPF, DKIM)
- Sử dụng domain thay vì `onboarding@resend.dev`
- Tránh spam keywords trong subject/content

## Migration từ SMTP

Nếu bạn đang dùng SMTP và muốn chuyển sang Resend:

1. ✅ Code đã được cập nhật để dùng Resend
2. ✅ Chỉ cần thêm `RESEND_API_KEY` vào `.env`
3. ✅ Không cần thay đổi code khác

## Tài liệu tham khảo

- Resend Documentation: https://resend.com/docs
- Resend API Reference: https://resend.com/docs/api-reference
- Resend Dashboard: https://resend.com/emails

