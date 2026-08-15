import Link from 'next/link';

export default function AdminPagesIndexPage() {
  return (
    <main className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Trang nội dung</h1>
        <p className="text-sm text-text-muted">Nội dung trang được lưu trong PostgreSQL.</p>
      </div>

      <section className="overflow-hidden rounded-card border bg-white">
        <div className="divide-y">
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-bold">Trang chủ</p>
              <p className="text-xs text-text-muted">/ — các khối nội dung hiển thị trên trang chủ công khai</p>
            </div>
            <Link href="/admin/pages/home" className="rounded-ctrl border px-3 py-1.5 text-sm font-semibold hover:bg-surface-secondary">
              Chỉnh sửa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
