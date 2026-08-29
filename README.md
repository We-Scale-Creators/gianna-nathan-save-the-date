# Gianna & Nathan — Save the Date

Luxury digital save-the-date for Gianna Gracie and Nathan Robert.

- September 25, 2027
- Villa Siena
- Gilbert, Arizona

## Stack

Static HTML/CSS/JavaScript. No build step, no dependencies, no `package.json`.

## Deploy (Vercel)

Import this repository into Vercel and deploy from `main`. The project settings
must be:

| Setting          | Value                  |
| ---------------- | ---------------------- |
| Framework Preset | **Other**              |
| Root Directory   | `./`                   |
| Build Command    | **empty** (override off) |
| Output Directory | **empty** (override off) |
| Install Command  | **empty** (override off) |

There is no `package.json`. If Build Command is set to anything — including the
default `npm run build` that gets filled in when a framework preset is selected —
the deploy fails before it ever serves a file. If a build has already failed this
way, clear the overrides in **Settings → Build & Development Settings**, then
**Deployments → ⋯ → Redeploy** with "Use existing Build Cache" **unchecked**.

`vercel.json` handles clean URLs, long-lived caching on `/assets/*`, and security
headers. It needs no changes.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000 — serve it over HTTP rather than opening
`index.html` from the filesystem, since the CSS, script, and image paths are all
root-absolute (`/styles.css`, `/assets/...`).
