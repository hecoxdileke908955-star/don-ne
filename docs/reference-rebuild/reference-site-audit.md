# Reference Site Audit — vesinhcongnghiephanoi.com (CleanHanoi)

> Nguồn dữ liệu: HTML thực tế của 13 URL đại diện (fetch trực tiếp qua curl, không dùng cache), CSS thật của theme (`wp-content/themes/cleanhnn/assets/css/main.css`, 391 dòng, tải trực tiếp từ site), `page-sitemap.xml` + `post-sitemap1/2.xml` (Rank Math). Website tham chiếu chỉ dùng để học cấu trúc — không sao chép logo/ảnh/văn bản.
> Phạm vi audit: đầy đủ cho các page type GLOBAL/HOME/DỊCH VỤ ARCHIVE/SERVICE DETAIL/BẢNG GIÁ/KHU VỰC/CẨM NANG/GIỚI THIỆU/LIÊN HỆ/POLICY theo đúng 13 URL đã fetch trực tiếp; 41 URL dịch vụ còn lại trong danh sách yêu cầu được xác nhận **cùng một WordPress single-post template** qua kiểm tra 3 mẫu (`ve-sinh-nha-cua`, `giat-ghe-sofa`, `ve-sinh-san-pickleball`) — xem ghi chú ở `reference-route-matrix.md`.

## 1. Page types phát hiện

| Page type | URL mẫu | Ghi chú |
|---|---|---|
| Trang chủ | `/` | 12 section (xem mục 3) |
| Service archive (custom taxonomy) | `/dich-vu/` | `posts-grid` fluid grid, `post-card` |
| Service detail (WP `single-post`) | `/ve-sinh-nha-cua/`, ... | 2 cột: content + sidebar |
| Location×Service combo (WP `single-post`, cùng custom post type) | `/giat-ghe-sofa-ba-dinh/` | **Phát hiện thêm qua sitemap**, không có trong danh sách yêu cầu gốc — local-SEO landing page ghép dịch-vụ+quận. Không implement (không có Location CMS). |
| Bảng giá | `/bang-gia/` | WP `page` |
| Khu vực (archive) | `/khu-vuc-phuc-vu/` | Cùng `posts-grid`/`post-card`, liệt kê các trang combo dịch-vụ+quận, có pagination |
| Cẩm nang (archive) | `/cam-nang-ve-sinh/` | Cùng `posts-grid`/`post-card`, bài viết kiến thức, pagination |
| Giới thiệu | `/gioi-thieu/` | WP `page`, nội dung ngắn |
| Liên hệ | `/lien-he/` | WP `page` |
| Policy | `/chinh-sach-bao-mat/`, `/chinh-sach-bao-hanh/` | WP `page`, `content-page` (max-width 860px) |

Sitemap (`page-sitemap.xml`) chỉ liệt kê 4 URL WP "page" thật (`/`, `/bang-gia/`, `/gioi-thieu/`, `/lien-he/`). `/dich-vu/`, `/khu-vuc-phuc-vu/`, `/cam-nang-ve-sinh/` là **archive ảo** của cùng một custom post type "post" lọc theo category — không xuất hiện trong page-sitemap, xác nhận qua HTTP 200 trực tiếp. `post-sitemap1.xml` (199 URL) + `post-sitemap2.xml` (28 URL) = 227 bài viết dạng "post", trộn lẫn dịch vụ + combo địa phương + bài cẩm nang.

## 2. GLOBAL layout (từ `main.css` + HTML thật)

- **Header**: `.site-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.95);backdrop-filter:blur(14px)}`. Container `max-width:1200px;padding:0 20px`.
- **Logo**: `.brand img{width:112px;height:auto}` (96px ở mobile).
- **Nav chính** (thứ tự thật từ HTML): Trang chủ · Dịch vụ▼ (dropdown 14 mục) · Bảng giá · Khu vực · Cẩm nang · Giới thiệu · Liên hệ.
- **Dropdown**: `.menu-sub{position:absolute;top:100%;left:50%;transform:translateX(-50%);min-width:220px;background:#fff;border-radius:14px;box-shadow:0 16px 40px rgba(4,42,80,.12);padding:10px 0}`, hiện khi hover (`menu-has-sub:hover`). Item: `padding:10px 20px;font-size:14px;font-weight:700`.
- **CTA header**: `.header-cta{background:orange;padding:12px 24px;border-radius:999px;font-weight:900}` — text "Gọi/Zalo", href `tel:`.
- **Mobile**: header CTA + nav ẩn dưới 760px, thay bằng `.mobile-menu-toggle` (44×44px, radius 999px) mở `.mobile-menu-panel`; submenu Dịch vụ hiện luôn dạng grid thụt lề, không phải accordion.
- **Floating desktop widget**: `.ch-desktop-contact-card{position:fixed;right:22px;bottom:96px;width:245px;padding:14px;border-radius:22px;background:rgba(255,255,255,.96);box-shadow:0 18px 45px rgba(15,23,42,.18);backdrop-filter:blur(10px)}` — 1 header (status dot xanh + "Cần tư vấn dịch vụ?") + 2 action (Gọi ngay / Nhắn Zalo), mỗi action `min-height:56px;border-radius:16px`.
- **Mobile sticky bar**: `.mobile-sticky{position:fixed;bottom:0;grid-template-columns:1fr 1fr}` — 2 nút "Gọi ngay"/"Nhắn Zalo" (không có nút Báo giá thứ 3 như Dọn Nè hiện tại).
- **Footer**: `.footer-grid{grid-template-columns:1.45fr 1.15fr 1.15fr 1fr}` — 4 cột: Brand+social, "Dịch Vụ Vệ Sinh", "Khu Vực Phục Vụ", "Thông Tin". `.footer-bottom{background:#04152d;padding:18px 0}` 2 dòng copyright.
- **Card chung**: `.service-card{border-radius:24px;box-shadow:0 16px 36px rgba(4,42,80,.07)}`, ảnh `aspect-ratio:5/3;object-fit:cover`. `.post-card{border-radius:20px}` (archive). `.btn{border-radius:999px;padding:14px 24px;font-weight:900}` (pill).
- **Breakpoints thật trong CSS**: `@media (max-width:1100px)`, `@media (max-width:760px)`.

