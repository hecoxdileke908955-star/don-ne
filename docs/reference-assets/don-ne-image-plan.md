# Dọn Nè — Kế Hoạch Tạo Ảnh (V1)

> Nguồn: [`asset-inventory.md`](./asset-inventory.md) / [`asset-inventory.json`](./asset-inventory.json) (kiểm kê CleanHanoi, `REFERENCE_ONLY`, chỉ dùng để suy ra **loại nội dung cần có**, không sao chép bố cục/logo/watermark 1:1).
> Danh mục dịch vụ dùng làm căn cứ SERVICES/BEFORE_AFTER dưới đây lấy từ catalog **thật** của Dọn Nè (`prisma/seed.ts`, 9 dịch vụ) — không dùng danh mục mở rộng của CleanHanoi (vd. đánh bóng sàn đá/gỗ, pickleball áp lực cao... chỉ giữ những gì Dọn Nè thực sự bán).
> File này **chỉ lập kế hoạch** — chưa tạo ảnh nào, chưa sửa code/DB/Prisma/`package.json`, chưa commit.

## Quy chuẩn áp dụng cho MỌI ảnh trong kế hoạch này

- Phong cách chụp thực tế tại Việt Nam (photo-realistic, không phong cách stock quốc tế).
- Nhân viên vệ sinh người Việt, đồng phục Dọn Nè sạch sẽ, chuyên nghiệp (áo polo/áo khoác đồng phục màu thương hiệu, không in logo CleanHanoi).
- Máy móc vệ sinh công nghiệp có thật (máy chà sàn, máy hút bụi công suất lớn, máy phun-hút — kiểu dáng thực tế, không phải đồ chơi/minh hoạ).
- Bối cảnh Hà Nội: nhà ở/chung cư/văn phòng/nhà xưởng kiểu kiến trúc Việt Nam, không nội thất/kiến trúc phương Tây.
- **Không** có logo CleanHanoi hay bất kỳ thương hiệu đối thủ nào.
- **Không** watermark.
- **Không** chữ chèn trong ảnh (text overlay do CMS xử lý, không bake vào ảnh).
- **Không** sao chép bố cục ảnh CleanHanoi 1:1 — mỗi ảnh là tác phẩm mới.
- Alt text tiếng Việt, mô tả đúng nội dung ảnh (chuẩn SEO + accessibility, khớp quy ước đã dùng ở Services/FAQ hiện tại).

**Negative prompt chung** (áp dụng cho mọi ảnh, liệt kê riêng phần khác biệt theo từng ảnh nếu có):
`logo, watermark, text overlay, brand name, CleanHanoi, competitor branding, stock photo look, western/foreign faces, cartoon, illustration, 3D render, low resolution, blurry, distorted hands, unsafe work practice, cluttered background, oversaturated colors`

---

## 1. HERO

### DN-HERO-01
| Trường | Giá trị |
|---|---|
| Tên file đề xuất | `dn-hero-banner-tong-quan.webp` |
| Mục đích | Ảnh banner chính của Hero section trang chủ |
| Trang sử dụng | `/` (Trang chủ) |
| Section sử dụng | `Hero` (`SectionData.type: 'Hero'`) |
| Tỷ lệ khung hình | 21:9 (desktop), có vùng an toàn để crop 16:9 mobile |
| Kích thước px | 1920×823 (gốc), xuất thêm 1080×463 cho mobile |
| Orientation | Landscape |
| Mô tả cảnh | Nhân viên Dọn Nè đang lau kính hoặc chà sàn phòng khách một căn hộ hiện đại, ánh sáng tự nhiên buổi sáng, không gian gọn gàng sáng sủa thể hiện "sạch tinh tươm" |
| Con người | Có — 1 nhân viên (nam hoặc nữ), đang thao tác, nhìn nghiêng/không nhìn thẳng máy ảnh |
| Trang phục | Đồng phục Dọn Nè (áo polo màu xanh lá đậm/trắng theo bảng màu thương hiệu), không in logo cụ thể (để linh hoạt), găng tay bảo hộ |
| Thiết bị xuất hiện | Cây lau kính chuyên dụng hoặc máy hút bụi cầm tay, xô dung dịch |
| Bối cảnh | Phòng khách chung cư Hà Nội hiện đại, cửa kính lớn, nội thất tối giản |
| Ánh sáng | Ánh sáng tự nhiên ban ngày, dịu, có thể hắt nhẹ từ cửa kính |
| Góc máy | Góc rộng ngang tầm mắt, hơi chếch 3/4, có khoảng trống bên trái/phải cho text overlay CMS |
| Mức độ chân thực | Photo-realistic cao, như ảnh chụp thương mại thật |
| Negative prompt riêng | `messy room, dark lighting, empty room without human, industrial background` |
| Alt text tiếng Việt | Nhân viên Dọn Nè vệ sinh phòng khách chung cư tại Hà Nội |
| Filename cuối cùng trong /public | `dn-hero-banner-tong-quan.webp` |
| Thư mục đích | `/public/images/home/` |

