export const sampleEmailHtml = `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Weekly Digest</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      /* ===========================================
         CSS FEATURES THAT NEED POSTCSS TO DETECT
         =========================================== */
      
      /* CSS Custom Properties (Variables) - poor email support */
      :root {
        --brand-primary: #4F46E5;
        --brand-secondary: #7C3AED;
        --spacing-md: 16px;
        --radius-lg: 12px;
      }
      
      /* Reset styles */
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  
      /* Client-specific resets */
      .ReadMsgBody { width: 100%; }
      .ExternalClass { width: 100%; }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
      
      /* Modern CSS functions - calc(), clamp(), min(), max() */
      .responsive-text {
        /* calc() - limited support */
        font-size: calc(14px + 0.5vw);
        /* clamp() - very poor support */
        line-height: clamp(1.4, 1.5 + 0.2vw, 1.8);
        /* min/max - poor support */
        width: min(100%, 600px);
        padding: max(16px, 2vw);
      }
      
      /* CSS Grid - not supported in most email clients */
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        grid-auto-rows: minmax(100px, auto);
      }
      
      /* Flexbox - limited support */
      .flex-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      
      /* Gradients - mixed support */
      .gradient-header {
        background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
        /* Fallback with radial gradient */
        background-image: radial-gradient(circle at top left, #4F46E5, #7C3AED);
      }
      
      .conic-badge {
        /* Conic gradient - very poor support */
        background: conic-gradient(from 45deg, #4F46E5, #7C3AED, #4F46E5);
      }
      
      /* @supports - not supported in email */
      @supports (display: grid) {
        .feature-grid {
          display: grid;
        }
      }
      
      /* @keyframes animations - very limited support */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .animated-element {
        animation: fadeIn 0.3s ease-out;
      }
      
      .pulse-button {
        animation: pulse 2s infinite;
      }
  
      /* Button hover state */
      .button-td:hover, .button-a:hover {
        background: #4338CA !important;
        border-color: #4338CA !important;
      }
  
      /* Dark mode styles with prefers-color-scheme */
      @media (prefers-color-scheme: dark) {
        .email-bg { background-color: #1a1a1a !important; }
        .body-text { color: #e5e5e5 !important; }
        .card-bg { background-color: #262626 !important; }
        
        /* filter and backdrop-filter - poor support */
        .dark-overlay {
          backdrop-filter: blur(10px);
          filter: brightness(0.9);
        }
      }
      
      /* prefers-reduced-motion - not widely supported */
      @media (prefers-reduced-motion: reduce) {
        .animated-element {
          animation: none;
        }
      }
  
      /* Mobile styles with nested rules */
      @media only screen and (max-width: 600px) {
        .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
        .stack-column-center { text-align: center !important; }
        .mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }
        .mobile-full-width { width: 100% !important; height: auto !important; }
        
        /* Nested responsive grid adjustment */
        .feature-grid {
          grid-template-columns: 1fr;
        }
        
        /* aspect-ratio - limited support */
        .responsive-image {
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }
      }
      
      /* @font-face - limited support */
      @font-face {
        font-family: 'CustomFont';
        src: url('https://example.com/font.woff2') format('woff2');
        font-display: swap;
      }
      
      /* @import - stripped by many clients */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      
      /* Modern pseudo-elements and selectors */
      .card::before {
        content: '';
        position: absolute;
        inset: 0; /* Logical property */
        background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.1));
      }
      
      /* :has() selector - cutting edge, no email support */
      .card:has(.featured-badge) {
        border: 2px solid var(--brand-primary);
      }
      
      /* :is() and :where() - no email support */
      :is(h1, h2, h3) {
        font-family: 'CustomFont', system-ui, sans-serif;
      }
      
      /* mix-blend-mode - poor support */
      .overlay-text {
        mix-blend-mode: multiply;
      }
      
      /* scroll-behavior - irrelevant but detected */
      html {
        scroll-behavior: smooth;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
    <!-- Preheader text (hidden but shows in inbox preview) -->
    <div style="display: none; max-height: 0; overflow: hidden;">
      Your weekly summary is here – 3 new features, 2 blog posts, and an exclusive offer inside.
      &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
  
    <!-- Email wrapper table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;" class="email-bg">
      <tr>
        <td align="center" style="padding: 40px 0;">
  
          <!-- Main container with modern CSS (600px max) -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: min(100%, 600px);">
  
            <!-- Header with gradient and CSS variables -->
            <tr>
              <td style="padding: 0 24px 24px; text-align: center;">
                <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 24px; border-radius: 12px;">
                  <img src="https://placehold.co/150x40/ffffff/4F46E5?text=ACME" alt="Acme Inc" width="150" height="40" style="display: block; margin: 0 auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
                </div>
              </td>
            </tr>
  
            <!-- Hero section with clamp() and calc() -->
            <tr>
              <td style="background-color: #ffffff; border-radius: 12px 12px 0 0; overflow: hidden;" class="card-bg">
                <div style="position: relative; aspect-ratio: 2.4 / 1;">
                  <img src="https://placehold.co/600x250/4F46E5/white?text=Weekly+Digest" alt="Weekly Digest" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; object-fit: cover;" class="mobile-full-width">
                </div>
              </td>
            </tr>
  
            <!-- Main content with CSS variables in inline styles -->
            <tr>
              <td style="background-color: #ffffff; padding: clamp(24px, 5vw, 40px);" class="card-bg mobile-padding">
                <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: clamp(24px, 4vw, 32px); font-weight: 700; color: #18181b; line-height: 1.3;" class="body-text">
                  Your Week in Review
                </h1>
                <p style="margin: 0 0 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: calc(14px + 0.25vw); color: #52525b; line-height: 1.6;" class="body-text">
                  Hi there, here's what happened this week at Acme. We shipped some exciting updates and have a special offer just for you.
                </p>
  
                <!-- CTA Button with transform and box-shadow -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                  <tr>
                    <td class="button-td pulse-button" style="border-radius: 8px; background: linear-gradient(135deg, #4F46E5 0%, #5B4FE8 100%); box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); transform: translateZ(0);">
                      <a class="button-a" href="https://example.com/dashboard" style="display: inline-block; padding: 14px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        View Dashboard →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- Feature cards using flexbox (will break in many clients) -->
            <tr>
              <td style="background-color: #ffffff; padding: 0 40px 32px;" class="card-bg mobile-padding">
                <div class="flex-container" style="display: flex; gap: 16px; flex-wrap: wrap;">
                  <!-- Card 1 with backdrop-filter -->
                  <div style="flex: 1 1 calc(50% - 8px); min-width: 200px; background-color: #f4f4f5; border-radius: 8px; padding: 20px; backdrop-filter: blur(4px);">
                    <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px;">🚀</p>
                    <h3 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #18181b;">New: Dark Mode</h3>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #52525b; line-height: 1.5;">
                      Easy on the eyes, day or night.
                    </p>
                  </div>
                  <!-- Card 2 with mix-blend-mode -->
                  <div style="flex: 1 1 calc(50% - 8px); min-width: 200px; background-color: #f4f4f5; border-radius: 8px; padding: 20px; position: relative;">
                    <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px;">📊</p>
                    <h3 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #18181b; mix-blend-mode: multiply;">Analytics v2</h3>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #52525b; line-height: 1.5;">
                      Redesigned with real-time updates.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
  
            <!-- Divider -->
            <tr>
              <td style="background-color: #ffffff; padding: 0 40px;" class="card-bg mobile-padding">
                <hr style="margin: 0; border: none; border-top: 1px solid #e4e4e7;">
              </td>
            </tr>
  
            <!-- Secondary content -->
            <tr>
              <td style="background-color: #ffffff; padding: 32px 40px; border-radius: 0 0 12px 12px;" class="card-bg mobile-padding">
                <h2 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600; color: #18181b;" class="body-text">
                  From the Blog
                </h2>
                
                <!-- Blog post items -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                      <a href="https://example.com/blog/1" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 500; color: #4F46E5; text-decoration: none; text-underline-offset: 2px;">
                        How We Reduced Load Times by 60%
                      </a>
                      <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #71717a;">
                        A deep dive into our performance optimizations.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <a href="https://example.com/blog/2" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 500; color: #4F46E5; text-decoration: none;">
                        Building Accessible Email Templates
                      </a>
                      <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #71717a;">
                        Best practices for inclusive email design.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="padding: 32px 24px; text-align: center;">
                <!-- Social icons with filter effects -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 16px;">
                  <tr>
                    <td style="padding: 0 8px;">
                      <a href="https://twitter.com/example">
                        <img src="https://placehold.co/32x32/71717a/ffffff?text=X" alt="Twitter" width="32" height="32" style="display: block; border-radius: 4px; filter: grayscale(100%); transition: filter 0.2s;">
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://linkedin.com/company/example">
                        <img src="https://placehold.co/32x32/71717a/ffffff?text=in" alt="LinkedIn" width="32" height="32" style="display: block; border-radius: 4px; filter: grayscale(100%);">
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://github.com/example">
                        <img src="https://placehold.co/32x32/71717a/ffffff?text=GH" alt="GitHub" width="32" height="32" style="display: block; border-radius: 4px; filter: grayscale(100%);">
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #71717a;">
                  Acme Inc · 123 Main Street · San Francisco, CA 94102
                </p>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #71717a;">
                  <a href="https://example.com/preferences" style="color: #71717a; text-decoration: underline;">Email preferences</a>
                  &nbsp;·&nbsp;
                  <a href="https://example.com/unsubscribe" style="color: #71717a; text-decoration: underline;">Unsubscribe</a>
                </p>
              </td>
            </tr>
  
          </table>
          <!-- End main container -->
  
        </td>
      </tr>
    </table>
  </body>
</html>`;
