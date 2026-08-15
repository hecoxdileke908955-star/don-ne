import { getDraftHomePage } from '@/lib/page-data';
import { DynamicSectionRenderer } from '@/components/sections/DynamicSectionRenderer';

export default async function AdminHomePagePreview() {
  const page = await getDraftHomePage().catch(() => null);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="sticky top-0 z-10 border-b border-yellow-300 bg-yellow-100 px-4 py-2 text-center text-xs font-bold text-yellow-900">
        XEM THỬ BẢN NHÁP — nội dung này chưa được xuất bản công khai
      </div>
      {page ? (
        <DynamicSectionRenderer sections={page.sections} />
      ) : (
        <p className="p-8 text-center text-sm text-text-muted">Không thể tải bản nháp trang chủ.</p>
      )}
    </div>
  );
}
