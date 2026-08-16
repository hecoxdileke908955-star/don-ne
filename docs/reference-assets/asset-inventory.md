# Reference Asset Inventory

> **Nguồn tham chiếu:** https://vesinhcongnghiephanoi.com/ (CleanHanoi) — dùng **chỉ để phân tích cấu trúc & nhu cầu hình ảnh**, không sao chép thương hiệu, không tải hàng loạt, không thay logo. Mọi ảnh liệt kê dưới đây thuộc CleanHanoi và được đánh dấu `REFERENCE_ONLY`.
> Ngày quét: 2026-08-16. Dữ liệu chi tiết máy-đọc-được: [`asset-inventory.json`](./asset-inventory.json).

## Tổng quan

- **Số URL quét thành công:** 54 / 54
- **URL lỗi:** 0
- **Tổng số image references (tất cả thẻ `<img>`, `background-image`, `og:image` trên 54 trang, gồm cả lặp lại):** 1.253 (sau khi loại 3 icon mạng xã hội hệ thống 40×40px)
- **Tổng số ảnh unique (gộp theo file gốc, coi các bản resize WordPress `-WIDTHxHEIGHT` là cùng một ảnh):** 319
- **Số ảnh trùng lặp (xuất hiện ≥ 2 trang):** 47
- **Số ảnh bị loại (icon hệ thống, không tính là content):** 3 (`pinterest-cleanhanoi.jpg`, `tiktok-cleanhanoi.webp`, `youtobe-cleanhanoi.jpg`, đều 40×40px)
- **Định dạng:** WebP 308 · JPG 10 · PNG 1 · SVG 0 · AVIF 0
- **Số ảnh theo nhóm vị trí** (một ảnh có thể thuộc nhiều nhóm nếu dùng ở nhiều vai trò):

| Nhóm | Số ảnh |
|---|---|
| content (thân bài/trang dịch vụ) | 203 |
| blog (bài cẩm nang + widget "bài viết liên quan" sitewide) | 76 |
| og:image | 46 |
| before/after | 36 |
| equipment | 23 |
| project/gallery | 14 |
| service card | 12 |
| team | 4 |
| testimonial | 3 |
| hero | 1 |
| logo/icon | 1 |

Toàn bộ ảnh sản phẩm dùng định dạng **WebP** (trừ 10 ảnh máy móc/kết quả cũ hơn ở JPG và 1 logo PNG có nền trong suốt) — không phát hiện SVG hay AVIF.

## Homepage

Trang `/` có 34 image reference (sau khi loại icon hệ thống):

| Vai trò | File gốc | Alt text |
|---|---|---|
| hero | `banner-desktop-ve-sinh-cong-nghiep-ha-noi-cleanhanoi.webp` | Dịch vụ vệ sinh công nghiệp Hà Nội CleanHanoi |
| logo/icon + og:image | `cropped-logo-cleanhanoi-ve-sinh-cong-nghiep-ha-noi.png` | CleanHanoi - Vệ sinh công nghiệp Hà Nội |
| service card ×11 | `dich-vu-cha-san-cong-nghiep-ha-noi-cleanhanoi.webp`, `dich-vu-giat-dem-tai-nha.webp`, `dich-vu-giat-tham.webp`, `dich-vu-thau-rua-be-nuoc-ngam-ha-noi-cleanhanoi.webp`, `giat-ghe-sofa-tai-nha-ha-noi-cleanhanoi.webp`, `ve-sinh-nha-cua.webp`, `ve-sinh-nha-xuong.webp`, `ve-sinh-sau-xay-dung.webp`, `ve-sinh-van-phong.webp`, `dich-vu-giat-tham-van-phong-ha-noi-cleanhanoi.webp`, `dich-vu-lau-kinh.webp`, `giat-ghe-van-phong.webp` | mỗi ảnh = 1 dịch vụ trong lưới dịch vụ trang chủ |
| team | `doi-thi-cong-ve-sinh-cong-nghiep-ha-noi-cleanhanoi.webp` | Đội thi công vệ sinh công nghiệp tại Hà Nội CleanHanoi |
| equipment ×4 | `dung-cu-ve-sinh-cong-nghiep.jpg`, `hoa-chat-ve-sinh-cong-nghiep.jpg`, `may-cha-san-cong-nghiep.jpg`, `may-hut-bui-cong-suat-lon.jpg`, `may-phun-hut-giat-tham.jpg` | khối "thiết bị/hoá chất chuyên dụng" |
| testimonial ×3 | `dai-dien-nha-xuong-long-bien.webp`, `khach-can-ho-cau-giay-1.webp`, `quan-ly-van-phong-nam-tu-liem.webp` | ảnh khách hàng kèm đánh giá |
| before/after | `sau-khi-tay-keo-lot-tham.webp` | Bề mặt sàn sau khi CleanHanoi xử lý keo lót thảm |
| blog (widget "bài viết liên quan" cuối trang) ×9 | `dich-vu-ve-sinh-biet-thu-ha-noi-cleanhanoi.webp`, `giat-dem-ha-dong-300x180.webp`, `giat-dem-nam-tu-liem-300x180.webp`, `ve-sinh-cong-nghiep-bac-giang-300x180.webp`, `ve-sinh-cong-nghiep-vinh-phuc-300x180.webp`, `giat-tham-cong-nghiep.webp`, `lot-tham-tay-keo-van-phong-ha-noi.webp`, `ve-sinh-cong-nghiep-nha-chung-cu.webp`, `ve-sinh-cong-nghiep-nha-xuong.webp`, `ve-sinh-cong-nghiep-van-phong.webp` | thumbnail bài cẩm nang gợi ý |

