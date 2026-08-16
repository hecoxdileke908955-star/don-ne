# Visual Parity Report (Round 4 — final parity implementation)

> **Round 4 kết luận nhanh**: homepage giờ có đủ 13 section (9 CMS + 4 static adapter: Intro/Equipment/VisualProof/Reviews), đúng thứ tự mục tiêu. Hero đã redesign thành khối card bo góc màu tối chứa badge+H1+CTA+ảnh, xác nhận bằng ảnh chụp thật ở 1440 và 375 — không còn khoảng trắng thừa dưới ảnh (một bug CSS thật được tìm và sửa giữa chừng: `next/image fill` + `height:100%` không resolve được trong grid/flex item chỉ có chiều cao từ `stretch`, phải chuyển sang `width`/`height` tường minh + `h-full`, xác nhận bằng `getBoundingClientRect()` trước/sau). Dropdown "Dịch Vụ" giờ mở được bằng bàn phím (`group-focus-within`), xác nhận bằng Playwright keyboard Tab test thật — không chỉ đọc code. `npm run build` PASS thật (nguyên nhân gốc của lỗi EPERM ở Round 2/3: chính server `next start` do phiên trước để sót đang giữ khoá file — xác nhận qua `Get-NetTCPConnection`/`Get-CimInstance`, dừng đúng process của repo, build lại PASS ngay). Chi tiết đầy đủ ở báo cáo hội thoại Round 4.

---

# Visual Parity Report (Round 3 — targeted fix + re-verify)

> **Cập nhật Round 3**: `dn-service-08.jpeg` đã được operator thay ảnh mới sau Round 2 — mở file trực tiếp bằng mắt, xác nhận: 2 nhân viên nam, mũ bảo hộ cam, dây đai an toàn (harness) với dây đai vàng rõ ràng gắn vào cáp neo, đứng trên nền tảng gondola có lan can kim loại, giày bảo hộ cổ cao. **RESOLVED** — đóng finding an toàn hình ảnh của Round 2.
>
> Round 3 review lại toàn bộ 8 file untracked source (`FloatingContactWidget.tsx`, `service-images.ts`, `khu-vuc-phuc-vu`, `cam-nang-ve-sinh`, `gioi-thieu`, `lien-he`, `chinh-sach-bao-mat`, `chinh-sach-bao-hanh`) line-by-line — không tìm thấy BLOCKER. 1 MINOR accessibility finding mới: dropdown "Dịch Vụ" trong `Header.tsx` chỉ mở bằng `group-hover` (CSS `:hover`), không có `focus-within`/`focus` fallback — người dùng bàn phím không mở được submenu bằng Tab, dù vẫn có thể Enter vào link "Dịch Vụ" để tới `/dich-vu` (không phải dead-end hoàn toàn). Chưa sửa trong Round 3 vì đây là hành vi có sẵn từ thiết kế `group-hover` gốc, không phải regression mới, và thời gian Round 3 ưu tiên các BLOCKER/IMPORTANT theo đúng phạm vi cho phép.
>
> Grep lại toàn bộ `src/`, `public/`, `next.config.js` cho `cleanhanoi|vesinhcongnghiephanoi|0355616583|cleanhnn|logo-original` → **0 kết quả** trong production source (chỉ xuất hiện hợp lệ trong `docs/reference-rebuild/`).
>
> `npm run lint` → 0 lỗi. `npm run test:unit` → 10/10 PASS. `npm run test:integration` (disposable Postgres thật, container mới `donne-round3-pg`, đã xoá sau khi test xong) → 1/1 PASS. `npx next build` (informational compile-check) → compiled + typechecked sạch, đủ 41 route kỳ vọng. **`npm run build` thật vẫn FAIL** do khoá file Windows `EPERM` trên `query_engine-windows.dll.node` — đã thử lại 3 lần, không tự giải quyết lần này (khác Round 1 nơi nó tự hết) — môi trường, không phải do thay đổi source (schema Prisma không đổi, `npx next build` dùng cùng client compile sạch). Ghi nhận trung thực: **KHÔNG được tính là `npm run build` PASS** theo đúng yêu cầu Phase 32.
>
> Không có file source nào bị sửa thêm trong Round 3 (không tìm thấy BLOCKER/IMPORTANT mới cần fix ngoài những gì đã đóng ở Round 2). `git diff --stat` / `git status --short` giữ nguyên y hệt Round 2 — xác nhận không mất file untracked, không có thay đổi ngoài ý muốn.

---

# Visual Parity Report (Round 2 — cập nhật, giữ nguyên làm baseline)

> Phương pháp Round 2: Playwright headless, 4 viewport bắt buộc (1440×900, 1024×768, 768×1024, 375×812), 8 trang × 2 site (reference thật + Dọn Nè `next build && next start` với disposable PostgreSQL đã seed) = **64 screenshot thật**, cộng theo dõi `page.on('console')`/`page.on('pageerror')` và kiểm tra `document.documentElement.scrollWidth` để bắt lỗi tràn ngang tự động trên toàn bộ 64 lần chụp — không chỉ đọc DOM tĩnh.

## Kết quả tự động (64/64 lần chụp)

