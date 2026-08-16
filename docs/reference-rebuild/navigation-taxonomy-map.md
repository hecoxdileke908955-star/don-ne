# Navigation & Taxonomy Map

## 1. Main navigation (reference, từ HTML thật)
Trang chủ → Dịch vụ▼ → Bảng giá → Khu vực → Cẩm nang → Giới thiệu → Liên hệ → CTA "Gọi/Zalo"

## 2. Dropdown "Dịch vụ" (reference, 14 mục thật)
Vệ sinh sau xây dựng · Vệ sinh nhà cửa · Vệ sinh nhà xưởng · Vệ sinh văn phòng · Giặt ghế sofa · Giặt thảm · Giặt đệm tại nhà · Giặt rèm cửa · Chà sàn công nghiệp · Dọn nhà theo giờ · Thau rửa bể nước ngầm · Mài sàn bê tông · Đánh bóng sàn đá · Đánh bóng sàn gỗ

## 3. Footer navigation (reference)
4 cột: **Brand+social** (Facebook/YouTube/Pinterest/X/LinkedIn/TikTok) · **Dịch Vụ Vệ Sinh** (danh sách link dịch vụ) · **Khu Vực Phục Vụ** (danh sách link) · **Thông Tin** (chưa xác định đầy đủ từ HTML fetch — `REFERENCE UNCERTAIN`, có thể gồm chính sách + liên hệ).

## 4. Service categories

| Reference (14 dropdown item) | Dọn Nè equivalent | Implement? |
|---|---|---|
| Vệ sinh nhà cửa | `ve-sinh-nha-cua` | ✅ Có sẵn trong DB |
| Vệ sinh sau xây dựng | `ve-sinh-sau-xay-dung` | ✅ Có sẵn |
| Vệ sinh nhà xưởng | — | ❌ NOT OFFERED BY DỌN NÈ (không có trong `Service` DB) |
| Vệ sinh văn phòng | `ve-sinh-van-phong` | ✅ Có sẵn |
| Giặt ghế sofa | `giat-ghe-sofa` | ✅ Có sẵn |
| Giặt thảm | `giat-tham-van-phong` (Dọn Nè chỉ có bản văn phòng) | ⚠️ MỘT PHẦN — không có "giặt thảm" tổng quát cho hộ gia đình |
| Giặt đệm tại nhà | `giat-dem` | ✅ Có sẵn |
| Giặt rèm cửa | — | ❌ NOT OFFERED |
| Chà sàn công nghiệp | — | ❌ NOT OFFERED |
| Dọn nhà theo giờ | — | ❌ NOT OFFERED |
| Thau rửa bể nước ngầm | — | ❌ NOT OFFERED |
| Mài sàn bê tông | — | ❌ NOT OFFERED |
| Đánh bóng sàn đá | — | ❌ NOT OFFERED |
| Đánh bóng sàn gỗ | — | ❌ NOT OFFERED |
| (không có trong dropdown 14 mục, nhưng có trong `Service` DB) | `ve-sinh-can-ho-chung-cu`, `dich-vu-lau-kinh`, `ve-sinh-san-pickleball` | ✅ Có sẵn — đã đưa vào dropdown Dọn Nè |

**Quan trọng**: dropdown "Dịch Vụ" trên Header Dọn Nè lấy **trực tiếp từ `/api/services` (DB thật)**, không hard-code theo danh sách 14 mục của reference — nghĩa là các mục "NOT OFFERED BY DỌN NÈ" ở trên **không xuất hiện** trên site Dọn Nè, đúng yêu cầu "không tự tuyên bố cung cấp dịch vụ chỉ vì reference có".

## 5. Article categories (Cẩm nang)
Reference có ≥11 bài trong hub + hàng chục bài khác trong sitemap (chủ đề: hóa chất, mẹo vệ sinh, hướng dẫn theo bề mặt). Dọn Nè: **0 bài** — chưa có Article CMS (AFTER V1 theo Step 8 planning). `/cam-nang-ve-sinh` hiển thị empty-state trung thực.

## 6. Location categories (Khu vực)
Reference: archive các trang combo "Dịch vụ + Quận" (vd. "Giặt ghế sofa Ba Đình"), phát hiện 227 bài qua sitemap. Dọn Nè: **không có Location CMS public** — trang `/khu-vuc-phuc-vu` hiển thị 12 quận/huyện (STATIC TEMPORARY, khớp dữ liệu `Location` đã seed trong DB nhưng chưa có API/route public riêng cho từng quận) mà **không** tạo các trang combo giả.

## 7. Policy links
Reference: `/chinh-sach-bao-mat/`, `/chinh-sach-bao-hanh/` (không tìm thấy link trực tiếp trong footer đã fetch — có thể nằm sâu hơn, `REFERENCE UNCERTAIN`). Dọn Nè: 2 trang tương ứng, có link ở Footer cột "Thông Tin".

## 8. Pagination structure
Reference: `.page-numbers` (pill 40×40px) dùng cho `/dich-vu/page/2/`, `/dich-vu/page/3/`, `/dich-vu/page/4/` (WP default pagination, ~10-12 item/trang). Dọn Nè: `/dich-vu` hiện hiển thị toàn bộ services (9 dịch vụ) trên 1 trang — **không cần phân trang** ở quy mô dữ liệu hiện tại; kiến trúc grid đã sẵn sàng mở rộng phân trang khi số lượng dịch vụ tăng.

## 9. Breadcrumb structure
Reference: không tìm thấy class `.breadcrumb` cụ thể trong HTML đã fetch (`REFERENCE UNCERTAIN`). Dọn Nè service detail: breadcrumb text đơn giản "Trang chủ / Dịch vụ / {Tên dịch vụ}" — giữ nguyên pattern đã có từ trước, phù hợp bằng chứng quan sát được (không phát minh thêm).

## 10. Related-content linking
Reference: sidebar "Dịch vụ nổi bật" (3 dịch vụ ngẫu nhiên/nổi bật) + "Bài Viết Liên Quan" cuối bài. Dọn Nè service detail: sidebar "Dịch Vụ Liên Quan" lấy dịch vụ **cùng category thật** (chính xác hơn reference — có liên quan ngữ nghĩa thay vì ngẫu nhiên), không có "bài viết liên quan" vì chưa có Article CMS.
