# Dọn Nè — P0 Image Generation Prompts

> Nguồn: [`don-ne-image-plan.md`](./don-ne-image-plan.md). File này chỉ chứa prompt để dùng với model tạo ảnh — chưa tạo ảnh nào, chưa sửa code/DB/`package.json`, chưa commit.
> Áp dụng cho đúng 8 ảnh P0: `DN-HERO-01`, `DN-SERVICE-01`, `DN-SERVICE-03`, `DN-SERVICE-04`, `DN-SERVICE-05`, `DN-EQUIPMENT-01`, `DN-BEFORE-01`, `DN-AFTER-01`.

---

# DN-HERO-01

Filename: `dn-hero-banner-tong-quan.webp`
Destination: `/public/images/home/dn-hero-banner-tong-quan.webp`
Priority: P0
Page: `/` (Trang chủ)
Section: `Hero`
Aspect ratio: 21:9 (desktop banner; export a 16:9 crop for mobile)
Recommended size: 1920×823px (desktop original)

## Generation Prompt

Photo-realistic commercial photograph, shot in Hanoi, Vietnam. A single Vietnamese professional cleaning staff member (either gender) is cleaning the glass window or mopping the floor of a modern Hanoi apartment living room, captured mid-action from a slight 3/4 angle, not looking directly at the camera. The worker wears a clean, professional plain uniform in a dark-green-and-white color scheme with no visible logo, text, or brand marks of any kind — the uniform must be entirely blank/unbranded. They are using a real handheld squeegee/glass-cleaning tool or a handheld vacuum, with a small bucket of cleaning solution nearby. The room is bright, tidy, minimal Vietnamese-apartment interior with large glass windows or sliding doors, natural morning daylight streaming in softly, no harsh shadows. Wide-angle composition at eye level, with a large clear negative-space area (at least the left third or right third of the frame, plain wall, window light, or soft-focus background) intentionally left uncluttered for a website headline and call-to-action button to be overlaid digitally afterward — do not render any text, words, letters, or graphic overlays into the image itself. High photo-realism, natural color grading, looks like a real commercial photograph taken for a Vietnamese home-cleaning service website, not a stock photo or illustration.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, wrong or nonsensical cleaning equipment, western/American/European style furniture or interior architecture, empty room with no person, messy or cluttered room, dark or moody lighting, industrial/factory background, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, unnatural glow, blurry, low resolution, out of focus subject

## Alt Text

Nhân viên Dọn Nè vệ sinh phòng khách chung cư tại Hà Nội

## Integration Notes

Sau khi tạo, lưu file vào `public/images/home/dn-hero-banner-tong-quan.webp`. Đây là ảnh banner Hero — bắt buộc giữ vùng negative space rộng (tối thiểu 1/3 chiều ngang khung hình) để CMS overlay heading + CTA của `Hero` section; **không** bake chữ/heading vào file ảnh.

---

# DN-SERVICE-01

Filename: `dn-service-ve-sinh-nha-cua.webp`
Destination: `/public/images/services/dn-service-ve-sinh-nha-cua.webp`
Priority: P0
Page: `/`, `/dich-vu`, `/ve-sinh-nha-cua`
Section: `ServiceGrid` (homepage card) / service detail hero (`/[slug]`)
Aspect ratio: 5:3
Recommended size: 1200×720px

## Generation Prompt

Photo-realistic photograph of a general house-cleaning service in Hanoi, Vietnam. A Vietnamese cleaning staff member is vacuuming or wiping down the floor of a Vietnamese townhouse living room, mid-action, using a real industrial-style handheld or upright vacuum cleaner and a microfiber cloth. The worker wears a clean, plain, unbranded professional uniform (no logos, no text, no fake brand marks), with cleaning gloves. The room shows a realistic Vietnamese home interior — tile or wood-look flooring, simple furniture, some visible light dust or a slightly untidy surface being actively cleaned (moderate, believable mess, not exaggerated). Natural window daylight or neutral warm indoor lighting, evenly lit, no harsh shadows. Camera at a 3/4 angle or eye level, medium shot framing both the worker and the surface/action clearly, composition centered on the cleaning activity. High photo-realism, natural color grading, looks like an authentic photograph for a real Vietnamese home-cleaning company, not a staged stock photo.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, wrong or mismatched cleaning equipment for the task, staged/unnatural pose, western/American/European style furniture or interior architecture, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, unnatural glow, blurry, low resolution

## Alt Text

Nhân viên Dọn Nè tổng vệ sinh phòng khách nhà ở Hà Nội

