#!/bin/bash

# Script để reset database (⚠️ Xóa hết data!)

read -p "⚠️  Bạn có chắc chắn muốn xóa hết data? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Đã hủy."
    exit 0
fi

echo "🗑️  Dừng và xóa database..."

docker-compose down -v

echo "✅ Đã xóa database và volumes."

echo "🚀 Khởi động lại database..."
docker-compose --env-file docker-compose.env up -d postgres

sleep 5

echo "✅ Database đã được reset và khởi động lại."

