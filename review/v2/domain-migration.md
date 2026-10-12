# Primary domain migration on 12 October 2026

Primary corporate domain: https://rainc.tech/
Business contact displayed by the website: founder@rainc.tech
Precidoc remains at https://precidoc.rainc.web.id/.

Cloudflare deployment succeeded and the Workers Domains API confirms both
rainc.tech and rainc.web.id are attached to the rainc Worker. The old domain
returns HTTP 308, preserving the path and query string, to rainc.tech.
All generated canonical, Open Graph, organization, sitemap and corporate policy
URLs now use rainc.tech. The old domain remains bound to serve redirects.

The environment proxy currently denies direct HTTPS requests to rainc.tech.
An allowlist draft adding only rainc.tech was saved for user review and Publish.
Public destination availability cannot be claimed from that blocked request.
The earlier public-verification.json records the previous domain verification.
Run scripts/check_public.py again once network access is applied.

Updating website contact links does not create a mailbox or configure email
routing. Delivery to founder@rainc.tech has not been verified or configured.
