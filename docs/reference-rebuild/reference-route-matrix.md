# Reference Route Matrix — URL-by-URL (54/54 fetch riêng lẻ, Round 2)

> **Cập nhật Round 2**: khác với báo cáo Round 1 (chỉ fetch 12/54 URL, suy luận 42 URL còn lại từ 3 mẫu), lượt này đã **fetch trực tiếp toàn bộ 54/54 URL**, phân tích `<body class>`, sidebar, grid, pagination, final-cta box qua regex trên HTML thật (không suy đoán). Kết quả: `SAME TEMPLATE VERIFIED` cho 41 trang service detail — xác nhận bằng chuỗi class thật `wp-singular post-template-default single single-post postid-N` giống hệt nhau ở toàn bộ 41 trang, không phải suy luận từ mẫu.

**HTTP status**: 54/54 = 200. Không có redirect, không có URL lỗi, không có duplicate.

**Biến thể phát hiện được** (khác báo cáo Round 1 chưa nêu): 3/41 trang service detail (`tay-keo-dan-tham`, `ve-sinh-nha-cua`, `ve-sinh-sau-xay-dung`) có thêm khối `.final-cta` giữa bài — 38/41 trang còn lại không có. Đây là biến thể nội dung nhỏ trong cùng 1 template, không phải template khác.

