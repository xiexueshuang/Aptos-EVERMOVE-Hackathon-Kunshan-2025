# AI巨头投资模拟器 (AI Giants Investment Simulator)

## 项目简介

这是一个基于Aptos Move开发的AI公司投资模拟器，模拟现实中美国AI巨头（NVIDIA、OpenAI、Meta）之间的相互投资、并购和持股动态。

通过智能合约实现了一个完整的AI企业投融资生态系统，包括：
- AI公司注册与股票增发
- 投资并购谈判系统
- 投资组合管理
- 所有权记录追踪

## 核心功能

### 1. AI公司注册
AI公司可以在平台上注册，发行股票并设定股价
```move
register_company(account, name, stock_price, total_shares)
```

### 2. 投资并购谈判
实现公司间的投资谈判流程
```move
initiate_negotiation(investor, company_name, target_company_addr, shares)
respond_negotiation(responder, negotiation_id, accept)
```

### 3. 直接投资
绕过谈判直接进行投资
```move
make_direct_investment(investor, target_company_addr, shares)
```

### 4. 投资组合管理
- 追踪个人投资记录
- 计算持股总数和投资价值
- 管理谈判记录

## 合约架构

### 核心数据结构

#### AICompany (AI公司)
- `name`: 公司名称
- `address`: 公司地址
- `stock_price`: 每股价格（最小APT单位）
- `total_shares`: 总发行股数
- `available_shares`: 可投资股数

#### Investment (投资记录)
- `investor`: 投资者地址
- `company_name`: 公司名称
- `shares`: 持股数量
- `total_value`: 总投资价值
- `timestamp`: 投资时间

#### Negotiation (谈判记录)
- `id`: 谈判ID
- `investor`: 投资方
- `company_name`: 投资公司名称
- `target_company_name`: 目标公司名称
- `shares`: 拟投资股数
- `agree`: 是否达成协议
- `completed`: 是否完成
- `price_per_share`: 每股价格
- `timestamp`: 创建时间

#### Portfolio (投资组合)
- `assets`: 投资记录列表
- `negotiations`: 谈判ID列表

## 使用场景

### 场景 1: NVIDIA 投资 OpenAI
1. NVIDIA 向 OpenAI 发起投资谈判
2. OpenAI 审核并接受谈判条款
3. 股份转移，投资完成

### 场景 2: Meta 收购 AI 初创公司
1. Meta 注册为AI公司
2. 直接购买目标公司股份
3. 更新投资组合记录

## 视图函数 (View Functions)

- `get_company_name(company_addr)`: 获取公司名称
- `get_company_stock_price(company_addr)`: 查看公司股价
- `get_company_available_shares(company_addr)`: 查看可投资股数
- `get_portfolio_size(account)`: 查看投资组合大小
- `get_investor_total_shares(investor, company_name)`: 查询特定公司总持股
- `get_investor_total_value(investor)`: 查询总投资价值

## 部署方式

### 使用 Aptos CLI

1. 编译合约
```bash
aptos move compile --package-dir .
```

2. 发布合约
```bash
aptos move publish --package-dir . --profile default
```

3. 测试合约
```bash
aptos move test --package-dir .
```

### 测试网部署要求
- Aptos 测试币（可通过测试网水龙头获取或社群申请）
- Aptos CLI 工具
- 测试网账户

## 演示示例

### 1. 注册AI公司
```bash
# NVIDIA 注册
aptos move run --function-id <account>::ai_investment::register_company \
  --args string:"NVIDIA" u64:1000 u64:1000000

# OpenAI 注册
aptos move run --function-id <account>::ai_investment::register_company \
  --args string:"OpenAI" u64:5000 u64:500000

# Meta 注册
aptos move run --function-id <account>::ai_investment::register_company \
  --args string:"Meta" u64:2000 u64:800000
```

### 2. 直接投资
```bash
# NVIDIA 投资 OpenAI
aptos move run --function-id <account>::ai_investment::make_direct_investment \
  --args address:<openai_addr> u64:10000
```

### 3. 投资谈判
```bash
# 发起谈判
aptos move run --function-id <account>::ai_investment::initiate_negotiation \
  --args string:"NVIDIA" address:<openai_addr> u64:5000

# 回应谈判
aptos move run --function-id <account>::ai_investment::respond_negotiation \
  --args u64:1 bool:true
```

## 技术特点

### 安全特性
- 权限验证：确保只有授权账户可以执行特定操作
- 资产管理：严密追踪股份转移和所有权
- 防止重复投资：谈判完成后自动标记状态

### 扩展性
- 模块化设计：可轻松添加新功能
- 接口清晰：便于前端或其他合约调用
- 数据透明：所有交易记录链上可查

## 开发团队

AI Investment Team - Aptos EVERMOVE Hackathon 2025

## 相关链接

- GitHub 仓库: [https://github.com/your-username/ai-investment](https://github.com/your-username/ai-investment)
- Aptos 文档: [https://aptos.dev](https://aptos.dev)
- Demo 演示: (待补充)

## 演示资料

### Demo 视频
- 合约部署过程演示
- 功能测试与交互演示
- 投资流程完整走通

### 截图
- Aptos Explorer 交易记录
- 合约调用示例
- 投资组合查询结果

## 未来扩展

1. **经济模型优化**
   - 股价自动调节机制
   - 投资收益计算
   - 股息分红系统

2. **治理功能**
   - 股东投票系统
   - 公司治理提案
   - 董事会选举

3. **高级功能**
   - 市场竞价系统
   - 期权交易
   - 跨链投资支持

4. **前端界面**
   - 实时投资面板
   - 谈判管理界面
   - 可视化投资组合

---

**状态**: ✅ 已完成核心合约开发

**部署网络**: Aptos Testnet

**技术栈**: Move, Aptos Framework, Aptos CLI