---

## 2. SERVICES

*(1 ảnh đại diện / dịch vụ — dùng chung cho service card `/`, thumbnail `/dich-vu`, hero ảnh `/[slug]`, OG-image mặc định trang dịch vụ đó — theo đúng bài học kiến trúc rút ra từ CleanHanoi.)*

Khung chung cho cả 9 ảnh SERVICES:
- Tỷ lệ khung hình: **5:3**
- Kích thước px: **1200×720**
- Orientation: **Landscape**
- Con người: **Có** — 1 nhân viên đang thao tác đúng dịch vụ
- Trang phục: Đồng phục Dọn Nè, găng tay, khẩu trang nếu phù hợp công việc
- Ánh sáng: Ánh sáng tự nhiên/đèn trong nhà trung tính, đủ sáng, không gắt
- Góc máy: 3/4 hoặc ngang tầm mắt, tập trung vào hành động + bề mặt đang xử lý
- Mức độ chân thực: Photo-realistic cao
- Negative prompt riêng: `wrong equipment for task, staged unnatural pose, foreign interior style`

| ID | Tên file đề xuất | Dịch vụ (slug Dọn Nè) | Trang sử dụng | Mô tả cảnh | Thiết bị xuất hiện | Bối cảnh | Alt text tiếng Việt |
|---|---|---|---|---|---|---|---|
| DN-SERVICE-01 | `dn-service-ve-sinh-nha-cua.webp` | `ve-sinh-nha-cua` | `/`, `/dich-vu`, `/ve-sinh-nha-cua` | Nhân viên hút bụi/lau sàn phòng khách nhà phố | Máy hút bụi công nghiệp, khăn microfiber | Nhà phố/nhà ở Hà Nội, phòng khách | Nhân viên Dọn Nè tổng vệ sinh phòng khách nhà ở Hà Nội |
| DN-SERVICE-02 | `dn-service-ve-sinh-can-ho-chung-cu.webp` | `ve-sinh-can-ho-chung-cu` | `/dich-vu`, `/ve-sinh-can-ho-chung-cu` | Nhân viên lau sàn gỗ/kính ban công căn hộ chung cư | Cây lau sàn, khăn lau kính | Căn hộ chung cư Hà Nội, ban công có view thành phố | Nhân viên Dọn Nè vệ sinh căn hộ chung cư tại Hà Nội |
| DN-SERVICE-03 | `dn-service-ve-sinh-sau-xay-dung.webp` | `ve-sinh-sau-xay-dung` | `/`, `/dich-vu`, `/ve-sinh-sau-xay-dung` | Nhân viên dùng máy hút bụi công nghiệp xử lý bụi xi măng sàn thô | Máy hút bụi công suất lớn, đồ bảo hộ (khẩu trang, kính) | Công trình mới hoàn thiện, sàn bê tông/gạch thô | Nhân viên Dọn Nè vệ sinh công trình sau xây dựng |
| DN-SERVICE-04 | `dn-service-ve-sinh-van-phong.webp` | `ve-sinh-van-phong` | `/`, `/dich-vu`, `/ve-sinh-van-phong` | Nhân viên lau bàn làm việc/kính vách ngăn văn phòng ngoài giờ | Khăn lau, bình xịt dung dịch | Văn phòng mở, bàn làm việc, vách kính | Nhân viên Dọn Nè vệ sinh văn phòng làm việc tại Hà Nội |
| DN-SERVICE-05 | `dn-service-giat-ghe-sofa.webp` | `giat-ghe-sofa` | `/`, `/dich-vu`, `/giat-ghe-sofa` | Nhân viên dùng máy phun-hút giặt ghế sofa vải tại nhà khách | Máy phun hút chuyên dụng, vòi giặt bọc đệm | Phòng khách nhà ở, sofa vải/nỉ | Nhân viên Dọn Nè giặt ghế sofa tại nhà ở Hà Nội |
| DN-SERVICE-06 | `dn-service-giat-dem.webp` | `giat-dem` | `/dich-vu`, `/giat-dem` | Nhân viên dùng máy phun-hút giặt nệm trong phòng ngủ | Máy phun hút, tấm bảo vệ sàn | Phòng ngủ nhà ở Hà Nội | Nhân viên Dọn Nè giặt đệm tại nhà ở Hà Nội |
| DN-SERVICE-07 | `dn-service-giat-tham-van-phong.webp` | `giat-tham-van-phong` | `/dich-vu`, `/giat-tham-van-phong` | Nhân viên giặt thảm trải sàn khu làm việc/phòng họp | Máy phun hút thảm, ống hút nước bẩn | Văn phòng, thảm trải sàn khu làm việc | Nhân viên Dọn Nè giặt thảm văn phòng tại Hà Nội |
| DN-SERVICE-08 | `dn-service-dich-vu-lau-kinh.webp` | `dich-vu-lau-kinh` | `/dich-vu`, `/dich-vu-lau-kinh` | Nhân viên lau kính mặt dựng toà nhà bằng cây gạt kính (thao tác an toàn, có dây đai nếu ở cao) | Cây gạt kính, khăn, dây đai an toàn nếu làm việc trên cao | Mặt kính toà nhà văn phòng | Nhân viên Dọn Nè lau kính mặt dựng toà nhà tại Hà Nội |
| DN-SERVICE-09 | `dn-service-ve-sinh-san-pickleball.webp` | `ve-sinh-san-pickleball` | `/dich-vu`, `/ve-sinh-san-pickleball` | Nhân viên dùng máy áp lực/chà sàn vệ sinh mặt sân pickleball ngoài trời | Máy chà sàn hoặc máy áp lực nước, ống dẫn | Sân pickleball/thể thao ngoài trời | Nhân viên Dọn Nè vệ sinh sân pickleball tại Hà Nội |

