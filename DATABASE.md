# 星座帝国 - 数据库设计文档

> 数据库表结构设计 v1.0

---

## 一、数据库架构

### 1.1 数据库选型

| 数据库 | 用途 |
|-------|------|
| MySQL 8.0 | 核心业务数据（用户、星系、装备、交易等） |
| Redis 7.0 | 缓存、排行榜、实时价格、会话、战斗锁 |
| MongoDB 7.0 | 日志、战报、聊天记录、交易历史 |
| OSS | 图片、视频、静态资源 |

### 1.2 MySQL 分库分表策略

```
用户库 (user_db)
├── users              # 用户基础信息
├── user_profiles      # 用户详细资料
├── user_zodiac        # 用户星座信息
└── user_friends       # 好友关系

游戏库 (game_db)
├── galaxies           # 星系
├── galaxy_buildings   # 星系建筑
├── equipments         # 装备
├── user_equipments    # 用户装备关联
└── battles            # 战斗记录

经济库 (economy_db)
├── time_accounts      # 时间账户
├── time_loans         # 时间借贷
├── emotions           # 情绪资源
├── emotion_cards      # 情绪卡片
├── emotion_votes      # 情绪卡片投票
├── trades             # 交易记录
└── market_listings    # 市场挂单

社交库 (social_db)
├── alliances          # 联盟
├── alliance_members   # 联盟成员
├── chatroom_routes    # 星际航道
└── chatroom_flows     # 航道流量
```

---

## 二、核心表设计

### 2.1 用户模块

#### users - 用户基础表
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    openid VARCHAR(64) NOT NULL COMMENT '微信openid',
    unionid VARCHAR(64) COMMENT '微信unionid',
    nickname VARCHAR(64) COMMENT '昵称',
    avatar_url VARCHAR(512) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别 0未知 1男 2女',
    level INT DEFAULT 1 COMMENT '等级',
    exp BIGINT DEFAULT 0 COMMENT '经验值',
    power BIGINT DEFAULT 100 COMMENT '战力',
    gold BIGINT DEFAULT 1000 COMMENT '金币',
    diamond INT DEFAULT 0 COMMENT '钻石',
    time_coin BIGINT DEFAULT 0 COMMENT '时间币',
    vip_level INT DEFAULT 0 COMMENT 'VIP等级',
    vip_expire_at DATETIME COMMENT 'VIP过期时间',
    shield_until DATETIME COMMENT '护盾结束时间',
    last_login_at DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(64) COMMENT '最后登录IP',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2封禁',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_openid (openid),
    KEY idx_level (level),
    KEY idx_power (power)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础表';
```

#### user_profiles - 用户资料表
```sql
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    zodiac_sign TINYINT COMMENT '星座 1白羊 2金牛...12双鱼',
    zodiac_name VARCHAR(20) COMMENT '星座名称',
    birth_region VARCHAR(50) COMMENT '出生星域',
    region_bonus JSON COMMENT '星域加成属性',
    bio VARCHAR(200) COMMENT '个人简介',
    total_play_time INT DEFAULT 0 COMMENT '累计游戏时长(秒)',
    total_battles INT DEFAULT 0 COMMENT '累计战斗次数',
    total_wins INT DEFAULT 0 COMMENT '累计胜利次数',
    total_trades INT DEFAULT 0 COMMENT '累计交易次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id),
    KEY idx_zodiac (zodiac_sign)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';
