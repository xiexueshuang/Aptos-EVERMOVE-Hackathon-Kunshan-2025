# AI投资模拟器 - 前端应用

基于 React + TypeScript + Vite 开发的AI巨头投资模拟器前端界面。

## 功能特性

### 🏢 公司管理
- 查看所有AI公司信息
- 注册新的AI公司
- 实时显示市值、股价、流通股份

### 💰 投资管理
- 创建直接投资
- 查看投资记录
- 实时计算投资价值和股份

### 🤝 投资谈判
- 发起投资谈判
- 接受/拒绝谈判提案
- 谈判历史追踪

### 📊 数据分析
- 市值分布饼图
- 投资时间线
- 投资组合可视化
- 实时数据更新

### 📝 交易日志
- 记录所有操作
- 类型过滤（全部/成功/错误/信息）
- 时间倒序显示

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **Recharts** - 数据可视化
- **Lucide React** - 图标库
- **CSS Variables** - 主题管理

## 快速开始

### 安装依赖

```bash
cd ID-Name/frontend
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 运行

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
frontend/
├── public/                     # 静态资源
├── src/
│   ├── components/            # React组件
│   │   ├── AnalyticsPanel.tsx # 数据分析面板
│   │   ├── CompanyManager.tsx # 公司管理面板
│   │   ├── InvestmentDashboard.tsx # 投资面板
│   │   ├── NegotiationPanel.tsx # 谈判面板
│   │   └── TransactionLog.tsx # 交易日志
│   ├── App.tsx                # 主应用组件
│   ├── store.ts               # Zustand状态管理
│   ├── types.ts               # TypeScript类型定义
│   └── index.css              # 全局样式
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 使用示例

### 场景1: NVIDIA 投资 OpenAI

1. 切换到"投资管理"标签
2. 点击"创建新投资"
3. 选择投资者: NVIDIA
4. 选择目标公司: OpenAI
5. 输入股份数量
6. 确认投资

### 场景2: 发起投资谈判

1. 切换到"投资谈判"标签
2. 点击"发起新谈判"
3. 选择投资者和目标公司
4. 输入拟投资股份
5. 确认发起谈判
6. 在谈判列表中接受或拒绝

### 场景3: 查看投资分析

1. 切换到"数据分析"标签
2. 查看市值分布饼图
3. 查看投资时间线
4. 分析投资组合

## 核心功能实现

### 状态管理 (Zustand)

```typescript
const useStore = create<AISimulationStore>((set, get) => ({
  companies: [], // AI公司列表
  investments: [], // 投资记录
  negotiations: [], // 谈判记录
  transactionLogs: [], // 交易日志

  // 公司管理
  registerCompany: (company) => { /* ... */ },

  // 投资管理
  makeDirectInvestment: (investor, targetCompanyId, shares) => { /* ... */ },

  // 谈判管理
  initiateNegotiation: (investor, companyName, targetCompanyId, shares) => { /* ... */ },
  respondToNegotiation: (negotiationId, accept) => { /* ... */ },

  // 数据分析
  getMarketCapData: () => { /* ... */ },
  getInvestmentTimeline: () => { /* ... */ },
  getCompanyHoldings: (investor) => { /* ... */ },

  // 日志记录
  logTransaction: (log) => { /* ... */ }
}));
```

### 组件结构

每个面板组件都使用 `useStore()` hook 访问全局状态，实现：
- 数据读取和展示
- 用户交互处理
- 状态更新
- 实时渲染

## 可视化图表

### 市值分布饼图
显示各AI公司的市值占比，颜色区分不同公司

### 投资时间线
展示投资价值随时间的累积变化

### 投资组合柱状图
显示NVIDIA等公司的详细投资组合分布

## 样式设计

### 主题颜色
- **主背景**: `#0f172a`
- **次要背景**: `#1e293b`
- **边框**: `#475569`
- **主文本**: `#f1f5f9`
- **次要文本**: `#cbd5e1`
- **强调色**: `#60a5fa` (蓝色), `#34d399` (绿色), `#a78bfa` (紫色)

### 响应式布局
- 桌面端：网格布局，2列面板
- 移动端：单列布局，自适应字体大小

## 模拟真实链上操作

前端实现了完整的业务逻辑模拟：

1. **注册公司** - 模拟链上部署智能合约
2. **直接投资** - 模拟调用智能合约投资函数
3. **发起谈判** - 模拟创建谈判交易
4. **响应谈判** - 模拟执行谈判结果
5. **日志记录** - 模拟链上交易哈希和状态

所有操作都记录在交易日志中，模拟真实的区块链交易流程。

## API 集成（预留）

代码中预留了与 Aptos 智能合约集成的接口：

```typescript
// 在 store.ts 中
interface NetworkConfig {
  network: 'devnet' | 'testnet' | 'mainnet';
  nodeUrl: string;
  accountKey: string;
}

// 可以与 Aptos TS SDK 集成
import { AptosClient } from 'aptos';
```

未来可以扩展为真正的链上交互应用。

## 演示功能

### 预加载数据
前端预加载了3家AI公司：
- NVIDIA (NVDA) - 股价 $1000
- OpenAI (OPENAI) - 股价 $5000
- Meta (META) - 股价 $2000

### 交互示例
用户可以通过界面进行完整的业务操作，并实时看到数据更新和图表变化。

## 部署建议

### 静态部署
```bash
npm run build
# 将 dist 目录部署到任何静态托管服务
```

### 与后端集成
如需连接真实的Aptos智能合约，需要：
1. 配置 `NetworkConfig`
2. 使用 `@aptos-labs/ts-sdk` 发送交易
3. 监听链上事件
4. 更新合约地址

## 依赖说明

- **zustand**: 轻量级状态管理，不需要Provider
- **recharts**: 基于React的数据可视化库
- **lucide-react**: 简洁美观的图标库
- **clsx**: 条件CSS类名组合工具

所有依赖均为轻量级，确保快速加载和运行。

## 开发提示

1. 使用 TypeScript 严格模式，确保类型安全
2. 组件无状态化，所有状态通过Zustand管理
3. 响应式设计，支持移动端访问
4. 使用CSS变量统一管理主题色
5. 预留合约集成接口，便于扩展

---

**版本**: 1.0.0

**作者**: AI Investment Team

**许可证**: MIT
