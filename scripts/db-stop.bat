@echo off
REM Script để dừng PostgreSQL database (Windows)

echo 🛑 Stopping PostgreSQL database...

docker-compose down

echo ✅ PostgreSQL đã dừng.

