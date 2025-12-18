import type { CanIEmailFeature } from '@/lib/caniemail';

export function buildCssPropertyMap(features: CanIEmailFeature[]): Map<string, CanIEmailFeature> {
  const map = new Map<string, CanIEmailFeature>();

  for (const feature of features) {
    if (feature.category !== 'css') {
      continue;
    }

    const propertyName = feature.slug.replace(/^css-/, '').replace(/-/g, '-');
    map.set(propertyName, feature);

    const titleLower = feature.title.toLowerCase();

    if (titleLower !== propertyName) {
      map.set(titleLower, feature);
    }

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

export function buildHtmlElementMap(features: CanIEmailFeature[]): Map<string, CanIEmailFeature> {
  const map = new Map<string, CanIEmailFeature>();

  for (const feature of features) {
    if (feature.category !== 'html') {
      continue;
    }

    const slugElement = feature.slug.replace(/^html-/, '').toLowerCase();

    if (slugElement && !slugElement.includes('attribute')) {
      map.set(slugElement, feature);
    }

    const titleMatch = feature.title.match(/<([a-z0-9-]+)>/i);

    if (titleMatch) {
      map.set(titleMatch[1].toLowerCase(), feature);
    }

    const elementMatch = feature.title.match(/^([a-z0-9-]+)\s+element/i);

    if (elementMatch) {
      map.set(elementMatch[1].toLowerCase(), feature);
    }

    if (feature.keywords) {
      const keywords = feature.keywords.split(',').map((k) => {
        return k.trim().toLowerCase();
      });

      for (const keyword of keywords) {
        if (keyword && !keyword.includes(' ') && !map.has(keyword)) {
          map.set(keyword, feature);
        }
      }
    }
  }

  return map;
}

export function buildHtmlAttributeMap(features: CanIEmailFeature[]): Map<string, CanIEmailFeature> {
  const map = new Map<string, CanIEmailFeature>();

  for (const feature of features) {
    if (feature.category !== 'html') {
      continue;
    }

    const attrMatch = feature.title.match(/([a-z-]+)\s+attribute/i);

    if (attrMatch) {
      map.set(attrMatch[1].toLowerCase(), feature);
    }

    if (feature.slug.includes('attribute')) {
      const slugAttr = feature.slug.replace(/^html-/, '').replace(/-attribute$/, '');
      map.set(slugAttr, feature);
    }

    if (feature.keywords) {
      const keywords = feature.keywords.split(',').map((k) => {
        return k.trim().toLowerCase();
      });

      for (const keyword of keywords) {
        if (keyword && !keyword.includes(' ') && !map.has(keyword)) {
          map.set(keyword, feature);
        }
      }
    }
  }

  return map;
}
