## 前端技术栈规则（必须遵守）

优先复用成熟库、组件源码可控、统一设计语言、严格限制重复依赖。每类功能只用下表指定的一个库。

### 第一原则：不重复造轮子

**严禁在已有依赖可以正确表达的情况下自行设计实现组件和行为。**

- 写任何组件或交互前，先查：shadcn/ui 是否已有该组件（`pnpm dlx shadcn@latest view <名称>` 或看官方组件列表）、下表里的库是否已有该能力。
- 有就用：缺组件用 `pnpm dlx shadcn@latest add <组件>` 加进来，不要手写一个"差不多的"。
- 弹窗、下拉、浮层、提示、标签页、折叠、开关、日期选择、命令面板、抽屉、表格排序/筛选/分页、表单校验、拖拽排序、分栏拖动、进出场动画、请求缓存与重试——这些都有现成实现，禁止手写焦点管理、键盘交互、定位计算、拖拽事件、缓存逻辑。
- 需要定制时，改 `src/components/ui/` 下的 shadcn 源码或用组合/`className` 扩展，不要另起一个平行组件。
- 只有确认现有依赖**无法正确表达**时才允许自行实现，并在代码注释和交付说明里写明：查过哪些现有组件/库、为什么不满足。

### 底座

React 19 + TypeScript（strict）+ Vite + Tailwind CSS v4，包管理只用 pnpm，路由用 React Router。

### 样式：只用 Tailwind CSS

- 所有样式一律写 Tailwind 工具类（`className`），条件/合并类名用 `@/lib/utils` 的 `cn()`，组件变体用 `cva`（shadcn 已带）。
- 颜色、圆角、间距用 shadcn 主题变量对应的类（`bg-background`、`text-muted-foreground`、`border-border`、`rounded-lg` 等），不要写死十六进制颜色或任意值（`bg-[#3b82f6]`、`w-[437px]`），确有必要时说明理由。
- 禁止：新建 `.css` / `.scss` / `.module.css` 文件、CSS-in-JS、`style={{...}}` 内联样式（运行时计算的动态值除外，如拖拽位移、虚拟列表高度）。
- 唯一的全局 CSS 是 `src/index.css`：只放 `@import "tailwindcss"`、主题变量和 `@theme` 扩展；需要新的设计 token 加在这里，不要散落在组件里。
- 暗色模式用 `dark:` 变体和主题变量，不要另写一套样式。

### 功能 → 唯一的库

| 类别 | 只用这个 | 规则 |
|---|---|---|
| UI 组件 | shadcn/ui（base: Base UI，preset: Nova） | 按钮、弹窗、表单控件、菜单等一律用 shadcn 组件 |
| 图标 | lucide-react | 界面里所有图标；不要内联 SVG 图标 |
| 动画 | motion | `import { motion, AnimatePresence } from "motion/react"`；简单 hover/过渡用 Tailwind |
| 可拖动分栏 | react-resizable-panels | 只通过 `@/components/ui/resizable` 使用 |
| 拖拽排序、看板 | @dnd-kit/core + @dnd-kit/sortable | |
| 客户端共享状态 | zustand | 只放 UI 状态、筛选条件、偏好；store 放 `src/stores/` |
| 服务端数据 | @tanstack/react-query | 接口数据一律走 query/mutation，**不要放进 zustand 或 useState 手动管理** |
| 表格 | @tanstack/react-table | 按 shadcn Data Table 的写法 |
| 表单与校验 | react-hook-form + zod | 用 shadcn 的 field/form 组件 |
| 图表 | recharts | 通过 shadcn `chart` 的 `ChartContainer`，颜色用 `--chart-*` 变量 |
| 消息提示 | sonner | |
| 日期处理 | date-fns | |
| 请求 | Axios，经 `src/lib/api.ts` 统一封装 | 业务接口只调用封装，不直接使用 axios 或 fetch |
| 测试 | vitest + @testing-library/react；E2E 用 Playwright | |

### 请求层与状态职责

- `src/lib/api.ts` 是 Axios 的统一入口，集中配置实例、baseURL、超时、认证信息和错误归一化。业务接口函数调用该封装，组件通过业务 Query/Mutation hooks 获取服务端数据，不到处直接调用 axios 或 fetch。
- 将 TanStack Query 的 AbortSignal 传给 Axios；不要吞掉错误或把失败包装成成功响应。空响应、文件下载等按接口约定处理，不无条件假定响应都是 JSON 或某个业务 envelope。
- 通用失败重试由 TanStack Query 管理，不在 Axios 拦截器中再叠加一套重试。写操作是否可重试按接口幂等性判断。仅在项目确有刷新令牌协议时实现 401 刷新，并处理并发去重与重放上限，不预先加入无需求的认证框架。
- **服务端数据**（用户资料、订单、权限等接口结果）由 TanStack Query 管理，不再复制一份到 Zustand。
- **跨组件/页面的纯客户端状态**（共享筛选条件、偏好、UI 开关）使用 Zustand，按领域拆分 store；不建一个包揽所有数据的全局 store，不引入 Redux 等并行状态库。
- **组件局部状态**使用 `useState`/`useReducer`，**表单状态**使用 React Hook Form；可由现有数据计算的值直接派生，不重复存储。需要分享链接或浏览器前进后退恢复的筛选优先放 URL，避免与 store 保留两个独立真值源。
- 不默认持久化整个 store；确需持久化时只选择必要的非敏感字段，不把密码或访问令牌放进 localStorage 持久化 store。

### 禁止

- 依赖以本 Skill 的 `guard/fe-stack.json` 为准（其中包含必要的工具与组件配套依赖）。确实需要新增时，先说明理由，待项目维护者确认后修改该清单，再安装。
- 明确禁用：antd、MUI、Chakra、Mantine、Headless UI、react-icons、heroicons、hugeicons、framer-motion（旧包名）、react-spring、gsap、redux、jotai、recoil、mobx、swr、formik、yup、react-beautiful-dnd、react-dnd、styled-components、emotion、sass、lodash、moment、dayjs、classnames、chart.js、echarts。
- 不要改 `components.json` 的 style / iconLibrary。

### 交付前自检

`pnpm lint && pnpm check:deps && pnpm test` 必须通过。
