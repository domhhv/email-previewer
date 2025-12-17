# Email Client Previewer

A web application for testing email HTML compatibility across major email clients.

## Features

- **Live HTML Preview** - See your email render in real-time as you type
- **CSS Compatibility Analysis** - Automatically detects CSS properties used and checks support across email clients
- **Caniemail Integration** - Powered by [caniemail.com](https://www.caniemail.com) data for accurate compatibility information
- **Detailed Reports** - View which clients support (or don't support) each CSS feature you use
- **Expandable Details** - Click any issue to see the full caniemail embed with support matrix

## Supported Email Clients

The compatibility report checks against these major email clients:

- Gmail (Web)
- Outlook Windows
- Outlook Mac
- Outlook.com
- Apple Mail (macOS)
- iOS Mail
- Yahoo Mail
- Samsung Email

## Getting Started

### Prerequisites

- Node.js 22
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/domhhv/email-previewer.git
cd email-previewer

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure (core files)

```
├── app/
│   └── page.tsx                      # Main page component
├── components/
│   ├── email-content-input.tsx       # HTML textarea input
│   ├── email-content-preview.tsx     # Sandboxed iframe preview
│   └── compatibility-report.tsx      # Issues list with caniemail embeds
├── lib/
│   ├── caniemail.ts                  # Caniemail API types and utilities
│   └── css-extractor.ts              # CSS property extraction from HTML
```

## Architecture

### How It Works

1. **Input** - User pastes email HTML into the textarea
2. **CSS Extraction** - The `css-extractor` parses the HTML to find all CSS properties used (from both inline styles and `<style>` tags)
3. **Compatibility Check** - Each CSS property is matched against caniemail.com's database of email client support
4. **Report Generation** - Issues are categorized by severity:
   - 🔴 **Error** - Property not supported in one or more major clients
   - 🟡 **Warning** - Partial support (may work with limitations)
   - 🟢 **Success** - Fully supported across all major clients
5. **Detail View** - Clicking an issue reveals the caniemail embed with the full support matrix

### Key Design Decisions

1. **Iframe-based preview** - Uses `srcdoc` with strict sandboxing for security. This shows how the email renders in a modern browser, not specific email clients.

2. **PostCSS-based CSS extraction** - Uses PostCSS with safe-parser for robust CSS parsing, handling nested rules, @-rules, and malformed CSS gracefully.

3. **Client-side analysis** - All processing happens in the browser. The caniemail data is fetched once and cached.

4. **Debounced updates** - HTML changes are debounced by 300ms to avoid excessive re-analysis while typing.

### Limitations

This tool provides **compatibility analysis**, not true email client rendering. Here's what it can and cannot do:

| ✅ Can Do                           | ❌ Cannot Do                            |
| ----------------------------------- | --------------------------------------- |
| Identify unsupported CSS properties | Show pixel-perfect rendering per client |
| Show caniemail support data         | Simulate Gmail's CSS preprocessing      |
| Preview in browser rendering        | Simulate Outlook's Word engine          |
| Parse inline and embedded styles    | Parse external stylesheets              |

For true cross-client preview screenshots, commercial tools like [Litmus](https://litmus.com) or [Email on Acid](https://emailonacid.com) are required—they maintain farms of actual email clients.

## Future Improvements

- [x] **CodeMirror Editor** - Syntax highlighting and better editing experience
- [x] **HTML Element Checking** - Detect unsupported HTML tags and attributes
- [x] **Advanced CSS Parsing** - Use PostCSS for more accurate CSS extraction
- [x] **Simulated Client Views** - Apply known CSS transforms per client (Gmail stripping, Outlook restrictions)
- [ ] **React Email Support** - Compile `.tsx` files using `@react-email/render`
- [ ] **Dark Mode Preview** - Toggle to simulate dark mode rendering
- [ ] **Export Report** - Download compatibility report as PDF/JSON
- [ ] **URL Sharing** - Share email + report via URL

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework
- [TypeScript](https://typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [PostCSS](https://postcss.org) - CSS parsing
- [caniemail.com](https://caniemail.com) - Compatibility data

## Author

**Dominik Hryshaiev** - [LinkedIn](https://www.linkedin.com/in/domhhv) · [GitHub](https://github.com/domhhv)

## License

MIT

## Acknowledgments

- [caniemail.com](https://www.caniemail.com) for their comprehensive email client support data
