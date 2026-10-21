import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { repositoryFiles } from "./files.ts";

const patterns: [string, RegExp][] = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  [
    "github-token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  ],
  ["service-account-token", /\bops_[A-Za-z0-9_-]{30,}\b/],
  ["aws-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["bearer-token", /\bBearer\s+[A-Za-z0-9._~-]{24,}/i],
];
export function checkSecrets(files: Map<string, string>): string[] {
  const errors: string[] = [];
  for (const [path, content] of files) {
    if (
      (/(^|\/)\.env(?:\.|$)/.test(path) && !path.endsWith(".example")) ||
      /(?:\.pem|\.key|\.tfstate(?:\..*)?)$/.test(path)
    )
      errors.push(`${path}: prohibited secret/state file`);
    for (const [index, line] of content.split("\n").entries()) {
      for (const [rule, pattern] of patterns)
        if (pattern.test(line))
          errors.push(`${path}:${index + 1}: ${rule} (value withheld)`);
      const assignments = line.matchAll(
        /\b(?:[A-Z_]*(?:TOKEN|PASSWORD|SECRET|API_KEY))["']?\s*[=:]\s*["']([^"']{8,})["']/gi,
      );
      for (const assignment of assignments) {
        if (!/^(?:op:\/\/|<|\$\{|YOUR_|REPLACE_|EXAMPLE_)/i.test(assignment[1]))
          errors.push(
            `${path}:${index + 1}: literal-secret-assignment (value withheld)`,
          );
      }
    }
  }
  return errors;
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const errors = checkSecrets(repositoryFiles(process.cwd()));
    errors.forEach((error) => console.error(error));
    if (errors.length) process.exitCode = 1;
    else
      console.log(
        "Working-tree credential-pattern and sensitive-file checks passed; history and live systems not scanned.",
      );
  } catch {
    console.error(
      "Secret inventory failed; inspect tracked file types and sizes.",
    );
    process.exitCode = 1;
  }
}
