# 星座帝国 - 前端脚本说明

## 脚本结构

```
assets/scripts/
├── MainGame.ts        # 主游戏脚本（核心入口）
├── GameEntry.ts       # 游戏入口说明
├── TestScene.ts       # 测试场景脚本
├── ui/                # UI组件
│   ├── TabBar.ts      # 底部导航栏
│   ├── ResourceBar.ts # 资源栏（金币/钻石/时间币）
│   └── UserInfo.ts    # 用户信息组件
├── managers/          # 管理器
│   └── ApiClient.ts   # API客户端
└── utils/             # 工具类
    └── Config.ts      # 配置文件
```

## 使用方法

### 1. 创建场景

在 Cocos Creator 中：

1. 新建场景 `MainScene`
2. 创建 Canvas 节点
3. 在 Canvas 下创建UI节点：
   - UserInfo（用户信息）
   - ResourceBar（资源栏）
   - TabBar（底部导航）

### 2. 挂载脚本

- Canvas → 添加 `MainGame` 组件
- UserInfo节点 → 添加 `UserInfo` 组件
- ResourceBar节点 → 添加 `ResourceBar` 组件
- TabBar节点 → 添加 `TabBar` 组件

### 3. 关联节点

在 MainGame 组件中，将对应的节点拖入属性面板。

## 注意事项

- 所有脚本使用 Cocos Creator 3.8.x 格式
- 使用 `@property` 装饰器定义可编辑属性
- 使用 `@ccclass` 装饰器注册组件

---

*创建时间：2026-03-10*