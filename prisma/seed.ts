import { PrismaClient, PublishStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Dọn Nè platform database...');

  // 1. GLOBAL SETTINGS
  await prisma.globalSetting.upsert({
    where: { key: 'site_config' },
    update: {},
    create: {
      key: 'site_config',
      value: {
        brandName: 'Dọn Nè',
        slogan: 'Dịch vụ vệ sinh công nghiệp & dân dụng chuyên nghiệp tại Hà Nội',
        hotlines: ['0964.182.330', '0973.62.62.46'],
        zaloNumbers: ['0964182330', '0973626246'],
        emails: ['contact@donne.vn', 'donne.hanoi@gmail.com'],
        mainAddress: '31/12 Phúc Lợi, Phường Phúc Lợi, Quận Long Biên, Hà Nội',
        branchAddresses: [
          'Số 6, Ngách 5/12 Lê Trọng Tấn, La Khê, Hà Đông, Hà Nội',
          'Tòa C2, Làng Quốc Tế Thăng Long, Dịch Vọng, Cầu Giấy, Hà Nội',
          'Số 45, Ngõ 168 Hào Nam, Đống Đa, Hà Nội'
        ],
        businessCode: '0109865421',
        workingHours: 'Phục vụ 24/7 (Cả Thứ Bảy, Chủ Nhật và Ngày Lễ)',
        footerCommitment: 'Nghiệm thu hài lòng 100% mới nhận thanh toán. Bảo hành làm lại miễn phí trong 24 giờ nếu có bất kỳ điểm chưa ưng ý.',
        socials: {
          facebook: 'https://facebook.com/donne.vietnam',
          tiktok: 'https://tiktok.com/@donne.official'
        }
      }
    }
  });

  // 2. SERVICE CATEGORIES
  const categoriesData = [
    { slug: 'nha-o', name: 'Nhà Ở & Dân Dụng', description: 'Vệ sinh nhà phố, căn hộ chung cư, biệt thự, dọn nhà theo giờ', sortOrder: 1 },
    { slug: 'doanh-nghiep', name: 'Doanh Nghiệp & Xây Dựng', description: 'Vệ sinh sau xây dựng, văn phòng, nhà xưởng, tòa nhà, bếp công nghiệp', sortOrder: 2 },
    { slug: 'giat-noi-that', name: 'Giặt & Nội Thất', description: 'Giặt ghế sofa, đệm cao su, topper, thảm trải sàn, rèm cửa', sortOrder: 3 },
    { slug: 'san-kinh', name: 'Sàn & Lau Kính', description: 'Đánh bóng sàn đá Marble/Granite, mài sàn bê tông, lau kính tòa nhà', sortOrder: 4 },
    { slug: 'dich-vu-khac', name: 'Dịch Vụ Chuyên Sâu', description: 'Vệ sinh sân Pickleball, thau rửa bể nước ngầm, khử khuẩn mốc tường', sortOrder: 5 }
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat
    });
    categoryMap.set(cat.slug, created.id);
  }

  // 3. SERVICES
  const servicesData = [
    {
      slug: 've-sinh-nha-cua',
      categorySlug: 'nha-o',
      title: 'Tổng Vệ Sinh Nhà Cửa Trọn Gói',
      badge: 'Phổ biến nhất',
      shortDescription: 'Dọn sạch từ trần đến sàn, làm sạch dầu mỡ bếp, tẩy cặn canxi nhà tắm, hút bụi mịn chuyên sâu.',
      whenNeeded: ['Nhà vừa chuyển đến hoặc chuyển đi', 'Tổng vệ sinh định kỳ 3-6 tháng', 'Chuẩn bị đón Tết hoặc tiệc gia đình'],
      includedItems: ['Hút bụi trần, tường, khe cửa', 'Cọ rửa toilet, tẩy cặn kính tắm', 'Tẩy dầu mỡ bếp, máy hút mùi', 'Lau cửa kính 2 mặt trong nhà', 'Chà sàn và hút khô'],
      excludedItems: ['Giặt sofa, đệm (tính riêng theo combo)', 'Lau kính ngoài trời dùng đu dây'],
      processSteps: ['Khảo sát & báo giá chốt', 'Phân loại rác & quét dọn thô', 'Hút bụi công nghiệp toàn diện', 'Tẩy điểm ố & cọ rửa chi tiết', 'Khách nghiệm thu từng phòng & thanh toán'],
      commitments: ['Không phát sinh chi phí', 'Nhân viên có lý lịch rõ ràng', 'Hóa chất chuẩn an toàn sức khỏe'],
      seoTitle: 'Dịch Vụ Tổng Vệ Sinh Nhà Cửa Hà Nội Trọn Gói | Dọn Nè',
      seoDescription: 'Dịch vụ tổng vệ sinh nhà cửa chuyên nghiệp tại Hà Nội. Đội ngũ tận tâm, máy móc hiện đại, nghiệm thu hài lòng mới thanh toán. Hotline: 0964.182.330.'
    },
    {
      slug: 've-sinh-can-ho-chung-cu',
      categorySlug: 'nha-o',
      title: 'Vệ Sinh Căn Hộ Chung Cư',
      badge: 'Nhanh trong ngày',
      shortDescription: 'Quy trình dọn sạch tiêu chuẩn cho căn hộ 1-3 phòng ngủ, bảo vệ sàn gỗ và nội thất cao cấp.',
      seoTitle: 'Dịch Vụ Vệ Sinh Căn Hộ Chung Cư Hà Nội | Dọn Nè',
      seoDescription: 'Vệ sinh căn hộ chung cư Hà Nội sạch tinh tươm. Báo giá trọn gói không phát sinh, hỗ trợ linh hoạt cuối tuần.'
    },
    {
      slug: 've-sinh-sau-xay-dung',
      categorySlug: 'doanh-nghiep',
      title: 'Vệ Sinh Công Trình Sau Xây Dựng',
      badge: 'Công nghệ cao',
      shortDescription: 'Sủi sạch sơn, xi măng bám sàn, hút sạch bụi mịn công nghiệp bằng máy công suất lớn 3 mô-tơ.',
      seoTitle: 'Vệ Sinh Công Trình Sau Xây Dựng Tại Hà Nội | Dọn Nè',
      seoDescription: 'Dịch vụ vệ sinh sau xây dựng nhà xưởng, tòa nhà, biệt thự tại Hà Nội. Thiết bị hiện đại, xử lý triệt để bụi mịn.'
    },
    {
      slug: 've-sinh-van-phong',
      categorySlug: 'doanh-nghiep',
      title: 'Vệ Sinh Văn Phòng Làm Việc',
      badge: 'Linh hoạt giờ giấc',
      shortDescription: 'Tổng vệ sinh hoặc định kỳ cuối tuần, làm sạch không gian làm việc giúp nâng cao năng suất doanh nghiệp.',
      seoTitle: 'Dịch Vụ Vệ Sinh Văn Phòng Hà Nội Chuyên Nghiệp | Dọn Nè',
      seoDescription: 'Dịch vụ vệ sinh văn phòng trọn gói tại Hà Nội. Phục vụ ngoài giờ hành chính không ảnh hưởng giờ làm việc.'
    },
    {
      slug: 'giat-ghe-sofa',
      categorySlug: 'giat-noi-that',
      title: 'Giặt Ghế Sofa Nỉ / Vải / Da',
      badge: 'Hơi nước nóng 140°C',
      shortDescription: 'Phun hút sâu khử khuẩn 99.9%, đánh bay vết ố mồ hôi, thức ăn và khử mùi ẩm mốc hiệu quả.',
      seoTitle: 'Dịch Vụ Giặt Ghế Sofa Tận Nhà Hà Nội | Dọn Nè',
      seoDescription: 'Giặt sofa nỉ, da, vải tại nhà bằng công nghệ hơi nước nóng 140°C. Sạch sâu, sấy khô nhanh chóng.'
    },
    {
      slug: 'giat-dem',
      categorySlug: 'giat-noi-that',
      title: 'Giặt Đệm Cao Su / Lò Xo / Bông Ép',
      badge: 'Khử khuẩn mạt bụi',
      shortDescription: 'Diệt sạch mạt giường, tẩy ố vàng vết nước tiểu em bé, xịt tinh dầu khử khuẩn tự nhiên an toàn cho da.',
      seoTitle: 'Dịch Vụ Giặt Đệm Tại Nhà Hà Nội | Dọn Nè',
      seoDescription: 'Giặt đệm cao su Kim Cương, Kymdan, Liên Á, đệm lò xo tại nhà ở Hà Nội. Khử mùi và diệt khuẩn chuyên sâu.'
    },
    {
      slug: 'giat-tham-van-phong',
      categorySlug: 'giat-noi-that',
      title: 'Giặt Thảm Trải Sàn Văn Phòng',
      badge: 'Diện tích lớn',
      shortDescription: 'Máy chà thảm công nghiệp mâm xoay kết hợp máy hút chân không công suất lớn giúp thảm khô nhanh.',
      seoTitle: 'Dịch Vụ Giặt Thảm Văn Phòng Giá Rẻ Hà Nội | Dọn Nè',
      seoDescription: 'Giặt thảm văn phòng diện tích lớn tại Hà Nội. Hóa chất sinh học an toàn, thi công ngoài giờ linh hoạt.'
    },
    {
      slug: 'dich-vu-lau-kinh',
      categorySlug: 'san-kinh',
      title: 'Dịch Vụ Lau Kính Mặt Dựng & Tòa Nhà',
      badge: 'Thợ đu dây chứng chỉ',
      shortDescription: 'Lau kính mặt ngoài tòa nhà cao tầng, shophouse, tẩy ố vảy cá và sơn keo bám trên kính lâu ngày.',
      seoTitle: 'Dịch Vụ Lau Kính Tòa Nhà Hà Nội Chuyên Nghiệp | Dọn Nè',
      seoDescription: 'Lau kính nhà cao tầng, biệt thự, văn phòng tại Hà Nội. Đội thợ đu dây có bảo hiểm an toàn tuyệt đối.'
    },
    {
      slug: 've-sinh-san-pickleball',
      categorySlug: 'dich-vu-khac',
      title: 'Vệ Sinh & Bảo Dưỡng Sân Pickleball / Tennis',
      badge: 'Hot trend 2026',
      shortDescription: 'Tẩy sạch rêu mốc, bụi cát trơn trượt, giữ độ ma sát chuẩn thể thao cho bề mặt sơn Acrylic sân Pickleball.',
      seoTitle: 'Dịch Vụ Vệ Sinh Sân Pickleball Tại Hà Nội | Dọn Nè',
      seoDescription: 'Dọn sạch rêu mốc, đất cát sân Pickleball tại Hà Nội bằng máy áp lực cao và hóa chất chuyên dụng không hại sơn.'
    }
  ];

  const serviceMap = new Map<string, string>();
  for (const s of servicesData) {
    const catId = categoryMap.get(s.categorySlug)!;
    const created = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        badge: s.badge,
        shortDescription: s.shortDescription,
        whenNeeded: s.whenNeeded ? s.whenNeeded : undefined,
        includedItems: s.includedItems ? s.includedItems : undefined,
        excludedItems: s.excludedItems ? s.excludedItems : undefined,
        processSteps: s.processSteps ? s.processSteps : undefined,
        commitments: s.commitments ? s.commitments : undefined,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription
      },
      create: {
        categoryId: catId,
        slug: s.slug,
        title: s.title,
        badge: s.badge,
        shortDescription: s.shortDescription,
        whenNeeded: s.whenNeeded ? s.whenNeeded : undefined,
        includedItems: s.includedItems ? s.includedItems : undefined,
        excludedItems: s.excludedItems ? s.excludedItems : undefined,
        processSteps: s.processSteps ? s.processSteps : undefined,
        commitments: s.commitments ? s.commitments : undefined,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription
      }
    });
    serviceMap.set(s.slug, created.id);
  }

  // 4. 24 SINGLE-SOURCE PRICE ITEMS
  const priceItemsData = [
    // Nhà cửa & Chung cư
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tổng vệ sinh căn hộ 1 Phòng ngủ (dưới 55m²)', unit: 'Gói', minPrice: 800000, maxPrice: 1000000, conditionText: 'Đã bao gồm hút bụi mịn, lau kính mặt trong, cọ toilet', sortOrder: 1 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tổng vệ sinh căn hộ 2 Phòng ngủ (55m² – 85m²)', unit: 'Gói', minPrice: 1100000, maxPrice: 1400000, conditionText: 'Bao gồm 2 toilet, bếp, ban công', sortOrder: 2 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tổng vệ sinh căn hộ 3 Phòng ngủ (85m² – 120m²)', unit: 'Gói', minPrice: 1500000, maxPrice: 1900000, conditionText: 'Bao gồm toàn bộ nội thất và khu sinh hoạt chung', sortOrder: 3 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tổng vệ sinh nhà phố, nhà ống nhiều tầng', unit: 'm²', minPrice: 12000, maxPrice: 18000, conditionText: 'Tính theo tổng diện tích sàn', sortOrder: 4 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tổng vệ sinh biệt thự, villa đơn lập / song lập', unit: 'm²', minPrice: 15000, maxPrice: 22000, conditionText: 'Bao gồm sân vườn thô và ban công lớn', sortOrder: 5 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Dọn nhà định kỳ theo giờ (nhân viên chuyên nghiệp)', unit: 'Giờ/người', minPrice: 70000, maxPrice: 90000, conditionText: 'Tối thiểu 3.5 giờ/ca làm', sortOrder: 6 },
    
    // Doanh nghiệp & Sau xây dựng
    { serviceSlug: 've-sinh-sau-xay-dung', itemName: 'Vệ sinh sau xây dựng nhà ở, chung cư mới', unit: 'm²', minPrice: 15000, maxPrice: 22000, conditionText: 'Tẩy keo, sơn bám sàn, hút bụi xi măng', sortOrder: 7 },
    { serviceSlug: 've-sinh-sau-xay-dung', itemName: 'Vệ sinh sau xây dựng tòa nhà, showroom lớn (> 500m²)', unit: 'm²', minPrice: 10000, maxPrice: 16000, conditionText: 'Khảo sát báo giá theo độ khó thực tế', sortOrder: 8 },
    { serviceSlug: 've-sinh-van-phong', itemName: 'Tổng vệ sinh văn phòng định kỳ cuối tuần', unit: 'm²', minPrice: 8000, maxPrice: 15000, conditionText: 'Làm ngoài giờ hành chính', sortOrder: 9 },
    { serviceSlug: 've-sinh-van-phong', itemName: 'Cung cấp tạp vụ văn phòng định kỳ hàng tháng', unit: 'Tháng', minPrice: 6500000, maxPrice: 8500000, conditionText: '8 tiếng/ngày, từ thứ 2 đến thứ 6', sortOrder: 10 },
    
    // Giặt ghế & Nội thất
    { serviceSlug: 'giat-ghe-sofa', itemName: 'Giặt sofa nỉ / vải văng đơn (1m6 – 2m2)', unit: 'Bộ', minPrice: 250000, maxPrice: 350000, conditionText: 'Phun hút nước nóng diệt khuẩn', sortOrder: 11 },
    { serviceSlug: 'giat-ghe-sofa', itemName: 'Giặt sofa góc chữ L nỉ / vải', unit: 'Bộ', minPrice: 350000, maxPrice: 450000, conditionText: 'Kèm tặng kèm 2 gối ôm', sortOrder: 12 },
    { serviceSlug: 'giat-ghe-sofa', itemName: 'Vệ sinh & dưỡng da ghế sofa da thật / giả da cao cấp', unit: 'Bộ', minPrice: 400000, maxPrice: 600000, conditionText: 'Dùng kem dưỡng da chuyên dụng 3M', sortOrder: 13 },
    { serviceSlug: 'giat-dem', itemName: 'Giặt đệm bông ép / mút (1m6 – 1m8)', unit: 'Chiếc', minPrice: 250000, maxPrice: 350000, conditionText: 'Hút sạch sâu bụi và vết ố', sortOrder: 14 },
    { serviceSlug: 'giat-dem', itemName: 'Giặt đệm cao su thiên nhiên chuyên sâu', unit: 'Chiếc', minPrice: 300000, maxPrice: 450000, conditionText: 'Công nghệ hơi nước nóng bảo vệ bề mặt cao su', sortOrder: 15 },
    { serviceSlug: 'giat-dem', itemName: 'Giặt tấm làm mềm đệm topper', unit: 'Chiếc', minPrice: 150000, maxPrice: 200000, conditionText: 'Giặt sấy khô tại chỗ', sortOrder: 16 },
    { serviceSlug: 'giat-tham-van-phong', itemName: 'Giặt thảm văn phòng diện tích nhỏ (< 100m²)', unit: 'Gói', minPrice: 800000, maxPrice: 1200000, conditionText: 'Trọn gói thiết bị hóa chất', sortOrder: 17 },
    { serviceSlug: 'giat-tham-van-phong', itemName: 'Giặt thảm văn phòng diện tích lớn (> 100m²)', unit: 'm²', minPrice: 8000, maxPrice: 14000, conditionText: 'Máy chà mâm xoay công nghiệp', sortOrder: 18 },
    { serviceSlug: 'giat-ghe-sofa', itemName: 'Giặt ghế xoay văn phòng nhân viên', unit: 'Chiếc', minPrice: 20000, maxPrice: 35000, conditionText: 'Số lượng từ 20 chiếc trở lên', sortOrder: 19 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Tháo lắp & Giặt rèm cửa sổ / ban công', unit: 'kg', minPrice: 30000, maxPrice: 45000, conditionText: 'Giao nhận và lắp đặt lại tận nhà', sortOrder: 20 },
    
    // Kính & Sàn & Sân Thể Thao
    { serviceSlug: 'dich-vu-lau-kinh', itemName: 'Lau kính mặt trong nhà, cửa sổ, vách tắm', unit: 'm²', minPrice: 8000, maxPrice: 15000, conditionText: 'Theo diện tích mặt kính', sortOrder: 21 },
    { serviceSlug: 'dich-vu-lau-kinh', itemName: 'Lau kính ngoài trời tòa nhà (đu dây an toàn)', unit: 'm²', minPrice: 15000, maxPrice: 28000, conditionText: 'Khảo sát thực địa và chuẩn bị giàn giáo/dây', sortOrder: 22 },
    { serviceSlug: 've-sinh-nha-cua', itemName: 'Chà sàn công nghiệp & đánh bóng sàn gạch men', unit: 'm²', minPrice: 8000, maxPrice: 15000, conditionText: 'Tẩy ố ron gạch và rêu mốc', sortOrder: 23 },
    { serviceSlug: 've-sinh-san-pickleball', itemName: 'Vệ sinh tẩy rêu mốc & bảo dưỡng sân Pickleball', unit: 'Sân', minPrice: 1200000, maxPrice: 2000000, conditionText: 'Sân tiêu chuẩn 13.41m x 6.1m kèm khu viền', sortOrder: 24 }
  ];

  // Clear existing price items to avoid duplicate keys during re-seed
  await prisma.priceItem.deleteMany();
  for (const item of priceItemsData) {
    const srvId = serviceMap.get(item.serviceSlug);
    if (srvId) {
      await prisma.priceItem.create({
        data: {
          serviceId: srvId,
          itemName: item.itemName,
          unit: item.unit,
          minPrice: item.minPrice,
          maxPrice: item.maxPrice,
          conditionText: item.conditionText,
          sortOrder: item.sortOrder,
          status: PublishStatus.PUBLISHED
        }
      });
    }
  }

  // 5. 12 HANOI LOCATIONS
  const locationsData = [
    { slug: 'cau-giay', districtName: 'Quận Cầu Giấy', featuredText: 'Có mặt sau 15 phút tại Dịch Vọng, Nghĩa Đô, Trung Hòa, Yên Hòa.', serviceHubAddress: 'Tòa C2 Thăng Long, Dịch Vọng, Cầu Giấy', sortOrder: 1 },
    { slug: 'dong-da', districtName: 'Quận Đống Đa', featuredText: 'Phục vụ nhanh chóng tại Hào Nam, Láng Hạ, Thái Hà, Xã Đàn.', serviceHubAddress: 'Số 45 Hào Nam, Đống Đa', sortOrder: 2 },
    { slug: 'long-bien', districtName: 'Quận Long Biên', featuredText: 'Trung tâm tổng hành dinh Dọn Nè tại Phúc Lợi, Vinhomes Riverside, Sài Đồng.', serviceHubAddress: '31/12 Phúc Lợi, Long Biên', sortOrder: 3 },
    { slug: 'ha-dong', districtName: 'Quận Hà Đông', featuredText: 'Đội thi công túc trực tại Văn Quán, Mỗ Lao, La Khê, Dương Nội.', serviceHubAddress: 'Số 6 Ngách 5/12 Lê Trọng Tấn, Hà Đông', sortOrder: 4 },
    { slug: 'nam-tu-liem', districtName: 'Quận Nam Từ Liêm', featuredText: 'Chuyên căn hộ Vinhomes Smart City, Mỹ Đình, Mễ Trì, Cầu Diễn.', sortOrder: 5 },
    { slug: 'bac-tu-liem', districtName: 'Quận Bắc Từ Liêm', featuredText: 'Phục vụ Ngoại Giao Đoàn, Xuân Đỉnh, Cổ Nhuế, Tây Tựu.', sortOrder: 6 },
    { slug: 'thanh-xuan', districtName: 'Quận Thanh Xuân', featuredText: 'Phục vụ Royal City, Nguyễn Trãi, Khuất Duy Tiến, Kim Giang.', sortOrder: 7 },
    { slug: 'ba-dinh', districtName: 'Quận Ba Đình', featuredText: 'Vệ sinh căn hộ dịch vụ, đại sứ quán tại Liễu Giai, Kim Mã, Đội Cấn.', sortOrder: 8 },
    { slug: 'tay-ho', districtName: 'Quận Tây Hồ', featuredText: 'Chuyên căn hộ cao cấp và biệt thự Quảng An, Nhật Tân, Ciputra.', sortOrder: 9 },
    { slug: 'hoang-mai', districtName: 'Quận Hoàng Mai', featuredText: 'Phục vụ Gamuda, Linh Đàm, Times City, Trương Định.', sortOrder: 10 },
    { slug: 'hai-ba-trung', districtName: 'Quận Hai Bà Trưng', featuredText: 'Phục vụ Minh Khai, Bạch Mai, Lê Đại Hành, Lò Đúc.', sortOrder: 11 },
    { slug: 'gia-lam', districtName: 'Huyện Gia Lâm', featuredText: 'Chuyên sâu căn hộ và shophouse Vinhomes Ocean Park 1.', sortOrder: 12 }
  ];

  for (const loc of locationsData) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: loc,
      create: loc
    });
  }

  // 6. HOMEPAGE SECTIONS IN BLOCK CMS
  const homeSections = [
    {
      type: 'Hero',
      variant: 'default',
      order: 1,
      visible: true,
      props: {
        badgeText: 'DỊCH VỤ VỆ SINH CHUYÊN NGHIỆP HÀ NỘI',
        heading: 'Không Gian Sống & Làm Việc',
        highlightWord: 'Sạch Tinh Tươm',
        subheading: 'Dọn Nè mang đến giải pháp tổng vệ sinh nhà cửa, công trình sau xây dựng, văn phòng và giặt đệm sofa bằng máy móc hiện đại. Nghiệm thu hài lòng 100% mới thanh toán.',
        primaryCtaText: 'Nhận Báo Giá 5 Phút',
        primaryCtaAction: 'quote_modal',
        secondaryCtaText: 'Xem Bảng Giá 2026',
        secondaryCtaAction: 'pricing',
        trustBullets: ['Khảo sát & Báo giá minh bạch', 'Nhân viên hồ sơ nhân thân chuẩn', 'Bảo hành hỗ trợ trong 24h']
      }
    },
    {
      type: 'ServiceGrid',
      variant: 'default',
      order: 2,
      visible: true,
      props: {
        heading: 'Dịch Vụ Vệ Sinh Trọng Tâm',
        subheading: 'Giải pháp làm sạch toàn diện cho gia đình và doanh nghiệp tại Hà Nội'
      }
    },
    {
      type: 'PricingPreview',
      variant: 'default',
      order: 3,
      visible: true,
      props: {
        heading: 'Bảng Giá Minh Bạch — Không Phát Sinh',
        subheading: 'Giá niêm yết rõ ràng theo diện tích thực tế và tình trạng công trình'
      }
    },
    {
      type: 'BeforeAfter',
      variant: 'default',
      order: 4,
      visible: true,
      props: {
        heading: 'Hình Ảnh Thực Tế Thi Công',
        subheading: 'Kết quả làm sạch rõ rệt trước và sau khi Dọn Nè xử lý'
      }
    },
    {
      type: 'Trust',
      variant: 'default',
      order: 5,
      visible: true,
      props: {
        heading: '3 Lý Do Khách Hàng Chọn Dọn Nè',
        subheading: 'Sự tin cậy và minh bạch là tiêu chuẩn số 1 trong mọi ca làm việc'
      }
    },
    {
      type: 'Process',
      variant: 'default',
      order: 6,
      visible: true,
      props: {
        heading: 'Quy Trình Làm Việc 4 Bước Chuẩn Mực',
        subheading: 'Nhanh chóng, rõ ràng và đảm bảo quyền lợi tối đa của khách hàng'
      }
    },
    {
      type: 'ServiceAreas',
      variant: 'default',
      order: 7,
      visible: true,
      props: {
        heading: 'Phủ Sóng 12 Quận Huyện Hà Nội',
        subheading: 'Đội ngũ túc trực tại các trạm cơ sở, có mặt sau 15-30 phút khi có lịch hẹn'
      }
    },
    {
      type: 'FAQ',
      variant: 'default',
      order: 8,
      visible: true,
      props: {
        heading: 'Câu Hỏi Thường Gặp'
      }
    },
    {
      type: 'CTA',
      variant: 'highlight',
      order: 9,
      visible: true,
      props: {
        heading: 'Đặt Lịch Dọn Dẹp Hôm Nay — Nhận Ưu Đãi Đầu Tuần',
        subheading: 'Liên hệ qua Hotline hoặc Zalo để nhân viên tư vấn gửi phương án tối ưu trong 5 phút.',
        hotlineText: '0964.182.330'
      }
    }
  ];

  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {
      title: 'Trang Chủ Dọn Nè',
      status: PublishStatus.PUBLISHED,
      seoTitle: 'Dọn Nè — Dịch Vụ Vệ Sinh Công Nghiệp & Nhà Cửa Chuyên Nghiệp Hà Nội',
      seoDescription: 'Dọn Nè cung cấp dịch vụ tổng vệ sinh nhà cửa, vệ sinh sau xây dựng, văn phòng, giặt sofa đệm tại Hà Nội. Giá minh bạch, nghiệm thu mới thanh toán. Hotline: 0964.182.330.'
    },
    create: {
      slug: 'home',
      title: 'Trang Chủ Dọn Nè',
      status: PublishStatus.PUBLISHED,
      seoTitle: 'Dọn Nè — Dịch Vụ Vệ Sinh Công Nghiệp & Nhà Cửa Chuyên Nghiệp Hà Nội',
      seoDescription: 'Dọn Nè cung cấp dịch vụ tổng vệ sinh nhà cửa, vệ sinh sau xây dựng, văn phòng, giặt sofa đệm tại Hà Nội. Giá minh bạch, nghiệm thu mới thanh toán. Hotline: 0964.182.330.'
    }
  });

  await prisma.pageSection.deleteMany({ where: { pageId: homePage.id } });
  for (const sec of homeSections) {
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        type: sec.type,
        variant: sec.variant,
        sortOrder: sec.order,
        visible: sec.visible,
        props: sec.props
      }
    });
  }

  // Version snapshot
  await prisma.pageVersion.create({
    data: {
      pageId: homePage.id,
      versionNumber: 1,
      sectionsJson: homeSections,
      isPublished: true
    }
  });

  // 7. GLOBAL FAQs
  const faqs = [
    { question: 'Dọn Nè có mang đầy đủ dụng cụ và máy móc chuyên dụng không?', answer: 'Có. Đội ngũ Dọn Nè trang bị đầy đủ máy hút bụi công nghiệp 3 mô-tơ, máy chà sàn, máy phun hút hơi nước nóng 140°C, cây gạt kính chuyên dụng cùng toàn bộ thang nhôm, khăn microfiber và hóa chất an toàn đạt chuẩn.', isGlobal: true, sortOrder: 1 },
    { question: 'Quy trình nghiệm thu và thanh toán diễn ra như thế nào?', answer: 'Sau khi hoàn tất công việc, đội trưởng sẽ cùng khách hàng kiểm tra từng phòng và từng hạng mục. Chỉ khi khách hàng hoàn toàn ưng ý và ký biên bản nghiệm thu thì mới tiến hành thanh toán tiền mặt hoặc chuyển khoản.', isGlobal: true, sortOrder: 2 },
    { question: 'Dọn Nè có xuất hóa đơn VAT cho công ty / doanh nghiệp không?', answer: 'Có. Dọn Nè hỗ trợ đầy đủ hợp đồng kinh tế, biên bản nghiệm thu thanh lý và xuất hóa đơn điện tử VAT hợp lệ cho tất cả khách hàng doanh nghiệp, văn phòng và trường học.', isGlobal: true, sortOrder: 3 }
  ];

  await prisma.fAQ.deleteMany({ where: { isGlobal: true } });
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
