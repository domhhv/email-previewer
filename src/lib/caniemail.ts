import camelcaseKeys from 'camelcase-keys';
import ky from 'ky';
import type { SnakeCasedPropertiesDeep } from 'type-fest';

/**
 * Types and utilities for working with caniemail.com data
 * API: https://www.caniemail.com/api/data.json
 */

enum SupportLevels {
  YES = 'y',
  PARTIAL = 'a',
  NO = 'n',
  UNKNOWN = 'u',
}

export type CanIEmailFeature = {
  category: 'css' | 'html' | 'image' | 'others';
  description: string;
  keywords: string | null;
  lastTestDate: string;
  notes: string | null;
  notesByNum: Record<string, string> | null;
  slug: string;
  stats: Record<string, Record<string, Record<string, string>>>;
  tags: string[];
  testResultsUrl: string | null;
  testUrl: string;
  title: string;
  url: string;
};

export type FeatureType = 'css' | 'css-at-rule' | 'html-element' | 'html-attribute';

export type CanIEmailData = {
  apiVersion: string;
  data: CanIEmailFeature[];
  lastUpdateDate: string;
  nicenames: {
    category: Record<string, string>;
    family: Record<string, string>;
    platform: Record<string, string>;
    support: Record<string, string>;
  };
};

export type CompatibilityIssue = {
  feature: CanIEmailFeature;
  featureType: FeatureType;
  property: string;
  severity: 'error' | 'warning' | 'success';
  summary: {
    partial: MajorClient[];
    supported: MajorClient[];
    unknown: MajorClient[];
    unsupported: MajorClient[];
  };
};

export const MAJOR_CLIENTS = [
  { family: 'gmail', label: 'Gmail', platform: 'desktop-webmail' },
  { family: 'outlook', label: 'Outlook Windows', platform: 'windows' },
  { family: 'outlook', label: 'Outlook Mac', platform: 'macos' },
  { family: 'outlook', label: 'Outlook.com', platform: 'outlook-com' },
  { family: 'apple-mail', label: 'Apple Mail', platform: 'macos' },
  { family: 'apple-mail', label: 'iOS Mail', platform: 'ios' },
  { family: 'yahoo', label: 'Yahoo', platform: 'desktop-webmail' },
  { family: 'samsung-email', label: 'Samsung Email', platform: 'android' },
] as const;

export type MajorClient = (typeof MAJOR_CLIENTS)[number];

let cachedData: CanIEmailData;

const DAY_IN_MS = 86_400;

export async function fetchCanIEmailData() {
  if (cachedData) {
    return cachedData;
  }

  const response = await ky<SnakeCasedPropertiesDeep<CanIEmailData>>('https://www.caniemail.com/api/data.json', {
    next: { revalidate: DAY_IN_MS },
  }).json();

  cachedData = camelcaseKeys(response, { deep: true });

  return cachedData;
}

function getSupportLevel(
  feature: CanIEmailFeature,
  family: string,
  platform: string
): { level: SupportLevels; note?: string; version: string } | null {
  const familyStats = feature.stats[family];

  if (!familyStats) {
    return null;
  }

  const platformStats = familyStats[platform];

  if (!platformStats) {
    return null;
  }

  const latestVersion = Object.keys(platformStats).at(-1);

  if (!latestVersion) {
    return null;
  }

  const rawValue = platformStats[latestVersion];

  const levelMatch = rawValue.match(/^([ynau])\s*(?:#(\d+))?$/);

  if (!levelMatch) {
    return { level: SupportLevels.UNKNOWN, version: latestVersion };
  }

  const level = levelMatch[1] as SupportLevels;
  const noteNum = levelMatch[2];
  const note = noteNum ? feature.notesByNum?.[noteNum] : undefined;

  return { level, note, version: latestVersion };
}

export function getFeatureSupportSummary(feature: CanIEmailFeature): {
  partial: MajorClient[];
  supported: MajorClient[];
  unknown: MajorClient[];
  unsupported: MajorClient[];
} {
  const result = {
    partial: [] as MajorClient[],
    supported: [] as MajorClient[],
    unknown: [] as MajorClient[],
    unsupported: [] as MajorClient[],
  };

  for (const client of MAJOR_CLIENTS) {
    const support = getSupportLevel(feature, client.family, client.platform);

    if (!support || support.level === SupportLevels.UNKNOWN) {
      result.unknown.push(client);
      continue;
    }

    if (support.level === SupportLevels.YES) {
      result.supported.push(client);
      continue;
    }

    if (support.level === SupportLevels.PARTIAL) {
      result.partial.push(client);
      continue;
    }

    result.unsupported.push(client);
  }

  return result;
}

export function createCompatibilityIssues(
  extractedCssProperties: Set<string>,
  extractedCssAtRules: Set<string>,
  extractedHtmlElements: Set<string>,
  extractedHtmlAttributes: Set<string>,
  cssPropertyMap: Map<string, CanIEmailFeature>,
  htmlElementMap: Map<string, CanIEmailFeature>,
  htmlAttributeMap: Map<string, CanIEmailFeature>
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const processedSlugs = new Set<string>();

  function processFeatures(
    items: Set<string>,
    featureMap: Map<string, CanIEmailFeature>,
    featureType: FeatureType,
    formatProperty: (item: string) => string = (item) => {
      return item;
    }
  ) {
    for (const item of items) {
      const feature = featureMap.get(item);

      if (!feature || processedSlugs.has(feature.slug)) {
        continue;
      }

      processedSlugs.add(feature.slug);

      const summary = getFeatureSupportSummary(feature);

      let severity: CompatibilityIssue['severity'] = 'success';

      if (summary.unsupported.length > 0) {
        severity = 'error';
      } else if (summary.partial.length > 0) {
        severity = 'warning';
      }

      issues.push({
        feature,
        featureType,
        property: formatProperty(item),
        severity,
        summary,
      });
    }
  }

  processFeatures(extractedCssProperties, cssPropertyMap, 'css');
  processFeatures(extractedCssAtRules, cssPropertyMap, 'css-at-rule');
  processFeatures(extractedHtmlElements, htmlElementMap, 'html-element', (el) => {
    return `<${el}>`;
  });
  processFeatures(extractedHtmlAttributes, htmlAttributeMap, 'html-attribute');

  return issues;
}
