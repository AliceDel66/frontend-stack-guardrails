---
name: frontend-stack
description: 用于 React 前端开发、页面与组件实现、前端技术选型和代码检查。统一 React、Vite、Tailwind CSS v4、shadcn/ui（Base UI + Nova）技术栈，优先复用成熟组件，限制重复依赖。独立使用，不依赖其他 Skill 或工作流。
---

# 前端技术栈与实现规范

## 使用方式

处理前端开发任务时，先阅读 [前端规范](references/frontend-rules.md)，再开展实现。规则、检查器与依赖清单均在本 Skill 目录内，不需要外部 Skill、全局配置或专用服务。

## 执行要求

1. **先了解项目**：读取项目说明、现有 AI 指令、`package.json`、`components.json` 及 ESLint 配置。明确任务的验收条件，只改需求所需部分。
2. **判断适用性**：本规范默认面向 React + Vite 的内部工具和数据看板。已有项目的明确约束优先；若已有技术栈与此冲突，说明冲突并由项目维护者决定，不擅自迁移框架、更换组件库或批量删除依赖。
3. **先复用后实现**：检查 shadcn/ui 和规范指定库是否已有能力。已有组件通过组合、`className` 或组件源码定制，不另造平行组件。
4. **遵守边界**：统一 Tailwind 与主题变量；HTTP 请求通过 `src/lib/api.ts` 中的 Axios 封装，接口缓存与重试交给 TanStack Query，客户端共享状态交给 Zustand；只使用白名单中的依赖。新增依赖或例外须经项目维护者确认并在清单中记录理由。
5. **检查按需接入**：`guard/check-deps.mjs` 和 `guard/fe-stack.json` 是依赖检查器；`guard/eslint-restricted.js` 是 ESLint flat config 片段。接入前检查项目已有配置，按包内 README 合并，不覆盖原配置。这些工具不会因 Skill 被加载而自动运行。
6. **验证后交付**：运行项目已配置的 lint、依赖检查、测试及构建；涉及界面时验证交互和相关布局。缺少命令先说明并按任务范围接入，不虚构通过结果。交付时列出实际检查结果、未验证项及已确认的例外。

## 资源与检查边界

- [完整规范](references/frontend-rules.md)
- [依赖清单](guard/fe-stack.json)
- [依赖检查器](guard/check-deps.mjs)
- [ESLint 导入规则](guard/eslint-restricted.js)

依赖检查器检查当前项目 `package.json` 的 dependencies 与 devDependencies，不检查传递依赖或版本兼容性。ESLint 片段仅约束 `src/**/*.ts`、`src/**/*.tsx` 中配置覆盖的导入；它不能自动保证所有架构、样式与复用要求。其余条款仍需代码审查与测试。
