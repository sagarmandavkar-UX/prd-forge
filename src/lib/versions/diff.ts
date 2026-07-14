import type { PrdDocument, PrdVersion } from "@/types/prd";

export interface SectionDiff {
  sectionKey: string;
  title: string;
  before: string;
  after: string;
  changed: boolean;
}

export function diffPrds(
  before: PrdDocument,
  after: PrdDocument
): SectionDiff[] {
  const beforeMap = new Map(
    before.sections.map((section) => [section.sectionKey, section])
  );
  return after.sections.map((section) => {
    const previous = beforeMap.get(section.sectionKey);
    return {
      sectionKey: section.sectionKey,
      title: section.title,
      before: previous?.contentText ?? "",
      after: section.contentText,
      changed: previous?.contentText !== section.contentText
    };
  });
}

export function compareVersions(
  first: PrdVersion,
  second: PrdVersion
): SectionDiff[] {
  return diffPrds(first.snapshot, second.snapshot);
}
