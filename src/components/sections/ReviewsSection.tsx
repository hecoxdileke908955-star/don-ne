import React from 'react';

/**
 * STATIC PUBLIC ADAPTER — Round 4, Phase 8.
 *
 * The reference homepage has a Reviews/testimonials section. Dọn Nè has no
 * verified review data source (no reviews table, no admin UI to submit/
 * verify one) — inventing names/avatars/star ratings/quotes would violate
 * the explicit "no fake testimonials" rule. This keeps the reference's
 * visual rhythm (heading + card row) at the equivalent homepage position
 * with a truthful "chưa có đánh giá đã xác minh" state, and is written so a
 * future verified-reviews feed can replace the card content without
 * changing this section's position or layout.
 */
export const ReviewsSection: React.FC = () => {
  return (
    <section className="border-t border-gray-100 bg-surface-secondary py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Phản Hồi Khách Hàng</p>
          <h2 className="text-2xl font-extrabold text-text-main sm:text-3xl">Đánh Giá Khách Hàng</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center rounded-[24px] border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-soft text-primary" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12Zm0 2.2c-3.5 0-9 1.75-9 5.25V21h18v-1.55c0-3.5-5.5-5.25-9-5.25Z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-text-main">Đánh giá đã xác minh đang được cập nhật</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">
                Dọn Nè chỉ đăng tải đánh giá từ khách hàng đã xác minh sử dụng dịch vụ.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