**Cấu trúc trang chủ suy ra:** Hero (1 banner lớn) → Lưới dịch vụ (12 thẻ, ảnh 1024×614 tỉ lệ ~5:3) → Đội ngũ thi công (1 ảnh) → Thiết bị/hoá chất (5 ảnh vuông-ish) → Đánh giá khách hàng (3 ảnh chân dung/hiện trường) → Trước/sau (1 ảnh minh hoạ) → Bài viết liên quan (9-10 thumbnail 300×180).

## Services

42 trang dịch vụ được quét (không tính trang hub `/dich-vu/` và các trang phân trang). Mỗi trang dịch vụ dùng khuôn mẫu: **1 ảnh minh hoạ mở đầu (content, 1024×614)** + **1–2 ảnh "trước khi" / "quy trình"/"kết quả sau"** riêng cho dịch vụ đó (không dùng chung với trang khác). Danh sách 2 ảnh đặc trưng nhất mỗi trang:

| Slug dịch vụ | Ảnh đặc trưng #1 | Ảnh đặc trưng #2 |
|---|---|---|
| ve-sinh-san-pickleball | cac-loai-san-the-thao-nhan-ve-sinh | may-ap-luc-cao-ve-sinh-san-pickleball |
| ve-sinh-ghe-o-to | giat-ghe-ni-vai-o-to-tai-nha | khu-vuc-ve-sinh-ghe-o-to-tai-ha-noi |
| giat-dem-cao-su | dem-cao-su-cu-nen-giat-hay-phuc-hoi | phuc-hoi-dem-cao-su-chai-san-tham-den |
| ve-sinh-sofa-ni-vai | cac-loai-sofa-ni-vai-nhan-ve-sinh | kiem-tra-sofa-ni-vai-truoc-khi-lam-sach |
| giat-chan-ga-goi-dem | cac-hang-muc-giat-chan-ga-goi-dem | kiem-tra-dong-goi-chan-ga-goi-sau-khi-giat |
| dich-vu-tay-moc-tuong-tran-nha | kiem-tra-be-mat-truoc-khi-tay-moc | nguyen-nhan-tuong-tran-nha-bi-moc |
| hanoi-mattress-cleaning-service (EN) | mattress-cleaning-extraction-equipment | mattress-drying-after-cleaning |
| hanoi-sofa-cleaning-service (EN) | professional-sofa-cleaning-process | sofa-cleaning-before-after-hanoi-1 |
| korean-home-carpet-cleaning-hanoi (KR) | (ảnh tên tiếng Hàn — thảm) | (ảnh tên tiếng Hàn — hút ẩm) |
| korean-mattress-cleaning-hanoi (KR) | mattress-cleaning-before-after-hanoi | mattress-cleaning-final-inspection-hanoi |
| korean-sofa-cleaning-hanoi (KR) | sofa-cleaning-before-after-hanoi | sofa-cleaning-process-hanoi |
| hanoi-house-cleaning-service (EN) | house-cleaning-booking-process-hanoi | house-cleaning-final-inspection-hanoi |
| korean-house-cleaning-hanoi (KR) | cleanhanoi-house-cleaning-process | house-cleaning-inspection-hanoi |
| tay-keo-dan-tham | gui-anh-nen-sau-khi-lot-tham-de-bao-gia-tay-keo | ket-qua-truoc-sau-tay-keo-dan-tham-tren-san |
| ve-sinh-nha-don-tet | cat-do-gia-tri-do-de-vo-truoc-khi-thue-don-nha-tet | gui-anh-hien-trang-dat-lich-don-nha-tet-som |
| quet-mang-nhen-nha-xuong | che-chan-hang-hoa-truoc-khi-quet-mang-nhen | doi-quet-mang-nhen-nha-xuong-chuyen-nghiep |
| giat-topper | cac-loai-topper-can-ve-sinh-dung-cach | gui-anh-topper-bao-gia-giat-topper |
| giat-rem | cac-loai-rem-cua-cleanhanoi-nhan-giat-ve-sinh | giat-rem-tai-nha-thao-giat-ve-sinh-tai-cho |
| ve-sinh-mai-ton-nha-xuong | an-toan-khi-ve-sinh-mai-ton-nha-xuong | gui-anh-hien-trang-bao-gia-ve-sinh-mai-ton-nha-xuong |
| danh-bong-san-be-tong | gui-anh-hien-trang-bao-gia-danh-bong-san-be-tong | khi-nao-nen-danh-bong-san-be-tong |
| ve-sinh-can-ho-chung-cu | hang-muc-ve-sinh-can-ho-bep-wc-ban-cong-ray-cua | kiem-tra-ban-giao-ve-sinh-can-ho-chung-cu |
| ve-sinh-bep-cong-nghiep | bep-cong-nghiep-bam-dau-mo-can-ve-sinh | bep-cong-nghiep-sach-sau-ve-sinh-cleanhanoi |
| thau-rua-be-nuoc-ngam | be-nuoc-ngam-co-can-bun-lang | be-nuoc-sach-sau-khi-thau-rua-cleanhanoi |
| ve-sinh-toa-nha | ve-sinh-sanh-toa-nha | ve-sinh-thang-may-toa-nha |
| danh-bong-san-go | kiem-tra-be-mat-san-go-truoc-khi-danh-bong | phu-bong-bao-duong-san-go |
| danh-bong-san-da | danh-bong-cau-thang-sanh-hanh-lang-da | kiem-tra-be-mat-san-da-truoc-khi-danh-bong |
| mai-san-be-tong | hut-bui-sau-khi-mai-san-be-tong | mai-boc-son-keo-lop-phu-cu-san-be-tong |
| ve-sinh-biet-thu | biet-thu-sach-sau-khi-ve-sinh-cleanhanoi | ve-sinh-bep-biet-thu |
| dich-vu-cha-san | cac-loai-san-co-the-cha-rua-bang-may | cha-san-bang-may-chuyen-dung |
| don-nha-theo-gio | dich-vu-don-nha-theo-gio-ha-noi-cleanhanoi | don-bep-rua-bat-theo-gio |
| ve-sinh-sofa-da | dau-hieu-can-ve-sinh-sofa-da | dich-vu-ve-sinh-sofa-da-ha-noi |
| giat-ghe-van-phong | dich-vu-giat-ghe-van-phong-ha-noi-cleanhanoi | ghe-van-phong-ban-can-ve-sinh |
| giat-tham-van-phong | giat-tham-khu-lam-viec-phong-hop | giat-tham-van-phong-tai-ha-noi |
| cung-cap-tap-vu | dich-vu-cung-cap-tap-vu-ha-noi-cleanhanoi | doi-ngu-tap-vu-cleanhanoi-ha-noi |
| dich-vu-lau-kinh | dich-vu-lau-kinh-ha-noi | lau-kinh-van-phong-toa-nha-ha-noi |
| giat-dem | dem-sach-sau-khi-giat-cleanhanoi (.jpg) | dich-vu-giat-dem-tai-nha-ha-noi-cleanhanoi (.jpg) |
| giat-ghe-sofa | cac-loai-sofa-cleanhanoi-nhan-ve-sinh | ghe-sofa-sach-sau-khi-giat-cleanhanoi |
| ve-sinh-nha-cua | hang-muc-ve-sinh-nha-cua-ha-noi | ket-qua-tong-ve-sinh-nha-cua-cleanhanoi |
| giat-tham | cac-loai-tham-pho-bien-cleanhanoi-nhan-giat | giat-va-hut-nuoc-ban-tren-tham |
| ve-sinh-van-phong | Cleanhanoi-ve-sinh-van-phong-247 | hang-muc-ve-sinh-van-phong-cleanhanoi |
| ve-sinh-sau-xay-dung | cac-hang-muc-ve-sinh-sau-xay-dung | khi-nao-can-ve-sinh-sau-xay-dung |
| ve-sinh-nha-xuong | dich-vu-ve-sinh-nha-xuong-ha-noi | luu-y-ve-sinh-nha-xuong-an-toan |

