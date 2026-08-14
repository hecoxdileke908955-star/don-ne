# DỌN NÈ — NỀN TẢNG DỊCH VỤ VỆ SINH CÔNG NGHIỆP & DÂN DỤNG HÀ NỘI

Dự án Production-Ready xây dựng cho thương hiệu **Dọn Nè** theo chuẩn kiến trúc:
- **Public Website:** Phong cách thiết kế *Sạch & Chắc (Structured Clean)*, tối ưu tỷ lệ chuyển đổi (Zalo gửi ảnh, Hotline gọi ngay, Form nhận báo giá 5 phút).
- **Single Source of Truth Pricing:** Entity `PriceItem` đồng bộ tức thời trên Trang chủ, Trang dịch vụ và Trang Bảng giá.
- **Visual Block CMS:** Tùy biến block nội dung không rủi ro bảo mật (No arbitrary HTML).
- **Traffic Attribution CRM:** Nối phiên truy cập (`utm_source`, `landing_page`, `device`) trực tiếp tới Lead và Doanh thu thực tế.
- **SEO & 301 Redirects:** Bảo toàn thứ hạng tìm kiếm và tự động chuyển hướng các URL cũ.

---

## 1. YÊU CẦU HỆ THỐNG
- **Node.js:** `v18.18.0` hoặc `v20.x` LTS trở lên
- **Trình quản lý gói:** `npm` (v9+) hoặc `pnpm`
- **Cơ sở dữ liệu:** PostgreSQL 14+ hoặc Supabase

---

## 2. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Cấu hình Biến Môi Trường (.env)
Tạo file `.env` từ file mẫu:
```bash
cp .env.example .env
```
Mở file `.env` và cập nhật chuỗi kết nối PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:postgres_password@localhost:5432/don_ne_db?schema=public"
ADMIN_BOOTSTRAP_PASSWORD="MatKhauQuanTriBaoMat2026!"
JWT_SECRET="ChuoiBiMatJWTToiThieu32KyTuRanDom"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Bước 3: Khởi động Cơ sở dữ liệu PostgreSQL (Tùy chọn qua Docker)
Nếu bạn có Docker trên máy, khởi chạy PostgreSQL với một lệnh duy nhất:
```bash
docker-compose up -d
```

### Bước 4: Tạo Bảng (Migrations) & Nạp Dữ Liệu Khởi Tạo (Seed)
```bash
# Tạo cấu trúc các bảng trong DB
npx prisma migrate dev --name init

# Nạp 5 nhóm dịch vụ, 24 hạng mục giá đơn nguồn và 12 quận huyện Hà Nội
npx prisma db seed
```

### Bước 5: Chạy Máy Chủ Phát Triển (Development)
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

## 3. CÁC ĐƯỜNG DẪN QUAN TRỌNG

- **Trang chủ:** `http://localhost:3000/`
- **Bảng giá 2026 (Single Source):** `http://localhost:3000/bang-gia`
- **Trang chi tiết dịch vụ:** `http://localhost:3000/ve-sinh-nha-cua`
- **Trang dịch vụ sau xây dựng:** `http://localhost:3000/ve-sinh-sau-xay-dung`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Quản lý Lead & CRM:** `http://localhost:3000/admin/leads`
- **Visual Page Editor:** `http://localhost:3000/admin/editor/home`

---

## 4. CHẠY KIỂM THỬ TỰ ĐỘNG (TEST SUITES)

```bash
# 1. Chạy toàn bộ Unit & Integration tests
npm test

# 2. Chạy riêng Unit tests (Pricing Engine, Auth Permissions, Section Schema, Redirects)
npm run test:unit

# 3. Chạy Integration tests (Pricing Propagation, Lead Attribution)
npm run test:integration

# 4. Chạy Playwright E2E tests trên trình duyệt thật (Desktop & Mobile)
npx playwright test
```

---

## 5. BUILD & DEPLOY PRODUCTION

```bash
# Build mã nguồn tối ưu cho production
npm run build

# Khởi chạy server production
npm run start
```