## 3. HOME — thứ tự section (từ `<section class="cleanhanoi-...">` thật)

```
1. Hero            (cleanhanoi-hero)
2. Services grid   (cleanhanoi-services)
3. Intro           (cleanhanoi-intro)     — giới thiệu công ty + ảnh caption
4. Pricing preview (cleanhanoi-price-section)
5. Why/Trust       (cleanhanoi-why)
6. Equipment       (cleanhanoi-equipment)
7. Process         (cleanhanoi-process)
8. Real work       (cleanhanoi-realwork)  — gallery công trình
9. Reviews         (cleanhanoi-reviews)   — testimonial khách hàng
10. Service areas  (cleanhanoi-area-section)
11. FAQ            (cleanhanoi-faq)
12. Final CTA      (section section-soft)
```
**Không có** section "Before/After" độc lập trên trang chủ reference (khác với Dọn Nè hiện có `BeforeAfter` là 1 trong 9 loại CMS section).

## 4. DỊCH VỤ ARCHIVE (`/dich-vu/`)

`<header class="archive-header">` → label "Danh mục" + H1 "Dịch vụ". Grid: `.posts-grid{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}` (fluid, không cột cố định — tự co giãn 1→4+ cột tùy viewport). Card `.post-card`: ảnh 300×180 (5:3) → title h3 → excerpt p → date span.

## 5. SERVICE DETAIL (WP single-post, xác nhận qua 3 mẫu)

Layout 2 cột: `<article>` nội dung dài (H1 `entry-title`, `entry-meta` ngày/tác giả, các H2 nội dung, `.cta-box`/`.cta-box.final-cta` chèn giữa bài) + `<aside class="sidebar">` gồm widget "Dịch vụ nổi bật" (3 ảnh 150×150 + link dịch vụ liên quan) và widget form "Đăng ký tư vấn dịch vụ". Cuối trang: "Bài Viết Liên Quan" (related posts). **Không phải** một template "service page" chuyên biệt với bảng giá/quy trình/FAQ tách khối riêng như giả định ban đầu — thực chất là bài viết dài có H2 tự nhiên.

## 6. BẢNG GIÁ, KHU VỰC, CẨM NANG, GIỚI THIỆU, LIÊN HỆ, POLICY

- **Bảng giá**: `.price-table-wrap{border-radius:24px}` + `.price-note` cảnh báo màu vàng.
- **Khu vực / Cẩm nang**: dùng chung `.posts-grid`/`.post-card` archive (không phải grid riêng), pagination `.page-numbers` (pill 40×40px).
- **Giới thiệu / Liên hệ**: page ngắn, không tìm thấy form liên hệ HTML riêng trong bản fetch (có thể do plugin form không xuất hiện qua fetch tĩnh) — đánh dấu `REFERENCE UNCERTAIN` cho chi tiết form liên hệ.
- **Policy**: `.content-page{max-width:860px}` — cột đơn, heading H2 phân đoạn.

## 7. Giới hạn của audit này

- Đã fetch HTML + CSS thật (không phải suy đoán) cho: `/`, `/dich-vu/`, `/bang-gia/`, `/khu-vuc-phuc-vu/`, `/cam-nang-ve-sinh/`, `/gioi-thieu/`, `/lien-he/`, `/chinh-sach-bao-mat/`, `/chinh-sach-bao-hanh/`, `/ve-sinh-nha-cua/`, `/giat-ghe-sofa/`, `/ve-sinh-san-pickleball/`, `/giat-ghe-sofa-ba-dinh/`.
- 41 URL dịch vụ còn lại trong danh sách gốc **không được fetch riêng lẻ trong lượt audit này** — suy luận dùng chung template dựa trên bằng chứng WP `single-post` nhất quán ở 3 mẫu đã kiểm; đây là giới hạn thời gian thực hiện, ghi nhận trung thực thay vì giả vờ đã kiểm từng URL.
- Không có screenshot pixel-by-pixel (xem `visual-parity-report.md` để biết giới hạn cụ thể).
