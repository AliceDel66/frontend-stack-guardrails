// 依赖白名单检查：package.json 里的依赖必须登记在 fe-stack.json，黑名单直接报替代方案。
// 用法：node scripts/check-deps.mjs   （fe-stack.json 与本脚本放在同一目录）
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const stack = JSON.parse(readFileSync(join(here, "fe-stack.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));

const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
const matches = (name, key) => (key.endsWith("/") ? name.startsWith(key) : name === key);

const denied = [];
const unknown = [];
for (const name of deps) {
  const denyKey = Object.keys(stack.deny).find((k) => matches(name, k));
  if (denyKey) {
    denied.push(`  ${name}  →  改用 ${stack.deny[denyKey]}`);
  } else if (!(name in stack.allow) && !stack.prefixes.some((p) => name.startsWith(p))) {
    unknown.push(`  ${name}`);
  }
}

if (denied.length) console.error(`禁用依赖：\n${denied.join("\n")}`);
if (unknown.length) console.error(`未登记依赖（先在 fe-stack.json 的 allow 里登记并写理由）：\n${unknown.join("\n")}`);
if (denied.length || unknown.length) process.exit(1);
console.log(`check-deps: ${deps.length} 个依赖全部在白名单内`);
