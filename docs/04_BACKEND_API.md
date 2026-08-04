# AECH MANAGEMENT SYSTEM

## 04_BACKEND_API

Version: V1.0

—

# MỤC TIÊU

Backend là trung tâm xử lý toàn bộ hệ thống.

Frontend không thao tác trực tiếp Database.

Tất cả dữ liệu đều đi qua API.

—

# CÔNG NGHỆ

- NodeJS
- ExpressJS
- PostgreSQL
- JWT
- Railway

—

# API ĐĂNG NHẬP

POST

/api/login

Chức năng

Đăng nhập hệ thống.

Trả về

JWT Token

Thông tin tài khoản

Quyền

—

# API NHÓM

GET

/api/groups

Lấy danh sách nhóm.

—

POST

/api/groups

Tạo nhóm mới.

Thông tin

- Tên nhóm
- Telegram Group ID
- Phần trăm phí

—

PUT

/api/groups/:id

Cập nhật nhóm.

—

DELETE

/api/groups/:id

Ẩn nhóm.

Không xóa Database.

—

# API GIAO DỊCH

GET

/api/transactions

Danh sách giao dịch.

—

POST

/api/transactions

Thêm giao dịch.

Thông tin

- Group
- Loại
- Nội dung
- Số tiền

Hệ thống tự tính

- Phí
- Thực nhận

—

PUT

/api/transactions/:id

Sửa giao dịch.

—

DELETE

/api/transactions/:id

Ẩn giao dịch.

Không xóa dữ liệu.

—

# API NHÂN VIÊN

GET

/api/users

Danh sách nhân viên.

—

POST

/api/users

Thêm nhân viên.

—

PUT

/api/users/:id

Sửa nhân viên.

—

DELETE

/api/users/:id

Ẩn nhân viên.

—

# API ỨNG TIỀN

GET

/api/advances

Danh sách ứng tiền.

—

POST

/api/advances

Thêm ứng tiền.

—

# API NOTE

GET

/api/notes

Danh sách Note.

—

POST

/api/notes

Thêm Note.

—

# API CHỐT NGÀY

POST

/api/report/day

Tạo báo cáo ngày.

Sau khi tạo

↓

Lưu Database

↓

Gửi Telegram

—

# API CHỐT THÁNG

POST

/api/report/month

Tạo báo cáo tháng.

Sau khi tạo

↓

Lưu Database

↓

Gửi Telegram

—

# API XUẤT FILE

GET

/api/export/excel

Xuất Excel.

—

GET

/api/export/pdf

Xuất PDF.

—

GET

/api/export/csv

Xuất CSV.

—

# QUY TẮC

Không cho phép Frontend truy cập Database.

Mọi dữ liệu phải qua API.

Mọi API đều kiểm tra JWT.

Mọi API ghi Log.

Mọi lỗi đều trả về JSON.

—

END OF FILE