*(9 trang song ngữ Anh/Hàn — `hanoi-*-service`, `korean-*-hanoi` — dùng lại đúng khuôn hình nhưng là bộ ảnh riêng, phục vụ khách quốc tế; không cần nhân bản cho Dọn Nè trừ khi có kế hoạch đa ngôn ngữ.)*

## Equipment

23 ảnh máy móc/dụng cụ/hoá chất, xuất hiện ở trang chủ và các trang dịch vụ liên quan:

| File | Mô tả (alt) |
|---|---|
| may-cha-san-cong-nghiep.jpg | Máy chà sàn công nghiệp CleanHanoi sử dụng |
| may-hut-bui-cong-suat-lon.jpg | Máy hút bụi công suất lớn trong vệ sinh công nghiệp |
| may-phun-hut-giat-tham.jpg | Máy phun hút giặt thảm và ghế văn phòng |
| dung-cu-ve-sinh-cong-nghiep.jpg | Dụng cụ vệ sinh công nghiệp CleanHanoi |
| hoa-chat-ve-sinh-cong-nghiep.jpg | Hóa chất vệ sinh công nghiệp phù hợp từng bề mặt |
| may-cha-san-300x180.webp | Tổng quan các loại máy chà sàn phổ biến |
| may-ap-luc-cao-ve-sinh-san-pickleball.webp | Kiểm soát áp lực nước khi vệ sinh mặt sân pickleball |
| may-moc-dung-cu-giat-ghe-sofa.webp | Máy phun hút, bàn chải mềm và dụng cụ vệ sinh ghế sofa |
| may-moc-hoa-chat-cha-san.webp | Máy móc hóa chất chà sàn công nghiệp |
| thiet-bi-lau-kinh-an-toan.webp | Bộ dụng cụ lau kính: cây gạt, khăn, xô dung dịch, dụng cụ nối dài, đồ bảo hộ |
| thiet-bi-dung-cu-ve-sinh-sau-xay-dung.webp | Thiết bị/dụng cụ chọn theo loại sàn, kính, mức độ bụi |
| mattress-cleaning-extraction-equipment.webp | Thiết bị giặt đệm chuyên dụng (hút ẩm/dung dịch) |
| sofa-cleaning-extraction-equipment.webp | Dụng cụ bọc đệm chuyên dụng cho giặt sofa |
| cac-loai-san-co-the-cha-rua-bang-may.webp | Các loại sàn có thể chà rửa bằng máy |
| cha-san-bang-may-chuyen-dung.webp | Quá trình chà sàn bằng máy chuyên dụng |
| mai-san-be-tong-bang-may-chuyen-dung.webp | Quá trình mài sàn bê tông bằng máy mài chuyên dụng |
| quy-trinh-danh-bong-san-da-bang-may.webp | Quy trình đánh bóng sàn đá bằng máy |
| quy-trinh-danh-bong-san-go-bang-may.webp | Quy trình đánh bóng sàn gỗ bằng máy |
| quy-trinh-giat-dem-bang-may-phun-hut.jpg | Quy trình giặt đệm bằng máy phun hút |
| quy-trinh-giat-ghe-van-phong-bang-may.webp | Quy trình giặt ghế văn phòng bằng máy phun hút |
| quy-trinh-giat-tham-van-phong-bang-may.webp | Quy trình giặt thảm văn phòng bằng máy chuyên dụng |
| ve-sinh-san-nha-xuong-bang-may-cha-san-cleanhanoi.webp | Vệ sinh sàn nhà xưởng bằng máy chà sàn công nghiệp |
| ve-sinh-thang-may-toa-nha.webp | Nhân viên vệ sinh thang máy toà nhà |