**Thư mục đích chung cho SERVICES:** `/public/images/services/`

---

## 3. EQUIPMENT

Khung chung: tỷ lệ **1:1**, kích thước **800×800**, orientation **Square**, thường **không có người** (cận cảnh thiết bị) trừ khi ghi chú khác, ánh sáng studio nhẹ/ánh sáng tự nhiên đều, góc máy cận cảnh 45° hoặc chính diện, mức độ chân thực photo-realistic sản phẩm.

| ID | Tên file đề xuất | Mục đích | Trang/section sử dụng | Mô tả cảnh | Con người | Thiết bị | Bối cảnh | Negative prompt riêng | Alt text tiếng Việt |
|---|---|---|---|---|---|---|---|---|---|
| DN-EQUIPMENT-01 | `dn-equipment-may-cha-san.webp` | Minh hoạ thiết bị chuyên dụng trong `Trust`/`Process` section | `/` (Trust/Process) | Máy chà sàn công nghiệp đặt trên sàn sạch, có thể có tay cầm nhân viên chạm nhẹ | Không bắt buộc (có thể có 1 bàn tay đang cầm) | Máy chà sàn đơn/liên hợp | Sàn nhà xưởng/sảnh sạch | `toy-like design, cartoon machine` | Máy chà sàn công nghiệp Dọn Nè sử dụng |
| DN-EQUIPMENT-02 | `dn-equipment-may-hut-bui.webp` | Minh hoạ thiết bị chuyên dụng | `/` (Trust/Process) | Máy hút bụi công suất lớn 3 mô-tơ, ống hút cuộn gọn | Không | Máy hút bụi công nghiệp | Nền trung tính hoặc sàn nhà xưởng | `household mini vacuum, low power look` | Máy hút bụi công suất lớn Dọn Nè sử dụng |
| DN-EQUIPMENT-03 | `dn-equipment-may-phun-hut.webp` | Minh hoạ thiết bị chuyên dụng | `/dich-vu-lau-kinh`... không, dùng cho `giat-ghe-sofa`/`giat-dem`/`giat-tham-van-phong` + `/` (Trust) | Máy phun-hút giặt thảm/sofa/đệm với vòi giặt đi kèm | Không | Máy phun hút chuyên dụng, vòi bọc đệm | Nền trung tính | `leaking hose, damaged unit` | Máy phun hút chuyên dụng giặt thảm và sofa Dọn Nè |
| DN-EQUIPMENT-04 | `dn-equipment-bo-dung-cu-lau-kinh.webp` | Minh hoạ thiết bị chuyên dụng dịch vụ lau kính | `/dich-vu-lau-kinh` | Bộ dụng cụ lau kính: cây gạt, khăn microfiber, xô dung dịch, dụng cụ nối dài, dây đai an toàn xếp gọn | Không | Cây gạt kính, khăn, xô, dây đai | Nền trung tính/sàn văn phòng | `improvised tools, unsafe rigging` | Bộ dụng cụ lau kính chuyên dụng Dọn Nè |
| DN-EQUIPMENT-05 | `dn-equipment-hoa-chat-dung-cu.webp` | Minh hoạ hoá chất/dụng cụ theo bề mặt | `/` (Trust), trang giới thiệu | Các chai hoá chất vệ sinh chuyên dụng (nhãn trung tính, không thương hiệu thật) xếp cùng khăn/bàn chải | Không | Chai dung dịch, bàn chải, khăn | Nền trung tính | `visible third-party chemical brand logo, hazard symbols without labels` | Hoá chất và dụng cụ vệ sinh chuyên dụng Dọn Nè |

