# RAinc

Static website for RAinc, Rizal Aditya's independent AI product studio and the maker of Precidoc.

## Develop

```sh
python3 -m http.server 8081 --directory public
```

No dependency installation or build is needed to serve the site. Fonts are bundled in `public/fonts` with their licenses. The site makes no third-party font or script requests.

## Content and interactions

- `public/index.html`: copy, navigation, product links, founder profile.
- `public/styles.css`: responsive design and locally hosted fonts.
- `public/app.js`: accessible tabs, mobile navigation, an example JSON download and motion that respects reduced motion preferences.

The product illustration and interactive example explain the workflow; they are not screenshots or a live Precidoc session. The sample download contains three example chunks and is identified as example data. Product buttons open `https://precidoc.rainc.web.id/`. No workspace route, API endpoint, customer count or paid plan is assumed. The founder profile uses plain text, without a placeholder photograph or avatar.

## Deploy to Cloudflare

This project is deployed as a static-assets Cloudflare Worker named `rainc`. The configuration is in `wrangler.jsonc`. Custom domain: `rainc.web.id`. The existing Precidoc service is separate.

Provide `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` through your environment. Keep credentials outside `public` and out of version control. `.env` is ignored by Git and is not automatically loaded by the static website.

Use Wrangler 4.149.0 or later from the repository directory:

```sh
wrangler deploy
```

For Cloudflare Pages Direct Upload, `cloudflare-pages.zip` contains only the files from `public` and can be regenerated without any credentials. For a separate Pages project connected to Git, choose no framework or build command, with `public` as the output directory.

## Design review

See `review/design-review.md` for the findings and validation. Screenshots and the motion recording in `review` are local browser renders of the deployable source. They are not served with the public site.
