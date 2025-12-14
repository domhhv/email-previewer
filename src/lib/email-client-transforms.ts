/**
 * Email client HTML transformers
 * Simulates how different email clients process and render HTML
 *
 * IMPORTANT: These are approximations, not pixel-perfect simulations.
 * Real clients have nuances that can only be tested by actually sending emails.
 */

export type EmailClient = 'browser' | 'gmail' | 'outlook' | 'yahoo';

export type EmailClientInfo = {
  description: string;
  id: EmailClient;
  label: string;
};

export const EMAIL_CLIENTS: EmailClientInfo[] = [
  {
    description: 'Modern browser rendering (Chrome, Firefox, Safari)',
    id: 'browser',
    label: 'Browser',
  },
  {
    description: 'Strips <style> tags, keeps only inline styles. No flexbox/grid.',
    id: 'gmail',
    label: 'Gmail',
  },
  {
    description: 'Uses Word engine. No border-radius, limited CSS support.',
    id: 'outlook',
    label: 'Outlook',
  },
  {
    description: 'Similar to Gmail, prefixes class names, strips <style> tags.',
    id: 'yahoo',
    label: 'Yahoo',
  },
];

/**
 * Transform HTML to simulate how a specific email client would render it
 */
export function transformForClient(html: string, client: EmailClient): string {
  switch (client) {
    case 'browser':
      return html;

    case 'gmail':
      return transformForGmail(html);

    case 'outlook':
      return transformForOutlook(html);

    case 'yahoo':
      return transformForYahoo(html);

    default:
      return html;
  }
}

/**
 * Gmail transformation:
 * - Strips all <style> tags (non-AMP emails)
 * - Keeps inline styles
 * - Removes certain CSS properties even from inline styles
 */
function transformForGmail(html: string): string {
  let result = html;

  // Remove all <style> tags and their contents
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove position property from inline styles (Gmail strips it)
  result = result.replace(/style\s*=\s*["']([^"']+)["']/gi, (match, styleContent) => {
    const cleaned = styleContent
      .replace(/position\s*:\s*[^;]+;?/gi, '')
      .replace(/display\s*:\s*(flex|grid)[^;]*;?/gi, '')
      .trim();

    return cleaned ? `style="${cleaned}"` : '';
  });

  return result;
}

/**
 * Outlook transformation:
 * - Removes border-radius (Word doesn't support it)
 * - Removes box-shadow
 * - Removes background gradients
 * - Strips flexbox/grid
 * - Removes max-width (partially supported)
 */
function transformForOutlook(html: string): string {
  let result = html;

  // Properties Outlook doesn't support well
  const unsupportedProperties = [
    /border-radius\s*:\s*[^;]+;?/gi,
    /box-shadow\s*:\s*[^;]+;?/gi,
    /text-shadow\s*:\s*[^;]+;?/gi,
    /background\s*:\s*linear-gradient[^;]+;?/gi,
    /background-image\s*:\s*linear-gradient[^;]+;?/gi,
    /display\s*:\s*(flex|grid|inline-flex|inline-grid)[^;]*;?/gi,
    /flex[^:]*\s*:\s*[^;]+;?/gi,
    /gap\s*:\s*[^;]+;?/gi,
    /justify-content\s*:\s*[^;]+;?/gi,
    /align-items\s*:\s*[^;]+;?/gi,
  ];

  // Clean inline styles
  result = result.replace(/style\s*=\s*["']([^"']+)["']/gi, (match, styleContent) => {
    let cleaned = styleContent;

    for (const pattern of unsupportedProperties) {
      cleaned = cleaned.replace(pattern, '');
    }

    cleaned = cleaned.trim();

    return cleaned ? `style="${cleaned}"` : '';
  });

  // Clean <style> tags too
  result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, styleContent) => {
    let cleaned = styleContent;

    for (const pattern of unsupportedProperties) {
      cleaned = cleaned.replace(pattern, '');
    }

    return `<style>${cleaned}</style>`;
  });

  return result;
}

/**
 * Yahoo transformation:
 * - Strips <style> tags (like Gmail)
 * - Keeps inline styles
 * - Similar restrictions to Gmail
 */
function transformForYahoo(html: string): string {
  // Yahoo is very similar to Gmail in terms of stripping
  return transformForGmail(html);
}