## Integration Notes

Sau khi tạo, lưu file vào `public/images/services/dn-service-ve-sinh-nha-cua.webp`. Dùng làm ảnh đại diện dịch vụ "Tổng Vệ Sinh Nhà Cửa Trọn Gói" (`slug: ve-sinh-nha-cua`) — cho service card trang chủ, thumbnail `/dich-vu`, ảnh hero `/ve-sinh-nha-cua`, và OG-image mặc định của trang này.

---

# DN-SERVICE-03

Filename: `dn-service-ve-sinh-sau-xay-dung.webp`
Destination: `/public/images/services/dn-service-ve-sinh-sau-xay-dung.webp`
Priority: P0
Page: `/`, `/dich-vu`, `/ve-sinh-sau-xay-dung`
Section: `ServiceGrid` (homepage card) / service detail hero (`/[slug]`)
Aspect ratio: 5:3
Recommended size: 1200×720px

## Generation Prompt

Photo-realistic photograph of a post-construction cleaning service in Hanoi, Vietnam. A Vietnamese cleaning staff member is operating a real industrial high-power vacuum cleaner to remove construction dust and cement residue from a freshly finished building interior floor. The worker wears a clean, plain, unbranded professional uniform (no logos, no text, no fake brand marks) along with realistic safety gear — a dust mask and protective glasses — appropriate for construction dust work. The scene shows a newly built or renovated interior: raw concrete or tiled floor with visible fine dust and construction debris being actively cleaned, exposed newly finished walls, believable construction-site cleanliness state (dusty but safe, not a demolition zone). Bright neutral construction-site lighting, natural daylight from open windows or work lights, evenly lit. Camera at a 3/4 angle or eye level, medium shot showing the worker, the vacuum equipment, and the dusty floor surface clearly. High photo-realism, natural color grading, authentic documentary look for a real Vietnamese post-construction cleaning company.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, wrong or mismatched cleaning equipment for the task, staged/unnatural pose, western/American/European style architecture, active demolition or unsafe/hazardous construction scene, missing required safety gear, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Nhân viên Dọn Nè vệ sinh công trình sau xây dựng

## Integration Notes

Sau khi tạo, lưu file vào `public/images/services/dn-service-ve-sinh-sau-xay-dung.webp`. Dùng làm ảnh đại diện dịch vụ "Vệ Sinh Công Trình Sau Xây Dựng" (`slug: ve-sinh-sau-xay-dung`) — cho service card trang chủ, thumbnail `/dich-vu`, ảnh hero `/ve-sinh-sau-xay-dung`, và OG-image mặc định của trang này.

---

# DN-SERVICE-04

Filename: `dn-service-ve-sinh-van-phong.webp`
Destination: `/public/images/services/dn-service-ve-sinh-van-phong.webp`
Priority: P0
Page: `/`, `/dich-vu`, `/ve-sinh-van-phong`
Section: `ServiceGrid` (homepage card) / service detail hero (`/[slug]`)
Aspect ratio: 5:3
Recommended size: 1200×720px

## Generation Prompt

Photo-realistic photograph of an office-cleaning service in Hanoi, Vietnam. A Vietnamese cleaning staff member is wiping down a desk or a glass partition wall in an open-plan office, using a cleaning cloth and a spray bottle of cleaning solution, captured mid-action. The worker wears a clean, plain, unbranded professional uniform (no logos, no text, no fake brand marks), with cleaning gloves. The scene shows a realistic modern Vietnamese office interior — desks, office chairs, glass partitions, after-hours or early-morning setting with office lights on. Neutral, even indoor office lighting (fluorescent/LED, not harsh), believable light dust or smudges being actively cleaned on the desk/glass surface. Camera at a 3/4 angle or eye level, medium shot framing both the worker and the surface being cleaned. High photo-realism, natural color grading, authentic look for a real Vietnamese office-cleaning company.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, wrong or mismatched cleaning equipment for the task, staged/unnatural pose, western/American/European style office architecture, empty room with no cleaning activity, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Nhân viên Dọn Nè vệ sinh văn phòng làm việc tại Hà Nội

## Integration Notes

Sau khi tạo, lưu file vào `public/images/services/dn-service-ve-sinh-van-phong.webp`. Dùng làm ảnh đại diện dịch vụ "Vệ Sinh Văn Phòng Làm Việc" (`slug: ve-sinh-van-phong`) — cho service card trang chủ, thumbnail `/dich-vu`, ảnh hero `/ve-sinh-van-phong`, và OG-image mặc định của trang này.

