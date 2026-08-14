import React from 'react';
import { SectionData } from '@/lib/section-schema';
import { HeroSection } from './HeroSection';
import { ServiceGridSection } from './ServiceGridSection';
import { PricingPreviewSection } from './PricingPreviewSection';
import { BeforeAfterSection } from './BeforeAfterSection';
import { TrustSection } from './TrustSection';
import { ProcessSection } from './ProcessSection';
import { ServiceAreasSection } from './ServiceAreasSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';

interface RendererProps {
  sections: SectionData[];
  onOpenQuote?: () => void;
}

export const DynamicSectionRenderer: React.FC<RendererProps> = ({ sections, onOpenQuote }) => {
  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div>
      {visibleSections.map((sec, idx) => {
        switch (sec.type) {
          case 'Hero':
            return <HeroSection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          case 'ServiceGrid':
            return <ServiceGridSection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          case 'PricingPreview':
            return <PricingPreviewSection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          case 'BeforeAfter':
            return <BeforeAfterSection key={idx} props={sec.props} />;
          case 'Trust':
            return <TrustSection key={idx} props={sec.props} />;
          case 'Process':
            return <ProcessSection key={idx} props={sec.props} />;
          case 'ServiceAreas':
            return <ServiceAreasSection key={idx} props={sec.props} />;
          case 'FAQ':
            return <FAQSection key={idx} props={sec.props} />;
          case 'CTA':
            return <CTASection key={idx} props={sec.props} onOpenQuote={onOpenQuote} />;
          default:
            return null;
        }
      })}
    </div>
  );
};
