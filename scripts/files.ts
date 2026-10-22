import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Verification intentionally omits .git. Walk the disposable copy rather than
// depending on Git metadata or coordinator permissions.
export function repositoryFiles(root: string): Map<string, string> {
  const result = new Map<string, string>();
  function walk(directory: string, prefix: string): void {
    for (const name of readdirSync(directory)) {
      if ([".git", "node_modules", "coverage"].includes(name)) continue;
      const path = prefix ? `${prefix}/${name}` : name;
      const absolute = join(directory, name);
      const stat = lstatSync(absolute);
      if (stat.isDirectory()) {
        walk(absolute, path);
        continue;
      }
      if (!stat.isFile() || stat.size > 1024 * 1024)
        throw new Error(`Unsupported file type or size: ${path}`);
      // Detect sensitive files by name without opening their contents.
      if (
        (/(^|\/)\.env(?:\.|$)/.test(path) && !path.endsWith(".example")) ||
        /(?:\.pem|\.key|\.tfstate(?:\..*)?)$/.test(path)
      ) {
        result.set(path, "");
        continue;
      }
      const content = readFileSync(absolute);
      if (content.includes(0))
        throw new Error(`Binary file requires explicit review: ${path}`);
      result.set(path, content.toString("utf8"));
    }
  }
  walk(root, "");
  return result;
}
