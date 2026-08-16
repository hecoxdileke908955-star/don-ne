# Current vs Reference Gap — Dọn Nè (trước/sau rebuild này)

Trạng thái ghi nhận: **sau khi thực hiện rebuild trong lượt này**. Cột "Trước" mô tả trạng thái Dọn Nè trước lượt này; cột "Sau" mô tả trạng thái ngay sau rebuild.

## GLOBAL

| Hạng mục | Reference | Trước | Sau | Trạng thái |
|---|---|---|---|---|
| Nav chính | 7 mục (Trang chủ/Dịch vụ▼/Bảng giá/Khu vực/Cẩm nang/Giới thiệu/Liên hệ) | 2 mục (Dịch vụ, Bảng giá) | 7 mục đúng thứ tự, dropdown Dịch vụ live từ DB | ĐÃ SỬA |
| CTA header | 1 pill "Gọi/Zalo" | Nút điện thoại + nút "Nhận Báo Giá" | 1 pill "Gọi / Zalo" (dùng số Dọn Nè thật) | ĐÃ SỬA |
| Floating desktop widget | Card 245px, Gọi+Zalo | Không có | Có (`FloatingContactWidget.tsx`), dùng config thật | ĐÃ SỬA |
| Mobile sticky bar | 2 nút Gọi/Zalo | 3 nút Gọi/Zalo/Báo giá | Giữ nguyên 3 nút (không phá tính năng báo giá đang hoạt động tốt) | GIỮ NGUYÊN CÓ CHỦ ĐÍCH — tốt hơn reference, không gỡ bớt |
| Footer | 4 cột (Brand/Dịch vụ/Khu vực/Thông tin) | 4 cột nhưng cột 3 là "Trạm phục vụ" (địa chỉ chi nhánh), không phải danh sách khu vực | 4 cột đúng nhóm nội dung (Brand+social / Dịch vụ live / Khu vực / Thông tin+liên hệ) | ĐÃ SỬA |
| Card radius | service-card 24px, post-card 20px | `rounded-card` = 12px dùng chung mọi nơi | Override `rounded-[24px]`/`rounded-[20px]` đúng ngữ cảnh, không đổi token `rounded-card` toàn cục | ĐÃ SỬA (cục bộ) |
| Button pill | `border-radius:999px` | Đã dùng `rounded-ctrl` (8px) cho nút chính | Header CTA đổi sang pill thật; các nút khác giữ nguyên `rounded-ctrl` hiện có của Dọn Nè | MỘT PHẦN — chỉ đổi nơi ảnh hưởng trực tiếp header/CTA mới thêm |

## HOME — section order

| # | Reference | Dọn Nè hiện tại (CMS-driven, admin có thể đổi order) |
|---|---|---|
| 1 | Hero | Hero ✓ |
| 2 | ServiceGrid | ServiceGrid ✓ |
| 3 | Intro | **THIẾU** |
| 4 | PricingPreview | PricingPreview ✓ (vị trí theo `sortOrder` CMS, admin-controlled) |
| 5 | Trust/Why | Trust ✓ |
| 6 | Equipment (section riêng) | Nằm lồng trong `ProcessSection.tsx` (không phải section CMS độc lập) |
| 7 | Process | Process ✓ |
| 8 | RealWork (gallery công trình) | **THIẾU** |
| 9 | Reviews (testimonial) | **THIẾU** |
| 10 | ServiceAreas | ServiceAreas ✓ |
| 11 | FAQ | FAQ ✓ |
| 12 | Final CTA | CTA ✓ |
| — | (không có) | BeforeAfter — Dọn Nè có, reference không có ở homepage |

**Vì sao Intro/RealWork/Reviews chưa xây**: 3 section này không có trong 9 `SectionType` hiện tại của Page CMS (`src/lib/section-schema.ts`). Thêm type mới vào enum là thay đổi TS hợp lệ (không phải migration Prisma), nhưng để một section MỚI thực sự xuất hiện cần một `PageSection` row mới trong DB — DB hiện tại chỉ có 9 row do `prisma/seed.ts` tạo, và nhiệm vụ này **cấm sửa seed**. Không có cơ chế "tạo section mới" trong Admin UI (Step 8A chỉ cho phép *sửa* section có sẵn). Xây 3 khối tĩnh chèn cứng ngoài CMS là khả thi nhưng rủi ro chất lượng thấp nếu làm vội — quyết định: không làm giả, ghi nhận là gap thật, ưu tiên các hạng mục có bằng chứng/tài nguyên đầy đủ hơn (header, footer, /dich-vu, service detail, floating widget, 6 trang mới).

