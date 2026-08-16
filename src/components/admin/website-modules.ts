import { UserRole } from '@prisma/client';

export type WebsiteModuleKey = 'home' | 'business' | 'services' | 'pricing' | 'faq';

export interface WebsiteModuleMeta {
  key: WebsiteModuleKey;
  href: string;
  label: string;
  minRole: UserRole;
  description: string;
  saveNote: string;
}

// Single source of truth for the Website Editor hub — used by the hub index
// cards, the shell nav (desktop + mobile), and each module route's
// save-semantics note. minRole here is UX-only; the real gate is each
// module route's own requireAdminRole() call plus the underlying API.
export const WEBSITE_MODULES: WebsiteModuleMeta[] = [
  {
    key: 'home',
    href: '/admin/website/home',
    label: 'Trang chủ',
    minRole: 'EDITOR',
    description: 'Chỉnh sửa nội dung, SEO và thứ tự các khối trên trang chủ.',
    saveNote: 'Thay đổi Trang chủ chỉ xuất hiện công khai sau khi bấm Xuất bản.',
  },
  {
    key: 'business',
    href: '/admin/website/business',
    label: 'Thông tin doanh nghiệp',
    minRole: 'ADMIN',
    description: 'Thương hiệu, liên hệ, địa chỉ, mạng xã hội và chân trang.',
    saveNote: 'Lưu thay đổi sẽ cập nhật thông tin website.',
  },
  {
    key: 'services',
    href: '/admin/website/services',
    label: 'Dịch vụ',
    minRole: 'EDITOR',
    description: 'Quản lý danh sách dịch vụ và trạng thái hiển thị.',
    saveNote: 'Lưu thay đổi áp dụng theo trạng thái dịch vụ.',
  },
  {
    key: 'pricing',
    href: '/admin/website/pricing',
    label: 'Bảng giá',
    minRole: 'ADMIN',
    description: 'Quản lý hạng mục giá theo từng dịch vụ.',
    saveNote: 'Lưu thay đổi áp dụng theo trạng thái hạng mục giá.',
  },
  {
    key: 'faq',
    href: '/admin/website/faq',
    label: 'FAQ',
    minRole: 'EDITOR',
    description: 'Câu hỏi thường gặp hiển thị trên trang chủ.',
    saveNote: 'FAQ đang hiển thị được cập nhật sau khi lưu.',
  },
];
