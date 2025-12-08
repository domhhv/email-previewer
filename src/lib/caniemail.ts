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

/**
 * Get the support level for a feature in a specific client
 * Returns the most recent test result
 */
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

  // Parse value like "a #1" into level and note reference
  const match = rawValue.match(/^([ynau])\s*(?:#(\d+))?$/);

  if (!match) {
    return { level: SupportLevels.UNKNOWN, version: latestVersion };
  }

  const level = match[1] as SupportLevels;
  const noteNum = match[2];
  const note = noteNum ? feature.notesByNum?.[noteNum] : undefined;

  return { level, note, version: latestVersion };
}

/**
 * Get support summary across all major clients
 */
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

/**
 * Get the caniemail embed URL for a feature
 */
export function getEmbedUrl(slug: string): string {
  return `https://embed.caniemail.com/${slug}/`;
}

/**
 * Build a map of CSS property names to caniemail feature slugs
 */
export function buildCssPropertyMap(data: CanIEmailData): Map<string, CanIEmailFeature> {
  const map = new Map<string, CanIEmailFeature>();

  for (const feature of data.data) {
    if (feature.category !== 'css') {
      continue;
    }

    // The slug often matches the property name with "css-" prefix
    // e.g., "css-border-radius" -> "border-radius"
    const propertyName = feature.slug.replace(/^css-/, '').replace(/-/g, '-');
    map.set(propertyName, feature);

    // Also map the title if it's different (e.g., "border-radius")
    const titleLower = feature.title.toLowerCase();

    if (titleLower !== propertyName) {
      map.set(titleLower, feature);
    }

    // Map keywords too
    if (feature.keywords) {
      const keywords = feature.keywords.split(',').map((k) => {
        return k.trim().toLowerCase();
      });

      for (const keyword of keywords) {
        if (keyword && !map.has(keyword)) {
          map.set(keyword, feature);
        }
      }
    }
  }

  return map;
}
