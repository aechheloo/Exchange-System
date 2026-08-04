<<<<<<< HEAD
# Exchange System V2

Hệ thống Telegram + PostgreSQL + Website quản lý nhiều nhóm.

## Chức năng đã có

- Một bot dùng cho nhiều nhóm Telegram.
- Tự lưu Telegram Group ID.
- Tên nhóm và phí riêng từng nhóm.
- Super Admin.
- Nhân viên và phân quyền theo nhóm.
- Nút:
  - ➕ Tiền vào
  - ➖ Tiền ra
  - 📄 Giao dịch
  - 📊 Báo cáo
  - 📋 Chốt
- Tiền vào tự tính phí.
- Số dư lũy kế và cho phép âm.
- Chốt ngày giữ nguyên số dư, đặt thống kê ngày về 0.
- Gửi thông báo giao dịch/chốt về Super Admin Chat.
- Website:
  - Dashboard
  - Sửa tên và phí
  - Giao dịch
  - Nhân viên
  - Phân quyền

## Biến Railway bắt buộc

```env
BOT_TOKEN=
DATABASE_URL=
SUPER_ADMIN_USER_ID=
SUPER_ADMIN_CHAT_ID=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=mat-khau-manh
PORT=8080
DATABASE_SSL=true
```

### SUPER_ADMIN_USER_ID

Nhắn riêng bot và gửi `/id`. Dùng số `User ID`.

### SUPER_ADMIN_CHAT_ID

Nơi nhận thông báo tổng. Có thể dùng chính User ID hoặc ID nhóm dạng `-100...`.

## Cách đưa lên GitHub bằng iPhone

1. Giải nén file ZIP trong ứng dụng Tệp.
2. Mở Working Copy.
3. Xóa toàn bộ file code cũ trong repository `Exchange-System`, nhưng không xóa repository.
4. Import/copy toàn bộ file và thư mục của gói này vào repository.
5. Commit một lần:
   `Exchange System V2 full`
6. Mở Remotes → github → Push.
7. Railway tự deploy.

## Cài nhóm Telegram lần đầu

1. Thêm bot vào nhóm.
2. Cho bot quyền Admin để bot gửi tin nhắn ổn định.
3. Super Admin gửi ngay trong nhóm:

```text
/setupgroup Hà Nội VIP|6
```

4. Bot trả về mã nhóm hệ thống.
5. Gửi `/menu` để hiện nút.

## Thêm nhân viên

Nhân viên nhắn riêng bot và gửi `/id` để lấy `User ID`.

Super Admin có thể dùng website `/admin/staff`, hoặc Telegram:

```text
/addstaff 123456789|Nhân viên A
/grant 123456789|1
```

Trong đó `1` là mã nhóm hệ thống xem bằng `/groups`.

## Sử dụng hằng ngày

Trong nhóm Telegram:

- Bấm `➕ Tiền vào`, nhập `10000000`.
- Bấm `➖ Tiền ra`, nhập số tiền.
- Bấm `📄 Giao dịch`.
- Bấm `📊 Báo cáo`.
- Bấm `📋 Chốt`.

Không có bước xác nhận.

## Website

Mở:

```text
https://TEN-MIEN-RAILWAY/admin
```

Trình duyệt sẽ hỏi tài khoản Basic Auth:

- Username: `ADMIN_USERNAME`
- Password: `ADMIN_PASSWORD`

## Lưu ý Railway

Chỉ chạy **một replica**. Không tự chạy `node index.js` trong Railway Console vì sẽ tạo thêm polling và Telegram báo lỗi `409 Conflict`.
=======
# Exchange-System
>>>>>>> main