**Thư mục đích chung cho EQUIPMENT:** `/public/images/equipment/`

---

## 4. PROJECTS

Khung chung: tỷ lệ **4:3**, kích thước **1200×900**, orientation **Landscape**, có người, ánh sáng hiện trường tự nhiên, góc máy phóng viên (candid, không dàn dựng cứng), mức độ chân thực photo-realistic như ảnh chụp công trình thật.

| ID | Tên file đề xuất | Mục đích | Trang/section sử dụng | Mô tả cảnh | Trang phục | Thiết bị | Bối cảnh | Alt text tiếng Việt |
|---|---|---|---|---|---|---|---|---|
| DN-PROJECT-01 | `dn-project-nha-o-chung-cu.webp` | Ảnh công trình thực tế — nhà ở/căn hộ | `/` (Trust), `/ve-sinh-nha-cua`, `/ve-sinh-can-ho-chung-cu` | Nhân viên đang tổng vệ sinh một căn hộ/nhà ở thật, nhiều góc phòng lộ ra hoạt động dọn dẹp | Đồng phục Dọn Nè | Máy hút bụi, xô dụng cụ | Căn hộ/nhà ở Hà Nội đang được dọn | Đội Dọn Nè thi công vệ sinh nhà ở tại Hà Nội |
| DN-PROJECT-02 | `dn-project-van-phong.webp` | Ảnh công trình thực tế — văn phòng | `/` (Trust), `/ve-sinh-van-phong`, `/giat-tham-van-phong` | Nhân viên vệ sinh khu vực làm việc mở của văn phòng ngoài giờ, đèn văn phòng bật | Đồng phục Dọn Nè | Máy hút bụi/thảm, xe đẩy dụng cụ | Văn phòng mở, bàn làm việc | Đội Dọn Nè thi công vệ sinh văn phòng tại Hà Nội |
| DN-PROJECT-03 | `dn-project-nha-xuong-cong-trinh.webp` | Ảnh công trình thực tế — nhà xưởng/sau xây dựng | `/ve-sinh-sau-xay-dung` | Nhân viên xử lý bụi công nghiệp diện rộng tại nhà xưởng/công trình mới xây, đeo đồ bảo hộ đầy đủ | Đồng phục + khẩu trang, kính bảo hộ | Máy hút bụi công nghiệp lớn, thang | Nhà xưởng/công trình xây dựng | Đội Dọn Nè thi công vệ sinh công trình sau xây dựng |
| DN-PROJECT-04 | `dn-project-doi-thi-cong-hien-truong.webp` | Ảnh nhóm đội thi công tại hiện trường (đa dụng, dùng khi cần ảnh "đội ngũ đông người + xe/thiết bị") | `/` (Trust), trang giới thiệu nếu có | 2-3 nhân viên Dọn Nè cùng thiết bị đứng/di chuyển tại một công trình, thể hiện quy mô đội nhóm chuyên nghiệp | Đồng phục đồng bộ | Máy móc xếp gọn, xe đẩy dụng cụ | Sảnh/hành lang công trình | Đội ngũ thi công vệ sinh chuyên nghiệp của Dọn Nè |

