import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * 验证公开消费者项目生成的 unified documentation、i18n entry 和路径隐私。
 * Verifies the public consumer project's unified documentation, i18n entries, and path privacy.
 */
async function main() {
  const integration = await readJson("docs/jsdoc/hia-integration.json");
  const manifest = await readJson("docs/unified/hia-manifest.json");
  const projectIndex = await readJson("docs/unified/project-index.json");

  assert.equal(integration.contract, "hia-jsdoc-integration");
  assert.ok(Array.isArray(integration.ir?.nodes) && integration.ir.nodes.length === 4);
  assert.deepEqual(manifest.project.views, ["all", "js"]);
  assert.equal(manifest.project.entryCounts.js, 4);
  assert.equal(manifest.project.entryCounts.all, 4);
  assert.equal(projectIndex.entries.filter((entry) => entry.view === "js").length, 4);
  assert.ok(projectIndex.entries.some((entry) => entry.id.includes("normalizebookmarktitle")));
  assert.ok(projectIndex.entries.some((entry) => entry.id.includes("sortbookmarksbytitle")));
  assert.equal((manifest.docSourceMaps ?? []).length, 0);

  await assertNoUnsafeOutput("docs");
  process.stdout.write("Bookmark Board public consumer documentation check passed: JS 4 unified entries.\n");
}

/**
 * 递归检查公开输出，避免本机绝对路径或 adapter 私有字段泄漏。
 * Recursively checks public output for local absolute paths and adapter-private field leaks.
 *
 * @param {string} directory Output directory.
 */
async function assertNoUnsafeOutput(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await assertNoUnsafeOutput(target);
      continue;
    }
    if (!entry.isFile() || ![".css", ".html", ".js", ".json"].includes(path.extname(entry.name))) {
      continue;
    }

    const content = await readFile(target, "utf8");
    assert.doesNotMatch(content, /(^|[^A-Za-z])[A-Za-z]:[\\/]/, `${target}: output leaks a Windows absolute path.`);
    assert.doesNotMatch(content, /(^|[\s"'([{])\\\\[A-Za-z0-9._$-]+[\\/]/, `${target}: output leaks a UNC path.`);
    assert.doesNotMatch(content, /\/Users\//, `${target}: output leaks a macOS user path.`);
    assert.doesNotMatch(content, /"filePath"\s*:/, `${target}: output retains an adapter-private filePath field.`);
  }
}

/**
 * 读取 JSON 文件。
 * Reads a JSON file.
 *
 * @param {string} filePath JSON file path.
 * @returns {Promise<unknown>} Parsed JSON value.
 */
async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

await main();