**Suy luận thiết bị Dọn Nè cần chụp:** máy chà sàn công nghiệp, máy hút bụi công suất lớn, máy phun-hút giặt thảm/sofa/đệm, máy mài/đánh bóng sàn đá-gỗ-bê tông, bộ dụng cụ lau kính, bộ hoá chất chuyên dụng theo bề mặt, đồ bảo hộ thi công.

## Real Projects

18 ảnh (14 project/gallery + 4 team):

| File | Mô tả |
|---|---|
| hinh-anh-thi-cong-giat-ghe-sofa-da-tai-nha.webp | Thi công giặt ghế sofa da tại nhà |
| hinh-anh-thi-cong-giat-ghe-sofa-nhung-tai-nha.webp | Thi công giặt ghế sofa nhung tại nhà |
| hinh-anh-thi-cong-giat-sofa-ni-tai-nha.webp | Thi công giặt sofa nỉ tại nhà |
| hinh-anh-thi-cong-giat-sofa-vai-tai-nha.webp | Thi công giặt sofa vải tại nhà |
| hinh-anh-thi-cong-giat-tham-cong-nghiep-cleanhanoi.webp | Thi công giặt thảm công nghiệp |
| hinh-anh-thi-cong-giat-tham-phong-khach.webp | Thi công giặt thảm phòng khách |
| hinh-anh-thi-cong-giat-tham-tai-cong-ty-LG.webp | Thi công giặt thảm tại công ty LG (khách hàng thực tế) |
| hinh-anh-thi-cong-giat-tham-tai-huyndai-ha-noi.webp | Thi công giặt thảm tại Hyundai Hà Nội (khách hàng thực tế) |
| hinh-anh-thi-cong-giat-tham-thuc-te-tai-ha-noi.webp | Thi công giặt thảm thực tế tại Hà Nội |
| hinh-anh-thi-cong-giat-tham-trai-san-tai-mixue-viet-nam.webp | Thi công giặt thảm tại Mixue Việt Nam (khách hàng thực tế) |
| thi-cong-giat-ghe-sofa-quan-karaok-tai-ha-noi.webp | Thi công giặt sofa quán karaoke |
| thi-cong-giat-tham-hoi-truong.webp | Thi công giặt thảm hội trường |
| thi-cong-giat-tham-tai-hoc-vien-nong-nghiep.webp | Thi công giặt thảm tại Học viện Nông nghiệp (khách hàng thực tế) |
| cong-trinh-phu-hop-danh-bong-san-be-tong.webp | Minh hoạ nhóm công trình phù hợp đánh bóng sàn bê tông |
| doi-thi-cong-ve-sinh-cong-nghiep-ha-noi-cleanhanoi(-1).webp | Đội thi công vệ sinh công nghiệp (×2 ảnh) |
| cong-viec-nhan-vien-tap-vu-hang-ngay.webp | Công việc hằng ngày của nhân viên tạp vụ |
| nhan-vien-giup-viec-theo-gio-ha-noi.webp | Nhân viên giúp việc theo giờ |

