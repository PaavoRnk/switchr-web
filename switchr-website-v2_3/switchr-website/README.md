# Switchr Website

Three static HTML files — no framework, no build step, deploy directly to Cloudflare Pages.

## Files

| File | URL | Description |
|------|-----|-------------|
| `index.html` | `/` | Homepage — hero, channel picker (WhatsApp/Email/Website), how it works, why Switchr, savings calculator, market watch + tariff quiz, testimonials, FAQ, partner logos |
| `how-it-works.html` | `/how-it-works` | Full 4-step explainer with step visuals and WhatsApp chat mockup |
| `results.html` | `/results` | Savings report page — bill breakdown, tariff comparison, switch form modal |

## What needs connecting to the backend

### index.html
- **Savings calculator** (`#savings` section) — slider currently uses a fixed 27–35% estimate. Should call the real savings calculation endpoint with `monthly_bill` + `usage_pattern` and return actual `annual_saving`, `new_monthly`, `current_annual`.
- **Channel picker — Website tab** — the upload dropzone (`#dropzone`, `#file-input`) currently redirects to `results.html` on file select. Should POST the PDF/image to the bill extraction endpoint and redirect to `results.html?id=xxx` with a session or job ID.
- **Email channel** — `audit@switchr.es` is hardcoded. Confirm this is the live inbound address.
- **WhatsApp CTA links** — `wa.me/34000000000` placeholder number. Replace with the real WATI/WhatsApp Business number.

### results.html
- **All savings figures are hardcoded** (€456/yr, €1,176 new annual cost etc). These should be populated dynamically from the bill extraction result, keyed by the session/job ID passed in the URL.
- **Tariff comparison table** (section 1) — P1/P2/P3 rates and kWh figures are static examples. Should come from the extracted bill data + live Gana/Nordy tariff API.
- **Potencia comparison** (section 2) — static. Should reflect extracted potencia from bill.
- **Optional services** (section 3) — static "Pack Iberdrola Hogar" example. Should be populated from extraction if detected, or hidden if none found.
- **Switch form modal** — personal details (name pre-filled as "Paavo"), address fields, CUPS — should pre-fill from extracted bill data. On submit, calls the Gana/Nordy contract API.
- **Provider name** — currently shows "Nordy" as the recommended provider. Should be determined by the savings calculation (best match across partners).

### how-it-works.html
- Static page, no backend connections needed.
- WhatsApp CTA links need the real number (same as index.html).

## Fonts
Loaded from Google Fonts CDN:
- `Sora` (headings, numbers)
- `DM Sans` (body)

## External dependencies
- `Chart.js 4.4.1` via cdnjs — used in the Market Watch section of index.html
- Gana logo: `https://vaporeta.ganaenergia.com/gana-web/v1/gana-logo.svg`
- Nordy logo: `https://nordy.es/hubfs/Nordy_August_2024/Images/Header%20logo.svg`

## Notes for Claude Code
- All JS is vanilla, inline in each HTML file — no separate JS files
- The savings quiz (`#hmc-widget`) in index.html is fully client-side and uses hardcoded saving percentages (27% fixed, 22% market). These estimates should ideally be replaced with real API calls once a bill is uploaded.
- The market watch chart uses hardcoded 2025 OMIE price data — this is intentional for the marketing page and does not need to be live data.

## processing.html
Sits between the upload (index.html) and the results page. Three phases:

**Phase 1 — Upload animation**
Progress bar with 4 steps: Uploading → Reading → Extracting → Done. Animated scan line over a bill mockup. Currently simulated with timeouts.

**Phase 2 — Extraction summary**
Shows every extracted field with ✓ / ⚠ / ✗ icons and the extracted value. Missing critical fields (CUPS, provider, annual kWh, P1/P2/P3) show an inline input for manual entry. Status banner at top changes colour based on completeness.

**Phase 3 — Redirect**
2.5s countdown bar then redirects to `results.html?job=jobId`.

### Backend integration (processing.html)
- Replace `MOCK_RESULT` with a real poll:
  ```js
  async function pollResult() {
    const r = await fetch('/api/extraction-status?job=' + jobId);
    const d = await r.json();
    if (d.status === 'processing') { setTimeout(pollResult, 1500); return; }
    renderExtraction(d);
  }
  ```
- Expected response shape is documented in the MOCK_RESULT object in the script
- jobId comes from URL param: `processing.html?job=xxxx`
- index.html upload tab should POST bill → get jobId back → redirect to `processing.html?job=xxxx`
