# 星座帝国 - 前端配置说明

## 微信小游戏配置

### 1. AppID配置

修改 `project.config.json` 中的 `appid`：
```json
{
  "appid": "your-wechat-appid"
}
```

### 2. 域名配置

在微信公众平台配置以下域名：

**request合法域名：**
- `https://your-domain.com`

**socket合法域名：**
- `wss://your-domain.com`

**uploadFile合法域名：**
- `https://your-domain.com`

**downloadFile合法域名：**
- `https://your-domain.com`

### 3. 构建流程

#### Cocos Creator构建
1. 打开 Cocos Creator
2. 菜单 → 项目 → 构建发布
3. 选择平台：微信小游戏
4. 填写应用ID
5. 点击构建

#### 微信开发者工具预览
1. 用微信开发者工具打开构建目录
2. 扫码预览

## 环境配置

修改 `config.json`：
```json
{
  "server": {
    "base_url": "开发环境地址",
    "production_url": "生产环境地址"
  }
}
```

## 文件说明

```
client/
├── project.config.json  # 微信小游戏项目配置
├── game.json           # 小游戏全局配置
├── config.json         # 游戏自定义配置
├── assets/             # 游戏资源
│   ├── scripts/        # TypeScript脚本
│   ├── textures/       # 图片资源
│   └── audio/          # 音频资源
└── README.md           # 本文件
```

## 注意事项

1. 微信小游戏要求 HTTPS
2. 域名需要备案
3. 首包大小限制 4MB
4. 总包大小限制 20MB