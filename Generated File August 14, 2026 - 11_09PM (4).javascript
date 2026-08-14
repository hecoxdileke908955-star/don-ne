export interface SiteConfig {
  brandName: string;
  slogan: string;
  hotlines: string[];
  zaloNumbers: string[];
  emails: string[];
  mainAddress: string;
  branchAddresses: string[];
  businessCode: string;
  workingHours: string;
  footerCommitment: string;
  socials: {
    facebook?: string;
    tiktok?: string;
  };
}

export const FALLBACK_SITE_CONFIG: SiteConfig = {
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
};
