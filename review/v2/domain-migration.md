# Domain consolidation on 12 October 2026

RAinc uses https://rainc.tech/ with founder@rainc.tech as its contact.
Precidoc now has the custom domain precidoc.rainc.tech on its existing Worker.
Corporate product links, including the sample entry, use the new product domain.

Live HTTPS checks confirm all seven corporate pages, indexing directives,
canonical URLs, robots and sitemap. See public-verification.json.
The old corporate domain returns HTTP 301 to the equivalent rainc.tech URL.
The old Precidoc sample returned HTTP 308 to precidoc.rainc.tech/sample,
preserving the tab query parameter. This redirect is served by the product
configuration, not the corporate Worker.

www.rainc.tech is bound to the corporate Worker and redirects to rainc.tech.
Unit tests verify both corporate redirects preserve paths and query strings.
The environment proxy blocks direct requests to www.rainc.tech and
precidoc.rainc.tech. Their allowlist additions were saved as a draft requiring
Save and Publish. Product processing, authentication, product canonical URLs
and the new sample destination have not been verified in this environment.

The founder confirmed sending and receiving at founder@rainc.tech. No email
was sent by this agent. SPF, DKIM and DMARC have not been independently audited;
the email provider has not been specified. Search Console and external profile
updates are also pending configured access.
