# Feedback follow up on 12 October 2026

The corporate V2 design is preserved. The Products page now links directly to
Precidoc's public sample and explains browser processing, current trial limits,
and unavailable LLM processing, OCR, embeddings and knowledge base connections.
These statements were checked against Precidoc's public landing page.

Public HTTPS requests succeeded for all seven corporate pages, robots.txt,
sitemap.xml and the Precidoc sample entry. Sitemap URLs match the page canonical
URLs, and the public pages allow indexing. Results are in public-verification.json.
This does not prove Google has indexed the website.

The browser suite passed 42 page and viewport combinations, desktop and mobile
accessibility checks, demo tabs, JSON download, keyboard and mobile navigation,
privacy signals and navigation without JavaScript. A separate mobile check of the
updated product copy found no horizontal overflow.

Remaining external verification:

* GitHub API access was rejected by the environment proxy. Repository About metadata
  has not been changed. The proposed description, website and topics are in README.
* LinkedIn is not an allowed destination in the environment. The founder profile
  link is preserved, but independent profile verification remains pending.
* Search Console access is not configured. No submission or indexing claim is made.
* Precidoc sample returned HTTP 200. Its processing, login and free workspace
  behavior require a separate product audit; they are not covered by RAinc tests.
* No traction, customer numbers or startup program approval claims were added.
