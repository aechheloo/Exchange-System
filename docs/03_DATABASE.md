# AECH MANAGEMENT SYSTEM

## 03_DATABASE

Version: V1.0

—

# MỤC TIÊU

Database sử dụng PostgreSQL.

Chỉ có một Database duy nhất.

Mọi dữ liệu đều lưu trong PostgreSQL.

Không lưu dữ liệu trong RAM.

Không dùng file JSON.

—

# BẢNG

## groups

Lưu thông tin nhóm.

Trường

- id
- name
- telegram_group_id
- fee_percent
- created_at
- updated_at

—

## users

Lưu nhân viên.

Trường

- id
- fullname
- phone
- note
- created_at
- updated_at

—

## transactions

Lưu toàn bộ giao dịch.

Trường

- id
- group_id
- type
- content
- amount
- fee_percent
- fee_amount
- receive_amount
- created_by
- created_at

type

IN

OUT

—

## advances

Lưu ứng tiền.

Trường

- id
- user_id
- amount
- note
- created_at

—

## notes

Lưu ghi chú.

Trường

- id
- user_id
- content
- created_at

—

## daily_reports

Lưu chốt ngày.

Trường

- id
- group_id
- total_in
- total_out
- total_fee
- total_receive
- report_date
- created_at

—

## monthly_reports

Lưu chốt tháng.

Trường

- id
- group_id
- total_in
- total_out
- total_fee
- total_receive
- report_month
- created_at

—

# QUAN HỆ

groups

↓

transactions

users

↓

advances

users

↓

notes

groups

↓

daily_reports

groups

↓

monthly_reports

—

# NGUYÊN TẮC

Không xóa dữ liệu.

Chỉ cập nhật trạng thái.

Mọi giao dịch phải lưu lịch sử.

Không sửa trực tiếp Database.

Mọi thao tác thông qua Backend API.

—

END OF FILE