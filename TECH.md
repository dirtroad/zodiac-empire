# 星座帝国 - 技术选型建议

> 技术架构与选型方案 v1.0

---

## 一、整体架构

```
┌─────────────────────────────────────────────────────┐
│                  微信小游戏客户端                     │
│              Cocos Creator 3.x + TypeScript         │
└─────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────┐
│                    负载均衡                          │
│                   Nginx / SLB                       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                    API 网关                          │
│              Kong / APISIX / 自研                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌──────────────┬──────────────┬──────────────┐
│   用户服务    │   游戏服务    │   经济服务    │
│  (Node.js)   │  (Node.js)   │  (Node.js)   │
└──────────────┴──────────────┴──────────────┘
                         ↓
┌──────────────┬──────────────┬──────────────┐
│    MySQL     │    Redis     │   MongoDB    │
│   主从复制    │   集群模式    │   副本集      │
└──────────────┴──────────────┴──────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                    对象存储                          │
│              阿里云OSS / 腾讯云COS                   │
└─────────────────────────────────────────────────────┘
```

---

## 二、技术选型

### 2.1 前端技术栈

| 技术 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| **Cocos Creator** | 3.8.x | 游戏引擎 | 微信小游戏官方推荐，生态成熟 |
| **TypeScript** | 5.x | 开发语言 | 类型安全，开发效率高 |
| **状态管理** | - | 数据管理 | 可选 Cocos 自带或 MobX |
| **网络库** | - | HTTP/WebSocket | 封装 axios + socket.io-client |

**为什么不选其他引擎？**
- Phaser：国内生态弱，小游戏适配差
- Laya：文档和社区不如 Cocos
- 白鹭：已停止维护
- Unity：小游戏包体过大

### 2.2 后端技术栈

#### 方案A：Node.js（推荐）

| 技术 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| **Node.js** | 20.x LTS | 运行时 | 前端友好，全栈可复用技能 |
| **NestJS** | 10.x | 框架 | 企业级，模块化，TypeScript原生 |
| **TypeORM** | 0.3.x | ORM | TypeScript友好，支持多种数据库 |
| **Socket.io** | 4.x | 实时通信 | WebSocket封装，兼容性好 |
| **Bull** | 4.x | 任务队列 | Redis-based，任务调度 |

#### 方案B：Go（高性能备选）

| 技术 | 版本 | 用途 | 选择理由 |
|-----|------|------|---------|
| **Go** | 1.21+ | 运行时 | 高并发，性能强 |
| **Gin** | 1.9+ | 框架 | 轻量高性能 |
| **GORM** | 1.25+ | ORM | Go最流行ORM |
| **gorilla/websocket** | 1.5+ | 实时通信 | 标准库级别 |

**选择建议：**
- 团队熟悉JavaScript → **Node.js**
- 追求极致性能 → **Go**
- 本项目推荐 → **Node.js**（开发效率优先）

### 2.3 数据库选型

| 数据库 | 版本 | 用途 | 选择理由 |
|-------|------|------|---------|
| **MySQL** | 8.0+ | 核心业务数据 | 成熟稳定，事务支持好 |
| **Redis** | 7.0+ | 缓存/排行榜/实时数据 | 高性能，丰富数据结构 |
| **MongoDB** | 7.0+ | 日志/战报/聊天记录 | 文档型，灵活查询 |

**MySQL分库分表：**
- 用户库：用户相关
- 游戏库：星系、装备、战斗
- 经济库：交易、市场、时间银行
- 社交库：好友、联盟、航道

### 2.4 云服务选型

#### 方案A：微信云开发（推荐新手）

| 服务 | 用途 |
|-----|------|
| 云函数 | 后端逻辑 |
| 云数据库 | 数据存储 |
| 云存储 | 静态资源 |
| 云调用 | 微信能力 |

**优点：**
- 一站式，无需运维
- 微信能力调用方便
- 成本低

**缺点：**
- 扩展性受限
- 复杂业务不灵活

#### 方案B：阿里云/腾讯云（推荐正式项目）

| 服务 | 用途 | 规格 |
|-----|------|------|
| ECS/轻量服务器 | 应用服务器 | 2核4G起步 |
| RDS MySQL | 数据库 | 2核4G起步 |
| Redis | 缓存 | 1G起步 |
| OSS/COS | 对象存储 | 按量付费 |
| SLB/CLB | 负载均衡 | 按需 |
| CDN | 静态加速 | 按量付费 |

**预估成本：**
- 开发环境：500-1000元/月
- 生产环境：2000-5000元/月

---

## 三、项目结构

### 3.1 前端项目结构

```
zodiac-empire-client/
├── assets/                 # 静态资源
│   ├── textures/          # 图片资源
│   ├── audio/             # 音频资源
│   ├── fonts/             # 字体资源
│   └── animations/        # 动画资源
├── scripts/               # 脚本
│   ├── core/              # 核心模块
│   │   ├── GameManager.ts # 游戏管理器
│   │   ├── NetworkManager.ts # 网络管理
│   │   ├── AudioManager.ts # 音频管理
│   │   └── StorageManager.ts # 存储管理
│   ├── ui/                # UI模块
│   │   ├── main/          # 主界面
│   │   ├── galaxy/        # 星系界面
│   │   ├── battle/        # 战斗界面
│   │   ├── market/        # 市场界面
│   │   └── common/        # 公共组件
│   ├── models/            # 数据模型
│   ├── utils/             # 工具函数
│   └── config/            # 配置文件
├── scenes/                # 场景
│   ├── Launch.scene       # 启动场景
│   ├── Main.scene         # 主界面
│   ├── Galaxy.scene       # 星系场景
│   ├── Battle.scene       # 战斗场景
│   └── Market.scene       # 市场场景
├── prefabs/               # 预制体
├── resources/             # 动态加载资源
└── settings/              # 项目设置
```