- **Lỗi JS (`pageerror`)**: 0.
- **Console error không phải CSP**: 0.
- **Tràn ngang (horizontal overflow)**: 0/64 — không phát hiện ở bất kỳ trang × viewport nào.
- **Console error CSP inline-style**: xuất hiện ở mọi trang Dọn Nè, mọi viewport (đã xác nhận từ Step 7D là lỗi có sẵn toàn site, không phải regression của rebuild này — không liên quan các thay đổi trong diff).

## `/` (Homepage) — kiểm tra trực quan thật (1440 & 375)

| Hạng mục | 1440 | 375 | Ghi chú |
|---|---|---|---|
| HEADER | MATCH | MATCH | Logo trái, nav phải, hamburger đúng vị trí mobile |
| HERO | **MISMATCH (xác nhận lại bằng ảnh)** | **MISMATCH** | Reference: khối card nền xanh đậm bo góc lớn chứa badge+H1+2 mô tả+3 CTA pill nhỏ, cả desktop và mobile. Dọn Nè: nền trắng phẳng, H1 đen gạch chân, 2 CTA + 3 trust-card riêng biệt bên dưới — không có khối màu bao quanh. Khác biệt phong cách rõ ràng, **không phải lỗi khoảng trắng cũ** (không quay lại bug đã sửa), chỉ là khác style. |
| SECTION ORDER | MISMATCH đã biết | — | Thiếu Intro/RealWork/Reviews, Equipment lồng trong Process — không đổi trong Round 2 (chưa có evidence mới thay đổi kết luận Round 1) |
| CARDS (service grid) | MATCH | MATCH | Ảnh-trên/chữ-dưới, radius, badge đúng hình dạng |
| FLOATING CTA | MATCH | N/A (ẩn đúng thiết kế trên mobile, giống reference dùng sticky bar riêng cho mobile) | |
| MOBILE STICKY BAR | CLOSE | CLOSE | Dọn Nè 3 nút (Gọi/Zalo/Báo giá) vs reference 2 nút (Gọi/Zalo) — khác biệt có chủ đích, đã ghi nhận Round 1 |
| OVERFLOW | MATCH (0 overflow) | MATCH (0 overflow) | Xác nhận tự động |

## `/dich-vu` — 768 (tablet, viewport bắt buộc mới)

| Hạng mục | Kết quả |
|---|---|
| Columns | **MATCH** — 2 cột đúng như yêu cầu "2 tablet" |
| Card/radius/meta | MATCH |
| Overflow | MATCH (0) |

## Các trang còn lại (`/bang-gia`, `/khu-vuc-phuc-vu`, `/cam-nang-ve-sinh`, `/gioi-thieu`, `/lien-he`, 1 service detail)

Đã chụp đủ 4 viewport × 2 site, xác nhận tự động **0 lỗi JS, 0 overflow ngang** ở toàn bộ. Không phát hiện mismatch cấu trúc mới ngoài các mismatch đã ghi nhận ở Round 1 (Khu vực/Cẩm nang STATIC TEMPORARY, service detail không có FAQ giả). Không có so sánh pixel chi tiết từng hạng mục (HEADER/CONTENT WIDTH/...) cho toàn bộ 6 trang × 4 viewport này trong bảng — giới hạn thời gian, đánh dấu **NOT INDIVIDUALLY SCORED**, chỉ có bằng chứng ảnh + quét lỗi tự động.

## Phát hiện MỚI ở Round 2 (không có trong báo cáo Round 1)

1. **Lint error thật**: `src/app/[slug]/page.tsx` gọi `setState` đồng bộ trong effect body (`react-hooks/set-state-in-effect`) — **đã sửa** (Phase 20), không còn lỗi lint.
2. **Ảnh `dn-service-08.jpeg` (lau kính)**: nhân viên đứng ở ban công/mép ngoài toà nhà cao tầng dùng cây gạt kính cán dài, không thấy rõ dây đai an toàn (harness) gắn vào điểm neo — chỉ thấy ống/dây màu cam ở thắt lưng 1 người, không rõ có phải dây an toàn thật hay ống dẫn dung dịch. Giày vải thường, không phải giày bảo hộ. **Đây là rủi ro hình ảnh (safety optics)** cho một công ty dịch vụ vệ sinh chuyên nghiệp — cần thay ảnh có dây an toàn rõ ràng trong lần tạo ảnh tiếp theo. Không sửa được trong phạm vi review này (không tạo/tải ảnh mới).
3. **41/41 trang service detail xác nhận CÙNG TEMPLATE thật** (Round 1 chỉ suy luận từ 3 mẫu) — không phát hiện template khác, chỉ có biến thể nhỏ (3/41 trang có thêm khối `.final-cta`).
4. Không phát hiện lỗi console/JS/overflow mới nào do rebuild gây ra.

## Kết luận Round 2

Không nâng cấp bất kỳ mục nào từ MISMATCH lên MATCH chỉ dựa trên suy đoán — Hero vẫn là **MISMATCH xác nhận bằng ảnh thật**, section order homepage vẫn thiếu 3 khối. Các mục mới kiểm chứng thêm ở Round 2 (tablet columns, overflow 4 viewport, 41/41 URL template) đều **MATCH/PASS có bằng chứng**. Tổng thể: **REVIEW**, không PASS toàn phần — đúng theo Phase 23 (còn Hero mismatch + 3 section thiếu + 1 rủi ro hình ảnh an toàn chưa xử lý).
