const PAGES = new Set([
  "/",
  "/products/",
  "/about/",
  "/updates/",
  "/contact/",
  "/privacy/",
  "/terms/",
]);
const EVENTS = new Set([
  "page_view",
  "product_open",
  "demo_open",
  "demo_step",
  "example_download",
  "contact_email",
  "founder_profile",
]);
const SOURCES = new Set([
  "page",
  "header",
  "home",
  "products",
  "product",
  "demo",
  "about",
  "contact",
  "privacy",
  "terms",
  "footer",
  "content",
]);
const STEPS = new Set(["review", "chunks", "export"]);
const reply = (status) =>
  new Response(null, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      ...(status === 405 ? { Allow: "POST" } : {}),
    },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (["rainc.web.id", "www.rainc.tech"].includes(url.hostname)) {
      url.hostname = "rainc.tech";
      url.protocol = "https:";
      return Response.redirect(url.href, 301);
    }
    if (url.pathname !== "/events") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return reply(405);
    if (request.headers.get("Origin") !== url.origin) return reply(403);
    if (
      request.headers.get("DNT") === "1" ||
      request.headers.get("Sec-GPC") === "1"
    )
      return reply(204);
    if (!request.headers.get("Content-Type")?.startsWith("application/json"))
      return reply(415);
    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > 512) return reply(413);
    // Read a bounded body, never arbitrary large analytics payloads.
    const reader = request.body?.getReader();
    if (!reader) return reply(400);
    const chunks = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 512) {
        await reader.cancel();
        return reply(413);
      }
      chunks.push(value);
    }
    let data;
    try {
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      data = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return reply(400);
    }
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      Object.keys(data).some(
        (key) => !["event", "page", "source", "step"].includes(key),
      )
    )
      return reply(400);
    if (
      !EVENTS.has(data.event) ||
      !PAGES.has(data.page) ||
      !SOURCES.has(data.source)
    )
      return reply(400);
    if (
      (data.event === "demo_step" && !STEPS.has(data.step)) ||
      (data.event !== "demo_step" && data.step !== undefined)
    )
      return reply(400);
    // Only allowlisted dimensions are logged; no request headers or identifiers.
    console.log(
      JSON.stringify({
        type: "rainc_site_metric",
        release: "corporate-v2",
        event: data.event,
        page: data.page,
        source: data.source,
        ...(data.step ? { step: data.step } : {}),
      }),
    );
    return reply(204);
  },
};
