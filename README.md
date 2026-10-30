# Frontend Stack Guardrails

**让 AI 写前端时，少换一套库，多复用一个组件。**

Opinionated frontend standards and AI coding skills for React, TypeScript, Tailwind CSS, and shadcn/ui—with dependency and ESLint guardrails.

[快速开始](#快速开始) · [技术栈](#默认技术栈) · [依赖检查](#依赖检查) · [ESLint 接入](#eslint-接入) · [贡献](#贡献) · [MIT License](LICENSE)

## 为什么做这个项目

AI 能很快写出页面，却容易在同一个项目里不断换选型：这个弹窗手写，下一个用另一套组件库；接口缓存自己维护，状态和样式各有一套。

这个项目把一套明确的前端工程偏好变成三种可复用资产：

| 层次 | 内容 | 作用 |
|---|---|---|
| AI 指令 | 独立 `frontend-stack` Skill | 在实现前明确组件复用和技术边界 |
| 开发规范 | 技术栈、样式、数据状态与交付约束 | 让团队和 AI 使用同一套规则 |
| 自动检查 | 依赖清单检查器、ESLint 导入规则 | 对部分可机器判断的约束提供失败信号 |

**这不是前端脚手架、组件库，也不是自动修复器。** 它不包含业务页面、node_modules 或模型服务，不依赖个人工作流、专用服务器或全局 hook。加载 Skill 不会自动安装依赖或执行检查。

## 适合什么项目

- React + Vite 的后台、内部工具和数据看板。
- 想统一 AI 编码选型、减少重复依赖的团队。
- 已有技术栈基本匹配，希望渐进接入规则的项目。

这是一套有明确偏好的默认方案，不是所有前端项目的最佳答案。Vue、移动端、SSR/SEO 项目应先评估，不要为采用本规范而强行迁移。已有项目的明确约束优先，冲突与例外由维护者确认。

## 快速开始

### 1. 获取文件

克隆仓库：

```bash
git clone https://github.com/AliceDel66/frontend-stack-guardrails.git
```

也可以在 GitHub 点击 **Code → Download ZIP**，解压后打开仓库目录。GitHub 自动生成的 ZIP 会多一层仓库文件夹；真正需要的是里面的 `.claude/skills/frontend-stack/`。

### 2. 放入你的项目

把该文件夹复制到目标项目，形成以下结构：

```text
your-project/
├── package.json
└── .claude/
    └── skills/
        └── frontend-stack/
            ├── SKILL.md
            ├── references/frontend-rules.md
            └── guard/
                ├── fe-stack.json
                ├── check-deps.mjs
                └── eslint-restricted.js
```

**不要覆盖项目已有的 README、CLAUDE.md、package.json 或同名 Skill。** 已有同名文件时，先比较再合并；文件管理器隐藏点目录时，请开启隐藏文件显示。

### 3. 让 AI 使用规范

在支持项目 Skill 的 Claude Code 中打开项目；已启动的会话可能需要重新打开以发现 Skill：

```text
/frontend-stack 实现一个订单管理页面，先说明组件复用方案和状态划分。
```

其他能读取项目文件的 AI 编码工具，也可以直接使用：

```text
先阅读 .claude/skills/frontend-stack/SKILL.md 及其引用的前端规范，
再完成本次前端任务。先核对现有项目约束，存在冲突时不要擅自迁移。
```

不同工具的自动发现机制不同，本仓库只预置 `.claude/skills` 布局，不保证其他工具自动加载。需要长期生效时，将阅读规范的要求追加到项目原有 AI 指令中。

### 使用场景示例

```text
审查这份 package.json 和页面代码：指出重复依赖、错误的状态归属，
以及可以用 shadcn/ui 替代的手写交互。只给最小必要修改。
```

```text
为用户管理页面设计表格、筛选和编辑表单。
接口数据使用 TanStack Query，表单使用 React Hook Form + Zod。
不要添加白名单之外的依赖；缺少关键信息时先问我。
```

## 默认技术栈

| 能力 | 选择 |
|---|---|
| 框架与构建 | React 19、TypeScript strict、Vite |
| 包管理与路由 | pnpm、React Router |
| UI 组件 | shadcn/ui：Base UI + Nova |
| 样式与图标 | Tailwind CSS v4、lucide-react |
| 动画 | motion，从 `motion/react` 导入 |
| 分栏与拖拽 | react-resizable-panels、dnd-kit |
| 客户端共享状态 | Zustand |
| 服务端数据 | TanStack Query |
| 表格 | TanStack Table |
| 表单与校验 | React Hook Form、Zod |
| 图表与提示 | Recharts、Sonner |
| 日期与请求 | date-fns、原生 fetch |
| 测试 | Vitest、Testing Library、Playwright |

完整要求见 [前端规范](.claude/skills/frontend-stack/references/frontend-rules.md)，依赖策略见 [fe-stack.json](.claude/skills/frontend-stack/guard/fe-stack.json)。

核心原则：

- **先复用，不重复造轮子。** 组件通过组合、className 或源码定制，避免平行实现。
- **服务端数据与 UI 状态分开。** 接口缓存交给 TanStack Query，Zustand 管理客户端共享状态。
- **样式走 Tailwind 与主题变量。** 不混入第二套样式系统。
- **新增依赖是显式决定。** 先确认需求和理由，再更新清单。

本项目不锁定全部依赖版本，也不提供应用 lockfile。请按所选 Vite/shadcn 版本要求准备 Node.js、pnpm，并维护项目自己的锁文件。不要将 Base UI + Nova 与其他 shadcn 基础组件或 preset 混用。

## 依赖检查

检查器仅依赖 Node.js 内置模块。在**目标项目根目录**执行：

```bash
node .claude/skills/frontend-stack/guard/check-deps.mjs
```

它读取当前目录的 `package.json`，检查 `dependencies` 与 `devDependencies`：

| 输入 | 结果 |
|---|---|
| 已登记依赖 | 退出码 0 |
| 禁用依赖，例如 axios | 退出码 1，提示替代方案 |
| 未登记依赖 | 退出码 1，要求登记理由 |

本仓库本身没有应用 `package.json`，不要在规范仓库根目录直接执行该检查器。

把下面的键合并到目标项目的 `package.json` → `scripts`，保留原有脚本：

```json
{
  "check:deps": "node .claude/skills/frontend-stack/guard/check-deps.mjs"
}
```

### 增加依赖或批准例外

1. 先确认现有组件或依赖确实不能满足需求。
2. 获得项目维护者确认。
3. 在 `guard/fe-stack.json` 的 `allow` 中登记包名和理由。
4. 如该包被 `deny` 禁止，还必须调整对应禁用规则；禁用列表优先于白名单。
5. 若 ESLint 也拦截该包，同步调整对应导入规则。

两个检查层的配置并非自动同步。不要为了让检查通过而放开整个包族或删除业务仍需要的依赖。

## ESLint 接入

使用项目已有的 ESLint flat config、TypeScript 解析器及 React 配置。本包只提供导入限制片段，不安装或替换完整 lint 工具链。

### 1. 确认模块格式

`eslint-restricted.js` 使用 ES Module。项目有 `"type": "module"` 时可直接导入；否则把该文件改名为 `eslint-restricted.mjs` 并调整导入路径，不要为了这个片段改变整个应用的模块类型。

### 2. 合并配置

在现有 ESLint 配置文件顶部添加：

```js
import {
  restrictedImports,
  uiOnlyImports,
} from "./.claude/skills/frontend-stack/guard/eslint-restricted.js";
```

在原配置数组末尾，按顺序追加两个配置。例如原文件导出一个数组，可改为以下形式；`existingConfigs` 代表你的原有配置，不是另一个依赖：

```js
export default [...existingConfigs, restrictedImports, uiOnlyImports];
```

使用 `defineConfig([...])` 的项目同样追加到数组末尾。若原有配置包含 `no-restricted-imports`，需要手动合并其额外限制，否则后面的配置会覆盖该规则。

### 3. 检查覆盖范围

- 对 `src/**/*.ts` 和 `src/**/*.tsx` 生效。
- 禁止配置中列出的库和子路径导入。
- 业务代码不能直接导入 Base UI、分栏底层库或 Sonner 的 `Toaster`。
- `src/components/ui/**` 可以使用上述底层库，但仍不能导入禁用库。
- 业务代码可以直接调用 Sonner 的 `toast`。

目录结构不同时，调整 `files` 和 `ignores`。ESLint 的禁用清单是依赖策略的部分覆盖，不代表全部规范都能自动检查。

## 检查能力边界

| 能检查 | 不能保证 |
|---|---|
| package.json 中直接依赖是否登记或禁用 | 传递依赖安全、版本兼容性、运行正确性 |
| 指定文件范围内的静态导入限制 | 所有动态加载方式、整个代码库的架构 |
| 部分底层组件导入是否越过封装 | 没有重复造轮子、没有视觉或无障碍问题 |

Skill 是给 AI 的指导，不是安全隔离措施。人工审查、测试和实际界面验证仍然必要。

## 项目交付检查

在目标项目完成脚本接入后，使用项目实际的检查命令：

```bash
pnpm lint
```

```bash
pnpm check:deps
```

```bash
pnpm test
```

```bash
pnpm build
```

测试默认 watch 模式时改用项目配置的一次运行方式。界面改动还需验证交互、状态和相关布局。未运行的检查必须说明，不能把静态审查称为测试通过。

## 常见问题

**必须使用 AI 才有价值吗？** 不需要。规范可以人工执行，依赖检查和 ESLint 片段也可以独立接入。

**复制 Skill 后检查会自动生效吗？** 不会。需要将检查脚本接入项目命令或 CI，并合并 ESLint 配置。

**已有项目第一次检查失败怎么办？** 逐项评估迁移成本和必要例外，不要批量删依赖或强制迁移。

**为什么不直接用最新版所有库？** 本项目约束的是职责分工和选型，不负责保证任意版本组合兼容。版本由实际项目管理。

## 贡献

欢迎通过 [Issues](https://github.com/AliceDel66/frontend-stack-guardrails/issues) 讨论规则缺口和具体使用场景，通过 Pull Request 改进文档或检查工具。

- 新规则请说明解决的问题、影响范围及可能的误报。
- 变更检查器时，验证允许依赖通过、禁用依赖失败、未登记依赖失败。
- 变更 ESLint 规则时，验证业务代码限制、UI 目录例外和子路径导入。
- 保持文档、Skill 和机器规则的边界说明一致；不引入个人路径、凭据或专属工作流。

## License

本仓库的规范、Skill 和检查脚本采用 [MIT License](LICENSE)。提及的 React、shadcn/ui 等第三方项目并未随仓库分发，其名称、商标与许可归各自权利人所有。本项目不代表这些项目的官方意见。
