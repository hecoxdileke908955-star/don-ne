'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SectionContentProps } from '@/lib/section-schema';
import { getServiceImage } from '@/lib/service-images';

interface ServiceGridProps { props: SectionContentProps; onOpenQuote?: () => void }
type Service = { id: string; slug: string; title: string; shortDescription: string | null; badge: string | null };

export const ServiceGridSection: React.FC<ServiceGridProps> = ({ props }) => {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(async (r) => { if (!r.ok) throw Error(); return r.json(); })
      .then((x) => setServices(x.services))
      .catch(() => setServices([]));
  }, []);

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main">
            {props.heading || 'Dịch Vụ Vệ Sinh Trọng Tâm'}
          </h2>
        </div>

        {services === null ? (
          <p className="text-center">Đang tải dịch vụ…</p>
        ) : services.length === 0 ? (
          <p className="text-center text-text-muted">Dịch vụ tạm thời chưa khả dụng.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const imageSrc = getServiceImage(s.slug);
              return (
                // Round 4.1 fix: whole card is now the clickable target (was
                // only the title text before — image/body had no href, a
                // real interaction gap vs the reference's fully-clickable
                // `.service-card`). A single Link wraps everything instead
                // of nesting an inner <Link> inside it (nested <a> is
                // invalid HTML and was the reason it wasn't done this way
                // originally).
                <Link
                  key={s.id}
                  href={`/${s.slug}`}
                  className="block overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {imageSrc && (
                    <div className="relative aspect-[5/3] w-full">
                      <Image
                        src={imageSrc}
                        alt={`Nhân viên Dọn Nè thực hiện dịch vụ ${s.title}`}
                        fill
                        quality={100}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="rounded bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold text-primary">{s.badge}</span>
                    <h3 className="text-base font-bold mt-3">{s.title}</h3>
                    <p className="text-xs text-text-muted mt-2">{s.shortDescription}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
