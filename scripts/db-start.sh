#!/bin/bash

# Script để khởi động PostgreSQL database với Docker

echo "🐳 Starting PostgreSQL database..."

# Kiểm tra xem docker-compose có tồn tại không
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose không được tìm thấy. Vui lòng cài đặt Docker Compose."
    exit 1
fi

# Kiểm tra xem Docker có chạy không
if ! docker info &> /dev/null; then
    echo "❌ Docker không chạy. Vui lòng khởi động Docker."
    exit 1
fi

# Tạo file docker-compose.env nếu chưa có
if [ ! -f docker-compose.env ]; then
    echo "📝 Tạo file docker-compose.env từ template..."
    cp docker-compose.env.example docker-compose.env
    echo "✅ Đã tạo docker-compose.env. Bạn có thể chỉnh sửa nếu cần."
fi

# Khởi động PostgreSQL
echo "🚀 Khởi động PostgreSQL..."
docker-compose --env-file docker-compose.env up -d postgres

# Đợi database sẵn sàng
echo "⏳ Đợi database sẵn sàng..."
sleep 5

# Kiểm tra status
if docker-compose ps | grep -q "edutech-postgres.*Up"; then
    echo "✅ PostgreSQL đã khởi động thành công!"
    echo ""
    echo "📊 Thông tin kết nối:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: edutech_db"
    echo "   User: postgres"
    echo "   Password: postgres"
    echo ""
    echo "💡 Để xem logs: docker-compose logs -f postgres"
    echo "💡 Để dừng: docker-compose down"
else
    echo "❌ Có lỗi khi khởi động PostgreSQL. Kiểm tra logs:"
    docker-compose logs postgres
    exit 1
fi