Ghi chú: CleanHanoi có nhiều ảnh "thi công thực tế tại khách hàng B2B nêu tên" (LG, Hyundai, Mixue, Học viện Nông nghiệp) — hiệu quả tin cậy cao nhưng **không thể tái sử dụng cho Dọn Nè** (thương hiệu/khách hàng của đối thủ). Dọn Nè cần tự chụp công trình thật của mình.

## Before / After

36 ảnh liên quan trước/sau. Phần lớn là **ảnh đơn** minh hoạ một bước quy trình ("trước khi…", "sau khi…"), không phải file cặp before+after tách riêng; một số ít là **ảnh so sánh ghép sẵn** trong cùng 1 file (theo alt text mô tả "so sánh... trước và sau... cùng góc chụp"):

**Ảnh so sánh ghép (before+after trong 1 file):**
- `mattress-cleaning-before-after-hanoi.webp`
- `sofa-cleaning-before-after-hanoi.webp`, `sofa-cleaning-before-after-hanoi-1.webp`
- `ket-qua-truoc-sau-tay-keo-dan-tham-tren-san.webp`
- `truoc-sau-khi-tay-moc-tuong-tran-nha.webp`
- `truoc-sau-khi-ve-sinh-sofa-ni-vai.webp`
- `truoc-sau-ve-sinh-san-pickleball.webp`

