# CLAUDE.md

Static save-the-date for Gianna Gracie & Nathan Robert — September 25, 2027,
Villa Siena, Gilbert AZ. Black-tie. Live at
https://gianna-nathan-save-the-date-eta.vercel.app, auto-deploys from `main`.

No build step. No `package.json`. No framework. Files are served as-is.

---

## 1. Structure

Every file sits at the repo root, flat:

- `index.html`
- `styles.css`
- `script.js`
- `vercel.json`
- `portrait-embrace.webp`, `villa-siena.webp` — the two photographs
- `og.jpg` — social preview
- `bodoni-moda-400.woff2`, `cormorant-300.woff2`, `cormorant-300-italic.woff2`, `jost-300.woff2` — self-hosted subset fonts

All paths in `index.html` and `styles.css` are root-absolute (`/styles.css`,
`/portrait-embrace.webp`, `/bodoni-moda-400.woff2`, …) to match. If anyone
reorganises assets into subfolders, **both files must be updated in the same
commit** or the deployed site 404s its own assets.

## 2. Design system

The palette is drawn from Villa Siena itself — whitewashed stucco, terracotta
walk, wrought iron, bougainvillea. Tokens live in `:root` in `styles.css`:

| Token | Value | Role |
|---|---|---|
| `--ink` | `#14110e` | Warm near-black ground (not blue-black) |
| `--paper` | `#efe9dd` | Letterpress stock |
| `--text` | `#241f19` | Body ink on paper |
| `--text-soft` | `#5d554a` | Labels, captions, quiet copy |
| `--gilt` | `#9c7f4e` | Hairlines only — rules, monogram bars, plate frame |
| `--wine` | `#8e2f47` | Bougainvillea. **The single accent.** |

`--wine` appears in exactly two places: the wax **seal** on the envelope, and
the diamond `b` in `.ornament`. A third use dilutes it — don't add one.

### Type

Three families is the ceiling.

- **Bodoni Moda 400** (`--display`) — display: names, date, venue name, monograms, envelope card.
- **Cormorant Garamond 300 / italic** (`--script`) — connective and quiet copy, mostly italic (`and`, "for the wedding of", the interlude).
- **Jost 300** (`--label`) uppercase at `letter-spacing: .42em` — engraved labels ("Save the Date", "The Location", "Formal invitation to follow").

Do not introduce a fourth family. Reuse `.label`, `.quiet` (and `.quiet--wide`
for tracked non-italic), rather than declaring parallel styles.

### Fonts

Self-hosted and **subset to only the glyphs this page uses** — the four faces
together are 28 KB. They are preloaded via `<link rel="preload">` for the two
faces that render above the fold (Bodoni Moda regular, Cormorant italic).

They are deliberately not loaded from Google Fonts. Guests will open this on
hotel wifi and inside the Instagram / Facebook / iMessage in-app browsers,
where a third-party font request hangs, flashes unstyled text, or gets blocked
outright.

**If new copy introduces a character not in the current subset it will silently
fall back to Didot / Garamond / Futura.** Re-subset the woff2 — do not switch
to a CDN.

### Photographs

Both `portrait-embrace.webp` and `villa-siena.webp` are pre-cropped to
**exactly 4:5 at 1080×1350**. CSS in `.plate-figure` uses `aspect-ratio: 4 / 5`
with `object-fit: cover`. The crop is baked in — do **not** re-add
`object-position` tuning, and do not swap in a differently-shaped source.

## 3. Invariants — verify each after any change

1. **Readable with JavaScript disabled.** `<body>` ships with `is-locked`
   (`overflow: hidden; height: 100svh`) and every `.reveal` starts at
   `opacity: 0`. Only `script.js` clears them. The `<noscript>` block in
   `index.html` unlocks scrolling, hides `.opening`, and reveals `.reveal`
   directly. Test by disabling JS in devtools.

2. **Open sequence ordering.** In `script.js`:
   - `body.classList.add('is-open')` fires immediately on click.
   - `is-locked` is removed at **1250 ms**.
   - `#invitation.scrollIntoView` fires at **1650 ms**.

   **Unlock must always precede scroll.** If you retime the flap animation,
   preserve that ordering and keep both timings within the animation duration
   (currently `.95s` flap + `1.15s` card lift with `.5s` delay, so ~1.65s
   total). `prefers-reduced-motion: reduce` collapses these to 20 ms / 40 ms;
   the ordering is preserved there too.

3. **15-second safety net.** `script.js` has a final `setTimeout` that sets
   `body.style.height = 'auto'` if the envelope was never opened. Keep it —
   it's what rescues guests whose click handler never fired.

4. **Reduced-motion honoured.** The media query in `styles.css` collapses
   every transition to `.01ms` and forces `.reveal { opacity: 1; transform: none; }`.
   Don't add a transition that skips this rule.

5. **No horizontal scroll at 390px viewport width.** `body { overflow-x: hidden; min-width: 320px; }`
   plus fluid `clamp()` sizing throughout. Verify at 390 px after any layout
   change.

## 4. Working method

- **No build step, no packages.** Do not add `package.json`, do not `npm install` anything.
- **Local preview:** `python3 -m http.server 8000`, then open `http://localhost:8000`. Root-absolute paths require HTTP — opening `index.html` from the filesystem will 404 the CSS, script, and assets.
- **Deploy:** the project is Vercel git-linked. Deployment is `git push` to `main` and nothing else. **Do not run `vercel` CLI.**
- Vercel project settings must stay: Framework Preset = **Other**, Build / Output / Install commands **empty**. Setting Build Command to anything (including the default `npm run build`) fails the deploy before it serves a file.

## 5. Open items

- **`og:image` is the relative path `/og.jpg`.** Open Graph requires an
  absolute URL, so link previews in iMessage, WhatsApp, and Facebook currently
  show text with no image. Fix (`https://<domain>/og.jpg`) when the custom
  domain is connected. Note in `index.html` head marks the spot.
- **Five dead files, nothing references them:**
  - `giannanathansavethedate.zip`
  - `base.css` (superseded by `styles.css`)
  - `assets/photo-1.webp`
  - `assets/photo-2.webp`
  - `assets/villa-siena-etching.webp`
- **`README.md` and `PRODUCTION_QA.md` are out of date** — they still describe
  the old `assets/` folder layout (`styles.css` importing `base.css`, images
  under `assets/`). The live site has been flattened; those docs have not been
  updated.

## 6. Reuse the existing vocabulary

Before adding a new class or CSS custom property, use what's there:

- **Tokens:** `--ink`, `--ink-soft`, `--paper`, `--paper-deep`, `--text`, `--text-soft`, `--gilt`, `--wine`, `--display`, `--script`, `--label`, `--ease`, `--ease-lift`.
- **Type classes:** `.label`, `.quiet`, `.quiet--wide`.
- **Structural classes:** `.ornament`, `.monogram` (+ `.monogram--small`), `.plate-figure` (+ `.plate-figure--venue`), `.reveal`, `.leaf`, `.plate`, `.opening`.

Parallel tokens or classes fragment the design system. Extend an existing one
if you need a variant (e.g. `.monogram--small` pattern).
