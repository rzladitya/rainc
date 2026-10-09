# RAinc design review

The complete landing page was reviewed through three passes: copy and CTA intent, full desktop and mobile renders, and individual sections with interaction and motion checks.

## Section findings

| Section | Result |
| --- | --- |
| Navigation | Plain RAinc wordmark, named destinations and an Open Precidoc button. The mobile disclosure uses Menu and Close, with Escape support. |
| Hero | Describes document preparation and identifies Precidoc as RAinc's first product. The document illustration preserves visible source references. |
| Product | Shows source comparison, chunks and export through an explicitly illustrated sample. All product buttons use Open Precidoc. |
| Studio | Replaces generic principles with ownership, the first product and the document preparation problem. |
| Founder | Names Rizal Aditya and his role without an invented quote, photograph or employer endorsement. |
| Closing | Invites the visitor to try a document and leads to the supplied Precidoc address. |
| Footer | Contains studio identity, founder attribution and named product and LinkedIn links. |

Decorative icons, numbered section labels, slash separators, arrows and dot separators were removed. Technical punctuation remains in the Markdown and JSON example data. Fonts are served locally. Sharing artwork matches the current page.

## Motion

The source document, chunk and export appear in sequence once when the illustration enters view. Section reveals run once on entry; tab and menu transitions follow user interaction. Motion uses the native Web Animations API with opacity and transforms. No animation loops, cursor effects or external animation libraries are used.

Reduced motion disables all animations, including when the preference changes while the page is open. Content is visible by default. Without JavaScript, the mobile navigation remains available and the static review example and product links remain readable.

## Validation

- Every section and all three example tabs checked at 320, 390, 620, 768, 1024 and 1440 pixels, with no horizontal overflow.
- Keyboard tab selection, mobile disclosure, Escape and section navigation passed.
- Example JSON download parsed and contained three chunks identified as example data.
- Automated WCAG A and AA checks detected zero violations for Review, Chunks and Export at desktop and mobile widths. This is an automated result, rather than a full accessibility certification.
- Reduced motion produced no animations across sections and tab changes.
- Static content and mobile navigation remained available without JavaScript.
- No JavaScript errors or failed local assets were detected.
- Recorded motion preview: 1280 by 900 pixels, approximately fourteen seconds.

Screenshots and video are local Chromium renders of the deployable source. The screenshot of an individual component hides the sticky header during capture to prevent a stitching overlay.

## Artifacts

- `desktop.png` and `mobile.png`: complete page.
- `desktop-first-screen.png`: initial desktop viewport.
- `section-hero.png`, `section-product.png`, `section-studio.png`, `section-founder.png`, `section-closing.png` and `section-footer.png`: individual sections.
- `mobile-product.png` and `mobile-studio.png`: mobile detail views.
- `motion-preview.webm`: document sequence, scrolling and tab transitions.

A real founder photograph and verified product usage evidence remain useful future additions. The page does not claim customers, paid users, funding or measured RAG performance.
