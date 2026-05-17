# Lighthouse + Bundle Analysis

Last updated: 2026-05-17

This document captures Papyr's frontend performance and SEO/accessibility
audit setup. **The full Lighthouse run is not executed on the operator
laptop** per the same policy that applies to Playwright. Bundle analysis
runs locally because it is lightweight (no headless browser, no production
server). Use this file as the operator's reference when running these
audits in CI or on a dedicated machine.

## What Was Set Up

- `npm run analyze` — runs Next.js Turbopack bundle analyzer in output mode
  (`next experimental-analyze -o`). Writes results to
  `frontend/.next/diagnostics/analyze` without spinning up the interactive
  UI. Safe for CI and laptops.
- `npm run analyze:ui` — same analysis, but starts the interactive web UI
  (defaults to `http://localhost:4000`). Use locally for treemap exploration.
- `npm run lhci` — runs `lhci autorun`, which boots `npm run start`,
  collects 3 Lighthouse runs per URL, and asserts the configured thresholds.
  Run this on a machine that can host a production Next.js server and a
  headless Chrome.
- `frontend/lighthouserc.js` — Lighthouse CI configuration.

> Note: `@next/bundle-analyzer` (the older webpack-only plugin) is **not**
> compatible with Turbopack, which Next.js 16 uses by default. We use the
> built-in `next experimental-analyze` instead.

## Lighthouse CI Configuration

`frontend/lighthouserc.js`:

| Setting | Value |
|---------|-------|
| Collect URLs | `/`, `/compress`, `/merge`, `/protect`, `/pdf-to-word` |
| Server command | `npm run start` |
| Server-ready pattern | `Ready` |
| Number of runs | 3 |
| Performance | warn at min 0.90 |
| Accessibility | error at min 0.95 |
| SEO | error at min 0.95 |
| Best Practices | warn at min 0.90 |
| Upload | `temporary-public-storage` |

`/pdf-to-word` is included as a representative async-conversion page so the
audit covers an interactive form view, not just static landing pages.
Backend-bound flows themselves are not exercised by Lighthouse — Lighthouse
only loads the frontend.

### Running Lighthouse CI (manual / non-laptop)

```bash
cd frontend
npm run build
npm run lhci
```

The runner will start `npm run start` automatically, run each URL three
times, and emit a public report URL plus a pass/fail status against the
thresholds above.

## Bundle Snapshot (2026-05-17)

Captured via `npm run analyze` (`next experimental-analyze -o`) on the
operator laptop. Numbers are raw `.next/static/chunks/*.js` sizes
(uncompressed) — they are wire-loaded gzipped, so real network footprint
is substantially smaller.

- Total client chunks: ~1.76 MB across all routes (uncompressed).
- Top heavy chunks (KB):
  - `042pvwmmlu8~n.js` — ~424 KB (likely PDF.js worker / pdfium runtime).
  - `0-gdq1_osscot.js` — ~416 KB (likely PDF rendering core).
  - `0grekfawtzhox.js` — ~222 KB.
  - `0mcp_9fl75ieh.js` — ~146 KB.
  - `03~yq9q893hmn.js` — ~110 KB.
  - Tail: 11 chunks under ~55 KB each, then a long tail under ~25 KB.

Per-route entry points are small; the bulk of the bundle is shared
client-side PDF tooling pulled in once and cached across pages.

## Optimization Recommendations (Initial)

These are derived from the bundle structure above. They are recommendations,
not commitments:

1. **Confirm PDF.js / `pdfjs-dist` is dynamically imported** on routes that
   need it (e.g. preview / page-viewer surfaces). The two largest chunks
   (~424 KB + ~416 KB) look consistent with the PDF stack and should not
   be loaded on the homepage or for tools that don't render PDFs in the
   browser.
2. **Verify `pdf-lib` is tree-shaken** for tools that only need a small
   subset (Merge / Split / Rotate). If a route imports the whole library
   namespace, swap to named imports of just the `PDFDocument`, `PDFPage`,
   etc. surfaces it actually uses.
3. **Audit `@dnd-kit/*`** — currently imported across multiple tools. The
   library is small but if only Merge truly needs drag-and-drop, the other
   tool routes shouldn't include the kit's chunk.
4. **Image optimization on landing copy** — Lighthouse will likely flag
   any unoptimized inline images on `/`, `/compress`, `/merge`, etc. Use
   `next/image` rather than raw `<img>` for any decorative content.
5. **`color-scheme` + theme inline script** — already inlined in the
   layout. Confirm no FOUC (flash of unstyled content) at LCP. If any
   appears in real CI Lighthouse runs, consider moving to a `<style>` tag
   strategy that ships in the HTML head.

These will be re-evaluated against Lighthouse output once the audit is run
in a non-laptop environment.

## Definition of "Done" for STEP-F2-049 (Option B)

Per operator decision (Option B in STEP-F2-049 review), this step delivers:

- Bundle analyzer wired up and runnable on the laptop (snapshot above).
- Lighthouse CI configured with the prompt's thresholds.
- This document explaining the setup and how to run audits later.

The full Lighthouse audit run is intentionally deferred to a CI / non-
laptop environment, consistent with the Playwright skip policy operative
since STEP-F2-041.
