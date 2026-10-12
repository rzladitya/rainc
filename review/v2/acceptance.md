# Corporate website V2 acceptance evidence

## Implemented

- RAinc company positioning uses the requested AI era headline and identifies the studio as independent, founded in early 2026, bootstrapped, founder led and Indonesia based.
- About includes mission, ownership, product focus, Rizal Aditya's name and AI engineering background, LinkedIn and the confirmed business email.
- Products labels Precidoc as the first SaaS product in active development. The product website link and a functional illustrated example are distinct entry points.
- Contact, Privacy Policy and Terms are public pages. Policies reflect email contact, static company pages, fixed sample data and first party metrics.
- Navigation provides Home, Products, About, Updates and Contact. Footer links include policies and business contact.
- Updates references the actual 9 October source commit and this 12 October website expansion. No product launch, paid usage, incorporation or external programme approval is invented.
- Every public page has its own title, description, canonical URL, Open Graph and Twitter metadata. Organization data contains founder and country information without a fabricated founding day or registration number. Sitemap contains all seven pages; robots permits company page indexing. Unknown routes return 404 with noindex.
- Native motion and shared typography retain the existing design. All content remains visible without animation; mobile navigation also works without JavaScript.

## Verified locally

- All seven pages served HTTP 200 without authentication in Cloudflare's local Worker runtime.
- All pages passed layout and font checks at 320, 390, 620, 768, 1024 and 1440 pixels.
- Desktop and mobile automated WCAG A and AA checks detected zero violations. This is not an accessibility certification.
- Menu, Escape, page navigation, demo tabs, keyboard selection and three-chunk JSON download worked.
- Sitemap, robots, canonical redirect, metadata and 404 behavior passed.
- Client event payloads were accepted with HTTP 204. DNT and GPC prevented collection. Unit checks rejected unknown fields, arbitrary page strings, foreign origins, invalid JSON and oversized payloads.
- Local Worker console metrics were persisted and queried successfully. The recorded count is automated test traffic, not evidence of customers or visitor traction.
- Normal motion ran and changes to reduced motion cancelled running effects on all pages.
- Local loading recorded no external resources or layout shifts. Performance figures in local-performance.json describe a local run, not production Core Web Vitals.
- No JavaScript or failed asset requests were detected in the passing browser run.

## Public verification limitation

The running workspace policy currently permits the Cloudflare API but blocks HTTP requests to rainc.web.id and precidoc.rainc.web.id. A draft preserves existing access and adds these domains and the Workers preview domain. Saving a draft does not apply the running policy. Review and save the environment settings and publish the environment to enable a public HTTPS check.

Public certificate behavior, the live Precidoc entry flow and its return link to RAinc remain unverified. RAinc's outgoing product links use the supplied canonical Precidoc address. No changes were made to Precidoc's separate service or its account policies.

## Artifacts

The desktop and mobile screenshots cover every page under review/v2. Browser results, local performance evidence and metrics persistence evidence are included separately. All screenshots were generated locally from the deployable source.
