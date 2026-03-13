# 星座帝国 - 前端项目

## 项目说明

本项目使用Cocos Creator 3.8.x 开发，目标平台为微信小游戏。

## 使用步骤

### 1. 打开项目
```bash
# 用Cocos Creator打开以下目录
/Users/mac_sun/zodiac-empire/client
```

### 2. 创建场景
在Cocos Creator中创建以下场景：
- LoadingScene - 加载场景
- LoginScene - 登录场景
- MainScene - 主场景
- GalaxyScene - 星系场景
- EquipmentScene - 装备场景
- BattleScene - 战斗场景
- MapScene - 地图场景

### 3. 挂载脚本
将对应的脚本文件拖拽到场景根节点，例如：
- LoadingScene.ts → LoadingScene场景根节点
- LoginScene.ts → LoginScene场景根节点
- MainScene.ts → MainScene场景根节点

### 4. 配置UI
在属性检查器中配置UI节点引用：
- 用户信息标签
- 功能按钮
- 列表视图等

### 5. 构建发布
1. 菜单 → 项目 → 构建发布
2. 选择平台：微信小游戏
3. 点击构建
4. 用微信开发者工具打开构建目录

## 后端地址配置

修改 `assets/scripts/utils/Config.ts` 中的 `API_BASE_URL`：
```typescript
export const NetworkConfig = {
    API_BASE_URL: 'http://localhost:3000/v1',  // 开发环境
    // API_BASE_URL: 'https://your-domain.com/v1',  // 生产环境
};
```

## 项目结构

```
client/
├── assets/
│   ├── scripts/
│   │   ├── scenes/          # 场景脚本
│   │   ├── managers/        # 管理器（网络、游戏）
│   │   ├── components/      # UI组件
│   │   └── utils/           # 配置、工具
│   ├── resources/           # 动态加载资源
│   ├── scenes/              # 场景文件
│   ├── textures/            # 图片资源
│   ├── audio/               # 音频资源
│   └── fonts/               # 字体资源
├── settings/                # 项目设置
├── package.json
└── project.json
```

## 已实现功能

- [x] 网络请求封装
- [x] 微信登录流程
- [x] 用户数据管理
- [x] 星系管理
- [x] 装备系统
- [x] 五行系统
- [x] 时空晶体
- [x] 地图系统

## 待实现功能

- [ ] 战斗动画
- [ ] 音效系统
- [ ] 粒子特效
- [ ] 引导系统
- [ ] 分享功能