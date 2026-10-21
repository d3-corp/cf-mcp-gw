import { test } from "node:test";
import assert from "node:assert/strict";
import { checkDocuments } from "../scripts/check-docs.ts";
import { checkSecrets } from "../scripts/check-secrets.ts";

test("documents resolve inline/reference/image links and duplicate heading anchors offline", () => {
  const files = new Map([
    [
      "README.md",
      "# Start\n[plan](docs/plan.md#scope-1)\n[reference][p]\n![image](diagram.svg)\n[p]: docs/plan.md#scope\n[external](https://example.com/path)",
    ],
    ["docs/plan.md", "# Scope\n# Scope\n[back](../README.md#start)"],
    ["diagram.svg", "<svg/>"],
    ["config.json", "{}"],
  ]);
  assert.deepEqual(checkDocuments(files), []);
});
test("broken paths, anchors, escaping paths, malformed URLs and JSON fail", () => {
  for (const link of [
    "missing.md",
    "#absent",
    "../outside.md",
    "https://",
    "/README.md",
  ]) {
    assert.ok(
      checkDocuments(new Map([["README.md", `[bad](${link})`]])).length > 0,
    );
  }
  assert.ok(
    checkDocuments(
      new Map([
        ["README.md", "# Intro"],
        ["config.json", "{"],
      ]),
    ).length > 0,
  );
  assert.ok(checkDocuments(new Map()).length > 0);
});
test("credential rules fail without echoing candidate values", () => {
  const values = [
    "gh" + "p_" + "a".repeat(36),
    "ops" + "_" + "a".repeat(40),
    "AK" + "IA" + "A".repeat(16),
    "-----BEGIN " + "PRIVATE KEY-----",
    "Bearer " + "a".repeat(40),
    "API_" + 'KEY="' + "a".repeat(30) + '"',
  ];
  for (const value of values) {
    const errors = checkSecrets(new Map([["sample.txt", value]]));
    assert.ok(errors.length > 0);
    assert.ok(errors.every((error) => !error.includes(value)));
  }
  assert.ok(
    checkSecrets(
      new Map([
        [".env", ""],
        ["state.tfstate", ""],
      ]),
    ).length >= 2,
  );
});
test("secret references and explicit placeholders pass", () => {
  assert.deepEqual(
    checkSecrets(
      new Map([
        [
          "README.md",
          'API_KEY="op://vault/item/field"\nTOKEN="YOUR_TOKEN"\nPASSWORD="<password>"',
        ],
      ]),
    ),
    [],
  );
});

test("inventory works without Git metadata, excludes dependencies and rejects symlinks/binaries", async () => {
  const { mkdtempSync, writeFileSync, mkdirSync, symlinkSync, rmSync } =
    await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { repositoryFiles } = await import("../scripts/files.ts");
  const root = mkdtempSync(join(tmpdir(), "gateway-check-fixture-"));
  try {
    writeFileSync(join(root, "README.md"), "# Test\n");
    mkdirSync(join(root, "node_modules"));
    writeFileSync(join(root, "node_modules", "ignored"), Buffer.from([0]));
    writeFileSync(join(root, ".env"), "never-read-this-content");
    const files = repositoryFiles(root);
    assert.equal(files.get(".env"), "");
    assert.ok(!files.has("node_modules/ignored"));
    assert.deepEqual(checkDocuments(files), []);
    assert.ok(checkSecrets(files).length > 0);
    symlinkSync("README.md", join(root, "linked.md"));
    assert.throws(() => repositoryFiles(root), /Unsupported file/);
    rmSync(join(root, "linked.md"));
    writeFileSync(join(root, "binary"), Buffer.from([0]));
    assert.throws(() => repositoryFiles(root), /Binary file/);
  } finally {
    rmSync(root, { recursive: true });
  }
});

test("reference links and JSON secret assignments cannot bypass the checks", () => {
  assert.ok(
    checkDocuments(
      new Map([["README.md", "[reference][target]\n\n[target]: absent.md"]]),
    ).length > 0,
  );
  const candidate = "a".repeat(30);
  const content = JSON.stringify({
    API_KEY: "op://vault/item/field",
    CLIENT_SECRET: candidate,
  });
  const errors = checkSecrets(new Map([["config.json", content]]));
  assert.equal(errors.length, 1);
  assert.ok(!errors[0].includes(candidate));
});
