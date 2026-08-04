# AECH MANAGEMENT SYSTEM

## 10_FINAL_PROJECT

Version: V1.0

—

# GIỚI THIỆU

AECH Management System là hệ thống quản lý thu chi, nhân viên và Telegram.

Website là trung tâm quản lý duy nhất.

Telegram chỉ dùng để nhận thông báo.

Toàn bộ dữ liệu lưu trên PostgreSQL.

—

# PHẠM VI DỰ ÁN

Website

Backend API

Database

Telegram Bot

Export

Authentication

Permission

Report

Deployment

—

# CHỨC NĂNG

## Dashboard

- Tổng Thu
- Tổng Chi
- Còn Lại
- Tổng nhóm
- Tổng nhân viên

—

## Nhóm

- Tạo nhóm
- Sửa nhóm
- Xóa nhóm
- Telegram Group ID
- Danh sách giao dịch

—

## Giao dịch

- Thu
- Chi
- Sửa
- Xóa
- Lịch sử

—

## Báo cáo

- Chốt ngày
- Chốt tháng

—

## Nhân viên

- Danh sách
- Ứng tiền
- Note
- Chốt lương

—

## Telegram

- Giao dịch
- Chốt ngày
- Chốt tháng
- Chốt lương

—

## Export

- Excel
- PDF
- CSV

—

# PHÂN QUYỀN

Super Admin

Toàn quyền.

Nhân viên

Chỉ xem nhóm được cấp.

Được tạo Thu.

Được tạo Chi.

Được ghi Note.

—

# CẤU TRÚC DỰ ÁN

AECH/

docs/

src/

frontend/

backend/

database/

telegram/

exports/

uploads/

logs/

—

# MỤC TIÊU HOÀN THÀNH

Website hoạt động.

Bot Telegram hoạt động.

Database hoạt động.

Export hoạt động.

Deploy Railway thành công.

—

# CHECKLIST

☑ Đăng nhập

☑ Dashboard

☑ Nhóm

☑ Thu

☑ Chi

☑ Nhân viên

☑ Ứng tiền

☑ Note

☑ Chốt ngày

☑ Chốt tháng

☑ Telegram

☑ Export

☑ Railway

☑ PostgreSQL

☑ GitHub

—

# NGUYÊN TẮC CUỐI CÙNG

Không tự ý thay đổi:

- Giao diện.
- Database.
- API.
- Telegram.
- Quyền.
- Luồng xử lý.

Mọi thay đổi đều phải được cập nhật vào tài liệu.

—

# KẾT LUẬN

Tài liệu trong thư mục `docs` là tài liệu chuẩn của dự án AECH.

Mọi mã nguồn được xây dựng phải tuân thủ đúng tài liệu này.

END OF FILE