**Thư mục đích chung cho PROJECTS:** `/public/images/projects/`

---

## 5. BEFORE_AFTER

*(Định dạng khuyến nghị: ảnh so sánh **ghép cạnh nhau** trong 1 file — cùng góc máy, cùng ánh sáng, cùng vị trí — theo bài học rút ra từ CleanHanoi. Mỗi cặp = 2 file riêng: BEFORE + AFTER, ghép hiển thị bằng CSS/component phía CMS, không bake ghép cứng vào ảnh để linh hoạt responsive.)*

Khung chung: tỷ lệ **1:1** mỗi nửa, kích thước **800×800** mỗi file, orientation **Square**, có người tuỳ cảnh (thường không cần, tập trung vào bề mặt/vật dụng), ánh sáng phải **giống hệt nhau giữa BEFORE và AFTER cùng cặp** (chụp cùng buổi, cùng đèn), góc máy **giống hệt nhau giữa BEFORE và AFTER cùng cặp**, mức độ chân thực photo-realistic, không chỉnh màu lệch giữa 2 ảnh (tránh gây nghi ngờ giả mạo).

| Cặp | ID | Tên file đề xuất | Dịch vụ liên quan | Mô tả cảnh | Bối cảnh | Alt text tiếng Việt |
|---|---|---|---|---|---|---|
| 1 — Sofa | DN-BEFORE-01 | `dn-before-01-sofa.webp` | `giat-ghe-sofa` | Ghế sofa vải/nỉ có vết bẩn, ố vàng rõ rệt, ánh sáng tự nhiên | Phòng khách nhà ở | Ghế sofa trước khi Dọn Nè vệ sinh |
| 1 — Sofa | DN-AFTER-01 | `dn-after-01-sofa.webp` | `giat-ghe-sofa` | Cùng ghế sofa, cùng góc/vị trí, bề mặt sạch, sáng màu hơn, không còn vết ố | Phòng khách nhà ở (giống hệt BEFORE-01) | Ghế sofa sau khi Dọn Nè vệ sinh |
| 2 — Đệm | DN-BEFORE-02 | `dn-before-02-dem.webp` | `giat-dem` | Bề mặt đệm có vết ố vàng/bụi bẩn rõ | Phòng ngủ nhà ở | Đệm trước khi Dọn Nè giặt |
| 2 — Đệm | DN-AFTER-02 | `dn-after-02-dem.webp` | `giat-dem` | Cùng đệm, cùng góc, bề mặt sạch sáng màu | Phòng ngủ nhà ở (giống hệt BEFORE-02) | Đệm sau khi Dọn Nè giặt |
| 3 — Thảm văn phòng | DN-BEFORE-03 | `dn-before-03-tham-van-phong.webp` | `giat-tham-van-phong` | Thảm trải sàn văn phòng có vết bẩn cục bộ, bụi bám | Khu làm việc văn phòng | Thảm văn phòng trước khi Dọn Nè giặt |
| 3 — Thảm văn phòng | DN-AFTER-03 | `dn-after-03-tham-van-phong.webp` | `giat-tham-van-phong` | Cùng khu vực thảm, cùng góc, sạch và đều màu hơn | Khu làm việc văn phòng (giống hệt BEFORE-03) | Thảm văn phòng sau khi Dọn Nè giặt |
| 4 — Nhà cửa (bếp/toilet) | DN-BEFORE-04 | `dn-before-04-nha-cua.webp` | `ve-sinh-nha-cua` | Khu bếp hoặc toilet có cặn bẩn, ố vàng ở bề mặt | Nhà ở Hà Nội | Khu bếp trước khi Dọn Nè tổng vệ sinh |
| 4 — Nhà cửa (bếp/toilet) | DN-AFTER-04 | `dn-after-04-nha-cua.webp` | `ve-sinh-nha-cua` | Cùng khu vực, cùng góc, sáng bóng sạch sẽ | Nhà ở Hà Nội (giống hệt BEFORE-04) | Khu bếp sau khi Dọn Nè tổng vệ sinh |

