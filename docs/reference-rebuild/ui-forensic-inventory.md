# UI Forensic Inventory

> Nguồn: CSS thật (`main.css`, 391 dòng, tải trực tiếp từ `wp-content/themes/cleanhnn/assets/css/main.css`) + HTML thật của 12 URL đã fetch + block `<style>` inline "CleanHanoi Desktop Contact Card". Giá trị dưới đây là **số thật từ file CSS gốc**, không phải ước lượng bằng mắt. Phạm vi: các component xuất hiện lặp lại nhiều nơi (header/nav/button/card/footer/floating widget) được ghi đầy đủ; các component chỉ xuất hiện 1 lần trên 1 loại trang phụ (vd. table style riêng của Bảng giá) ghi ở mức tóm tắt do giới hạn thời gian audit.

## HEADER

| Thuộc tính | Giá trị thật |
|---|---|
| Component | `.site-header` |
| Xuất hiện | Mọi URL |
| Desktop/mobile | Cả hai, breakpoint 760px |
| Position | `sticky; top:0; z-index:50` |
| Background | `rgba(255,255,255,.95)` + `backdrop-filter: blur(14px)` |
| Border | `border-bottom:1px solid rgba(220,234,246,.9)` |
| Container | `.container{max-width:1200px;padding:0 20px}` |
| Logo (`.brand img`) | `width:112px` desktop, `96px` mobile |
| Nav item | `.menu a` — không có padding riêng định nghĩa (dùng flex gap của `.menu`, giá trị gap không thấy trong đoạn đã trích — `REFERENCE UNCERTAIN`) |
| Dropdown arrow | Không phải icon riêng — dùng text/CSS-generated, xoay khi hover (suy luận từ hành vi `menu-has-sub:hover .menu-sub{display:block}`, không có transform arrow trong CSS đã trích) |
| Submenu (`.menu-sub`) | width `min-width:220px`, `border-radius:14px`, `box-shadow:0 16px 40px rgba(4,42,80,.12)`, `padding:10px 0`, `margin-top:10px`, position `absolute;top:100%;left:50%;translateX(-50%)` |
| Submenu item | `padding:10px 20px; font-size:14px; font-weight:700` |
| Submenu hover | `background:var(--soft); color:var(--blue)` |
| CTA (`.header-cta`) | `background:orange; padding:12px 24px; border-radius:999px; font-weight:900; box-shadow:0 12px 24px rgba(255,159,28,.22)` |
| Sticky behavior | Luôn dính top, không ẩn khi cuộn xuống (không thấy logic hide-on-scroll trong CSS) |
| Mobile hamburger | `.mobile-menu-toggle{width:44px;height:44px;border-radius:999px;border:1px solid var(--line)}`, 3 gạch `span{width:20px;height:2px}` |
| Mobile drawer | `.mobile-menu-panel` — full width, submenu hiện `display:grid` luôn (không toggle riêng) |

## BUTTON

| Loại | Class | Radius | Padding | Font-weight |
|---|---|---|---|---|
| Primary | `.btn.btn-primary` | 999px (pill, từ `.btn`) | `14px 24px` | 900 |
| Light/outline | `.btn.btn-light` | 999px | `14px 24px` | 900 |
| Header CTA | `.header-cta` | 999px | `12px 24px` | 900 |
| Floating widget action | `.ch-contact-action` | 16px | `10px 12px`, `min-height:56px` | — |
| Pagination | `.page-numbers` | 999px | — | 900, `min-width/height:40px` |
| Category index CTA | `.category-index-link` | 999px | `10px 16px` | 900 |

Không tìm thấy định nghĩa `:hover`/`:active`/`:focus` riêng cho `.btn` trong đoạn CSS đã trích ngoài `.footer-social-btn:hover{transform:translateY(-2px)}` và `.service-card:hover{transform:translateY(-4px)}` — `REFERENCE UNCERTAIN` cho hover/active/focus chi tiết của nút chính.

## CARD

| Loại | Class | Radius | Shadow | Ảnh |
|---|---|---|---|---|
| Service card (homepage) | `.service-card` | 24px | `0 16px 36px rgba(4,42,80,.07)`, hover `0 20px 44px` + `translateY(-4px)` | `aspect-ratio:5/3; object-fit:cover` |
| Archive post card | `.post-card` | 20px | `0 14px 32px rgba(4,42,80,.06)` | 300×180 (5:3) |
| Equipment card | `.equipment-card` | 22px | `0 14px 32px rgba(4,42,80,.06)` | — |
| Gallery card | `.gallery-card` | 24px | `0 14px 32px rgba(4,42,80,.06)` | — |
| Review/testimonial card | `.review-card` | 24px | — | avatar 52×52px tròn |
| Category index card | `.category-index-card` | 20px | `0 14px 32px rgba(4,42,80,.06)` | — |
| Intro image card | `.intro-image-card` | 28px | `0 18px 45px rgba(4,42,80,.10)`, min-height 520px | caption overlay đáy |
| Price table wrap | `.price-table-wrap` | 24px | `0 18px 45px rgba(4,42,80,.10)` | — |

