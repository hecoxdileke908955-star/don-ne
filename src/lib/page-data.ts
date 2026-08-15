import 'server-only';

import { Page, PageSection, PublishStatus } from '@prisma/client';
import { prisma } from '@/lib/db';
import { SectionData, SectionPropsSchema } from '@/lib/section-schema';

export const HOME_PAGE_SLUG = 'home';

/**
 * Section types that DynamicSectionRenderer actually implements. The schema
 * enum (section-schema.ts) intentionally reserves a few types for later —
 * the CMS must never let an editor publish or persist one of those, and any
 * row already carrying one is excluded from what admins/public ever see
 * rendered.
 */
export const IMPLEMENTED_SECTION_TYPES = [
  'Hero',
  'ServiceGrid',
  'PricingPreview',
  'BeforeAfter',
  'Trust',
  'Process',
  'ServiceAreas',
  'FAQ',
  'CTA',
] as const;

export type ImplementedSectionType = (typeof IMPLEMENTED_SECTION_TYPES)[number];

export function isImplementedSectionType(type: string): type is ImplementedSectionType {
  return (IMPLEMENTED_SECTION_TYPES as readonly string[]).includes(type);
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  status: PublishStatus;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface PageWithSections extends PageMeta {
  sections: SectionData[];
}

function toSectionData(row: PageSection): SectionData | null {
  const parsed = SectionPropsSchema.safeParse({
    id: row.id,
    type: row.type,
    variant: row.variant,
    order: row.sortOrder,
    visible: row.visible,
    props: row.props,
  });

  if (!parsed.success || !isImplementedSectionType(parsed.data.type)) return null;

  return parsed.data;
}

function toPageMeta(page: Page): PageMeta {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
}

/**
 * DRAFT read for Admin use only (editor form, preview). Reflects the live,
 * currently-editable PageSection rows regardless of publish status. Does not
 * swallow database failures — callers (Admin API routes) map a thrown error
 * to a generic 503, matching the existing admin route convention.
 */
export async function getDraftHomePage(): Promise<PageWithSections | null> {
  const page = await prisma.page.findUnique({ where: { slug: HOME_PAGE_SLUG } });
  if (!page) return null;

  const rows = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: { sortOrder: 'asc' },
  });

  const sections = rows
    .map(toSectionData)
    .filter((section): section is SectionData => section !== null);

  return { ...toPageMeta(page), sections };
}

/**
 * PUBLISHED read for public rendering. Reads the most recent published
 * PageVersion snapshot — not the live PageSection rows — so an in-progress
 * draft edit never reaches an unauthenticated visitor before Publish is
 * pressed. Any failure (not found, not published, no snapshot yet, or a
 * genuine database error) collapses to null, the same convention already
 * used by getPublicSiteConfig: there is no hard-coded fallback content to
 * return instead.
 */
export async function getPublishedHomePage(): Promise<PageWithSections | null> {
  try {
    const page = await prisma.page.findUnique({ where: { slug: HOME_PAGE_SLUG } });
    if (!page || page.status !== PublishStatus.PUBLISHED) return null;

    const version = await prisma.pageVersion.findFirst({
      where: { pageId: page.id, isPublished: true },
      orderBy: { versionNumber: 'desc' },
    });
    if (!version) return null;

    const snapshot = normalizePublishedSnapshot(version.sectionsJson, page);
    if (!snapshot) return null;

    return {
      ...toPageMeta(page),
      seoTitle: snapshot.seoTitle,
      seoDescription: snapshot.seoDescription,
      sections: snapshot.sections,
    };
  } catch {
    return null;
  }
}

interface PublishedSnapshot {
  sections: SectionData[];
  seoTitle: string | null;
  seoDescription: string | null;
}

/**
 * A published snapshot is stored as { sections, seoTitle, seoDescription }.
 * The original seed data wrote a bare section array for version 1 — that
 * legacy shape is still accepted, falling back to the Page row's own SEO
 * fields (true at seed time, since both were written together).
 */
function normalizePublishedSnapshot(raw: unknown, page: Page): PublishedSnapshot | null {
  const rawSections = Array.isArray(raw) ? raw : (raw as { sections?: unknown })?.sections;
  if (!Array.isArray(rawSections)) return null;

  const sections = rawSections
    .map((entry) => {
      const parsed = SectionPropsSchema.safeParse(entry);
      return parsed.success && isImplementedSectionType(parsed.data.type) ? parsed.data : null;
    })
    .filter((section): section is SectionData => section !== null);

  if (Array.isArray(raw)) {
    return { sections, seoTitle: page.seoTitle, seoDescription: page.seoDescription };
  }

  const wrapper = raw as { seoTitle?: unknown; seoDescription?: unknown };
  return {
    sections,
    seoTitle: typeof wrapper.seoTitle === 'string' ? wrapper.seoTitle : null,
    seoDescription: typeof wrapper.seoDescription === 'string' ? wrapper.seoDescription : null,
  };
}

/**
 * Builds the exact JSON snapshot persisted by the Publish action, from the
 * current draft state. Sections outside IMPLEMENTED_SECTION_TYPES are
 * dropped rather than published, matching what DynamicSectionRenderer would
 * silently skip anyway.
 */
export function buildPublishSnapshot(page: PageMeta, sections: SectionData[]): PublishedSnapshot {
  return {
    sections: sections.filter((section) => isImplementedSectionType(section.type)),
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
}
