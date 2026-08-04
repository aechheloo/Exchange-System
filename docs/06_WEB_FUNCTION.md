# AECH MANAGEMENT SYSTEM

## 06_WEB_FUNCTION

Version: V1.0

—

# MỤC TIÊU

Website là trung tâm quản lý toàn bộ hệ thống.

Tất cả thao tác đều thực hiện trên Website.

Telegram chỉ nhận thông báo.

—

# TRANG ĐĂNG NHẬP

Đăng nhập bằng:

- Tài khoản
- Mật khẩu

Sau khi đăng nhập

↓

Kiểm tra quyền

↓

Đi tới Dashboard.

—

# DASHBOARD

Hiển thị

- Tổng Thu hôm nay
- Tổng Chi hôm nay
- Còn Lại hôm nay
- Tổng nhóm
- Tổng nhân viên

Danh sách nhóm

Nút

➕ Tạo nhóm

—

# QUẢN LÝ NHÓM

Super Admin được phép

- Thêm nhóm
- Đổi tên nhóm
- Xóa nhóm
- Đổi Telegram Group ID
- Cấp quyền nhân viên vào nhóm

Mỗi nhóm gồm

- Tên nhóm
- Telegram Group ID
- Danh sách giao dịch
- Danh sách nhân viên

—

# CHI TIẾT NHÓM

Có 3 Tab

1. Thu Chi
2. Nhân viên
3. Báo cáo

—

# TAB THU CHI

Có các nút

➕ Thu

➖ Chi

📋 Chốt ngày

📅 Chốt tháng

📄 Xuất dữ liệu

Danh sách giao dịch

Hiển thị

- Thời gian
- Nội dung
- Loại
- Số tiền
- Người tạo

—

# THÊM GIAO DỊCH

Thông tin

- Loại (Thu / Chi)
- Nội dung
- Số tiền
- Ghi chú (không bắt buộc)

Sau khi lưu

↓

Lưu PostgreSQL

↓

Gửi Telegram

↓

Cập nhật Dashboard

—

# CHI TIẾT GIAO DỊCH

Hiển thị

- Ngày giờ
- Nội dung
- Loại
- Số tiền
- Người tạo
- Ghi chú

Nút

✏️ Sửa

🗑 Xóa

—

# TAB NHÂN VIÊN

Hiển thị

- Tên
- Số điện thoại
- Tổng hiện tại

Nút

➕

✏️

🗑

👁 Chi tiết

—

# CHI TIẾT NHÂN VIÊN

Thông tin

- Họ tên
- Số điện thoại

Có 3 mục

1. Giao dịch
2. Ứng tiền
3. Note

—

# ỨNG TIỀN

Nút

💵 Ứng tiền

Thông tin

- Số tiền
- Nội dung

Lưu lịch sử ứng tiền.

—

# NOTE

Nhân viên được phép tạo Note.

Super Admin xem toàn bộ Note.

Note không được gửi Telegram.

—

# CHỐT NGÀY

Hệ thống tự tính

- Tổng Thu
- Tổng Chi
- Còn Lại
- Số giao dịch

Sau đó

↓

Lưu Database

↓

Gửi Telegram

—

# CHỐT THÁNG

Hệ thống tự tính

- Tổng Thu
- Tổng Chi
- Còn Lại
- Tổng giao dịch

Sau đó

↓

Lưu Database

↓

Gửi Telegram

—

# XUẤT DỮ LIỆU

Hỗ trợ

- Excel
- PDF
- CSV

Theo

- Nhóm
- Nhân viên
- Ngày
- Tháng

—

# NHẬT KÝ HỆ THỐNG

Lưu

- Đăng nhập
- Đăng xuất
- Thêm
- Sửa
- Xóa
- Chốt ngày
- Chốt tháng

—

END OF FILE