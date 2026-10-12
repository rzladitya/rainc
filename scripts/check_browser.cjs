const BASE = process.env.BASE_URL || "http://127.0.0.1:8085";
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({
    headless: true,
    executablePath:
      process.env.BROWSER_EXECUTABLE ||
      (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({ reducedMotion: "reduce", acceptDownloads: true });
  const paths = [
    "/",
    "/products/",
    "/about/",
    "/updates/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ];
  const errors = [];
  const events = [];
  const results = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", async (r) => {
    if (r.url().endsWith("/events")) {
      events.push({
        status: r.status(),
        payload: JSON.parse(r.request().postData()),
      });
    } else if (r.url().startsWith(BASE) && r.status() >= 400)
      errors.push(r.status() + " " + r.url());
  });
  for (const width of [320, 390, 620, 768, 1024, 1440]) {
    await p.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      const r = await p.goto(BASE + path, { waitUntil: "networkidle" });
      if (r.status() !== 200) throw Error(path + " HTTP " + r.status());
      const info = await p.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        h1: document.querySelectorAll("h1").length,
        canonical: document.querySelector("link[rel=canonical]").href,
        description: document.querySelector("meta[name=description]").content,
        robots: document.querySelector("meta[name=robots]").content,
        fonts:
          document.fonts.check("500 16px Manrope") &&
          document.fonts.check('400 16px "DM Sans"'),
      }));
      if (
        info.scroll > width ||
        info.h1 !== 1 ||
        !info.fonts ||
        !info.description ||
        info.robots !== "index, follow" ||
        info.canonical !== "https://rainc.web.id" + path
      )
        throw Error(path + " " + JSON.stringify(info));
      results.push({
        width,
        path,
        status: r.status(),
        title: await p.title(),
        overflow: false,
      });
    }
    console.log(width + "px: seven pages pass layout, fonts and SEO");
  }
  for (const width of [1440, 390]) {
    await p.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      await p.goto(BASE + path, { waitUntil: "networkidle" });
      await p.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
      const v = await p.evaluate(
        async () =>
          (
            await axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa"],
              },
            })
          ).violations,
      );
      console.log(
        "Axe",
        width,
        path,
        JSON.stringify(
          v.map((x) => ({ id: x.id, targets: x.nodes.map((n) => n.target) })),
        ),
      );
      if (v.length) process.exitCode = 1;
      const n = path === "/" ? "home" : path.replaceAll("/", "");
      await p.screenshot({
        path: `review/v2/${n}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await p.goto(BASE + "/products/", { waitUntil: "networkidle" });
  for (const id of ["chunks", "export", "review"]) {
    await p.locator("#tab-" + id).click();
    if (!(await p.locator("#panel-" + id).isVisible()))
      throw Error("Demo tab " + id);
  }
  await p.locator("#tab-review").focus();
  await p.keyboard.press("ArrowRight");
  if ((await p.locator("#tab-chunks").getAttribute("aria-selected")) !== "true")
    throw Error("Keyboard demo");
  await p.keyboard.press("End");
  const [download] = await Promise.all([
    p.waitForEvent("download"),
    p.waitForResponse(
      (response) =>
        response.url().endsWith("/events") &&
        response.request().postDataJSON()?.event === "example_download",
    ),
    p.locator(".download-example").click(),
  ]);
  const data = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
  if (data.chunks.length !== 3 || !data.example) throw Error("Bad example");
  console.log("Demo and keyboard navigation pass; three chunks downloaded");
  await p.goto(BASE + "/");
  await p.locator(".menu-toggle").click();
  if (!(await p.locator("nav").isVisible())) throw Error("Menu unavailable");
  await p.keyboard.press("Escape");
  if (
    (await p.locator(".menu-toggle").getAttribute("aria-expanded")) !== "false"
  )
    throw Error("Escape menu");
  await p.locator(".menu-toggle").click();
  await p.locator('nav a[href="/about/"]').click();
  await p.waitForURL("**/about/");
  console.log("Mobile navigation and Escape pass");
  for (const href of [
    "/",
    "/products/",
    "/about/",
    "/updates/",
    "/contact/",
    "/privacy/",
    "/terms/",
    "/sitemap.xml",
    "/robots.txt",
  ]) {
    const r = await p.request.get(BASE + href);
    if (r.status() !== 200)
      throw Error("Public link " + href + " " + r.status());
  }
  const missing = await p.request.get(BASE + "/does-not-exist/");
  if (
    missing.status() !== 404 ||
    !(await missing.text()).includes("noindex, follow")
  )
    throw Error("404 indexing");
  const api = await p.request.get(BASE + "/events");
  if (api.status() !== 405 || api.headers()["x-robots-tag"] !== "noindex")
    throw Error("Metrics indexing");
  const redirect = await p.request.get(BASE + "/about", {
    maxRedirects: 0,
  });
  if (![301, 302, 307, 308].includes(redirect.status()))
    throw Error("Canonical route redirect");
  console.log("Public pages, 404, robots, sitemap and canonical redirect pass");
  await p.goto(BASE + "/contact/", { waitUntil: "networkidle" });
  await p
    .locator(".contact-primary .button")
    .evaluate((e) =>
      e.addEventListener("click", (event) => event.preventDefault()),
    );
  await Promise.all([
    p.waitForResponse(
      (response) =>
        response.url().endsWith("/events") &&
        response.request().postDataJSON()?.event === "contact_email",
    ),
    p.locator(".contact-primary .button").click(),
  ]);
  if (
    !events.some((e) => e.status === 204 && e.payload.event === "contact_email")
  )
    throw Error("Email event missing");
  if (
    !events.some(
      (e) => e.status === 204 && e.payload.event === "example_download",
    )
  )
    throw Error("Download metric missing");
  if (events.some((e) => e.status !== 204))
    throw Error("Metrics response error");
  for (const e of events) {
    if (
      Object.keys(e.payload).some(
        (k) => !["event", "page", "source", "step"].includes(k),
      )
    )
      throw Error("Extra payload");
    if (e.payload.page.includes("?")) throw Error("Query string tracked");
  }
  console.log(
    "Browser metrics accepted; query strings and user content excluded",
  );
  for (const signal of ["dnt", "gpc"]) {
    const ctx = await b.newContext();
    await ctx.addInitScript(
      ({ signal }) => {
        Object.defineProperty(
          Navigator.prototype,
          signal === "dnt" ? "doNotTrack" : "globalPrivacyControl",
          { get: () => (signal === "dnt" ? "1" : true), configurable: true },
        );
      },
      { signal },
    );
    const page = await ctx.newPage();
    let count = 0;
    page.on("request", (r) => {
      if (r.url().endsWith("/events")) count++;
    });
    await page.goto(BASE + "/contact/", {
      waitUntil: "networkidle",
    });
    if (count !== 0) throw Error("Privacy signal ignored " + signal);
    await ctx.close();
  }
  console.log("DNT and GPC suppress browser tracking");
  const ctx = await b.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  });
  const staticPage = await ctx.newPage();
  for (const path of paths) {
    await staticPage.goto(BASE + path, { waitUntil: "networkidle" });
    if (
      !(await staticPage.locator("nav").isVisible()) ||
      !(await staticPage.locator("main").isVisible())
    )
      throw Error("No JS navigation " + path);
    if (
      await staticPage.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
    )
      throw Error("No JS overflow " + path);
  }
  await ctx.close();
  console.log("No-JavaScript mobile navigation works on all pages");
  console.log("Runtime / asset errors:", errors);
  if (errors.length) process.exitCode = 1;
  fs.writeFileSync(
    "review/v2/browser-results.json",
    JSON.stringify(
      { checks: results, metricsCount: events.length, errors },
      null,
      2,
    ),
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
