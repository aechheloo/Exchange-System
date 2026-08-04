# AECH MANAGEMENT SYSTEM

## 07_PERMISSION

Version: V1.0

—

# MỤC TIÊU

Hệ thống chỉ có 2 cấp quyền.

- Super Admin
- Nhân viên

Không có quyền khác.

—

# SUPER ADMIN

Toàn quyền hệ thống.

Được phép

- Đăng nhập
- Tạo tài khoản
- Khóa tài khoản
- Mở khóa tài khoản
- Đổi mật khẩu
- Tạo nhóm
- Đổi tên nhóm
- Xóa nhóm
- Đổi Telegram Group ID
- Cấp quyền nhóm cho nhân viên
- Thu tiền
- Chi tiền
- Sửa giao dịch
- Xóa giao dịch
- Xem toàn bộ giao dịch
- Xem toàn bộ nhân viên
- Thêm nhân viên
- Sửa nhân viên
- Xóa nhân viên
- Ghi Note
- Xem Note
- Ứng tiền
- Chốt ngày
- Chốt tháng
- Xuất Excel
- Xuất PDF
- Xuất CSV
- Xem nhật ký hệ thống

—

# NHÂN VIÊN

Được phép

- Đăng nhập
- Xem Dashboard
- Chỉ xem nhóm được cấp
- Thêm giao dịch Thu
- Thêm giao dịch Chi
- Ghi Note
- Xem thông tin của chính mình

Không được phép

- Tạo nhóm
- Xóa nhóm
- Đổi Telegram Group ID
- Xem nhóm khác
- Xóa giao dịch
- Chốt tháng
- Xuất dữ liệu toàn hệ thống
- Thay đổi quyền
- Xem nhật ký hệ thống

—

# QUYỀN THEO NHÓM

Super Admin chọn:

Nhân viên A

↓

Được xem

- Nhóm Xào Lăn
- Nhóm Thịt Chó

Không được xem

- Nhóm ABC
- Nhóm DEF

Nhân viên chỉ nhìn thấy đúng các nhóm đã được cấp.

—

# NOTE

Nhân viên được tạo Note.

Note chỉ Super Admin xem được.

Không gửi Telegram.

—

# ỨNG TIỀN

Nhân viên không tự tạo ứng tiền.

Super Admin tạo.

Lưu toàn bộ lịch sử.

—

# ĐĂNG NHẬP

JWT

Thời gian hết hạn

7 ngày

Đăng xuất

↓

Xóa Token

—

# BẢO MẬT

Mọi API đều kiểm tra Token.

Không có Token

↓

Không truy cập.

Sai quyền

↓

403 Forbidden.

—

END OF FILE