## FLOATING WIDGET (desktop) — `.ch-desktop-contact-card`

| Thuộc tính | Giá trị thật |
|---|---|
| Position | `fixed; right:22px; bottom:96px; z-index:9999` |
| Width | `245px` |
| Padding | `14px` |
| Radius | `22px` |
| Background | `rgba(255,255,255,.96)` + `blur(10px)` |
| Shadow | `0 18px 45px rgba(15,23,42,.18)` |
| Header | status dot 11×11px tròn xanh (`#16a34a`) + halo `box-shadow:0 0 0 6px rgba(22,163,74,.13)`, tiêu đề 14px/800, phụ đề 12px |
| Action button | `min-height:56px; border-radius:16px; padding:10px 12px`, gap icon-text 11px |

## STICKY MOBILE BAR — `.mobile-sticky`

`position:fixed;bottom:0;grid-template-columns:1fr 1fr;gap:10px;padding:10px 14px;border-top:1px solid var(--line);box-shadow:0 -8px 30px rgba(4,42,80,.12)` — chỉ 2 nút (Gọi ngay/Nhắn Zalo), không có nút thứ 3.

## FOOTER

| Thuộc tính | Giá trị thật |
|---|---|
| Grid | `.footer-grid{grid-template-columns:1.45fr 1.15fr 1.15fr 1fr;gap:36px}` → 1fr 1fr ở ≤1100px → 1fr ở mobile |
| Padding | `.footer-main{padding:64px 0 42px}` |
| Logo box | `.footer-logo{background:#fff;padding:10px 14px;border-radius:16px}`, ảnh 150px |
| Social button | `.footer-social-btn{width:42px;height:42px;border-radius:50%}`, màu riêng từng mạng (fb `#1877f2`, zalo `#0068ff`, gmail `#ea4335`) |
| Column heading | `.footer-col h4{font-size:18px}` |
| Bottom bar | `.footer-bottom{background:#04152d;padding:18px 0}` |

## OTHER

| Component | Ghi chú |
|---|---|
| Breadcrumb | Không tìm thấy class `.breadcrumb` trong HTML đã fetch — `REFERENCE UNCERTAIN` |
| Badge | `.footer-badge{border-radius:999px;background:rgba(0,159,145,.14)}` |
| Empty state | `.empty-state{max-width:640px;padding:36px;border-radius:22px;box-shadow:0 14px 32px rgba(4,42,80,.06)}` |
| Pagination | `.page-numbers{min-width:40px;height:40px;border-radius:999px}` |
| FAQ accordion | `.faq details{border-radius:18px;padding:18px 22px;box-shadow:0 10px 24px rgba(4,42,80,.05)}` — dùng thẻ `<details>` HTML gốc |
| Section heading | `.section-title{font-size:42px;line-height:1.18;max-width:860px}`, `.section-desc{font-size:17px;color:muted;max-width:780px}` |

## Design tokens gốc (`:root`)

```
--blue:#005fcc; --blue2:#003d8f; --cyan:#00a894; --teal:#008b85;
--orange:#ff9f1c; --dark:#061b3a; --text:#16304f; --muted:#5b6b82;
--soft:#eef8ff; --soft2:#f6fbff; --line:#dceaf6; --max:1200px;
```
Dọn Nè **không** dùng palette này (đúng yêu cầu — chỉ học contrast/hierarchy), giữ nguyên palette Dọn Nè hiện có (`primary`, `text-main`, `text-muted`, `surface`...).

## Giới hạn

Do giới hạn thời gian, các component sau **chưa** được đo forensic chi tiết (không có trong đoạn CSS đã trích hoặc cần fetch thêm trang chưa audit): form liên hệ, table bảng giá chi tiết từng ô, testimonial carousel behavior, breadcrumb, accordion FAQ animation, focus states của mọi nút. Đánh dấu `REFERENCE UNCERTAIN` — implementation Dọn Nè giữ pattern gần nhất với bằng chứng đã quan sát, không tự phát minh chi tiết.
