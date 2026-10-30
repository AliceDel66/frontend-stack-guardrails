// 并进项目 eslint.config.js：
//   import { restrictedImports, uiOnlyImports, apiOnlyImports } from "./.claude/skills/frontend-stack/guard/eslint-restricted.js";
//   export default defineConfig([..., restrictedImports, uiOnlyImports, apiOnlyImports]);
// 作用：AI 忘了 frontend-rules.md 时，lint 直接报错并给出替代方案。

const banned = [
  ["framer-motion", "用 motion：import { motion } from \"motion/react\""],
  ["react-icons", "用 lucide-react"],
  ["lodash", "用原生 JS"],
  ["lodash-es", "用原生 JS"],
  ["moment", "用 date-fns"],
  ["dayjs", "用 date-fns"],
  ["classnames", "用 @/lib/utils 的 cn()"],
  ["swr", "用 @tanstack/react-query"],
  ["formik", "用 react-hook-form"],
  ["yup", "用 zod"],
  ["react-beautiful-dnd", "用 @dnd-kit"],
  ["antd", "用 shadcn/ui"],
];

// paths 只匹配完整包名，子路径（如 react-icons/fa、lodash/debounce）要靠 pattern 拦
const bannedPatterns = [
  ...banned.map(([name, message]) => [`${name}/*`, message]),
  ["@mui/*", "用 shadcn/ui"],
  ["@heroicons/*", "用 lucide-react"],
  ["@hugeicons/*", "用 lucide-react"],
  ["@emotion/*", "用 Tailwind"],
];

export const restrictedImports = {
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: banned.map(([name, message]) => ({ name, message })),
        patterns: bannedPatterns.map(([group, message]) => ({ group: [group], message })),
      },
    ],
  },
};

// 独立使用语法规则，避免覆盖 UI 导入限制。
export const apiOnlyImports = {
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/lib/api.ts"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: ':matches(ImportDeclaration, ExportNamedDeclaration, ExportAllDeclaration)[source.value=/^axios(\\/|$)/]',
        message: "Axios 只允许在 src/lib/api.ts 中导入；业务代码使用统一封装。类型也通过封装层导出。",
      },
    ],
  },
};

export const uiOnlyImports = {
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/components/ui/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          ...banned.map(([name, message]) => ({ name, message })),
          { name: "react-resizable-panels", message: "用 @/components/ui/resizable" },
          { name: "sonner", importNames: ["Toaster"], message: "用 @/components/ui/sonner 的 Toaster" },
        ],
        patterns: [
          ...bannedPatterns.map(([group, message]) => ({ group: [group], message })),
          { group: ["@base-ui/*"], message: "用 @/components/ui 下的 shadcn 组件，缺就 shadcn add" },
        ],
      },
    ],
  },
};
