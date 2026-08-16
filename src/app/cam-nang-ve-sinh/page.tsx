'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

/**
 * STATIC TEMPORARY: Dọn Nè has no Article CMS yet (Step 8 planning marked
 * Articles as NOT NEEDED for V1 — no route/data currently exists). This
 * page is a real, honest empty-state shell — not fabricated blog posts —
 * mirroring the reference site's own `.empty-state` pattern for a category
 * with zero items, so the route and future publishing hook already exist.
 */
export default function CleaningGuidePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Kiến Thức Vệ Sinh</p>
            <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Cẩm Nang Vệ Sinh</h1>
          </div>

          <div className="mx-auto max-w-xl rounded-[22px] border border-gray-200 bg-white p-9 text-center shadow-sm">
            <p className="text-sm font-semibold text-text-main">Cẩm nang đang được biên soạn</p>
            <p className="mt-2 text-xs text-text-muted leading-relaxed">
              Dọn Nè đang chuẩn bị các bài hướng dẫn vệ sinh nhà cửa, văn phòng và mẹo bảo quản nội thất. Quay lại sau để đọc những bài viết đầu tiên.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