---

# DN-SERVICE-05

Filename: `dn-service-giat-ghe-sofa.webp`
Destination: `/public/images/services/dn-service-giat-ghe-sofa.webp`
Priority: P0
Page: `/`, `/dich-vu`, `/giat-ghe-sofa`
Section: `ServiceGrid` (homepage card) / service detail hero (`/[slug]`)
Aspect ratio: 5:3
Recommended size: 1200×720px

## Generation Prompt

Photo-realistic photograph of an upholstery/sofa cleaning service in Hanoi, Vietnam. A Vietnamese cleaning staff member is using a real portable wet-extraction (spray-and-extract) upholstery cleaning machine with an extraction wand to clean a fabric or fabric-blend sofa in a customer's home living room, captured mid-action. The worker wears a clean, plain, unbranded professional uniform (no logos, no text, no fake brand marks), with cleaning gloves. The sofa fabric shows a realistic, believable level of soiling on the untreated section versus the section already being cleaned (subtle, not exaggerated). The room is a typical Vietnamese home living room, natural daylight from a window, warm neutral indoor lighting, evenly lit, no harsh shadows. Camera at a 3/4 angle or eye level, medium shot clearly showing the worker, the extraction machine, and the sofa surface being cleaned. High photo-realism, natural color grading, authentic look for a real Vietnamese upholstery-cleaning company.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, wrong or mismatched cleaning equipment for the task, staged/unnatural pose, western/American/European style furniture or interior architecture, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Nhân viên Dọn Nè giặt ghế sofa tại nhà ở Hà Nội

## Integration Notes

Sau khi tạo, lưu file vào `public/images/services/dn-service-giat-ghe-sofa.webp`. Dùng làm ảnh đại diện dịch vụ "Giặt Ghế Sofa Nỉ / Vải / Da" (`slug: giat-ghe-sofa`) — cho service card trang chủ, thumbnail `/dich-vu`, ảnh hero `/giat-ghe-sofa`, và OG-image mặc định của trang này. Không dùng chung sofa/phòng với cặp `DN-BEFORE-01`/`DN-AFTER-01` — đây là ảnh hành động minh hoạ dịch vụ, không phải ảnh so sánh trước/sau.

---

# DN-EQUIPMENT-01

Filename: `dn-equipment-may-cha-san.webp`
Destination: `/public/images/equipment/dn-equipment-may-cha-san.webp`
Priority: P0
Page: `/` (Trust / Process section)
Section: `Trust` / `Process`
Aspect ratio: 1:1
Recommended size: 800×800px

## Generation Prompt

Photo-realistic close-up product-style photograph of a real industrial floor-scrubbing machine (single-disc or combination floor scrubber, the kind used by professional cleaning companies), standing on a clean, polished floor surface. Optionally, one Vietnamese worker's hand is gently resting on or gripping the handle of the machine, cropped so only the hand/forearm is visible (no need to show a full person or face). No visible logos, brand names, or text on the machine body — a neutral, realistic industrial equipment design. The background is a clean, softly lit hallway or lobby floor, slightly blurred/soft-focus to keep focus on the machine. Even, soft studio-style or natural indoor lighting from a 45-degree angle or straight-on, no harsh reflections. Camera framing: tight product/equipment close-up, centered composition. High photo-realism, looks like a genuine equipment photograph from a real Vietnamese industrial cleaning company, not a toy or illustration.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, toy-like or cartoonish machine design, wrong or nonsensical machine parts, western/American/European style interior, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Máy chà sàn công nghiệp Dọn Nè sử dụng

## Integration Notes

Sau khi tạo, lưu file vào `public/images/equipment/dn-equipment-may-cha-san.webp`. Dùng minh hoạ khối "Thiết bị chuyên dụng" trong `Trust`/`Process` section trang chủ.

---

# DN-BEFORE-01

Filename: `dn-before-01-sofa.webp`
Destination: `/public/images/before-after/dn-before-01-sofa.webp`
Priority: P0
Page: `/` (Trang chủ)
Section: `BeforeAfter`
Aspect ratio: 1:1
Recommended size: 800×800px

## Generation Prompt