**Ảnh "trước" / "sau" riêng lẻ theo từng bước quy trình** (phần còn lại trong 36 ảnh, ví dụ: `kiem-tra-be-mat-san-da-truoc-khi-danh-bong`, `san-da-sang-bong-sau-khi-danh-bong-cleanhanoi`, `hut-bui-kho-truoc-khi-giat-tham`, `kiem-tra-tham-sau-khi-giat-cleanhanoi`, `vet-ban-va-bui-tren-tham-truoc-khi-giat`, `tham-van-phong-sach-sau-khi-giat-cleanhanoi`, v.v. — danh sách đầy đủ trong `asset-inventory.json`, nhóm `before/after`).

**Khuyến nghị cho Dọn Nè:** dùng mẫu **ảnh so sánh ghép cạnh-nhau (trước | sau), cùng góc máy, cùng ánh sáng** — dễ tin cậy hơn 2 ảnh rời rạc, và là định dạng chủ đạo CleanHanoi dùng cho các dịch vụ giá trị cao (giặt đệm, sofa, sàn đá/gỗ, tẩy keo thảm).

## Blog / Cẩm nang

Trang hub `/cam-nang-ve-sinh/` hiển thị 11 bài viết với ảnh đại diện 300×180 (tỉ lệ 5:3):

| File | Tiêu đề bài viết (suy từ alt) |
|---|---|
| ve-sinh-cong-nghiep-bac-giang.webp | Top 5 đơn vị vệ sinh công nghiệp Bắc Giang |
| ve-sinh-cong-nghiep-vinh-phuc.webp | Top 5 dịch vụ vệ sinh công nghiệp Vĩnh Phúc |
| baking-soda-la-gi.webp | Baking soda là gì, dùng vệ sinh nhà cửa |
| hcl-la-gi-trong-ve-sinh-cong-nghiep.webp | HCl là gì trong vệ sinh công nghiệp |
| ve-sinh-nem-bang-baking-soda.webp | Cách vệ sinh nệm bằng baking soda tại nhà |
| ve-sinh-tham-bang-baking-soda.webp | Cách vệ sinh thảm bằng baking soda tại nhà |
| cach-tay-muc-tren-sofa-da-ni-vai.webp | Cách tẩy mực trên sofa da/nỉ/vải tại nhà |
| cach-lam-nha-ve-sinh-luon-thom-sach-mui.webp | Cách làm nhà vệ sinh luôn thơm sạch mùi |
| dich-vu-ve-sinh-bon-nuoc-inox-bon-nhua-tai-ha-noi.webp | Vệ sinh bồn nước inox/nhựa |
| quy-trinh-ve-sinh-nha-xuong-chuyen-nghiep.webp | Quy trình vệ sinh nhà xưởng chuyên nghiệp |
| cach-ve-sinh-san-nhua-gia-go-san-vinyl.webp | Cách vệ sinh sàn nhựa giả gỗ / sàn vinyl |

Ngoài ra, một widget "bài viết liên quan" (thumbnail 300×180, cùng khuôn hình) được nhúng ở cuối gần như **mọi trang** trong site (kể cả các trang dịch vụ) — tổng 76 tham chiếu ảnh `blog` trên 54 trang, trỏ về ~15–20 bài viết cẩm nang khác nhau.

## Reusable Assets

Các ảnh dùng lặp lại nhiều nơi (logo + ảnh lưới dịch vụ trang chủ, đồng thời cũng được set làm `og:image` mặc định và tái sử dụng trong widget bài-viết-liên-quan):