| # | URL | HTTP | Page type (verified) | Body class signature | Sidebar | Grid | Pagination | Final CTA | Dọn Nè route | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | / | 200 | Homepage | `home wp-singular page-template-default page page-id-13 wp-custom-logo ` | False | True | False | False | / |  |
| 2 | /dich-vu/ | 200 | Service archive | `archive category category-dich-vu category-3 wp-custom-logo wp-theme-c` | False | True | True | False | /dich-vu |  |
| 3 | /bang-gia/ | 200 | Pricing | `wp-singular page-template-default page page-id-2 wp-custom-logo wp-the` | False | False | False | False | /bang-gia |  |
| 4 | /khu-vuc-phuc-vu/ | 200 | Location archive | `archive category category-khu-vuc-phuc-vu category-4 wp-custom-logo wp` | False | True | True | False | /khu-vuc-phuc-vu |  |
| 5 | /cam-nang-ve-sinh/ | 200 | Article archive | `archive category category-cam-nang-ve-sinh category-1 wp-custom-logo w` | False | True | True | False | /cam-nang-ve-sinh |  |
| 6 | /gioi-thieu/ | 200 | About | `wp-singular page-template-default page page-id-333 wp-custom-logo wp-t` | False | False | False | False | /gioi-thieu |  |
| 7 | /lien-he/ | 200 | Contact | `wp-singular page-template-default page page-id-322 wp-custom-logo wp-t` | False | False | False | False | /lien-he |  |
| 8 | /ve-sinh-san-pickleball/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2824 singl` | True | True | False | False | /ve-sinh-san-pickleball |  |
| 9 | /ve-sinh-ghe-o-to/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2530 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 10 | /giat-dem-cao-su/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2514 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 11 | /ve-sinh-sofa-ni-vai/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2393 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 12 | /giat-chan-ga-goi-dem/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2377 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 13 | /dich-vu-tay-moc-tuong-tran-nha/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2335 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 14 | /hanoi-mattress-cleaning-service/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2260 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 15 | /hanoi-sofa-cleaning-service/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2250 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 16 | /korean-home-carpet-cleaning-hanoi/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2242 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 17 | /korean-mattress-cleaning-hanoi/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2233 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 18 | /korean-sofa-cleaning-hanoi/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2225 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 19 | /hanoi-house-cleaning-service/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2216 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 20 | /dich-vu/page/2/ | 200 | Service archive (pagination) | `archive paged category category-dich-vu category-3 wp-custom-logo page` | False | True | True | False | /dich-vu |  |
| 21 | /korean-house-cleaning-hanoi/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2204 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 22 | /tay-keo-dan-tham/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-2117 singl` | True | True | False | True | none (NOT OFFERED) | Có final-cta box (biến thể nhỏ) |
| 23 | /ve-sinh-nha-don-tet/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-1606 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 24 | /quet-mang-nhen-nha-xuong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-1431 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 25 | /giat-topper/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-1342 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 26 | /giat-rem/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-1332 singl` | True | True | False | False | none (NOT OFFERED) |  |
| 27 | /ve-sinh-mai-ton-nha-xuong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-644 single` | True | True | False | False | none (NOT OFFERED) |  |
| 28 | /danh-bong-san-be-tong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-641 single` | True | True | False | False | none (NOT OFFERED) |  |
| 29 | /ve-sinh-can-ho-chung-cu/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-646 single` | True | True | False | False | /ve-sinh-can-ho-chung-cu |  |
| 30 | /ve-sinh-bep-cong-nghiep/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-147 single` | True | True | False | False | none (NOT OFFERED) |  |
| 31 | /thau-rua-be-nuoc-ngam/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-142 single` | True | True | False | False | none (NOT OFFERED) |  |
| 32 | /ve-sinh-toa-nha/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-136 single` | True | True | False | False | none (NOT OFFERED) |  |
| 33 | /dich-vu/page/3/ | 200 | Service archive (pagination) | `archive paged category category-dich-vu category-3 wp-custom-logo page` | False | True | True | False | /dich-vu |  |
| 34 | /danh-bong-san-go/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-140 single` | True | True | False | False | none (NOT OFFERED) |  |
| 35 | /danh-bong-san-da/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-134 single` | True | True | False | False | none (NOT OFFERED) |  |
| 36 | /mai-san-be-tong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-132 single` | True | True | False | False | none (NOT OFFERED) |  |
| 37 | /ve-sinh-biet-thu/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-129 single` | True | True | False | False | none (NOT OFFERED) |  |
| 38 | /dich-vu-cha-san/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-127 single` | True | True | False | False | none (NOT OFFERED) |  |
| 39 | /don-nha-theo-gio/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-138 single` | True | True | False | False | none (NOT OFFERED) |  |
| 40 | /ve-sinh-sofa-da/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-125 single` | True | True | False | False | none (NOT OFFERED) |  |
| 41 | /giat-ghe-van-phong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-123 single` | True | True | False | False | none (NOT OFFERED) |  |
| 42 | /giat-tham-van-phong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-121 single` | True | True | False | False | /giat-tham-van-phong |  |
| 43 | /cung-cap-tap-vu/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-109 single` | True | True | False | False | none (NOT OFFERED) |  |
| 44 | /dich-vu-lau-kinh/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-80 single-` | True | True | False | False | /dich-vu-lau-kinh |  |
| 45 | /giat-dem/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-76 single-` | True | True | False | False | /giat-dem |  |
| 46 | /dich-vu/page/4/ | 200 | Service archive (pagination) | `archive paged category category-dich-vu category-3 wp-custom-logo page` | False | True | True | False | /dich-vu |  |
| 47 | /giat-ghe-sofa/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-69 single-` | True | True | False | False | /giat-ghe-sofa |  |
| 48 | /ve-sinh-nha-cua/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-51 single-` | True | True | False | True | /ve-sinh-nha-cua | Có final-cta box (biến thể nhỏ) |
| 49 | /giat-tham/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-73 single-` | True | True | False | False | none (NOT OFFERED) |  |
| 50 | /ve-sinh-van-phong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-62 single-` | True | True | False | False | /ve-sinh-van-phong |  |
| 51 | /ve-sinh-sau-xay-dung/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-20 single-` | True | True | False | True | /ve-sinh-sau-xay-dung | Có final-cta box (biến thể nhỏ) |
| 52 | /ve-sinh-nha-xuong/ | 200 | Service detail (single-post) VERIFIED | `wp-singular post-template-default single single-post postid-42 single-` | True | True | False | False | none (NOT OFFERED) |  |
| 53 | /chinh-sach-bao-mat/ | 200 | Policy | `privacy-policy wp-singular page-template-default page page-id-3 wp-cus` | False | False | False | False | /chinh-sach-bao-mat |  |
| 54 | /chinh-sach-bao-hanh/ | 200 | Policy | `wp-singular page-template-default page page-id-501 wp-custom-logo wp-t` | False | False | False | False | /chinh-sach-bao-hanh |  |