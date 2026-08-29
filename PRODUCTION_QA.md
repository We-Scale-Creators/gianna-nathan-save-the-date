# Production QA

## 2026-08-29 — deploy fixes

**Venue illustration did not render.** `assets/villa-siena-etching.webp` was an SVG
file carrying a `.webp` extension. Vercel serves files by extension, so it went out
as `Content-Type: image/webp`, and because `vercel.json` sets
`X-Content-Type-Options: nosniff` the browser was forbidden from sniffing the real
type and refused to decode it. The `<img>` resolved to `naturalWidth: 0` — a blank
gap in the Location section on every browser.

Fixed by renaming the file to `assets/villa-siena-etching.svg` and updating the
reference in `index.html`.

**Page was unreadable with JavaScript disabled.** `<body>` ships with the
`is-locked` class (`overflow: hidden`), and `.reveal` blocks start at `opacity: 0`.
Both are only cleared by `script.js`. If the script failed to load — blocked,
flaky connection, in-app browser with JS restrictions — the guest got a locked
screen and an envelope that would not open, with no way to reach the invitation.

Fixed with a `<noscript>` block in `index.html` that unlocks scrolling, hides the
envelope sequence, and reveals the invitation directly.

Also added an inline SVG favicon (removes a 404 and the default blank tab icon).

## Structure

Static HTML/CSS/JavaScript. No build step, no dependencies.

- `index.html` — markup
- `styles.css` — imports `base.css`, then production overrides
- `base.css` — the design system
- `script.js` — envelope open + scroll reveals
- `assets/` — photographs and venue illustration
- `vercel.json` — clean URLs and cache/security headers

## Known follow-up

No `og:image` is set, so link previews (iMessage, WhatsApp, Facebook) render as a
plain text card. Adding one requires the final production domain, since Open Graph
image URLs must be absolute.
