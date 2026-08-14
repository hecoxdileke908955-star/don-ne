import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FALLBACK_SITE_CONFIG } from '@/lib/global-settings';

export const Footer: React.FC = () => {
  const config = FALLBACK_SITE_CONFIG;

  return (
    <footer className="border-t border-gray-200 bg-surface-secondary text-text-main pt-12 pb-20 md:pb-12 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image src="/logo-web.png" alt="Dọn Nè" fill className="object-contain" />
              </div>
              <span className="text-xl font-black text-primary">DỌN NÈ</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {config.slogan}
            </p>
            <div className="text-xs text-text-muted pt-2 border-t border-gray-200">
              <p><strong>Mã số thuế:</strong> {config.businessCode}</p>
              <p><strong>Thời gian làm việc:</strong> {config.workingHours}</p>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="font-bold text-text-main mb-3 text-xs uppercase tracking-wider">
              Dịch Vụ Chính
            </h4>
            <ul className="space-y-2 text-xs text-text-muted">
              <li><Link href="/ve-sinh-nha-cua" className="hover:text-primary">Tổng vệ sinh nhà cửa</Link></li>
              <li><Link href="/ve-sinh-can-ho-chung-cu" className="hover:text-primary">Vệ sinh căn hộ chung cư</Link></li>
              <li><Link href="/ve-sinh-sau-xay-dung" className="hover:text-primary">Vệ sinh sau xây dựng</Link></li>
              <li><Link href="/ve-sinh-van-phong" className="hover:text-primary">Vệ sinh văn phòng</Link></li>
              <li><Link href="/giat-ghe-sofa" className="hover:text-primary">Giặt ghế sofa & Nệm</Link></li>
              <li><Link href="/dich-vu-lau-kinh" className="hover:text-primary">Dịch vụ lau kính tòa nhà</Link></li>
              <li><Link href="/ve-sinh-san-pickleball" className="hover:text-primary">Vệ sinh sân Pickleball</Link></li>
            </ul>
          </div>

          {/* Col 3: Areas in Hanoi */}
          <div>
            <h4 className="font-bold text-text-main mb-3 text-xs uppercase tracking-wider">
              Trạm Phục Vụ Hà Nội
            </h4>
            <ul className="space-y-1.5 text-xs text-text-muted">
              <li><strong>Trụ sở chính:</strong> {config.mainAddress}</li>
              {config.branchAddresses.map((branch, idx) => (
                <li key={idx}><strong>Trạm {idx + 1}:</strong> {branch}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Commitment */}
          <div>
            <h4 className="font-bold text-text-main mb-3 text-xs uppercase tracking-wider">
              Liên Hệ & Cam Kết
            </h4>
            <div className="space-y-2 text-xs text-text-muted">
              <p>
                <strong>Hotline 24/7:</strong>{' '}
                <a href={`tel:${config.hotlines[0].replace(/\./g, '')}`} className="font-bold text-primary hover:underline">
                  {config.hotlines[0]}
                </a>{' '}
                -{' '}
                <a href={`tel:${config.hotlines[1].replace(/\./g, '')}`} className="font-bold text-primary hover:underline">
                  {config.hotlines[1]}
                </a>
              </p>
              <p><strong>Email:</strong> {config.emails[0]}</p>
              <div className="p-3 bg-primary-soft/50 rounded-lg border border-primary/20 text-text-main mt-3">
                <p className="text-[11px] font-semibold text-primary">CAM KẾT DỌN NÈ:</p>
                <p className="text-[11px] text-text-muted mt-1">{config.footerCommitment}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-text-muted flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Dọn Nè. All rights reserved. Tiêu chuẩn Structured Clean.</p>
          <div className="flex gap-4">
            <Link href="/chinh-sach-bao-mat" className="hover:text-primary">Chính sách bảo mật</Link>
            <Link href="/chinh-sach-bao-hanh" className="hover:text-primary">Chính sách bảo hành</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
