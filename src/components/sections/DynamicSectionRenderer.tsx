import React from 'react';
import { SectionData } from '@/lib/section-schema';
import type { PublicFaq } from '@/lib/faq-data';
import { HeroSection } from './HeroSection';
import { ServiceGridSection } from './ServiceGridSection';
import { PricingPreviewSection } from './PricingPreviewSection';
import { BeforeAfterSection } from './BeforeAfterSection';
import { TrustSection } from './TrustSection';
import { ProcessSection } from './ProcessSection';
import { ServiceAreasSection } from './ServiceAreasSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';
import { IntroSection } from './IntroSection';
import { EquipmentSection } from './EquipmentSection';
import { VisualProofSection } from './VisualProofSection';
import { ReviewsSection } from './ReviewsSection';

interface RendererProps {
  sections: SectionData[];
  onOpenQuote?: () => void;
  faqs?: PublicFaq[];
}

export const DynamicSectionRenderer: React.FC<RendererProps> = ({ sections, onOpenQuote, faqs = [] }) => {
  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  // Static public-only sections (no SectionType exists for these in the CMS
  // enum — adding one would require a schema migration + admin UI, out of
  // scope). They are inserted immediately after the CMS-driven section they
  // follow in the reference homepage order, so admin-controlled ordering of
  // the 9 real SectionTypes is left untouched.
  return (
    <div>
      {visibleSections.map((sec, idx) => {
        switch (sec.type) {
          case 'Hero':
            return <HeroSection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          case 'ServiceGrid':
            return (
              <React.Fragment key={idx}>
                <ServiceGridSection props={sec.props} onOpenQuote={onOpenQuote} />
                <IntroSection />
              </React.Fragment>
            );
          case 'PricingPreview':
            return <PricingPreviewSection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          case 'BeforeAfter':
            return <BeforeAfterSection key={idx} props={sec.props} />;
          case 'Trust':
            return <TrustSection key={idx} props={sec.props} />;
          case 'Process':
            return (
              <React.Fragment key={idx}>
                <ProcessSection props={sec.props} />
                <EquipmentSection />
                <VisualProofSection />
                <ReviewsSection />
              </React.Fragment>
            );
          case 'ServiceAreas':
            return <ServiceAreasSection key={idx} props={sec.props} />;
          case 'FAQ':
            return <FAQSection key={idx} props={sec.props} faqs={faqs} />;
          case 'CTA':
            return <CTASection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