**Negative prompt riêng cho toàn bộ BEFORE_AFTER:** `different angle between before/after, different lighting between before/after, staged/exaggerated dirt, digitally added dirt overlay, mismatched furniture position`

**Section sử dụng:** `BeforeAfter` section trang chủ (`/`), thay thế nội dung text-only hiện tại của `BeforeAfterSlider.tsx`.
**Thư mục đích:** `/public/images/before-after/`

---

## 6. TEAM

### DN-TEAM-01
| Trường | Giá trị |
|---|---|
| Tên file đề xuất | `dn-team-doi-thi-cong.webp` |
| Mục đích | Ảnh đội ngũ cho khối "Vì sao chọn Dọn Nè" |
| Trang sử dụng | `/` (Trang chủ) |
| Section sử dụng | `Trust` |
| Tỷ lệ khung hình | 5:3 |
| Kích thước px | 1200×720 |
| Orientation | Landscape |
| Mô tả cảnh | 3-4 nhân viên Dọn Nè đứng cùng nhau tại một công trình thật, cạnh thiết bị (máy chà sàn/xe đẩy dụng cụ), tư thế tự nhiên, có thể đang trao đổi công việc thay vì tạo dáng cứng |
| Con người | Có — nhóm 3-4 người, cả nam và nữ |
| Trang phục | Đồng phục Dọn Nè đồng bộ, sạch sẽ, có thể đội mũ/khẩu trang tuỳ ngữ cảnh |
| Thiết bị xuất hiện | Máy chà sàn hoặc xe đẩy dụng cụ đặt cạnh |
| Bối cảnh | Sảnh/hành lang một công trình đã hoàn thiện, ánh sáng tốt |
| Ánh sáng | Ánh sáng tự nhiên ban ngày, đều, không đổ bóng gắt |
| Góc máy | Ngang tầm mắt, khoảng cách vừa đủ để thấy cả nhóm và một phần bối cảnh |
| Mức độ chân thực | Photo-realistic cao, như ảnh đội nhóm chụp thật tại hiện trường |
| Negative prompt riêng | `stiff corporate headshot pose, studio backdrop, matching fake smiles, stock team photo look` |
| Alt text tiếng Việt | Đội thi công vệ sinh công nghiệp Dọn Nè tại Hà Nội |
| Filename cuối cùng trong /public | `dn-team-doi-thi-cong.webp` |
| Thư mục đích | `/public/images/team/` |

---

## Generation Order

Thứ tự tạo ảnh chính xác — ưu tiên để trang chủ Dọn Nè nhìn hoàn chỉnh nhanh nhất trước, sau đó mở rộng ra các trang dịch vụ:

1. DN-HERO-01
2. DN-SERVICE-01 (ve-sinh-nha-cua)
3. DN-SERVICE-03 (ve-sinh-sau-xay-dung)
4. DN-SERVICE-04 (ve-sinh-van-phong)
5. DN-SERVICE-05 (giat-ghe-sofa)
6. DN-EQUIPMENT-01 (máy chà sàn)
7. DN-BEFORE-01 (sofa — trước)
8. DN-AFTER-01 (sofa — sau)
9. DN-SERVICE-02 (ve-sinh-can-ho-chung-cu)
10. DN-SERVICE-06 (giat-dem)
11. DN-SERVICE-07 (giat-tham-van-phong)
12. DN-SERVICE-08 (dich-vu-lau-kinh)
13. DN-SERVICE-09 (ve-sinh-san-pickleball)
14. DN-EQUIPMENT-02 (máy hút bụi)
15. DN-EQUIPMENT-03 (máy phun-hút)
16. DN-TEAM-01
17. DN-BEFORE-02 (đệm — trước)
18. DN-AFTER-02 (đệm — sau)
19. DN-PROJECT-01 (nhà ở/căn hộ)
20. DN-PROJECT-02 (văn phòng)
21. DN-EQUIPMENT-04 (bộ dụng cụ lau kính)
22. DN-EQUIPMENT-05 (hoá chất/dụng cụ)
23. DN-PROJECT-03 (nhà xưởng/công trình)
24. DN-PROJECT-04 (đội thi công hiện trường)
25. DN-BEFORE-03 (thảm văn phòng — trước)
26. DN-AFTER-03 (thảm văn phòng — sau)
27. DN-BEFORE-04 (nhà cửa/bếp — trước)
28. DN-AFTER-04 (nhà cửa/bếp — sau)
