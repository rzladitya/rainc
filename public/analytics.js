(() => {
  // No cookies, browser identifiers, user input or URL query strings.
  const privacySignal = () =>
    navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1" ||
    window.doNotTrack === "1";
  const pages = new Set([
    "/",
    "/products/",
    "/about/",
    "/updates/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ]);
  const page = location.pathname;
  if (!pages.has(page) || privacySignal()) return;
  const send = (event, source = "content", step) => {
    if (privacySignal()) return;
    const payload = { event, page, source };
    if (step) payload.step = step;
    fetch("/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
      keepalive: true,
    }).catch(() => {});
  };
  send("page_view", "page");
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-event]");
    if (link) send(link.dataset.event, link.dataset.source || "content");
    const tab = event.target.closest('[role="tab"]');
    if (tab) send("demo_step", "demo", tab.id.replace("tab-", ""));
    if (event.target.closest(".download-example"))
      send("example_download", "demo");
  });
  document.addEventListener("keydown", (event) => {
    if (
      !event.target.matches('[role="tab"]') ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    queueMicrotask(() => {
      const selected = document.querySelector(
        '[role="tab"][aria-selected="true"]',
      );
      if (selected) send("demo_step", "demo", selected.id.replace("tab-", ""));
    });
  });
})();
