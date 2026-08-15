import React from 'react';
import type { SectionContentProps } from '@/lib/section-schema';
import type { PublicFaq } from '@/lib/faq-data';

interface FAQSectionProps {
  props: SectionContentProps;
  faqs: PublicFaq[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ props, faqs }) => {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main text-center mb-8">
          {props.heading || 'Câu Hỏi Thường Gặp'}
        </h2>

        {faqs.length === 0 ? (
          <p className="text-center text-xs text-text-muted">Câu hỏi thường gặp tạm thời chưa khả dụng.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className="rounded-card border border-gray-200 bg-surface-secondary p-5">
                <h3 className="text-sm font-bold text-text-main mb-2">
                  {idx + 1}. {faq.question}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
