import { type Root, type AtRule, type Declaration } from 'postcss';
import safeParser from 'postcss-safe-parser';

export function extractFeatures(html: string) {
  const cssProperties = new Set<string>();
  const cssAtRules = new Set<string>();
  const cssValues = new Map<string, Set<string>>();

  extractInlineStyles(html, cssProperties, cssValues);

  extractStyleTags(html, cssProperties, cssAtRules, cssValues);

  return {
    cssAtRules,
    cssProperties,
    htmlAttributes: extractHtmlAttributes(html),
    htmlElements: extractHtmlElements(html),
  };
}

function extractInlineStyles(html: string, properties: Set<string>, values: Map<string, Set<string>>) {
  const inlineStyleRegex = /style\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = inlineStyleRegex.exec(html)) !== null) {
    const styleContent = match[1];

    const wrappedCss = `* { ${styleContent} }`;

    try {
      const root = safeParser(wrappedCss);
      extractPropertiesFromAst(root, properties, values);
    } catch {
      extractPropertiesSimple(styleContent, properties);
    }
  }
}

function extractStyleTags(
  html: string,
  properties: Set<string>,
  atRules: Set<string>,
  values: Map<string, Set<string>>
): void {
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleTagRegex.exec(html)) !== null) {
    const cssContent = match[1];

    try {
      const root = safeParser(cssContent);
      extractPropertiesFromAst(root, properties, values);
      extractAtRulesFromAst(root, atRules);
    } catch {
      extractPropertiesSimple(cssContent, properties);
      extractAtRulesSimple(cssContent, atRules);
    }
  }
}

function extractPropertiesFromAst(root: Root, properties: Set<string>, values: Map<string, Set<string>>): void {
  root.walk((node) => {
    if (node.type === 'decl') {
      const decl = node as Declaration;
      const prop = decl.prop.toLowerCase();
      const isVendorProperty = prop.startsWith('-');

      if (isVendorProperty) {
        const unprefixed = prop.replace(/^-(?:webkit|moz|ms|o)-/, '');
        properties.add(unprefixed);
      } else {
        properties.add(prop);
      }

      const value = decl.value.toLowerCase();

      if (!values.has(prop)) {
        values.set(prop, new Set());
      }

      values.get(prop)!.add(value);

      extractValueFeatures(value, properties);
    }
  });
}

function extractValueFeatures(value: string, properties: Set<string>) {
  const cssFeatures = [
    { feature: 'linear-gradient', pattern: /linear-gradient/i },
    { feature: 'radial-gradient', pattern: /radial-gradient/i },
    { feature: 'conic-gradient', pattern: /conic-gradient/i },
    { feature: 'repeating-linear-gradient', pattern: /repeating-linear-gradient/i },
    { feature: 'repeating-radial-gradient', pattern: /repeating-radial-gradient/i },
    { feature: 'calc', pattern: /calc\s*\(/i },
    { feature: 'css variables', pattern: /var\s*\(/i },
    { feature: 'clamp', pattern: /clamp\s*\(/i },
    { feature: 'min', pattern: /min\s*\(/i },
    { feature: 'max', pattern: /max\s*\(/i },
    { feature: 'fit-content', pattern: /fit-content/i },
    { feature: 'min-content', pattern: /min-content/i },
    { feature: 'max-content', pattern: /max-content/i },
  ];

  for (const { feature, pattern } of cssFeatures) {
    if (pattern.test(value)) {
      properties.add(feature);
    }
  }
}

function extractAtRulesFromAst(root: Root, atRules: Set<string>) {
  root.walk((node) => {
    if (node.type === 'atrule') {
      const rule = node as AtRule;
      const ruleName = `@${rule.name.toLowerCase()}`;
      atRules.add(ruleName);

      if (rule.name.toLowerCase() === 'media' && rule.params) {
        extractMediaFeatures(rule.params, atRules);
      }

      if (rule.name.toLowerCase() === 'supports') {
        atRules.add('@supports');
      }
    }
  });
}

function extractMediaFeatures(params: string, atRules: Set<string>): void {
  const featureRegex = /\(\s*([a-z-]+)\s*(?::|,|\))/gi;
  let match;

  while ((match = featureRegex.exec(params)) !== null) {
    const feature = match[1].toLowerCase();
    atRules.add(`@media (${feature})`);
  }
}

function extractPropertiesSimple(css: string, properties: Set<string>) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const propertyRegex = /([a-z-]+)\s*:/gi;
  let match;

  while ((match = propertyRegex.exec(css)) !== null) {
    const property = match[1].toLowerCase();

    if (property.length > 1 && !property.startsWith('-')) {
      properties.add(property);
    }
  }
}

function extractAtRulesSimple(css: string, atRules: Set<string>) {
  const atRuleRegex = /@([a-z-]+)/gi;
  let match;

  while ((match = atRuleRegex.exec(css)) !== null) {
    atRules.add(`@${match[1].toLowerCase()}`);
  }
}

function extractHtmlElements(html: string) {
  const elements = new Set<string>();
  const tagRegex = /<([a-z][a-z0-9-]*)/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    elements.add(match[1].toLowerCase());
  }

  return elements;
}

function extractHtmlAttributes(html: string) {
  const attributes = new Set<string>();
  const attrRegex = /\s([a-z][a-z0-9-]*)\s*=/gi;
  let match;

  while ((match = attrRegex.exec(html)) !== null) {
    attributes.add(match[1].toLowerCase());
  }

  return attributes;
}
