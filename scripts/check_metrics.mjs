import assert from "node:assert/strict";
import worker from "../worker.mjs";
const origin = "https://rainc.tech";
const entries = [];
const originalLog = console.log;
console.log = (value) => entries.push(JSON.parse(value));
const post = (data, headers = {}) =>
  new Request(`${origin}/events`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data),
  });
const metric = {
  event: "product_open",
  page: "/products/",
  source: "products",
};
try {
  const redirect = await worker.fetch(new Request("https://rainc.web.id/products/?from=old"), {});
  assert.equal(redirect.status, 301);
  const www = await worker.fetch(new Request("https://www.rainc.tech/about/?from=www"), {});
  assert.equal(www.status, 301);
  assert.equal(www.headers.get("Location"), "https://rainc.tech/about/?from=www");
  assert.equal(redirect.headers.get("Location"), "https://rainc.tech/products/?from=old");
  assert.equal((await worker.fetch(post(metric), {})).status, 204);
  assert.deepEqual(entries[0], {
    type: "rainc_site_metric",
    release: "corporate-v2",
    ...metric,
  });
  const count = entries.length;
  for (const headers of [{ DNT: "1" }, { "Sec-GPC": "1" }])
    assert.equal((await worker.fetch(post(metric, headers), {})).status, 204);
  assert.equal(entries.length, count, "Privacy signals must skip log creation");
  assert.equal(
    (await worker.fetch(post(metric, { Origin: "https://other.example" }), {}))
      .status,
    403,
  );
  assert.equal(
    (await worker.fetch(new Request(`${origin}/events`), {})).status,
    405,
  );
  assert.equal(
    (await worker.fetch(post({ ...metric, email: "private@example.test" }), {}))
      .status,
    400,
  );
  assert.equal(
    (
      await worker.fetch(
        post({ ...metric, page: "/contact/?email=private" }),
        {},
      )
    ).status,
    400,
  );
  assert.equal(
    (await worker.fetch(post({ ...metric, event: "unrecognized" }), {})).status,
    400,
  );
  assert.equal(
    (
      await worker.fetch(
        post({ ...metric, source: "private@example.test" }),
        {},
      )
    ).status,
    400,
  );
  assert.equal(
    (await worker.fetch(post({ ...metric, step: "export" }), {})).status,
    400,
  );
  assert.equal(
    (
      await worker.fetch(
        post({
          event: "demo_step",
          page: "/products/",
          source: "demo",
          step: "export",
        }),
        {},
      )
    ).status,
    204,
  );
  const body = JSON.stringify({ text: "x".repeat(600) });
  assert.equal(
    (
      await worker.fetch(
        new Request(`${origin}/events`, {
          method: "POST",
          headers: { Origin: origin, "Content-Type": "application/json" },
          body,
        }),
        {},
      )
    ).status,
    413,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request(`${origin}/events`, {
          method: "POST",
          headers: { Origin: origin, "Content-Type": "application/json" },
          body: "invalid json",
        }),
        {},
      )
    ).status,
    400,
  );
  let forwarded = false;
  assert.equal(
    (
      await worker.fetch(new Request(`${origin}/about/`), {
        ASSETS: {
          fetch() {
            forwarded = true;
            return new Response("public page");
          },
        },
      })
    ).status,
    200,
  );
  assert.ok(forwarded);
} finally {
  console.log = originalLog;
}
console.log(
  "Metrics checks passed: valid events, privacy signals, origin, bounded payload, allowlists and public assets",
);
