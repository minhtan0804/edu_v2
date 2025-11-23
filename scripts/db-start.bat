@echo off
REM Script để khởi động PostgreSQL database với Docker (Windows)

echo 🐳 Starting PostgreSQL database...

REM Kiểm tra xem docker-compose có tồn tại không
where docker-compose >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose không được tìm thấy. Vui lòng cài đặt Docker Desktop.
    exit /b 1
)

REM Tạo file docker-compose.env nếu chưa có
if not exist docker-compose.env (
    echo 📝 Tạo file docker-compose.env từ template...
    copy docker-compose.env.example docker-compose.env
    echo ✅ Đã tạo docker-compose.env. Bạn có thể chỉnh sửa nếu cần.
)

REM Khởi động PostgreSQL
echo 🚀 Khởi động PostgreSQL...
docker-compose --env-file docker-compose.env up -d postgres

REM Đợi database sẵn sàng
echo ⏳ Đợi database sẵn sàng...
timeout /t 5 /nobreak >nul

REM Kiểm tra status
docker-compose ps | findstr "edutech-postgres.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL đã khởi động thành công!
    echo.
    echo 📊 Thông tin kết nối:
    echo    Host: localhost
    echo    Port: 5432
    echo    Database: edutech_db
    echo    User: postgres
    echo    Password: postgres
    echo.
    echo 💡 Để xem logs: docker-compose logs -f postgres
    echo 💡 Để dừng: docker-compose down
) else (
    echo ❌ Có lỗi khi khởi động PostgreSQL. Kiểm tra logs:
    docker-compose logs postgres
    exit /b 1
)