```

#### user_friends - 好友关系表
```sql
CREATE TABLE user_friends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    friend_id BIGINT NOT NULL COMMENT '好友ID',
    route_id BIGINT COMMENT '星际航道ID',
    match_score INT DEFAULT 0 COMMENT '星座匹配度分数',
    intimacy INT DEFAULT 0 COMMENT '亲密度',
    interaction_count INT DEFAULT 0 COMMENT '互动次数',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_friend (user_id, friend_id),
    KEY idx_friend_id (friend_id),
    KEY idx_route (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='好友关系表';
```

---

### 2.2 星座模块

#### zodiac_configs - 星座配置表
```sql
CREATE TABLE zodiac_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sign TINYINT NOT NULL COMMENT '星座序号 1-12',
    name VARCHAR(20) NOT NULL COMMENT '星座名称',
    element VARCHAR(10) COMMENT '元素 火/土/风/水',
    region_name VARCHAR(50) COMMENT '星域名称',
    resource_bonus VARCHAR(50) COMMENT '资源倾向',
    power_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '战力加成%',
    defense_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '防御加成%',
    production_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '产出加成%',
    trade_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '贸易加成%',
    synthesis_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '合成成功率加成%',
    best_match VARCHAR(50) COMMENT '最佳匹配星座',
    good_match VARCHAR(100) COMMENT '良好匹配星座',
    description TEXT COMMENT '星座描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_sign (sign)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星座配置表';

-- 初始数据
INSERT INTO zodiac_configs (sign, name, element, region_name, resource_bonus, power_bonus, production_bonus, trade_bonus, synthesis_bonus, best_match, good_match) VALUES
(1, '白羊座', '火', '烈焰星域', '激情、攻击', 5.00, 0, 0, 0, '狮子座', '射手座'),
(2, '金牛座', '土', '翡翠星域', '金币、资源', 0, 10.00, 0, 0, '处女座', '摩羯座'),
(3, '双子座', '风', '双子星域', '智慧、贸易', 0, 0, 8.00, 0, '天秤座', '水瓶座'),
(4, '巨蟹座', '水', '月光星域', '平静、防御', 0, 0, 0, 0, '天蝎座', '双鱼座'),
(5, '狮子座', '火', '太阳星域', '快乐、领导', 0, 0, 0, 0, '白羊座', '射手座'),
(6, '处女座', '土', '晶钻星域', '智慧、合成', 0, 0, 0, 5.00, '金牛座', '摩羯座'),
(7, '天秤座', '风', '天平星域', '平衡、外交', 3.00, 3.00, 3.00, 3.00, '双子座', '水瓶座'),
(8, '天蝎座', '水', '暗影星域', '愤怒、暴击', 8.00, 0, 0, 0, '巨蟹座', '双鱼座'),
(9, '射手座', '火', '远行星域', '探索、速度', 0, 0, 0, 0, '白羊座', '狮子座'),
(10, '摩羯座', '土', '坚毅星域', '时间、稳定', 0, 0, 0, 0, '金牛座', '处女座'),
(11, '水瓶座', '风', '极光星域', '创新、稀有', 0, 0, 0, 0, '双子座', '天秤座'),
(12, '双鱼座', '水', '梦幻星域', '情绪、治愈', 0, 0, 0, 0, '巨蟹座', '天蝎座');
```

---

### 2.3 星系模块

#### galaxies - 星系表
```sql
CREATE TABLE galaxies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '所属用户ID',
    name VARCHAR(100) COMMENT '星系名称',
    type TINYINT DEFAULT 1 COMMENT '星系类型 1快乐 2智慧 3激情 4平静 5混沌',
    rarity TINYINT DEFAULT 1 COMMENT '稀有度 1普通 2稀有 3史诗 4传说',
    size INT DEFAULT 1 COMMENT '星系大小 1-9',
    level INT DEFAULT 1 COMMENT '星系等级',
    base_production DECIMAL(10,2) DEFAULT 100 COMMENT '基础产出',
    defense_power BIGINT DEFAULT 0 COMMENT '防御战力',
    is_main TINYINT DEFAULT 0 COMMENT '是否主星系 0否 1是',
    is_frozen TINYINT DEFAULT 0 COMMENT '是否冻结',
    frozen_until DATETIME COMMENT '冻结结束时间',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2被占领',
    owner_user_id BIGINT COMMENT '当前占领者ID',
    occupied_at DATETIME COMMENT '占领时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_type (type),
    KEY idx_owner (owner_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星系表';
```

#### galaxy_buildings - 星系建筑表
```sql
CREATE TABLE galaxy_buildings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    galaxy_id BIGINT NOT NULL COMMENT '星系ID',
    building_type TINYINT NOT NULL COMMENT '建筑类型 1情绪工厂 2时间银行 3防御阵列 4贸易站',
    name VARCHAR(100) COMMENT '建筑名称',
    level INT DEFAULT 1 COMMENT '建筑等级',
    production_rate DECIMAL(10,2) DEFAULT 0 COMMENT '产出效率',
    capacity INT DEFAULT 100 COMMENT '容量',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用',
    upgrade_end_at DATETIME COMMENT '升级完成时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_galaxy_id (galaxy_id),
    KEY idx_building_type (building_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星系建筑表';
```

---

### 2.4 装备模块

#### equipments - 装备定义表
```sql
CREATE TABLE equipments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '装备名称',
    type TINYINT NOT NULL COMMENT '装备类型 1情绪引擎 2时间加速器 3星际武器 4护盾发生器 5特殊装备',
    rarity TINYINT NOT NULL COMMENT '稀有度 1普通 2稀有 3史诗 4传说 5神话',
    base_power INT DEFAULT 0 COMMENT '基础战力',
    attack_bonus INT DEFAULT 0 COMMENT '攻击加成',
    defense_bonus INT DEFAULT 0 COMMENT '防御加成',
    special_effect VARCHAR(200) COMMENT '特殊效果',
    description TEXT COMMENT '装备描述',
    icon_url VARCHAR(512) COMMENT '图标URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_type (type),
    KEY idx_rarity (rarity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='装备定义表';
```

#### user_equipments - 用户装备表
```sql
CREATE TABLE user_equipments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    equipment_id BIGINT NOT NULL COMMENT '装备定义ID',
    level INT DEFAULT 1 COMMENT '强化等级',
    current_power INT COMMENT '当前战力',
    is_equipped TINYINT DEFAULT 0 COMMENT '是否装备中',
    equipped_slot TINYINT COMMENT '装备槽位',
    is_locked TINYINT DEFAULT 0 COMMENT '是否锁定',
    is_for_sale TINYINT DEFAULT 0 COMMENT '是否在售',
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_equipment_id (equipment_id),
    KEY idx_for_sale (is_for_sale)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户装备表';
```

#### equipment_synthesis_logs - 装备合成日志
```sql
CREATE TABLE equipment_synthesis_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    input_equipment_ids JSON NOT NULL COMMENT '输入装备ID列表',
    output_equipment_id BIGINT COMMENT '输出装备ID',
    success TINYINT COMMENT '是否成功',
    catalyst_used TINYINT DEFAULT 0 COMMENT '使用催化剂数量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='装备合成日志';
```

---

### 2.5 情绪模块

#### emotions - 用户情绪资源表
```sql
CREATE TABLE emotions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    emotion_type TINYINT NOT NULL COMMENT '情绪类型 1快乐 2平静 3激情 4智慧 5愤怒 6焦虑',
    emotion_name VARCHAR(20) COMMENT '情绪名称',
    amount BIGINT DEFAULT 0 COMMENT '数量',
    daily_production DECIMAL(10,2) DEFAULT 0 COMMENT '每日产出',
    last_collect_at DATETIME COMMENT '上次收取时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_type (user_id, emotion_type),
    KEY idx_emotion_type (emotion_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户情绪资源表';
```

#### emotion_cards - 情绪卡片表
```sql
CREATE TABLE emotion_cards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '上传用户ID',
    title VARCHAR(200) COMMENT '卡片标题',
    content_type TINYINT NOT NULL COMMENT '内容类型 1图片 2视频',
    content_url VARCHAR(512) NOT NULL COMMENT '内容URL',
    thumbnail_url VARCHAR(512) COMMENT '缩略图URL',
    emotion_type TINYINT COMMENT 'AI识别情绪类型',
    emotion_confidence DECIMAL(5,2) COMMENT '情绪识别置信度',
    popularity INT DEFAULT 0 COMMENT '人气值(点赞数)',
    popularity_level TINYINT DEFAULT 1 COMMENT '人气等级 1普通 2热门 3爆款 4现象级',
    is_anonymous TINYINT DEFAULT 0 COMMENT '是否匿名',
    is_blurred TINYINT DEFAULT 0 COMMENT '是否打码',
    status TINYINT DEFAULT 1 COMMENT '状态 1待审核 2正常 3违规 4下架',
    audit_result TEXT COMMENT '审核结果',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    share_count INT DEFAULT 0 COMMENT '分享次数',
    collected_at DATETIME COMMENT '领取奖励时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_popularity (popularity DESC),
    KEY idx_status (status),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪卡片表';
```

#### emotion_votes - 情绪卡片投票表
```sql
CREATE TABLE emotion_votes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    card_id BIGINT NOT NULL COMMENT '卡片ID',
    voter_id BIGINT NOT NULL COMMENT '投票用户ID',
    vote_type TINYINT DEFAULT 1 COMMENT '投票类型 1点赞 2踩',
    reward_claimed TINYINT DEFAULT 0 COMMENT '是否已领取奖励',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_card_voter (card_id, voter_id),
    KEY idx_voter_id (voter_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪卡片投票表';
```

#### emotion_card_collections - 情绪卡片收藏表
```sql
CREATE TABLE emotion_card_collections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    card_id BIGINT NOT NULL COMMENT '卡片ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_card (user_id, card_id),
    KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪卡片收藏表';
```

---

### 2.6 时间银行模块

#### time_accounts - 时间账户表
```sql
CREATE TABLE time_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    balance BIGINT DEFAULT 0 COMMENT '余额(时间币)',
    deposited BIGINT DEFAULT 0 COMMENT '已存入金额',
    interest_rate DECIMAL(5,4) DEFAULT 0.0500 COMMENT '日利率',
    total_interest BIGINT DEFAULT 0 COMMENT '累计利息',
    loan_balance BIGINT DEFAULT 0 COMMENT '贷款余额',
    credit_limit BIGINT DEFAULT 1000 COMMENT '信用额度',
    credit_score INT DEFAULT 500 COMMENT '信用分数',
    frozen_amount BIGINT DEFAULT 0 COMMENT '冻结金额',
    last_interest_at DATETIME COMMENT '上次计息时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时间账户表';
```

#### time_loans - 时间借贷表
```sql
CREATE TABLE time_loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    borrower_id BIGINT NOT NULL COMMENT '借款人ID',
    guarantor_id BIGINT COMMENT '担保人ID',
    amount BIGINT NOT NULL COMMENT '借款金额',
    interest_rate DECIMAL(5,4) NOT NULL COMMENT '利率',
    total_repay BIGINT NOT NULL COMMENT '应还总额',
    repaid BIGINT DEFAULT 0 COMMENT '已还金额',
    status TINYINT DEFAULT 1 COMMENT '状态 1进行中 2已还清 3逾期 4违约',
    due_at DATETIME NOT NULL COMMENT '到期时间',
    repaid_at DATETIME COMMENT '还清时间',
    guarantor_fee BIGINT DEFAULT 0 COMMENT '担保费',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_borrower_id (borrower_id),
    KEY idx_guarantor_id (guarantor_id),
    KEY idx_status (status),
    KEY idx_due_at (due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时间借贷表';
```

#### time_investments - 时间投资表
```sql
CREATE TABLE time_investments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    investor_id BIGINT NOT NULL COMMENT '投资人ID',
    project_user_id BIGINT NOT NULL COMMENT '项目所有者ID',
    project_type TINYINT NOT NULL COMMENT '项目类型 1星系建设 2装备研发 3贸易投资',
    project_id BIGINT COMMENT '项目ID',
    amount BIGINT NOT NULL COMMENT '投资金额',
    share_ratio DECIMAL(5,2) NOT NULL COMMENT '分成比例%',
    total_return BIGINT DEFAULT 0 COMMENT '累计收益',
    status TINYINT DEFAULT 1 COMMENT '状态 1进行中 2已完成 3已取消',
    end_at DATETIME COMMENT '结束时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_investor_id (investor_id),
    KEY idx_project_user_id (project_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时间投资表';
```

---

### 2.7 星际航道模块

#### chatroom_routes - 星际航道表
```sql
CREATE TABLE chatroom_routes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    friend_id BIGINT NOT NULL COMMENT '好友ID',
    route_level INT DEFAULT 1 COMMENT '航道等级 1量子通道 2曲速航道 3跃迁通道 4传送门',
    flow INT DEFAULT 0 COMMENT '流量值',
    trade_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '贸易加成%',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2冻结',
    last_interact_at DATETIME COMMENT '最后互动时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_friend (user_id, friend_id),
    KEY idx_flow (flow DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星际航道表';
```

#### chatroom_flows - 航道流量记录表
```sql
CREATE TABLE chatroom_flows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_id BIGINT NOT NULL COMMENT '航道ID',
    flow_type TINYINT NOT NULL COMMENT '流量类型 1访问 2点赞 3送礼 4战斗 5贸易',
    flow_value INT DEFAULT 1 COMMENT '流量值',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_route_id (route_id),
    KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='航道流量记录表';
```

---

### 2.8 战斗模块

#### battles - 战斗记录表
```sql
CREATE TABLE battles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attacker_id BIGINT NOT NULL COMMENT '进攻方ID',
    defender_id BIGINT NOT NULL COMMENT '防守方ID',
    battle_type TINYINT NOT NULL COMMENT '战斗类型 1星际战争 2情绪对决 3贸易争夺 4复仇战役',
    attacker_power BIGINT COMMENT '进攻方战力',
    defender_power BIGINT COMMENT '防守方战力',
    winner_id BIGINT COMMENT '胜利者ID',
    reward_type TINYINT COMMENT '奖励类型 1星系 2装备 3资源',
    reward_id BIGINT COMMENT '奖励ID',
    reward_amount BIGINT COMMENT '奖励数量',
    battle_duration INT COMMENT '战斗时长(秒)',
    battle_data JSON COMMENT '战斗详细数据',
    revenge_available TINYINT DEFAULT 1 COMMENT '是否可复仇',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_attacker_id (attacker_id),
    KEY idx_defender_id (defender_id),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='战斗记录表';
```

---

### 2.9 贸易模块

#### market_listings - 市场挂单表
```sql
CREATE TABLE market_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT NOT NULL COMMENT '卖家ID',
    item_type TINYINT NOT NULL COMMENT '物品类型 1星系 2装备 3情绪资源 4时间币',
    item_id BIGINT COMMENT '物品ID',
    item_name VARCHAR(100) COMMENT '物品名称',
    item_data JSON COMMENT '物品详细数据',
    quantity BIGINT DEFAULT 1 COMMENT '数量',
    price BIGINT NOT NULL COMMENT '价格',
    currency TINYINT DEFAULT 1 COMMENT '货币类型 1金币 2钻石 3时间币',
    listing_type TINYINT DEFAULT 1 COMMENT '挂单类型 1一口价 2拍卖',
    auction_end_at DATETIME COMMENT '拍卖结束时间',
    highest_bidder_id BIGINT COMMENT '最高出价者ID',
    highest_bid BIGINT COMMENT '最高出价',
    status TINYINT DEFAULT 1 COMMENT '状态 1在售 2已售 3已下架 4已过期',
    sold_to_id BIGINT COMMENT '买家ID',
    sold_at DATETIME COMMENT '售出时间',
    view_count INT DEFAULT 0 COMMENT '浏览次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_seller_id (seller_id),
    KEY idx_item_type (item_type),
    KEY idx_status (status),
    KEY idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='市场挂单表';
```

#### trades - 交易记录表
```sql
CREATE TABLE trades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    buyer_id BIGINT NOT NULL COMMENT '买家ID',
    seller_id BIGINT NOT NULL COMMENT '卖家ID',
    listing_id BIGINT COMMENT '挂单ID',
    item_type TINYINT NOT NULL COMMENT '物品类型',
    item_id BIGINT COMMENT '物品ID',
    item_name VARCHAR(100) COMMENT '物品名称',
    quantity BIGINT DEFAULT 1 COMMENT '数量',
    price BIGINT NOT NULL COMMENT '成交价',
    currency TINYINT DEFAULT 1 COMMENT '货币类型',
    fee BIGINT COMMENT '手续费',
    trade_type TINYINT DEFAULT 1 COMMENT '交易类型 1市场购买 2好友交易 3拍卖',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_buyer_id (buyer_id),
    KEY idx_seller_id (seller_id),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交易记录表';
```

#### emotion_exchange_prices - 情绪交易所价格表
```sql
CREATE TABLE emotion_exchange_prices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    emotion_type TINYINT NOT NULL COMMENT '情绪类型',
    base_price DECIMAL(10,2) NOT NULL COMMENT '基础价格',
    current_price DECIMAL(10,2) NOT NULL COMMENT '当前价格',
    daily_high DECIMAL(10,2) COMMENT '当日最高价',
    daily_low DECIMAL(10,2) COMMENT '当日最低价',
    total_supply BIGINT DEFAULT 0 COMMENT '总供应量',
    total_demand BIGINT DEFAULT 0 COMMENT '总需求量',
    volatility DECIMAL(5,2) DEFAULT 1.00 COMMENT '波动系数',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_emotion_type (emotion_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪交易所价格表';
```

---

### 2.10 联盟模块

#### alliances - 联盟表
```sql
CREATE TABLE alliances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '联盟名称',
    leader_id BIGINT NOT NULL COMMENT '盟主ID',
    description TEXT COMMENT '联盟描述',
    badge_url VARCHAR(512) COMMENT '联盟徽章',
    level INT DEFAULT 1 COMMENT '联盟等级',
    member_count INT DEFAULT 1 COMMENT '成员数',
    max_members INT DEFAULT 50 COMMENT '最大成员数',
    total_power BIGINT DEFAULT 0 COMMENT '总战力',
    zodiac_requirement TINYINT COMMENT '星座要求 NULL为不限',
    join_type TINYINT DEFAULT 1 COMMENT '加入方式 1自由 2申请 3邀请',
    min_level INT DEFAULT 1 COMMENT '最低等级要求',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2解散',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_leader_id (leader_id),
    KEY idx_zodiac (zodiac_requirement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='联盟表';
```

#### alliance_members - 联盟成员表
```sql
CREATE TABLE alliance_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alliance_id BIGINT NOT NULL COMMENT '联盟ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role TINYINT DEFAULT 1 COMMENT '角色 1成员 2长老 3副盟主 4盟主',
    contribution INT DEFAULT 0 COMMENT '贡献值',
    join_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id),
    KEY idx_alliance_id (alliance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='联盟成员表';
```

### 2.11 战队模块（新增）

#### teams - 战队表
```sql
CREATE TABLE teams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '战队名称',
    leader_id BIGINT NOT NULL COMMENT '队长ID',
    description TEXT COMMENT '战队描述',
    badge_url VARCHAR(512) COMMENT '战队徽章',
    level INT DEFAULT 1 COMMENT '战队等级',
    member_count INT DEFAULT 1 COMMENT '成员数',
    max_members INT DEFAULT 5 COMMENT '最大成员数',
    total_power BIGINT DEFAULT 0 COMMENT '总战力',
    match_bonus DECIMAL(5,2) DEFAULT 0 COMMENT '匹配加成%',
    score INT DEFAULT 0 COMMENT '战队积分',
    rank INT DEFAULT 0 COMMENT '战队排名',
    wins INT DEFAULT 0 COMMENT '胜利场次',
    losses INT DEFAULT 0 COMMENT '失败场次',
    weekly_battles INT DEFAULT 0 COMMENT '本周战斗次数',
    status TINYINT DEFAULT 1 COMMENT '状态 1正常 2解散',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_leader_id (leader_id),
    KEY idx_rank (rank),
    KEY idx_score (score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='战队表';
```

#### team_members - 战队成员表
```sql
CREATE TABLE team_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    team_id BIGINT NOT NULL COMMENT '战队ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role TINYINT DEFAULT 1 COMMENT '角色 1成员 2队长',
    power BIGINT DEFAULT 0 COMMENT '加入时战力',
    contribution INT DEFAULT 0 COMMENT '贡献值',
    zodiac_sign TINYINT COMMENT '星座',
    join_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id),
    KEY idx_team_id (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='战队成员表';
```

#### team_battles - 战队战斗表
```sql
CREATE TABLE team_battles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attacker_team_id BIGINT NOT NULL COMMENT '进攻方战队ID',
    defender_team_id BIGINT NOT NULL COMMENT '防守方战队ID',
    attacker_power BIGINT COMMENT '进攻方总战力',
    defender_power BIGINT COMMENT '防守方总战力',
    attacker_match_bonus DECIMAL(5,2) COMMENT '进攻方匹配加成',
    defender_match_bonus DECIMAL(5,2) COMMENT '防守方匹配加成',
    winner_team_id BIGINT COMMENT '胜利方战队ID',
    rounds JSON COMMENT '战斗回合详情',
    score_change INT COMMENT '积分变化',
    rewards JSON COMMENT '奖励详情',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_attacker_team (attacker_team_id),
    KEY idx_defender_team (defender_team_id),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='战队战斗表';
```

#### zodiac_match_cache - 星座匹配缓存表
```sql
CREATE TABLE zodiac_match_cache (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    zodiac_a TINYINT NOT NULL COMMENT '星座A',
    zodiac_b TINYINT NOT NULL COMMENT '星座B',
    match_level TINYINT NOT NULL COMMENT '匹配等级 1普通 2良好 3最佳',
    power_bonus DECIMAL(5,2) NOT NULL COMMENT '战力加成%',
    trade_bonus DECIMAL(5,2) NOT NULL COMMENT '贸易加成%',
    
    UNIQUE KEY uk_zodiac_pair (zodiac_a, zodiac_b),
    KEY idx_match_level (match_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星座匹配缓存表';

-- 初始化数据
INSERT INTO zodiac_match_cache (zodiac_a, zodiac_b, match_level, power_bonus, trade_bonus) VALUES
-- 火象（1白羊,5狮子,9射手）与风象（3双子,7天秤,11水瓶）最佳匹配
(1,3,3,20.00,20.00),(1,7,3,20.00,20.00),(1,11,3,20.00,20.00),
(5,3,3,20.00,20.00),(5,7,3,20.00,20.00),(5,11,3,20.00,20.00),
(9,3,3,20.00,20.00),(9,7,3,20.00,20.00),(9,11,3,20.00,20.00),
-- 土象（2金牛,6处女,10摩羯）与水象（4巨蟹,8天蝎,12双鱼）最佳匹配
(2,4,3,20.00,20.00),(2,8,3,20.00,20.00),(2,12,3,20.00,20.00),
(6,4,3,20.00,20.00),(6,8,3,20.00,20.00),(6,12,3,20.00,20.00),
(10,4,3,20.00,20.00),(10,8,3,20.00,20.00),(10,12,3,20.00,20.00),
-- 同元素良好匹配（部分示例）
(1,5,2,10.00,10.00),(1,9,2,10.00,10.00),(5,9,2,10.00,10.00),
(2,6,2,10.00,10.00),(2,10,2,10.00,10.00),(6,10,2,10.00,10.00),
(3,7,2,10.00,10.00),(3,11,2,10.00,10.00),(7,11,2,10.00,10.00),
(4,8,2,10.00,10.00),(4,12,2,10.00,10.00),(8,12,2,10.00,10.00);
```

---

## 三、Redis 数据结构

### 3.1 排行榜
```
# 战力排行榜
ZSET leaderboard:power

# 财富排行榜
ZSET leaderboard:wealth

# 情绪持有排行榜
ZSET leaderboard:emotion:{emotion_type}

# 人气卡片排行榜
ZSET leaderboard:emotion_cards:daily
ZSET leaderboard:emotion_cards:weekly
```

### 3.2 实时数据
```
# 情绪实时价格
HASH emotion:prices
  happiness: 120.5
  calm: 85.2
  passion: 150.0
  ...

# 用户在线状态
SET online:users

# 用户会话
STRING session:{user_id} -> JSON

# 战斗锁
STRING battle:lock:{user_id} -> 1 (TTL: 30s)

# 行动力
HASH user:action_points:{user_id}
  current: 10
  max: 20
  last_recover: timestamp
```

### 3.3 缓存
```
# 用户信息缓存
STRING user:info:{user_id} -> JSON (TTL: 1h)

# 星系信息缓存
STRING galaxy:info:{galaxy_id} -> JSON (TTL: 30m)

# 航道流量缓存
STRING route:flow:{route_id} -> int (TTL: 24h)

# 市场挂单缓存
ZSET market:listings:{item_type} -> listing_id sorted by price
```

---

## 四、MongoDB 集合设计

### 4.1 battle_logs - 战斗日志
```javascript
{
    _id: ObjectId,
    battle_id: Long,
    attacker_id: Long,
    defender_id: Long,
    battle_type: Int,
    rounds: [
        {
            round: Int,
            attacker_action: String,
            defender_action: String,
            damage: Int,
            effect: String
        }
    ],
    result: {
        winner_id: Long,
        rewards: {}
    },
    created_at: Date
}
```

### 4.2 trade_history - 交易历史
```javascript
{
    _id: ObjectId,
    trade_id: Long,
    buyer_id: Long,
    seller_id: Long,
    item: {},
    price: Long,
    created_at: Date
}
```

### 4.3 emotion_card_comments - 情绪卡片评论
```javascript
{
    _id: ObjectId,
    card_id: Long,
    user_id: Long,
    content: String,
    like_count: Int,
    created_at: Date
}
```

---

## 五、索引优化建议

### 5.1 查询优化
- 用户查询：openid、user_id
- 排行榜查询：power、wealth
- 市场查询：item_type + status + price
- 战斗查询：attacker_id + created_at、defender_id + created_at

### 5.2 分表策略
- users：按user_id哈希分16张表
- battles：按月分表
- trades：按月分表
- emotion_votes：按card_id哈希分表

### 5.3 归档策略
- battles：超过3个月归档到MongoDB
- trades：超过6个月归档到MongoDB
- emotion_votes：超过1年归档

---

## 五、五行模块（新增）

### 5.1 user_wuxing - 用户五行表
```sql
CREATE TABLE user_wuxing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    birth_date DATE COMMENT '出生日期',
    birth_time TIME COMMENT '出生时间',
    bazi_year VARCHAR(10) COMMENT '年柱（如：甲子）',
    bazi_month VARCHAR(10) COMMENT '月柱',
    bazi_day VARCHAR(10) COMMENT '日柱',
    bazi_hour VARCHAR(10) COMMENT '时柱',
    bazi_json JSON COMMENT '完整八字数据',
    main_wuxing VARCHAR(10) NOT NULL COMMENT '主五行（木火土金水）',
    wuxing_count JSON COMMENT '五行统计{"木":2,"火":3,...}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id),
    KEY idx_main_wuxing (main_wuxing)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户五行表';
```

### 5.2 equipment_wuxing - 装备五行表
```sql
CREATE TABLE equipment_wuxing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_id BIGINT NOT NULL COMMENT '装备ID',
    wuxing VARCHAR(10) NOT NULL COMMENT '五行属性',
    wuxing_bonus JSON COMMENT '五行加成{"attack":10,"defense":5}',
    skill_id BIGINT COMMENT '关联技能ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_equipment_id (equipment_id),
    KEY idx_wuxing (wuxing)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='装备五行表';
```

### 5.3 wuxing_skills - 五行技能表
```sql
CREATE TABLE wuxing_skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '技能名称',
    wuxing VARCHAR(10) NOT NULL COMMENT '五行属性',
    skill_type TINYINT NOT NULL COMMENT '技能类型 1攻击 2防御 3治疗 4控制',
    description TEXT COMMENT '技能描述',
    base_damage INT DEFAULT 0 COMMENT '基础伤害',
    damage_coefficient DECIMAL(5,2) DEFAULT 1.0 COMMENT '伤害系数',
    special_effect VARCHAR(200) COMMENT '特殊效果',
    cooldown INT DEFAULT 0 COMMENT '冷却时间(秒)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_wuxing (wuxing),
    KEY idx_skill_type (skill_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='五行技能表';
```

### 5.4 wuxing_relations - 五行关系缓存表
```sql
CREATE TABLE wuxing_relations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    wuxing_a VARCHAR(10) NOT NULL COMMENT '五行A',
    wuxing_b VARCHAR(10) NOT NULL COMMENT '五行B',
    relation VARCHAR(10) NOT NULL COMMENT '关系 相生/相克/同行',
    attack_coefficient DECIMAL(5,2) NOT NULL COMMENT '攻击系数',
    defense_coefficient DECIMAL(5,2) NOT NULL COMMENT '防御系数',
    
    UNIQUE KEY uk_wuxing_pair (wuxing_a, wuxing_b)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='五行关系缓存表';

-- 初始化数据
INSERT INTO wuxing_relations (wuxing_a, wuxing_b, relation, attack_coefficient, defense_coefficient) VALUES
-- 相克关系
('木', '土', '相克', 1.30, 0.80),
('土', '水', '相克', 1.30, 0.80),
('水', '火', '相克', 1.30, 0.80),
('火', '金', '相克', 1.30, 0.80),
('金', '木', '相克', 1.30, 0.80),
-- 相生关系
('木', '火', '相生', 0.90, 1.20),
('火', '土', '相生', 0.90, 1.20),
('土', '金', '相生', 0.90, 1.20),
('金', '水', '相生', 0.90, 1.20),
('水', '木', '相生', 0.90, 1.20),
-- 同行关系
('木', '木', '同行', 1.00, 1.00),
('火', '火', '同行', 1.00, 1.00),
('土', '土', '同行', 1.00, 1.00),
('金', '金', '同行', 1.00, 1.00),
('水', '水', '同行', 1.00, 1.00);
```

---

## 六、时空晶体模块（新增）

### 6.1 space_time_crystals - 时空晶体账户表
```sql
CREATE TABLE space_time_crystals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    balance BIGINT DEFAULT 0 COMMENT '当前余额',
    deposited BIGINT DEFAULT 0 COMMENT '已存入金额',
    interest_rate DECIMAL(5,4) DEFAULT 0.0500 COMMENT '日利率',
    total_interest BIGINT DEFAULT 0 COMMENT '累计利息',
    loan_balance BIGINT DEFAULT 0 COMMENT '贷款余额',
    credit_limit BIGINT DEFAULT 1000 COMMENT '信用额度',
    credit_score INT DEFAULT 500 COMMENT '信用分数',
    frozen_amount BIGINT DEFAULT 0 COMMENT '冻结金额',
    last_interest_at DATETIME COMMENT '上次计息时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时空晶体账户表';
```

### 6.2 space_time_loans - 时空晶体借贷表
```sql
CREATE TABLE space_time_loans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    borrower_id BIGINT NOT NULL COMMENT '借款人ID',
    guarantor_id BIGINT COMMENT '担保人ID',
    amount BIGINT NOT NULL COMMENT '借款金额',
    interest_rate DECIMAL(5,4) NOT NULL COMMENT '利率',
    total_repay BIGINT NOT NULL COMMENT '应还总额',
    repaid BIGINT DEFAULT 0 COMMENT '已还金额',
    status TINYINT DEFAULT 1 COMMENT '状态 1进行中 2已还清 3逾期 4违约',
    due_at DATETIME NOT NULL COMMENT '到期时间',
    repaid_at DATETIME COMMENT '还清时间',
    guarantor_fee BIGINT DEFAULT 0 COMMENT '担保费',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_borrower_id (borrower_id),
    KEY idx_guarantor_id (guarantor_id),
    KEY idx_status (status),
    KEY idx_due_at (due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时空晶体借贷表';
```

### 6.3 space_time_teleports - 时空穿梭记录表
```sql
CREATE TABLE space_time_teleports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    from_region VARCHAR(50) COMMENT '出发星域',
    to_region VARCHAR(50) NOT NULL COMMENT '目标星域',
    cost INT NOT NULL COMMENT '消耗晶体',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时空穿梭记录表';
```

### 6.4 space_time_skills - 时空技能使用记录表
```sql
CREATE TABLE space_time_skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    skill_type TINYINT NOT NULL COMMENT '技能类型 1加速建设 2加速生产 3时空回溯 4时空预言 5时空冻结',
    target_id BIGINT COMMENT '目标ID',
    cost INT NOT NULL COMMENT '消耗晶体',
    effect_data JSON COMMENT '效果数据',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_skill_type (skill_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时空技能使用记录表';
```

### 6.5 zodiac_search_logs - 星座匹配搜索记录表
```sql
CREATE TABLE zodiac_search_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    search_type TINYINT NOT NULL COMMENT '搜索类型 1最佳匹配 2良好匹配 3附近玩家 4高级筛选',
    cost INT NOT NULL COMMENT '消耗晶体',
    result_count INT DEFAULT 0 COMMENT '结果数量',
    filters JSON COMMENT '筛选条件',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_user_id (user_id),
    KEY idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星座匹配搜索记录表';
```

---

## 七、地图模块（新增）

### 7.1 star_regions - 星域表
```sql
CREATE TABLE star_regions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '星域名称',
    element VARCHAR(10) COMMENT '元素属性 火/土/风/水',
    zodiac_signs VARCHAR(100) COMMENT '对应星座',
    description TEXT COMMENT '星域描述',
    center_x INT COMMENT '中心X坐标',
    center_y INT COMMENT '中心Y坐标',
    radius INT COMMENT '半径',
    is_special TINYINT DEFAULT 0 COMMENT '是否特殊区域',
    teleport_cost INT DEFAULT 100 COMMENT '穿梭消耗',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_element (element),
    KEY idx_is_special (is_special)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星域表';

-- 初始化数据
INSERT INTO star_regions (name, element, zodiac_signs, description, teleport_cost) VALUES
('烈焰星域', '火', '1,5,9', '火象星座的领地，热情奔放', 50),
('厚土星域', '土', '2,6,10', '土象星座的领地，稳定厚重', 80),
('疾风星域', '风', '3,7,11', '风象星座的领地，自由灵动', 100),
('深水星域', '水', '4,8,12', '水象星座的领地，深邃神秘', 120),
('中央星域', NULL, NULL, '全服中心区域，稀有资源聚集地', 200),
('黑洞边缘', NULL, NULL, '特殊区域，高危高收益', 500);
```

### 7.2 galaxy_positions - 星系位置表
```sql
CREATE TABLE galaxy_positions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    galaxy_id BIGINT NOT NULL COMMENT '星系ID',
    region_id BIGINT NOT NULL COMMENT '星域ID',
    pos_x INT NOT NULL COMMENT 'X坐标',
    pos_y INT NOT NULL COMMENT 'Y坐标',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_galaxy_id (galaxy_id),
    KEY idx_region_id (region_id),
    KEY idx_position (pos_x, pos_y)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星系位置表';
```

### 7.3 map_resources - 地图资源点表
```sql
CREATE TABLE map_resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id BIGINT COMMENT '所属星域ID',
    resource_type TINYINT NOT NULL COMMENT '资源类型 1金币 2情绪 3装备碎片 4时空晶体',
    pos_x INT NOT NULL COMMENT 'X坐标',
    pos_y INT NOT NULL COMMENT 'Y坐标',
    amount INT NOT NULL COMMENT '资源数量',
    respawn_time INT DEFAULT 3600 COMMENT '刷新时间(秒)',
    last_collected_at DATETIME COMMENT '上次采集时间',
    collector_id BIGINT COMMENT '采集者ID',
    status TINYINT DEFAULT 1 COMMENT '状态 1可采集 2已采集',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY idx_region_id (region_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地图资源点表';
```

### 7.4 map_events - 地图事件表
```sql
CREATE TABLE map_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id BIGINT COMMENT '所属星域ID',
    event_type TINYINT NOT NULL COMMENT '事件类型 1资源刷新 2Boss出现 3时空裂缝',
    title VARCHAR(100) NOT NULL COMMENT '事件标题',
    description TEXT COMMENT '事件描述',
    pos_x INT COMMENT 'X坐标',
    pos_y INT COMMENT 'Y坐标',
    start_at DATETIME NOT NULL COMMENT '开始时间',
    end_at DATETIME COMMENT '结束时间',
    rewards JSON COMMENT '奖励',
    status TINYINT DEFAULT 1 COMMENT '状态 1进行中 2已结束',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_region_id (region_id),
    KEY idx_status (status),
    KEY idx_time (start_at, end_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='地图事件表';
```

---

## 八、占星学星座关系表（新增）

### 8.1 zodiac_oppositions - 对宫星座表
```sql
CREATE TABLE zodiac_oppositions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zodiac_a TINYINT NOT NULL COMMENT '星座A',
    zodiac_b TINYINT NOT NULL COMMENT '星座B',
    theme VARCHAR(50) COMMENT '关系主题',
    battle_bonus DECIMAL(5,2) DEFAULT 30.00 COMMENT '战斗伤害加成%',
    
    UNIQUE KEY uk_zodiac_pair (zodiac_a, zodiac_b)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对宫星座表';

-- 初始化数据
INSERT INTO zodiac_oppositions (zodiac_a, zodiac_b, theme, battle_bonus) VALUES
(1, 7, '自我vs他人', 30.00),  -- 白羊↔天秤
(2, 8, '物质vs情感', 30.00),  -- 金牛↔天蝎
(3, 9, '细节vs远景', 30.00),  -- 双子↔射手
(4, 10, '家庭vs事业', 30.00), -- 巨蟹↔摩羯
(5, 11, '个人vs群体', 30.00), -- 狮子↔水瓶
(6, 12, '现实vs理想', 30.00); -- 处女↔双鱼
```

### 8.2 zodiac_polarities - 星座极性表
```sql
CREATE TABLE zodiac_polarities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zodiac_sign TINYINT NOT NULL COMMENT '星座',
    polarity TINYINT NOT NULL COMMENT '极性 1主动 2固定 3变动',
    polarity_name VARCHAR(20) COMMENT '极性名称',
    
    UNIQUE KEY uk_zodiac (zodiac_sign)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星座极性表';

-- 初始化数据
INSERT INTO zodiac_polarities (zodiac_sign, polarity, polarity_name) VALUES
(1, 1, '主动'), (2, 2, '固定'), (3, 3, '变动'),
(4, 1, '主动'), (5, 2, '固定'), (6, 3, '变动'),
(7, 1, '主动'), (8, 2, '固定'), (9, 3, '变动'),
(10, 1, '主动'), (11, 2, '固定'), (12, 3, '变动');
```

---

**文档版本：** v2.0  
**更新日期：** 2026-03-09  
**作者：** 小科 🔬