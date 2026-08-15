'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { DynamicSectionRenderer } from '@/components/sections/DynamicSectionRenderer';
import { SectionData } from '@/lib/section-schema';

interface HomePageClientProps {
  sections: SectionData[];
}

export function HomePageClient({ sections }: HomePageClientProps) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      <main className="flex-1">
        <DynamicSectionRenderer sections={sections} onOpenQuote={() => setIsQuoteOpen(true)} />
      </main>
      <Footer />
      <MobileStickyBar onOpenQuote={() => setIsQuoteOpen(true)} />
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
