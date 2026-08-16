'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getServiceImage } from '@/lib/service-images';

type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  badge: string | null;
  createdAt: string;
  category: { name: string };
};

export default function ServicesIndexPage() {
  const [services, setServices] = useState<Service[] | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(async (r) => { if (!r.ok) throw Error(); return r.json(); })
      .then((x) => setServices(x.services))
      .catch(() => setServices([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-12 bg-surface-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">Danh Mục</p>
            <h1 className="text-3xl font-extrabold text-text-main sm:text-4xl">Dịch Vụ Vệ Sinh</h1>
          </div>

          {services === null ? (
            <p className="text-center">Đang tải dịch vụ…</p>
          ) : services.length === 0 ? (
            <p className="text-center text-text-muted">Dịch vụ tạm thời chưa khả dụng.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((item) => {
                const imageSrc = getServiceImage(item.slug);
                return (
                  <Link
                    key={item.id}
                    href={`/${item.slug}`}
                    className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[5/3] w-full bg-primary-soft">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={`Nhân viên Dọn Nè thực hiện dịch vụ ${item.title}`}
                          fill
                          quality={100}
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary/60">{item.category.name}</div>
                      )}
                    </div>
                    <div className="p-5">
                      {item.badge && <span className="mb-2 inline-block rounded bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">{item.badge}</span>}
                      <h3 className="text-sm font-bold text-text-main leading-snug">{item.title}</h3>
                      {item.shortDescription && <p className="mt-2 text-xs text-text-muted leading-relaxed">{item.shortDescription}</p>}
                      <span className="mt-3 block text-[11px] font-medium text-text-muted">
                        Cập nhật: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
