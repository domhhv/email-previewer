/**
 * CSS and HTML feature extractor using PostCSS for robust CSS parsing
 *
 * Improvements over regex-based extraction:
 * - Handles nested rules (@media, @supports, @keyframes)
 * - Properly parses complex selectors
 * - Extracts CSS values (for detecting specific features like gradients)
 * - Handles malformed CSS gracefully via postcss-safe-parser
 * - Extracts @-rules and their parameters
 */

import { type Root, type AtRule, type Declaration } from 'postcss';
import safeParser from 'postcss-safe-parser';

export type ExtractedFeatures = {
  cssAtRules: Set<string>;
  cssProperties: Set<string>;
  cssValues: Map<string, Set<string>>;
  htmlAttributes: Set<string>;
  htmlElements: Set<string>;
};

/**
 * Main extraction function - returns all features used in the HTML
 */
export function extractFeatures(html: string): ExtractedFeatures {
  const cssProperties = new Set<string>();
  const cssAtRules = new Set<string>();
  const cssValues = new Map<string, Set<string>>();

  // Extract and parse CSS from inline styles
  extractInlineStyles(html, cssProperties, cssValues);

  // Extract and parse CSS from <style> tags
  extractStyleTags(html, cssProperties, cssAtRules, cssValues);

  return {
    cssAtRules,
    cssProperties,
    cssValues,
    htmlAttributes: extractHtmlAttributes(html),
    htmlElements: extractHtmlElements(html),
  };
}

/**
 * Extract CSS properties from inline style attributes using PostCSS
 */
function extractInlineStyles(html: string, properties: Set<string>, values: Map<string, Set<string>>): void {
  const inlineStyleRegex = /style\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = inlineStyleRegex.exec(html)) !== null) {
    const styleContent = match[1];

    // Wrap in a dummy selector so PostCSS can parse it
    const wrappedCss = `* { ${styleContent} }`;

    try {
      const root = safeParser(wrappedCss);
      extractPropertiesFromAst(root, properties, values);
    } catch {
      // If PostCSS fails, fall back to simple extraction
      extractPropertiesSimple(styleContent, properties);
    }
  }
}

/**
 * Extract CSS from <style> tags using PostCSS
 */
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
      // If PostCSS fails, fall back to simple extraction
      extractPropertiesSimple(cssContent, properties);
      extractAtRulesSimple(cssContent, atRules);
    }
  }
}

/**
 * Extract CSS properties and values from PostCSS AST
 */
function extractPropertiesFromAst(root: Root, properties: Set<string>, values: Map<string, Set<string>>): void {
  root.walk((node) => {
    if (node.type === 'decl') {
      const decl = node as Declaration;
      const prop = decl.prop.toLowerCase();

      // Skip vendor prefixes for the main property set (but still track them)
      if (!prop.startsWith('-')) {
        properties.add(prop);
      } else {
        // Track vendor-prefixed properties separately
        // Extract the non-prefixed version too
        const unprefixed = prop.replace(/^-(?:webkit|moz|ms|o)-/, '');
        properties.add(unprefixed);
      }

      // Track values for specific properties (useful for detecting gradients, etc.)
      const value = decl.value.toLowerCase();

      if (!values.has(prop)) {
        values.set(prop, new Set());
      }

      values.get(prop)!.add(value);

      // Extract special CSS functions/features from values
      extractValueFeatures(value, properties);
    }
  });
}

/**
 * Extract special features from CSS values (gradients, calc, var, etc.)
 */
function extractValueFeatures(value: string, properties: Set<string>): void {
  // Detect CSS functions that have their own compatibility concerns
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

/**
 * Extract @-rules from PostCSS AST
 */
function extractAtRulesFromAst(root: Root, atRules: Set<string>): void {
  root.walk((node) => {
    if (node.type === 'atrule') {
      const rule = node as AtRule;
      const ruleName = `@${rule.name.toLowerCase()}`;
      atRules.add(ruleName);

      // For @media rules, extract the media features
      if (rule.name.toLowerCase() === 'media' && rule.params) {
        extractMediaFeatures(rule.params, atRules);
      }

      // For @supports, track the feature being tested
      if (rule.name.toLowerCase() === 'supports') {
        atRules.add('@supports');
      }
    }
  });
}

/**
 * Extract media query features like prefers-color-scheme, min-width, etc.
 */
function extractMediaFeatures(params: string, atRules: Set<string>): void {
  const featureRegex = /\(\s*([a-z-]+)\s*(?::|,|\))/gi;
  let match;

  while ((match = featureRegex.exec(params)) !== null) {
    const feature = match[1].toLowerCase();
    atRules.add(`@media (${feature})`);
  }
}

/**
 * Simple fallback extraction for CSS properties (when PostCSS fails)
 */
function extractPropertiesSimple(css: string, properties: Set<string>): void {
  // Remove comments
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

/**
 * Simple fallback extraction for @-rules
 */
function extractAtRulesSimple(css: string, atRules: Set<string>): void {
  const atRuleRegex = /@([a-z-]+)/gi;
  let match;

  while ((match = atRuleRegex.exec(css)) !== null) {
    atRules.add(`@${match[1].toLowerCase()}`);
  }
}

/**
 * Extract HTML elements used in the email
 */
function extractHtmlElements(html: string): Set<string> {
  const elements = new Set<string>();
  const tagRegex = /<([a-z][a-z0-9-]*)/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    elements.add(match[1].toLowerCase());
  }

  return elements;
}

/**
 * Extract HTML attributes used in the email
 */
function extractHtmlAttributes(html: string): Set<string> {
  const attributes = new Set<string>();
  const attrRegex = /\s([a-z][a-z0-9-]*)\s*=/gi;
  let match;

  while ((match = attrRegex.exec(html)) !== null) {
    attributes.add(match[1].toLowerCase());
  }

  return attributes;
}
