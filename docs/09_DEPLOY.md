# AECH MANAGEMENT SYSTEM

## 09_DEPLOY

Version: V1.0

—

# MỤC TIÊU

Triển khai toàn bộ hệ thống AECH lên môi trường Production.

Hệ thống hoạt động 24/7.

Toàn bộ dữ liệu lưu trên PostgreSQL.

—

# KIẾN TRÚC TRIỂN KHAI

Người dùng

↓

Website

↓

Backend API

↓

PostgreSQL

↓

Telegram Bot

—

# GITHUB

Repository

AECH

Branch

main

Toàn bộ mã nguồn lưu trên GitHub.

—

# RAILWAY

Deploy

NodeJS

ExpressJS

PostgreSQL

Biến môi trường

.env

—

# ENVIRONMENT

PORT

DATABASE_URL

JWT_SECRET

BOT_TOKEN

WEBHOOK_URL

—

# DATABASE

PostgreSQL

Tự động kết nối khi Deploy.

Không lưu dữ liệu cục bộ.

Backup định kỳ.

—

# TELEGRAM BOT

Một Bot duy nhất.

Bot phục vụ nhiều nhóm.

Mỗi nhóm có Telegram Group ID riêng.

Website tự gửi dữ liệu.

Không nhập dữ liệu trên Telegram.

—

# DOMAIN

HTTPS

SSL

Tên miền

aech.vn

(Có thể thay đổi sau.)

—

# LOG

Lưu

- Đăng nhập
- Đăng xuất
- Thêm giao dịch
- Sửa giao dịch
- Xóa giao dịch
- Chốt ngày
- Chốt tháng
- Thêm nhân viên
- Xóa nhân viên

—

# BACKUP

Database

01 lần mỗi ngày.

File Export

Lưu theo ngày.

—

# QUY TẮC

Không Deploy trực tiếp khi chưa kiểm tra.

Không sửa Database Production bằng tay.

Không xóa dữ liệu Production.

Không sửa biến môi trường trên Server nếu chưa kiểm tra.

—

END OF FILE