Photo-realistic photograph, "before cleaning" state, of a fabric/fabric-blend sofa in a Vietnamese home living room. The sofa shows realistic, visible soiling — yellowish stains, dulled fabric color, light dust and surface grime consistent with months of normal household use (believable, not exaggerated or cartoonishly dirty). No person needs to be in this shot — focus entirely on the sofa itself, shot straight-on or at a very slight 3/4 angle, filling most of the frame with a small amount of the surrounding room visible (wall, floor edge, maybe a corner of a window) for context. The room is a typical Vietnamese home living room with natural daylight from a window as the primary light source, soft and even, no strong directional shadows. Camera: fixed tripod-style framing, eye-level or slightly above, standard lens (no wide-angle distortion), composition and camera distance chosen so it can be exactly replicated for a matching "after" photo of the same sofa in the same room. High photo-realism, natural color grading, no color correction/enhancement — looks like a real unedited photograph.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, digitally added/painted-on dirt overlay, exaggerated or cartoonish filth, western/American/European style furniture or interior architecture, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Ghế sofa trước khi Dọn Nè vệ sinh

## Integration Notes

Sau khi tạo, lưu file vào `public/images/before-after/dn-before-01-sofa.webp`. **Ràng buộc nhất quán bắt buộc với `DN-AFTER-01`:** cùng một chiếc sofa (cùng kiểu dáng, cùng chất liệu, cùng màu gốc, cùng vị trí kê trong phòng), cùng góc camera, cùng khoảng cách/lens, cùng vị trí đặt máy ảnh, cùng ánh sáng (chụp cùng thời điểm trong ngày, cùng nguồn sáng) — chỉ khác biệt duy nhất là trạng thái sạch/bẩn của sofa. Sinh `DN-BEFORE-01` trước, sau đó dùng lại chính xác mô tả bối cảnh/góc máy/ánh sáng khi sinh `DN-AFTER-01` để đảm bảo tính nhất quán (không sinh "hai căn phòng khác nhau").

---

# DN-AFTER-01

Filename: `dn-after-01-sofa.webp`
Destination: `/public/images/before-after/dn-after-01-sofa.webp`
Priority: P0
Page: `/` (Trang chủ)
Section: `BeforeAfter`
Aspect ratio: 1:1
Recommended size: 800×800px

## Generation Prompt

Photo-realistic photograph, "after cleaning" state, of the exact same fabric/fabric-blend sofa, same room, same camera position, same lens, same framing, and same lighting as `DN-BEFORE-01` — the only difference is that the sofa is now visibly clean: stains removed, fabric color restored to its true original tone (not artificially lightened or a different color/material/shape than the before photo), surface texture looks fresh and evenly clean, no yellowing or grime. No person needs to be in this shot — focus entirely on the sofa itself, same straight-on or slight 3/4 angle as the before photo, same amount of surrounding room visible for context (same wall, same floor edge, same window corner). Same natural daylight from the same window as the primary light source, same softness and direction, no strong directional shadows. Camera: identical tripod-style framing, eye-level or slightly above, standard lens, same composition and camera distance as the before photo so the two images form a matching before/after pair of the same sofa. High photo-realism, natural color grading consistent with the before photo, no color correction/enhancement — looks like a real unedited photograph taken shortly after `DN-BEFORE-01`.

## Negative Prompt

CleanHanoi logo, any competitor logo, Dọn Nè logo or brand mark rendered by AI, any text, letters, words, captions, watermark, signature, distorted or garbled text, extra fingers, missing fingers, deformed hands, mutated hands, unrealistic anatomy, different sofa shape/material/color than the before photo, different room or different camera angle/lighting than the before photo, unrealistically pristine/new-looking sofa inconsistent with a cleaned (not replaced) sofa, western/American/European style furniture or interior architecture, glossy over-produced stock-photo look, CGI, 3D render, illustration, cartoon, anime, oversaturated colors, excessive HDR, blurry, low resolution

## Alt Text

Ghế sofa sau khi Dọn Nè vệ sinh

## Integration Notes

Sau khi tạo, lưu file vào `public/images/before-after/dn-after-01-sofa.webp`. **Ràng buộc nhất quán bắt buộc với `DN-BEFORE-01`:** phải là cùng một chiếc sofa, cùng căn phòng, cùng camera position, cùng lens, cùng ánh sáng, cùng bố cục như đã sinh ở `DN-BEFORE-01` — chỉ thay đổi trạng thái sạch/bẩn của sofa, tuyệt đối không đổi màu sắc, chất liệu, hoặc hình dạng của sofa, không sinh thành "hai căn phòng khác nhau". Nếu model tạo ảnh hỗ trợ image-to-image/reference-image, nên dùng chính `DN-BEFORE-01` làm ảnh tham chiếu bố cục khi sinh ảnh này.