| File | Số trang dùng | Vai trò |
|---|---|---|
| cropped-logo-cleanhanoi-ve-sinh-cong-nghiep-ha-noi.png | 54/54 | Logo header + favicon + og:image mặc định |
| dich-vu-cha-san-cong-nghiep-ha-noi-cleanhanoi.webp | 44 | Service card + og:image + blog widget |
| dich-vu-giat-dem-tai-nha.webp | 44 | nt |
| dich-vu-giat-tham.webp | 44 | nt |
| dich-vu-thau-rua-be-nuoc-ngam-ha-noi-cleanhanoi.webp | 44 | nt |
| giat-ghe-sofa-tai-nha-ha-noi-cleanhanoi.webp | 44 | nt |
| ve-sinh-nha-cua.webp | 44 | nt |
| ve-sinh-nha-xuong.webp | 44 | nt |
| ve-sinh-sau-xay-dung.webp | 44 | nt |
| ve-sinh-van-phong.webp | 44 | nt |
| dich-vu-danh-bong-san-da-ha-noi-cleanhanoi.webp | 43 | og:image + blog widget |
| dich-vu-danh-bong-san-go-ha-noi-cleanhanoi.webp | 43 | nt |
| don-nha-theo-gio-ha-noi.webp | 43 | nt |
| giat-dem-cao-su-tai-nha-ha-noi.webp | 43 | nt |
| ve-sinh-ghe-o-to-tai-nha-ha-noi.webp | 43 | nt |
| ve-sinh-san-pickleball-ha-noi.webp | 43 | nt |
| ve-sinh-sofa-ni-vai-sach-sau.webp | 43 | nt |

**Bài học kiến trúc cho Dọn Nè:** mỗi dịch vụ chỉ cần **1 ảnh đại diện chất lượng cao (1024×614, tỉ lệ ~5:3)**; ảnh đó tái dùng làm service-card trang chủ, thumbnail trang danh mục, OG-image mặc định và ảnh gợi ý "dịch vụ liên quan" — không cần chụp/generate ảnh riêng cho mỗi vị trí hiển thị.

---

## Recommended Dọn Nè Image Set

Bộ ảnh **tối thiểu** Dọn Nè cần tạo cho V1, suy ra từ cấu trúc CleanHanoi ở trên, ánh xạ vào kiến trúc CMS hiện có của Dọn Nè (9 loại `SectionData` trên trang chủ + trang `/dich-vu`, `/bang-gia`, `/[slug]`). Tất cả ảnh tham chiếu CleanHanoi phía trên đều `REFERENCE_ONLY` — không dùng trực tiếp.

### Homepage / Hero
**DN-HERO-01** — REFERENCE_ONLY nguồn cảm hứng: `banner-desktop-ve-sinh-cong-nghiep-ha-noi-cleanhanoi.webp`
- Mục đích: ảnh banner Hero section trang chủ (`SectionData.type: 'Hero'`)
- Tỷ lệ khung hình: 21:9 (desktop) hoặc 16:9 (fallback mobile)
- Kích thước đề xuất: 1920×823px (desktop), nén WebP < 250KB
- Nội dung cần có: nhân viên Dọn Nè đang thao tác thực tế (lau kính/chà sàn), đồng phục có logo, không gian sáng sạch, có thể overlay text
- Trang sử dụng: `/` (Hero section)

### Services (mỗi dịch vụ chính 1 ảnh)
**DN-SERVICE-01 … DN-SERVICE-N** (N = số dịch vụ đang publish trong `Service` — hiện ~10+ theo 5 category: Nhà ở & Dân dụng, Doanh nghiệp & Xây dựng, Giặt & Nội thất, Sàn & Lau kính, Dịch vụ chuyên sâu)
- Mục đích: service card trang chủ (`ServiceGrid`), thumbnail `/dich-vu`, ảnh đại diện `/[slug]`, OG-image mặc định của trang dịch vụ
- Tỷ lệ khung hình: 5:3 (khớp mẫu `1024×614` của CleanHanoi)
- Kích thước đề xuất: 1200×720px, WebP
- Nội dung cần có: nhân viên/thiết bị Dọn Nè đang thực hiện đúng dịch vụ đó (vd: tổng vệ sinh nhà cửa, vệ sinh sau xây dựng, vệ sinh văn phòng, giặt sofa/đệm) — 1 ảnh dùng chung cho mọi vị trí hiển thị của dịch vụ đó
- Trang sử dụng: `/`, `/dich-vu`, `/[slug]` tương ứng

