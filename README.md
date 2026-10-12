# RAinc corporate website

The corporate website for RAinc, an independent AI Product Studio founded in early 2026 by Rizal Aditya. The studio is based in Indonesia and bootstrapped. Precidoc is its first SaaS product.

The existing minimalist design is shared across seven public pages: Home, Products, About, Updates, Contact, Privacy Policy and Terms. All pages are static HTML. A small Cloudflare Worker handles limited first party website metrics.

## Development

Requirements: Node.js 22 or later, Python 3, and npm.

```sh
npm ci
npm run generate
npm run dev -- --port 8085
```

`npm run dev` disables loading deployment credentials from `.env` into the local Worker. Keep Cloudflare deployment authentication in the process environment or secure environment settings. Never add it to `public`, `worker.mjs` or `wrangler.jsonc`.

## Content and files

- `scripts/generate_site.py`: company information, page content, shared navigation, metadata, structured data, sitemap and robots generation.
- `site/partials`: the original document illustration and interactive workflow component.
- `public/styles.css` and `public/app.js`: the existing visual system, accessible menu and demo tabs, JSON example download and reduced motion support.
- `public/analytics.js`: privacy signal aware event tracker.
- `worker.mjs`: bounded, allowlisted metrics endpoint and asset forwarding.
- `public/fonts`: locally hosted fonts and their licenses.

The company facts come from the founder's instructions. Update entries describe actual corporate website milestones. The product demo is an illustrated sample, not a live Precidoc session. No product API route, customer count, legal registration, funding round or programme approval is asserted.

Precidoc links point to `https://precidoc.rainc.web.id/`. Business contact links use `founder@rainc.tech`. Company policies cover the corporate website, not undocumented Precidoc account or document processing behavior.

## Validation

Start the local Worker on port 8085, then run:

```sh
npm test
npm run test:browser
```

The browser suite uses a system Chromium at `/usr/bin/chromium` when available. Otherwise install a Playwright browser or specify `BROWSER_EXECUTABLE`. `BASE_URL` can select another test server. The suite checks pages at six widths, metadata, indexability, accessibility, navigation, demo download and privacy signals. It writes local review artifacts under `review/v2`.

The HTTP smoke suite exercises the local Worker and its static asset routing. Review evidence distinguishes local validation from public HTTPS verification.

## Deploy

Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` securely, then:

```sh
npm run deploy
```

`wrangler.jsonc` configures the `rainc` Worker, its assets and the `rainc.tech` primary custom domain and `rainc.web.id` redirect. All requests pass through the Worker so the old domain can redirect; `/events` handles metrics. All public company pages remain static.

`cloudflare-pages.zip` contains static assets only. It does not contain the metrics Worker, so it is not a complete V2 deployment on its own.

## Metrics operations

In the Cloudflare dashboard, open the `rainc` Worker and its Logs or Observability view. Filter console messages containing `rainc_site_metric`. Records contain an event, page, source placement, optional demo step and the release label `corporate-v2`.

Tracked events are `page_view`, `product_open`, `demo_open`, `demo_step`, `example_download`, `contact_email` and `founder_profile`. These represent page views or user actions, not unique people, delivered emails, subscriptions or sales. The tracker uses no cookies, browser IDs, query strings, document content or email contents. Do Not Track and Global Privacy Control suppress tracking.

Metrics use the existing Cloudflare Worker logging service. No additional paid analytics subscription or third party browser SDK is required. Provider plan quotas and log retention settings still apply. Privacy disclosures describe the distinction between event payloads and Cloudflare's technical request records.

### Follow up verification

Run `python3 scripts/check_public.py` after deployment to check the seven public
HTTPS pages, canonical URLs, indexing directives, sitemap and Precidoc sample
entry. This does not establish search engine indexing or test the Precidoc
workspace itself. Google Search Console submission requires access to the site
owner's Search Console property.

Repository About settings to apply when GitHub API access is available:

* Description: RAinc corporate website. An independent AI Product Studio founded by Rizal Aditya, developing Precidoc.
* Website: https://rainc.tech/
* Topics: ai, saas, document-processing, product-studio, cloudflare-workers

The October 12 follow up retains the V2 design and makes Precidoc's current
capabilities and unavailable features explicit. Its public sample entry links
straight to the product; the corporate example remains a separate illustration.
