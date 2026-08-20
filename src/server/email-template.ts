import { CODE_TTL_MINUTES } from 'Lib/otp';

export const BRAND = 'Bike Nomad';
const TAGLINE = 'Rent a bike by the hour';

/**
 * The app palette (src/styles/globals.css) written out as hex: no mail client
 * understands oklch(), so these have to be baked in rather than referenced.
 */
const palette = {
  page: '#f5f8fa',
  card: '#ffffff',
  border: '#d6dde1',
  text: '#141a1f',
  muted: '#606e77',
  primary: '#0069a8',
  panel: '#e8eef1',
};

type CodeEmail = {
  /** Short, action-first line at the top of the card. */
  heading: string;
  /** One sentence explaining what the code unlocks. */
  intro: string;
  code: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Hand-rolled table markup rather than a component library: mail clients (Outlook
 * especially) only reliably render tables with inline styles, and this keeps the
 * dependency list unchanged.
 *
 * The code itself is the whole point of the message, so it gets the largest type
 * on the page. It stays a single run of text — boxed-per-digit layouts look nice
 * but paste back as "1 2 3 4 5 6".
 */
export function renderCodeEmail({ heading, intro, code }: CodeEmail) {
  const expiry = `This code expires in ${CODE_TTL_MINUTES} minutes.`;
  const security = "If you didn't request it, you can safely ignore this email — nothing will happen.";
  // Sits in the inbox preview line, so the code is often readable without opening.
  const preheader = `${code} — ${expiry}`;
  // Stops the body copy from bleeding into the preview line after the preheader.
  const preheaderPad = '&#847;&zwnj;&nbsp;'.repeat(16);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(heading)}</title>
    <style>
      @media only screen and (max-width: 600px) {
        .gutter { padding-left: 24px !important; padding-right: 24px !important; }
        .code { font-size: 34px !important; letter-spacing: 8px !important; text-indent: 8px !important; }
      }
      @media (prefers-color-scheme: dark) {
        .page { background-color: #0f1418 !important; }
        .card { background-color: #171f25 !important; border-color: #28323a !important; border-top-color: #3fa3d6 !important; }
        .ink { color: #eef4f7 !important; }
        .brand { color: #74d4ff !important; }
        .muted { color: #9fadb6 !important; }
        .panel { background-color: #0f1a21 !important; border-color: #28323a !important; }
        .code { color: #74d4ff !important; }
        .rule { border-color: #28323a !important; }
      }
    </style>
  </head>
  <body class="page" style="margin: 0; padding: 0; width: 100%; background-color: ${palette.page};">
    <div style="display: none; overflow: hidden; max-height: 0; max-width: 0; opacity: 0; font-size: 1px; line-height: 1px; color: ${palette.page};">${escapeHtml(preheader)}${preheaderPad}</div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="page" style="background-color: ${palette.page};">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
            <tr>
              <td class="card" style="background-color: ${palette.card}; border: 1px solid ${palette.border}; border-top: 4px solid ${palette.primary}; border-radius: 14px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="gutter brand" style="padding: 28px 32px 0 32px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: ${palette.primary};">
                      ${escapeHtml(BRAND)}
                    </td>
                  </tr>
                  <tr>
                    <td class="gutter ink" style="padding: 12px 32px 0 32px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 22px; line-height: 1.3; font-weight: 700; color: ${palette.text};">
                      ${escapeHtml(heading)}
                    </td>
                  </tr>
                  <tr>
                    <td class="gutter muted" style="padding: 8px 32px 0 32px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.55; color: ${palette.muted};">
                      ${escapeHtml(intro)}
                    </td>
                  </tr>
                  <tr>
                    <td class="gutter" style="padding: 24px 32px 0 32px;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="panel" style="background-color: ${palette.panel}; border: 1px solid ${palette.border}; border-radius: 12px;">
                        <tr>
                          <td align="center" style="padding: 26px 12px 22px 12px;">
                            <div class="code" style="font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, 'Courier New', monospace; font-size: 44px; line-height: 1.1; font-weight: 700; color: ${palette.primary}; letter-spacing: 12px; text-indent: 12px;">${escapeHtml(code)}</div>
                            <div class="muted" style="padding-top: 12px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.4; color: ${palette.muted};">${escapeHtml(expiry)}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="gutter" style="padding: 24px 32px 0 32px;">
                      <hr class="rule" style="height: 0; margin: 0; border: 0; border-top: 1px solid ${palette.border};" />
                    </td>
                  </tr>
                  <tr>
                    <td class="gutter muted" style="padding: 16px 32px 28px 32px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.55; color: ${palette.muted};">
                      ${escapeHtml(security)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" class="muted" style="padding: 20px 16px 0 16px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.5; color: ${palette.muted};">
                ${escapeHtml(BRAND)} — ${escapeHtml(TAGLINE)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [heading, '', intro, '', code, '', expiry, '', security, '', `${BRAND} — ${TAGLINE}`].join('\n');

  return { html, text };
}