### Equipment
**DN-EQUIPMENT-01 … 05**
1. Máy chà sàn công nghiệp
2. Máy hút bụi công suất lớn / 3 mô-tơ
3. Máy phun-hút giặt thảm/sofa/đệm
4. Bộ dụng cụ lau kính chuyên dụng (cây gạt, khăn, thang, đai an toàn)
5. Hoá chất/dụng cụ vệ sinh theo bề mặt
- Mục đích: khối "Thiết bị chuyên dụng" (có thể gắn vào section `Trust`/`Process` hoặc trang giới thiệu)
- Tỷ lệ khung hình: 1:1 hoặc 4:3
- Kích thước đề xuất: 800×800px (1:1) hoặc 800×600px (4:3), WebP
- Nội dung cần có: cận cảnh thiết bị thật của Dọn Nè, nền sạch/trung tính, có thể kèm tay người đang thao tác
- Trang sử dụng: `/` (Trust/Process section), trang giới thiệu nếu có

### Real Projects
**DN-PROJECT-01 … 04**
- Mục đích: khối công trình thực tế đã thi công (chưa có section riêng trong CMS hiện tại — đề xuất bổ sung dạng ảnh trong `ImageText` section khi triển khai, hoặc dùng tạm trong `BeforeAfter`)
- Tỷ lệ khung hình: 4:3
- Kích thước đề xuất: 1200×900px, WebP
- Nội dung cần có: ảnh thi công thật tại công trình Dọn Nè (nhà dân, văn phòng, nhà xưởng) — **không dùng lại ảnh có tên thương hiệu khách hàng của CleanHanoi**
- Trang sử dụng: `/` (Trust section) hoặc trang dịch vụ liên quan

### Before / After
**DN-BEFORE-01 / DN-AFTER-01 … 04** (4 cặp, ghép thành 4 ảnh so sánh cạnh-nhau)
1. Sofa/ghế trước và sau khi giặt
2. Đệm trước và sau khi giặt
3. Sàn (đá/gỗ/bê tông) trước và sau khi đánh bóng/chà
4. Thảm trước và sau khi giặt/tẩy keo
- Mục đích: `BeforeAfter` section trang chủ — thay `BeforeAfterSlider.tsx` hiện đang dùng text mô tả không có ảnh thật
- Tỷ lệ khung hình: 1:1 mỗi nửa (ghép thành 2:1 cho ảnh đôi) hoặc 4:3 mỗi nửa
- Kích thước đề xuất: mỗi nửa 800×800px, ảnh ghép cuối 1600×800px, WebP
- Nội dung cần có: cùng góc máy, cùng ánh sáng, cùng vị trí — chụp "trước" ngay khi khảo sát và "sau" ngay khi nghiệm thu
- Trang sử dụng: `/` (BeforeAfter section)

### Team / Trust
**DN-TEAM-01**
- Mục đích: ảnh đội ngũ thi công cho khối "Vì sao chọn Dọn Nè" (`Trust` section)
- Tỷ lệ khung hình: 5:3
- Kích thước đề xuất: 1200×720px, WebP
- Nội dung cần có: đội thi công Dọn Nè mặc đồng phục, đứng cùng thiết bị, tại một công trình thật
- Trang sử dụng: `/` (Trust section)

**Tổng cộng bộ ảnh tối thiểu đề xuất: 1 Hero + ~10 Service + 5 Equipment + 4 Project + 4 cặp Before/After (8 ảnh thành phần) + 1 Team ≈ 29 ảnh gốc**, đủ để phủ toàn bộ vị trí hiển thị hiện có trong CMS Dọn Nè (Hero, ServiceGrid, Trust, BeforeAfter, cùng thumbnail `/dich-vu` và `/[slug]`) mà không cần Media/upload pipeline (đã xác định là AFTER V1 trong Step 8 planning) — ảnh có thể nạp qua URL tĩnh trong `public/` hoặc CDN ngoài cho tới khi tính năng upload được xây dựng.
