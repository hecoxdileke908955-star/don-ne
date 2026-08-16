'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { formatPriceRange } from '@/lib/pricing-engine';
import { getServiceImage } from '@/lib/service-images';

type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  badge: string | null;
  whenNeeded: string[] | null;
  includedItems: string[] | null;
  excludedItems: string[] | null;
  processSteps: string[] | null;
  commitments: string[] | null;
  category: { id: string; name: string };
};
type Price = { id: string; service: { slug: string }; itemName: string; unit: string; minPrice: string | number; maxPrice: string | number | null };

function ContentList({ heading, items }: { heading: string; items: string[] | null | undefined }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-text-main">{heading}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-text-muted">
            <span className="mt-0.5 text-primary">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [service, setService] = useState<Service | null | undefined>(undefined);
  const [prices, setPrices] = useState<Price[]>([]);
  const [related, setRelated] = useState<Service[]>([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(async (r) => { if (r.status === 404) { setService(null); return null; } if (!r.ok) throw Error(); return r.json(); })
      .then((x) => { if (x) setService(x.service); })
      .catch(() => setService(null));
    fetch('/api/pricing').then((r) => r.json()).then((x) => setPrices(x.items.filter((item: Price) => item.service.slug === slug))).catch(() => setPrices([]));
  }, [slug]);

  useEffect(() => {
    if (!service) return;
    fetch('/api/services')
      .then(async (r) => { if (!r.ok) throw Error(); return r.json(); })
      .then((x) => setRelated(x.services.filter((s: Service) => s.id !== service.id && s.category.id === service.category.id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [service]);

  if (service === undefined) return <main className="p-8 text-center">Đang tải dịch vụ…</main>;
  if (service === null) return <main className="p-8 text-center">Không tìm thấy dịch vụ.</main>;

  const imageSrc = getServiceImage(service.slug);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-10 bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="mb-6 text-xs text-text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link> / <Link href="/dich-vu" className="hover:text-primary">Dịch vụ</Link> / <span className="text-text-main">{service.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main content */}
            <article>
              {service.badge && <span className="rounded bg-primary-soft px-3 py-1 text-xs font-bold text-primary">{service.badge}</span>}
              <h1 className="mt-3 text-2xl font-black text-text-main sm:text-4xl">{service.title}</h1>
              {service.shortDescription && <p className="mt-3 text-sm text-text-muted leading-relaxed">{service.shortDescription}</p>}

              {imageSrc && (
                <div className="relative mt-6 aspect-[5/3] w-full overflow-hidden rounded-2xl">
                  <Image src={imageSrc} alt={`Nhân viên Dọn Nè thực hiện dịch vụ ${service.title}`} fill quality={100} sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
                </div>
              )}

              <ContentList heading="Khi Nào Cần Dịch Vụ Này" items={service.whenNeeded} />
              <ContentList heading="Hạng Mục Thực Hiện" items={service.includedItems} />
              <ContentList heading="Không Bao Gồm" items={service.excludedItems} />
              <ContentList heading="Quy Trình Thực Hiện" items={service.processSteps} />
              <ContentList heading="Cam Kết Dịch Vụ" items={service.commitments} />

              <section className="mt-8 rounded-card border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-text-main">Bảng Giá Tham Khảo</h2>
                {prices.length ? (
                  <div className="mt-3 divide-y divide-gray-100">
                    {prices.map((price) => (
                      <div key={price.id} className="flex items-center justify-between py-2.5 text-sm">
                        <span className="text-text-main">{price.itemName}</span>
                        <b className="text-primary">{formatPriceRange(Number(price.minPrice), price.maxPrice === null ? null : Number(price.maxPrice), price.unit)}</b>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-text-muted">Bảng giá tạm thời chưa khả dụng.</p>
                )}
              </section>

              <div className="mt-8 rounded-2xl bg-primary p-6 text-center text-white">
                <h2 className="text-lg font-bold">Đặt Lịch {service.title} Ngay Hôm Nay</h2>
                <p className="mt-1 text-xs text-primary-soft">Khảo sát và báo giá miễn phí trong 5 phút.</p>
                <button onClick={() => setIsQuoteOpen(true)} className="mt-4 rounded-ctrl bg-white px-6 py-3 text-sm font-bold text-primary shadow hover:bg-gray-100">
                  Nhận Báo Giá Ngay
                </button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-card border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-text-main">Dịch Vụ Liên Quan</h3>
                <div className="mt-4 space-y-3">
                  {related.length === 0 && <p className="text-xs text-text-muted">Đang cập nhật.</p>}
                  {related.map((r) => {
                    const relatedImage = getServiceImage(r.slug);
                    return (
                      <Link key={r.id} href={`/${r.slug}`} className="flex items-center gap-3 group">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-primary-soft">
                          {relatedImage && <Image src={relatedImage} alt={r.title} fill quality={100} sizes="56px" className="object-cover" />}
                        </div>
                        <span className="text-xs font-semibold text-text-main group-hover:text-primary">{r.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-card border border-primary/20 bg-primary-soft p-5">
                <h3 className="text-sm font-bold text-primary">Đăng Ký Tư Vấn Dịch Vụ</h3>
                <p className="mt-2 text-xs text-text-muted">Để lại yêu cầu, Dọn Nè liên hệ tư vấn và báo giá trong 5 phút.</p>
                <button onClick={() => setIsQuoteOpen(true)} className="mt-3 w-full rounded-ctrl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-hover">
                  Nhận Báo Giá 5 Phút
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} defaultServiceSlug={service.slug} />
    </div>
  );
}