**Vì sao Equipment lồng trong Process thay vì đứng riêng**: xuất phát từ một yêu cầu ở lượt làm việc trước (thêm ảnh thiết bị vào section "phù hợp nhất đang nói về quy trình"). Đúng vị trí tương đối (sau Why/Trust) nhưng chưa tách thành section CSS riêng biệt như reference. Rủi ro khi tách: phải chèn tĩnh giữa 2 section CMS có `sortOrder` do admin toàn quyền sắp xếp — cùng giới hạn kỹ thuật như trên.

## DỊCH VỤ ARCHIVE

| Hạng mục | Trước | Sau |
|---|---|---|
| Layout | Nhóm theo category, card text-only trong khung lớn | Grid card ảnh-trên-chữ-dưới, 1/2/3/4 cột theo viewport, hover nâng nhẹ |
| Ảnh | Không có | Dùng `SERVICE_IMAGES` (đã refactor ra `src/lib/service-images.ts` dùng chung Header/ServiceGrid/dich-vu/[slug]) |
| Meta | Không có | Ngày cập nhật thật từ `Service.createdAt` |

## SERVICE DETAIL

| Hạng mục | Trước | Sau |
|---|---|---|
| Layout | 1 cột, chỉ có mô tả ngắn + bảng giá | 2 cột: content (breadcrumb, ảnh, whenNeeded/includedItems/excludedItems/processSteps/commitments — toàn bộ field thật từ `Service`, không hard-code) + sidebar (dịch vụ liên quan cùng category, form CTA) |
| FAQ | — | Không thêm (Dọn Nè chưa có FAQ theo từng dịch vụ, chỉ có FAQ global — không bịa) |

## KHU VỰC / CẨM NANG

STATIC TEMPORARY cả hai (đúng như hướng dẫn — không tạo migration Location/Article CMS):
- `/khu-vuc-phuc-vu`: grid 12 quận/huyện thật (khớp dữ liệu `Location` đã seed trước đó dù chưa có Location CMS public), không link tới trang combo dịch-vụ+quận giả (reference có 227 bài viết dạng này — Dọn Nè không bịa).
- `/cam-nang-ve-sinh`: empty-state trung thực (Dọn Nè chưa có bài viết nào) — dùng đúng pattern "trạng thái rỗng" mà reference cũng có sẵn cho category rỗng, không bịa bài viết.

## GIỚI THIỆU / LIÊN HỆ / POLICY

Toàn bộ **DB-BACKED cho phần liên hệ** (số điện thoại, Zalo, email, địa chỉ đọc từ `GlobalSetting` qua `useSiteConfig()`), nội dung tường thuật (giới thiệu công ty, chính sách) là **văn bản gốc Dọn Nè**, không copy CleanHanoi.

## Những gì NÊN GIỮ NGUYÊN vì Dọn Nè đã tốt hơn reference

- Page/Section CMS + Draft/Preview/Publish (Step 8A) — reference là WordPress tĩnh, không có concept này.
- FAQ CMS quản trị được (Step 8B) — reference FAQ là nội dung tĩnh trong theme.
- Pricing single-source-of-truth — reference không công khai cơ chế đồng bộ giá.
- RBAC/Admin/Users/CSRF/rate-limit — không có gì tương đương ở reference (WordPress + plugin).
- MobileStickyBar 3 nút (thêm nút Báo giá) — chuyển đổi tốt hơn bản 2 nút của reference.

## Gap còn lại sau lượt này (chưa xử lý)

1. Homepage thiếu 3 section: Intro, RealWork (gallery), Reviews (testimonial) — lý do kỹ thuật đã nêu ở trên.
2. Equipment là block lồng trong Process, chưa tách section riêng đúng vị trí tuyệt đối.
3. 41/54 URL dịch vụ reference chưa được audit từng URL riêng lẻ (suy luận từ 3 mẫu đại diện).
4. Không có screenshot pixel-by-pixel thực tế (xem `visual-parity-report.md`).
5. Location×Service combo landing pages (227 bài viết dạng này trên reference) — cố ý không xây, vì sẽ cần Location CMS thật + nội dung SEO riêng cho từng cặp dịch-vụ/quận, ngoài phạm vi "V1 rebuild, không tạo migration lớn".
