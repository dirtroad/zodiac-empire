# 美术资源目录说明

## 目录结构

```
assets/
├── textures/           # 图片资源
│   ├── ui/            # UI界面图片
│   │   ├── login/     # 登录界面
│   │   ├── main/      # 主界面
│   │   └── popups/    # 弹窗
│   ├── icons/         # 图标
│   │   ├── zodiac/    # 12星座图标
│   │   ├── wuxing/    # 五行图标
│   │   └── resources/ # 资源图标（金币、钻石等）
│   ├── equipment/     # 装备图标
│   ├── galaxy/        # 星系图片
│   ├── battle/        # 战斗相关
│   └── effects/       # 特效图片
├── audio/             # 音频资源
│   ├── bgm/           # 背景音乐
│   └── sfx/           # 音效
└── fonts/             # 字体文件
```

## 各目录说明

### textures/ui/login/
登录界面相关图片：
- bg_login.png - 登录背景（750x1334）
- logo.png - 游戏Logo（400x200）
- btn_wechat_normal.png - 微信登录按钮（300x80）
- btn_wechat_pressed.png - 微信登录按钮按下态

### textures/ui/main/
主界面相关图片：
- bg_main.png - 主界面背景
- bar_top.png - 顶部信息栏
- bar_bottom.png - 底部导航栏
- frame_avatar.png - 头像边框

### textures/ui/popups/
弹窗相关图片：
- bg_popup_small.png - 小弹窗背景
- bg_popup_medium.png - 中弹窗背景
- bg_popup_large.png - 大弹窗背景
- btn_close.png - 关闭按钮

### textures/icons/zodiac/
12星座图标（每个128x128）：
- icon_zodiac_1.png - 白羊座
- icon_zodiac_2.png - 金牛座
- icon_zodiac_3.png - 双子座
- icon_zodiac_4.png - 巨蟹座
- icon_zodiac_5.png - 狮子座
- icon_zodiac_6.png - 处女座
- icon_zodiac_7.png - 天秤座
- icon_zodiac_8.png - 天蝎座
- icon_zodiac_9.png - 射手座
- icon_zodiac_10.png - 摩羯座
- icon_zodiac_11.png - 水瓶座
- icon_zodiac_12.png - 双鱼座

### textures/icons/wuxing/
五行图标（每个64x64）：
- icon_wuxing_1.png - 金
- icon_wuxing_2.png - 木
- icon_wuxing_3.png - 水
- icon_wuxing_4.png - 火
- icon_wuxing_5.png - 土

### textures/icons/resources/
资源图标（每个64x64）：
- icon_gold.png - 金币
- icon_diamond.png - 钻石
- icon_crystal.png - 时空晶体
- icon_exp.png - 经验值

### textures/equipment/
装备图标（每个80x80）：
按 类型_品质_编号 命名
- weapon_normal_1.png - 普通武器1
- weapon_rare_1.png - 稀有武器1
- helmet_epic_1.png - 史诗头盔1
- armor_legendary_1.png - 传说衣服1

### textures/galaxy/
星系图片（每个200x200）：
- galaxy_normal.png - 普通星系
- galaxy_binary.png - 双星系统
- galaxy_cluster.png - 星团
- galaxy_nebula.png - 星云
- galaxy_blackhole.png - 黑洞

### textures/battle/
战斗相关：
- bg_battle.png - 战斗背景
- effect_attack_1.png - 攻击特效1
- effect_skill_1.png - 技能特效1

### textures/effects/
通用特效：
- effect_glow.png - 发光效果
- effect_particle.png - 粒子素材

### audio/bgm/
背景音乐：
- bgm_login.mp3 - 登录音乐
- bgm_main.mp3 - 主界面音乐
- bgm_battle.mp3 - 战斗音乐

### audio/sfx/
音效：
- sfx_click.mp3 - 按钮点击
- sfx_get_item.mp3 - 获得物品
- sfx_attack.mp3 - 攻击音效
- sfx_victory.mp3 - 胜利音效

## 文件命名规范

- 全部小写
- 用下划线分隔
- 格式：类型_名称_状态.png

示例：
- btn_login_normal.png
- btn_login_pressed.png
- icon_zodiac_1.png

## 图片格式要求

- 格式：PNG（透明背景）
- 色彩：RGB
- 位深：32位（带Alpha通道）

## 联系方式

技术对接：小科
遇到问题随时沟通