import MarkdownIt from "markdown-it";
import { posix, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { repositoryFiles } from "./files.ts";

const markdown = new MarkdownIt();
function anchors(content: string): Set<string> {
  const tokens = markdown.parse(content, {});
  const result = new Set<string>();
  const counts = new Map<string, number>();
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== "heading_open") continue;
    const text = (tokens[i + 1].children ?? [])
      .filter((t) => ["text", "code_inline"].includes(t.type))
      .map((t) => t.content)
      .join("");
    const slug = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_ -]/gu, "")
      .replace(/ /g, "-");
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    result.add(count ? `${slug}-${count}` : slug);
  }
  return result;
}
export function checkDocuments(files: Map<string, string>): string[] {
  const errors: string[] = [];
  const docs = [...files.keys()].filter((path) => path.endsWith(".md"));
  if (!docs.length) errors.push("No Markdown documents found");
  for (const [path, content] of files) {
    if (path.endsWith(".json")) {
      try {
        JSON.parse(content);
      } catch {
        errors.push(`${path}: invalid JSON`);
      }
    }
    if (!path.endsWith(".md")) continue;
    for (const token of markdown.parse(content, {})) {
      for (const child of token.children ?? []) {
        if (!["link_open", "image"].includes(child.type)) continue;
        const href = String(
          child.attrGet(child.type === "image" ? "src" : "href") ?? "",
        );
        try {
          if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) {
            const url = new URL(href);
            if (
              !["https:", "http:", "mailto:"].includes(url.protocol) ||
              url.username ||
              url.password
            )
              throw new Error();
            continue;
          }
          const [pathname, fragment] = href.split("#");
          const target = pathname
            ? posix.normalize(
                posix.join(
                  posix.dirname(path),
                  decodeURIComponent(pathname.split("?")[0]),
                ),
              )
            : path;
          if (
            pathname.startsWith("/") ||
            target === ".." ||
            target.startsWith("../") ||
            !files.has(target)
          )
            throw new Error();
          if (
            fragment &&
            target.endsWith(".md") &&
            !anchors(files.get(target)!).has(decodeURIComponent(fragment))
          )
            throw new Error();
        } catch {
          errors.push(
            `${path}: invalid or missing link target (destination withheld)`,
          );
        }
      }
    }
  }
  return errors;
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const errors = checkDocuments(repositoryFiles(process.cwd()));
    errors.forEach((error) => console.error(error));
    if (errors.length) process.exitCode = 1;
    else
      console.log(
        "Markdown links/anchors and JSON syntax passed (external URLs not fetched).",
      );
  } catch {
    console.error(
      "Document inventory failed; inspect tracked file types and sizes.",
    );
    process.exitCode = 1;
  }
}