### 3.2 后端项目结构（Node.js + NestJS）

```
zodiac-empire-server/
├── src/
│   ├── main.ts            # 入口文件
│   ├── app.module.ts      # 根模块
│   ├── common/            # 公共模块
│   │   ├── decorators/    # 装饰器
│   │   ├── filters/       # 过滤器
│   │   ├── guards/        # 守卫
│   │   ├── interceptors/  # 拦截器
│   │   ├── pipes/         # 管道
│   │   └── utils/         # 工具函数
│   ├── config/            # 配置
│   ├── modules/           # 业务模块
│   │   ├── auth/          # 认证模块
│   │   ├── user/          # 用户模块
│   │   ├── galaxy/        # 星系模块
│   │   ├── equipment/     # 装备模块
│   │   ├── emotion/       # 情绪模块
│   │   ├── emotion-card/  # 情绪卡片模块
│   │   ├── time-bank/     # 时间银行模块
│   │   ├── route/         # 星际航道模块
│   │   ├── battle/        # 战斗模块
│   │   ├── market/        # 市场模块
│   │   ├── alliance/      # 联盟模块
│   │   └── leaderboard/   # 排行榜模块
│   ├── entities/          # 数据库实体
│   ├── dto/               # 数据传输对象
│   └── migrations/        # 数据库迁移
├── test/                  # 测试
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 四、开发环境

### 4.1 必备工具

| 工具 | 用途 | 下载地址 |
|-----|------|---------|
| Node.js | 运行时 | nodejs.org |
| Cocos Creator | 游戏引擎 | cocos.com/creator |
| VSCode | 代码编辑器 | code.visualstudio.com |
| 微信开发者工具 | 小程序调试 | developers.weixin.qq.com |
| Git | 版本控制 | git-scm.com |
| MySQL Workbench | 数据库管理 | mysql.com/products/workbench |
| Redis Desktop Manager | Redis管理 | rdmeditor.com |
| Postman | API测试 | postman.com |

### 4.2 VSCode 插件推荐

```
- TypeScript Hero
- ESLint
- Prettier
- GitLens
- MySQL
- Redis
- Cocos Creator Helper
```

### 4.3 开发环境配置

```bash
# Node.js 版本管理
nvm install 20
nvm use 20

# 全局工具
npm install -g pnpm
npm install -g @nestjs/cli
npm install -g pm2

# 数据库
# 本地开发可用 Docker
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8
docker run -d --name redis -p 6379:6379 redis:7
docker run -d --name mongo -p 27017:27017 mongo:7
```

---

## 五、CI/CD 流程

### 5.1 Git 分支策略

```
main        # 生产环境
  ↑
release/*   # 发布分支
  ↑
develop     # 开发环境
  ↑
feature/*   # 功能分支
hotfix/*    # 紧急修复
```

### 5.2 开发流程

```
1. 从 develop 创建 feature 分支
2. 开发完成后提交 PR
3. Code Review 通过后合并
4. 测试环境验证
5. 合并到 release 分支
6. 预发布环境验证
7. 合并到 main 分支
8. 自动部署到生产环境
```

### 5.3 自动化部署

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to server
        run: |
          # 部署脚本
```

---

## 六、监控与运维

### 6.1 监控方案

| 监控项 | 工具 | 用途 |
|-------|------|------|
| 服务器监控 | Prometheus + Grafana | CPU、内存、磁盘 |
| 应用监控 | PM2 / NestJS Logger | 日志、错误 |
| 数据库监控 | MySQL Slow Log | 慢查询 |
| 性能监控 | Sentry | 前端错误追踪 |
| 业务监控 | 自研看板 | DAU、留存、收入 |

### 6.2 日志方案

```
应用日志 → Winston/Pino → 文件
    ↓
日志采集 → Filebeat
    ↓
日志存储 → Elasticsearch
    ↓
日志分析 → Kibana
```

### 6.3 备份策略

| 数据 | 频率 | 保留时长 |
|-----|------|---------|
| MySQL | 每日全量 + 实时binlog | 30天 |
| Redis | RDB每小时 + AOF实时 | 7天 |
| MongoDB | 每日全量 | 30天 |
| 代码 | Git实时 | 永久 |

---

## 七、安全方案

### 7.1 接口安全

- HTTPS 强制
- Token 鉴权（JWT）
- 请求签名验证
- 频率限制
- SQL注入防护
- XSS防护

### 7.2 数据安全

- 敏感数据加密存储
- 数据库访问控制
- 定期安全审计

### 7.3 微信小游戏安全

- 域名白名单
- 接口鉴权
- 防刷机制
- 内容审核（情绪卡片）

---

## 八、性能优化

### 8.1 前端优化

- 分包加载
- 资源压缩
- 对象池
- 合批渲染
- 内存管理

### 8.2 后端优化

- Redis缓存
- 数据库索引优化
- 连接池
- 异步处理
- 负载均衡

### 8.3 性能指标

| 指标 | 目标值 |
|-----|-------|
| 首屏加载 | < 3秒 |
| 接口响应 | < 200ms |
| 战斗计算 | < 100ms |
| 支持在线 | 10000+ |

---

**文档版本：** v1.0  
**创建日期：** 2026-03-09  
**作者：** 小科 🔬