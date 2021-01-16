/**
 * Deno includes:
 *
 * 1. The test runner in the CLI.
 * 2. Assertions in the standard library.
 * 3. Built-in test fixtures with Deno.test().
 */

import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.83.0/testing/asserts.ts";

Deno.test("short example test", () => {
  assertEquals("deno", "deno");
  assertNotEquals({ runtime: "deno" }, { runtime: "node" });
});

Deno.test({
  name: "long example test",
  ignore: Deno.build.os === "windows",
  fn() {
    assertEquals("deno", "deno");
    assertNotEquals({ runtime: "deno" }, { runtime: "node" });
  },
});

Deno.test({
  name: "ops leak",
  sanitizeOps: false,
  fn() {
    setTimeout(console.log, 10000);
  },
});

Deno.test({
  name: "resource leak",
  sanitizeResources: false,
  async fn() {
    await Deno.open("./models/planets.ts");
  },
});
