# 星座帝国 - API接口设计文档

> RESTful API 接口规范 v1.0

---

## 一、接口规范

### 1.1 基础信息

| 项目 | 说明 |
|-----|------|
| 基础URL | `https://api.zodiac-empire.com/v1` |
| 协议 | HTTPS |
| 数据格式 | JSON |
| 编码 | UTF-8 |
| 时间格式 | ISO 8601 (`2024-01-01T12:00:00Z`) |

### 1.2 请求头

```
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <uuid>
X-Platform: wechat_miniapp
X-Version: 1.0.0
```

### 1.3 响应格式

#### 成功响应
```json
{
    "code": 0,
    "message": "success",
    "data": { ... },
    "timestamp": 1704067200000
}
```

#### 错误响应
```json
{
    "code": 10001,
    "message": "用户不存在",
    "data": null,
    "timestamp": 1704067200000
}
```

### 1.4 错误码定义

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 10001-10999 | 用户相关错误 |
| 20001-20999 | 游戏相关错误 |
| 30001-30999 | 经济相关错误 |
| 40001-40999 | 社交相关错误 |
| 50001-50999 | 系统错误 |

---

## 二、用户模块 API

### 2.1 微信登录

**POST** `/auth/wechat/login`

**请求参数：**
```json
{
    "code": "微信登录code",
    "encrypted_data": "加密数据",
    "iv": "初始向量"
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
        "expires_in": 7200,
        "user": {
            "id": 10001,
            "nickname": "星际旅行者",
            "avatar_url": "https://...",
            "level": 1,
            "power": 100
        },
        "is_new_user": true
    }
}
```

### 2.2 获取用户信息

**GET** `/users/{user_id}`

**响应：**
```json
{
    "code": 0,
    "data": {
        "id": 10001,
        "nickname": "星际旅行者",
        "avatar_url": "https://...",
        "level": 5,
        "exp": 1250,
        "exp_to_next": 2000,
        "power": 1500,
        "gold": 10000,
        "diamond": 50,
        "time_coin": 500,
        "vip_level": 0,
        "vip_expire_at": null,
        "shield_until": null,
        "zodiac": {
            "sign": 1,
            "name": "白羊座",
            "element": "火",
            "region_name": "烈焰星域",
            "bonus": {
                "power_bonus": 5.0
            }
        },
        "stats": {
            "total_battles": 50,
            "total_wins": 35,
            "win_rate": 70.0,
            "total_trades": 20
        },
        "created_at": "2024-01-01T12:00:00Z"
    }
}
```

### 2.3 更新用户资料

**PUT** `/users/{user_id}/profile`

**请求参数：**
```json
{
    "nickname": "新昵称",
    "bio": "个人简介",
    "zodiac_sign": 1
}
```

### 2.4 获取用户星座信息

**GET** `/users/{user_id}/zodiac`

**响应：**
```json
{
    "code": 0,
    "data": {
        "sign": 1,
        "name": "白羊座",
        "element": "火",
        "region": {
            "name": "烈焰星域",
            "resource_bonus": "激情、攻击",
            "bonuses": {
                "power_bonus": 5.0
            }
        },
        "best_match": ["狮子座"],
        "good_match": ["射手座"],
        "daily_fortune": {
            "date": "2024-01-01",
            "luck_score": 85,
            "fortune_text": "今日运势旺盛...",
            "bonus": {
                "power_bonus": 10.0
            }
        }
    }
}
```

---

## 三、星系模块 API

### 3.1 获取用户星系列表

**GET** `/users/{user_id}/galaxies`

**响应：**
```json
{
    "code": 0,
    "data": {
        "galaxies": [
            {
                "id": 1,
                "name": "烈焰主星",
                "type": 1,
                "type_name": "快乐星系",
                "rarity": 1,
                "size": 3,
                "level": 2,
                "base_production": 150.5,
                "defense_power": 500,
                "is_main": true,
                "buildings": [
                    {
                        "id": 1,
                        "type": 1,
                        "type_name": "情绪工厂",
                        "level": 2,
                        "production_rate": 50.0
                    }
                ],
                "resources": {
                    "happiness": 100,
                    "gold": 500
                }
            }
        ],
        "total": 3
    }
}
```

### 3.2 获取星系详情

**GET** `/galaxies/{galaxy_id}`

### 3.3 建设星系建筑

**POST** `/galaxies/{galaxy_id}/buildings`

**请求参数：**
```json
{
    "building_type": 1,
    "position": {"x": 100, "y": 200}
}
```

### 3.4 升级星系建筑

**PUT** `/galaxies/{galaxy_id}/buildings/{building_id}/upgrade`

### 3.5 收取星系资源

**POST** `/galaxies/{galaxy_id}/collect`

**响应：**
```json
{
    "code": 0,
    "data": {
        "resources": {
            "happiness": 50,
            "gold": 200
        },
        "bonus": {
            "zodiac_bonus": 5.0
        }
    }
}
```

---

## 四、装备模块 API

### 4.1 获取用户装备列表

**GET** `/users/{user_id}/equipments`

**查询参数：**
- `type`: 装备类型（可选）
- `rarity`: 稀有度（可选）
- `equipped`: 是否已装备（可选）

**响应：**
```json
{
    "code": 0,
    "data": {
        "equipments": [
            {
                "id": 1,
                "equipment_id": 101,
                "name": "火焰引擎",
                "type": 1,
                "type_name": "情绪引擎",
                "rarity": 2,
                "rarity_name": "稀有",
                "level": 1,
                "current_power": 30,
                "attack_bonus": 10,
                "defense_bonus": 5,
                "special_effect": "提升激情采集效率10%",
                "is_equipped": true,
                "equipped_slot": 1,
                "icon_url": "https://..."
            }
        ],
        "total": 15
    }
}
```

### 4.2 装备详情

**GET** `/user-equipments/{user_equipment_id}`

### 4.3 装备装备/卸下

**POST** `/user-equipments/{user_equipment_id}/equip`

**请求参数：**
```json
{
    "slot": 1
}
```

**POST** `/user-equipments/{user_equipment_id}/unequip`

### 4.4 装备合成

**POST** `/equipments/synthesize`

**请求参数：**
```json
{
    "equipment_ids": [1, 2, 3],
    "use_catalyst": true,
    "use_protection": false
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "success": true,
        "output_equipment": {
            "id": 4,
            "name": "烈焰之心",
            "rarity": 3,
            "rarity_name": "史诗",
            "current_power": 100
        },
        "consumed": {
            "equipments": [1, 2, 3],
            "catalyst": 1
        }
    }
}
```

### 4.5 装备强化

**POST** `/user-equipments/{user_equipment_id}/enhance`

**请求参数：**
```json
{
    "materials": [
        {"type": "gold", "amount": 1000},
        {"type": "emotion", "emotion_type": 1, "amount": 50}
    ]
}
```

---

## 五、情绪模块 API

### 5.1 获取用户情绪资源

**GET** `/users/{user_id}/emotions`

**响应：**
```json
{
    "code": 0,
    "data": {
        "emotions": [
            {
                "type": 1,
                "name": "快乐",
                "amount": 500,
                "daily_production": 50.5,
                "can_collect": true,
                "collect_amount": 25
            },
            {
                "type": 3,
                "name": "激情",
                "amount": 200,
                "daily_production": 30.0,
                "can_collect": false
            }
        ]
    }
}
```

### 5.2 收取情绪资源

**POST** `/users/{user_id}/emotions/{emotion_type}/collect`

---

## 六、情绪卡片模块 API

### 6.1 上传情绪卡片

**POST** `/emotion-cards`

**请求参数（multipart/form-data）：**
```
file: 图片/视频文件
title: 卡片标题
emotion_type: 情绪类型（可选，AI自动识别）
is_anonymous: 是否匿名
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "card_id": 1,
        "content_url": "https://...",
        "thumbnail_url": "https://...",
        "emotion_type": 1,
        "emotion_name": "快乐",
        "emotion_confidence": 0.92,
        "status": 1,
        "message": "卡片已提交审核"
    }
}
```

### 6.2 获取情绪卡片列表

**GET** `/emotion-cards`

**查询参数：**
- `emotion_type`: 情绪类型（可选）
- `order_by`: 排序方式（popularity/newest）
- `page`: 页码
- `page_size`: 每页数量

**响应：**
```json
{
    "code": 0,
    "data": {
        "cards": [
            {
                "id": 1,
                "user": {
                    "id": 10001,
                    "nickname": "星际旅行者",
                    "avatar_url": "https://..."
                },
                "title": "今天的快乐时刻",
                "content_type": 1,
                "content_url": "https://...",
                "thumbnail_url": "https://...",
                "emotion_type": 1,
                "emotion_name": "快乐",
                "popularity": 156,
                "popularity_level": 2,
                "popularity_level_name": "热门",
                "view_count": 1200,
                "is_anonymous": false,
                "is_liked": false,
                "is_collected": false,
                "created_at": "2024-01-01T12:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total": 100,
            "total_pages": 5
        }
    }
}
```

### 6.3 获取情绪卡片详情

**GET** `/emotion-cards/{card_id}`

### 6.4 点赞情绪卡片

**POST** `/emotion-cards/{card_id}/like`

**响应：**
```json
{
    "code": 0,
    "data": {
        "popularity": 157,
        "reward": {
            "time_coin": 5,
            "friendship_point": 1
        }
    }
}
```

### 6.5 取消点赞

**DELETE** `/emotion-cards/{card_id}/like`

### 6.6 收藏情绪卡片

**POST** `/emotion-cards/{card_id}/collect`

### 6.7 取消收藏

**DELETE** `/emotion-cards/{card_id}/collect`

### 6.8 领取卡片人气奖励

**POST** `/emotion-cards/{card_id}/claim-reward`

**响应：**
```json
{
    "code": 0,
    "data": {
        "popularity": 500,
        "popularity_level": 3,
        "reward": {
            "emotion_type": 1,
            "amount": 200,
            "rare_fragment": 1
        }
    }
}
```

### 6.9 获取我上传的卡片

**GET** `/users/{user_id}/emotion-cards`

### 6.10 获取我收藏的卡片

**GET** `/users/{user_id}/emotion-card-collections`

---

## 七、时间银行模块 API

### 7.1 获取时间账户信息

**GET** `/users/{user_id}/time-account`

**响应：**
```json
{
    "code": 0,
    "data": {
        "balance": 1000,
        "deposited": 500,
        "interest_rate": 0.05,
        "total_interest": 50,
        "loan_balance": 0,
        "credit_limit": 2000,
        "credit_score": 600,
        "frozen_amount": 0,
        "next_interest_at": "2024-01-02T00:00:00Z"
    }
}
```

### 7.2 存入时间币

**POST** `/users/{user_id}/time-account/deposit`

**请求参数：**
```json
{
    "amount": 500
}
```

### 7.3 取出时间币

**POST** `/users/{user_id}/time-account/withdraw`

**请求参数：**
```json
{
    "amount": 200
}
```

### 7.4 申请贷款

**POST** `/time-loans`

**请求参数：**
```json
{
    "amount": 1000,
    "duration_days": 7,
    "guarantor_id": 10002
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "loan_id": 1,
        "amount": 1000,
        "interest_rate": 0.08,
        "total_repay": 1560,
        "due_at": "2024-01-08T12:00:00Z",
        "guarantor_fee": 50,
        "status": "pending_guarantor"
    }
}
```

### 7.5 获取我的贷款列表

**GET** `/users/{user_id}/time-loans`

**查询参数：**
- `status`: 贷款状态（进行中/已还清/逾期）

### 7.6 还款

**POST** `/time-loans/{loan_id}/repay`

**请求参数：**
```json
{
    "amount": 500
}
```

### 7.7 担保贷款

**POST** `/time-loans/{loan_id}/guarantee`

### 7.8 时间投资

**POST** `/time-investments`

**请求参数：**
```json
{
    "project_user_id": 10002,
    "project_type": 1,
    "project_id": 5,
    "amount": 200,
    "share_ratio": 10.0
}
```

### 7.9 获取我的投资列表

**GET** `/users/{user_id}/time-investments`

---

## 八、星际航道模块 API

### 8.1 获取好友航道列表

**GET** `/users/{user_id}/routes`

**响应：**
```json
{
    "code": 0,
    "data": {
        "routes": [
            {
                "id": 1,
                "friend": {
                    "id": 10002,
                    "nickname": "星尘",
                    "avatar_url": "https://...",
                    "zodiac": {
                        "sign": 5,
                        "name": "狮子座"
                    }
                },
                "route_level": 2,
                "route_level_name": "曲速航道",
                "flow": 150,
                "trade_bonus": 20.0,
                "zodiac_match_score": 95,
                "zodiac_match_level": "最佳匹配",
                "last_interact_at": "2024-01-01T10:00:00Z"
            }
        ],
        "total": 10
    }
}
```

### 8.2 增加航道流量

**POST** `/routes/{route_id}/flow`

**请求参数：**
```json
{
    "flow_type": 1,
    "flow_value": 10
}
```

### 8.3 升级航道

**POST** `/routes/{route_id}/upgrade`

---

## 九、战斗模块 API

### 9.1 获取可攻击目标列表

**GET** `/users/{user_id}/attack-targets`

**查询参数：**
- `type`: 目标类型（好友/附近/复仇）

**响应：**
```json
{
    "code": 0,
    "data": {
        "targets": [
            {
                "user_id": 10002,
                "nickname": "星尘",
                "avatar_url": "https://...",
                "level": 5,
                "power": 1200,
                "galaxy_count": 3,
                "has_shield": false,
                "can_attack": true,
                "zodiac_match": {
                    "sign": 5,
                    "match_level": "最佳匹配"
                }
            }
        ]
    }
}
```

### 9.2 发起攻击

**POST** `/battles`

**请求参数：**
```json
{
    "defender_id": 10002,
    "battle_type": 1
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "battle_id": 1,
        "attacker_power": 1500,
        "defender_power": 1200,
        "winner_id": 10001,
        "is_win": true,
        "battle_duration": 15,
        "reward_options": [
            {"type": "galaxy", "id": 5, "name": "翡翠卫星"},
            {"type": "equipment", "id": 10, "name": "时间碎片"},
            {"type": "resource", "gold": 500, "emotions": [{"type": 1, "amount": 50}]}
        ]
    }
}
```

### 9.3 选择战斗奖励

**POST** `/battles/{battle_id}/select-reward`

**请求参数：**
```json
{
    "reward_index": 0
}
```

### 9.4 获取战斗记录

**GET** `/users/{user_id}/battles`

**查询参数：**
- `type`: 战斗类型（进攻/防守）
- `page`: 页码
- `page_size`: 每页数量

### 9.5 获取战斗详情

**GET** `/battles/{battle_id}`

### 9.6 发起复仇

**POST** `/battles/{battle_id}/revenge`

---

## 十、贸易模块 API

### 10.1 获取市场挂单列表

**GET** `/market/listings`

**查询参数：**
- `item_type`: 物品类型
- `rarity`: 稀有度
- `order_by`: 排序方式（price/created_at）
- `page`: 页码
- `page_size`: 每页数量

### 10.2 创建市场挂单

**POST** `/market/listings`

**请求参数：**
```json
{
    "item_type": 2,
    "item_id": 10,
    "quantity": 1,
    "price": 5000,
    "currency": 1,
    "listing_type": 1
}
```

### 10.3 获取挂单详情

**GET** `/market/listings/{listing_id}`

### 10.4 购买挂单

**POST** `/market/listings/{listing_id}/buy`

### 10.5 取消挂单

**DELETE** `/market/listings/{listing_id}`

### 10.6 获取我的挂单

**GET** `/users/{user_id}/market-listings`

### 10.7 好友交易

**POST** `/trades/friend`

**请求参数：**
```json
{
    "friend_id": 10002,
    "offer_items": [
        {"type": "equipment", "id": 10, "quantity": 1}
    ],
    "request_items": [
        {"type": "emotion", "emotion_type": 1, "quantity": 100}
    ]
}
```

### 10.8 获取情绪交易所价格

**GET** `/emotion-exchange/prices`

**响应：**
```json
{
    "code": 0,
    "data": {
        "prices": [
            {
                "emotion_type": 1,
                "emotion_name": "快乐",
                "base_price": 100.0,
                "current_price": 120.5,
                "daily_change": 5.2,
                "daily_high": 125.0,
                "daily_low": 115.0
            }
        ]
    }
}
```

### 10.9 购买情绪

**POST** `/emotion-exchange/buy`

**请求参数：**
```json
{
    "emotion_type": 1,
    "amount": 100,
    "max_price": 130.0
}
```

### 10.10 出售情绪

**POST** `/emotion-exchange/sell`

**请求参数：**
```json
{
    "emotion_type": 1,
    "amount": 50,
    "min_price": 110.0
}
```

---

## 十一、联盟模块 API

### 11.1 获取联盟列表

**GET** `/alliances`

**查询参数：**
- `zodiac`: 星座筛选
- `order_by`: 排序方式（power/members）
- `page`: 页码
- `page_size`: 每页数量

### 11.2 创建联盟

**POST** `/alliances`

**请求参数：**
```json
{
    "name": "烈焰军团",
    "description": "火象星座联盟",
    "badge_url": "https://...",
    "zodiac_requirement": 1,
    "join_type": 2,
    "min_level": 5
}
```

### 11.3 获取联盟详情

**GET** `/alliances/{alliance_id}`

### 11.4 加入联盟

**POST** `/alliances/{alliance_id}/join`

### 11.5 退出联盟

**POST** `/alliances/{alliance_id}/leave`

### 11.6 获取联盟成员

**GET** `/alliances/{alliance_id}/members`

### 11.7 踢出成员

**POST** `/alliances/{alliance_id}/members/{user_id}/kick`

### 11.8 获取我的联盟

**GET** `/users/{user_id}/alliance`

---

## 十二、战队模块 API（新增）

### 12.1 获取战队列表

**GET** `/teams`

**查询参数：**
- `order_by`: 排序方式（rank/score/power）
- `page`: 页码
- `page_size`: 每页数量

**响应：**
```json
{
    "code": 0,
    "data": {
        "teams": [
            {
                "id": 1,
                "name": "烈焰战队",
                "leader": {
                    "id": 10001,
                    "nickname": "星际旅行者",
                    "zodiac": {"sign": 1, "name": "白羊座"}
                },
                "level": 3,
                "member_count": 5,
                "max_members": 5,
                "total_power": 15000,
                "match_bonus": 12.5,
                "score": 2500,
                "rank": 15,
                "wins": 45,
                "losses": 12
            }
        ],
        "pagination": {
            "page": 1,
            "page_size": 20,
            "total": 100
        }
    }
}
```

### 12.2 创建战队

**POST** `/teams`

**请求参数：**
```json
{
    "name": "烈焰战队",
    "description": "最佳匹配阵容",
    "badge_url": "https://..."
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "team_id": 1,
        "name": "烈焰战队",
        "leader_id": 10001,
        "max_members": 5,
        "message": "战队创建成功"
    }
}
```

### 12.3 获取战队详情

**GET** `/teams/{team_id}`

**响应：**
```json
{
    "code": 0,
    "data": {
        "id": 1,
        "name": "烈焰战队",
        "leader": {
            "id": 10001,
            "nickname": "星际旅行者",
            "zodiac": {"sign": 1, "name": "白羊座"},
            "power": 3500
        },
        "members": [
            {
                "id": 10002,
                "nickname": "星尘",
                "zodiac": {"sign": 5, "name": "狮子座"},
                "power": 3200,
                "match_with_leader": "良好匹配",
                "join_at": "2024-01-01T12:00:00Z"
            }
        ],
        "level": 3,
        "total_power": 15000,
        "match_bonus": 12.5,
        "match_analysis": {
            "best_match_count": 4,
            "good_match_count": 3,
            "normal_match_count": 3,
            "total_pairs": 10
        },
        "score": 2500,
        "rank": 15,
        "weekly_battles": 2,
        "max_weekly_battles": 3
    }
}
```

### 12.4 加入战队

**POST** `/teams/{team_id}/join`

**响应：**
```json
{
    "code": 0,
    "data": {
        "team_id": 1,
        "message": "加入成功",
        "match_info": {
            "your_zodiac": "白羊座",
            "match_bonus_contribution": "+8%"
        }
    }
}
```

### 12.5 退出战队

**POST** `/teams/{team_id}/leave`

### 12.6 踢出成员

**POST** `/teams/{team_id}/members/{user_id}/kick`

**请求参数：**
```json
{
    "reason": "长期不活跃"
}
```

### 12.7 获取推荐队友

**GET** `/teams/recommend-members`

**响应：**
```json
{
    "code": 0,
    "data": {
        "recommendations": [
            {
                "user": {
                    "id": 10005,
                    "nickname": "流星",
                    "zodiac": {"sign": 9, "name": "射手座"},
                    "power": 2800,
                    "level": 8
                },
                "match_level": "最佳匹配",
                "match_bonus": "+20%",
                "priority": 1
            }
        ],
        "your_zodiac": {"sign": 1, "name": "白羊座"},
        "best_match_zodiacs": ["双子座", "天秤座", "水瓶座"]
    }
}
```

### 12.8 战队匹配

**POST** `/teams/{team_id}/match`

**请求参数：**
```json
{
    "mode": "auto"
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "matched_team": {
            "id": 2,
            "name": "风暴战队",
            "total_power": 14500,
            "member_count": 5
        },
        "power_comparison": {
            "your_team": 15000,
            "enemy_team": 14500,
            "advantage": "slight"
        },
        "can_start": true
    }
}
```

### 12.9 发起战队战斗

**POST** `/teams/{team_id}/battle`

**请求参数：**
```json
{
    "defender_team_id": 2
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "battle_id": 1,
        "attacker_team": {
            "id": 1,
            "name": "烈焰战队",
            "total_power": 15000,
            "match_bonus": 12.5
        },
        "defender_team": {
            "id": 2,
            "name": "风暴战队",
            "total_power": 14500,
            "match_bonus": 8.0
        },
        "winner_team_id": 1,
        "rounds": [...],
        "score_change": {
            "attacker": +50,
            "defender": -30
        },
        "rewards": {
            "gold": 2000,
            "honor": 100,
            "team_points": 50
        }
    }
}
```

### 12.10 获取战队战斗记录

**GET** `/teams/{team_id}/battles`

**查询参数：**
- `page`: 页码
- `page_size`: 每页数量

### 12.11 获取我的战队

**GET** `/users/{user_id}/team`

### 12.12 战队商店

**GET** `/teams/{team_id}/shop`

**响应：**
```json
{
    "code": 0,
    "data": {
        "items": [
            {
                "id": 1,
                "name": "稀有装备箱",
                "type": "equipment_box",
                "cost": 100,
                "description": "开启获得稀有装备"
            }
        ],
        "team_points": 500
    }
}
```

### 12.13 兑换战队商店物品

**POST** `/teams/{team_id}/shop/{item_id}/purchase`

---

## 十三、星座匹配 API（新增）

### 13.1 查询星座匹配度

**GET** `/zodiac/match`

**查询参数：**
- `zodiac_a`: 星座A（1-12）
- `zodiac_b`: 星座B（1-12）

**响应：**
```json
{
    "code": 0,
    "data": {
        "zodiac_a": {"sign": 1, "name": "白羊座", "element": "火"},
        "zodiac_b": {"sign": 3, "name": "双子座", "element": "风"},
        "match_level": "最佳匹配",
        "match_level_id": 3,
        "power_bonus": 20.0,
        "trade_bonus": 20.0,
        "description": "火象与风象的最佳组合，相辅相成"
    }
}
```

### 13.2 获取最佳匹配星座列表

**GET** `/zodiac/{sign}/best-matches`

**响应：**
```json
{
    "code": 0,
    "data": {
        "zodiac": {"sign": 1, "name": "白羊座", "element": "火"},
        "best_matches": [
            {"sign": 3, "name": "双子座", "element": "风"},
            {"sign": 7, "name": "天秤座", "element": "风"},
            {"sign": 11, "name": "水瓶座", "element": "风"}
        ],
        "good_matches": [
            {"sign": 5, "name": "狮子座", "element": "火"},
            {"sign": 9, "name": "射手座", "element": "火"}
        ]
    }
}
```

### 13.3 计算团队匹配加成

**POST** `/zodiac/calculate-team-bonus`

**请求参数：**
```json
{
    "zodiacs": [1, 3, 5, 7, 9]
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "total_bonus": 12.5,
        "match_analysis": {
            "total_pairs": 10,
            "best_match_pairs": 4,
            "good_match_pairs": 3,
            "normal_match_pairs": 3
        },
        "details": [
            {"pair": [1, 3], "level": "最佳匹配", "bonus": 20.0},
            {"pair": [1, 5], "level": "良好匹配", "bonus": 10.0}
        ]
    }
}
```

---

## 十四、排行榜模块 API

### 12.1 获取战力排行榜

**GET** `/leaderboard/power`

**查询参数：**
- `scope`: 范围（all/friends/alliance）
- `page`: 页码
- `page_size`: 每页数量

**响应：**
```json
{
    "code": 0,
    "data": {
        "rankings": [
            {
                "rank": 1,
                "user": {
                    "id": 10001,
                    "nickname": "星际旅行者",
                    "avatar_url": "https://...",
                    "level": 50,
                    "zodiac": {"sign": 1, "name": "白羊座"}
                },
                "power": 50000,
                "is_me": false
            }
        ],
        "my_rank": {
            "rank": 15,
            "power": 1500
        },
        "pagination": {
            "page": 1,
            "page_size": 50,
            "total": 10000
        }
    }
}
```

### 12.2 获取财富排行榜

**GET** `/leaderboard/wealth`

### 12.3 获取情绪卡片人气榜

**GET** `/leaderboard/emotion-cards`

**查询参数：**
- `period`: 时间范围（daily/weekly/monthly）

---

## 十三、WebSocket 事件

### 13.1 连接

```
wss://api.zodiac-empire.com/ws?token=<access_token>
```

### 13.2 事件类型

| 事件 | 说明 | 数据 |
|-----|------|------|
| `user.online` | 用户上线 | `{user_id}` |
| `user.offline` | 用户离线 | `{user_id}` |
| `battle.start` | 战斗开始 | `{battle_id, attacker_id, defender_id}` |
| `battle.end` | 战斗结束 | `{battle_id, winner_id}` |
| `emotion.price.update` | 情绪价格更新 | `{emotion_type, price}` |
| `card.popularity.update` | 卡片人气更新 | `{card_id, popularity}` |
| `trade.success` | 交易成功 | `{trade_id, item_type, price}` |
| `loan.due.remind` | 贷款到期提醒 | `{loan_id, due_at}` |
| `attack.alert` | 被攻击提醒 | `{attacker_id, galaxy_id}` |
| `friend.interact` | 好友互动 | `{friend_id, interact_type}` |

---

## 十四、签名与安全

### 14.1 请求签名

```
签名字符串 = METHOD + URL + TIMESTAMP + NONCE + BODY
签名 = HMAC-SHA256(签名字符串, app_secret)
```

**请求头：**
```
X-Timestamp: 1704067200
X-Nonce: abc123
X-Signature: a1b2c3d4...
```

### 14.2 频率限制

| 接口类型 | 限制 |
|---------|------|
| 普通接口 | 100次/分钟 |
| 战斗接口 | 10次/分钟 |
| 交易接口 | 30次/分钟 |
| 上传接口 | 10次/小时 |

---

## 十五、五行模块 API（新增）

### 15.1 获取用户五行信息

**GET** `/users/{user_id}/wuxing`

**响应：**
```json
{
    "code": 0,
    "data": {
        "main_wuxing": "火",
        "bazi": {
            "year": "甲子",
            "month": "乙丑",
            "day": "丙寅",
            "hour": "丁卯"
        },
        "wuxing_count": {
            "木": 2,
            "火": 3,
            "土": 1,
            "金": 1,
            "水": 1
        }
    }
}
```

### 15.2 计算用户五行

**POST** `/wuxing/calculate`

**请求参数：**
```json
{
    "birth_date": "1990-03-15",
    "birth_time": "10:00:00"
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "main_wuxing": "火",
        "bazi": {...},
        "wuxing_count": {...}
    }
}
```

### 15.3 获取五行关系

**GET** `/wuxing/relation`

**查询参数：**
- `wuxing_a`: 五行A
- `wuxing_b`: 五行B

**响应：**
```json
{
    "code": 0,
    "data": {
        "relation": "相克",
        "attack_coefficient": 1.30,
        "defense_coefficient": 0.80
    }
}
```

### 15.4 获取五行技能列表

**GET** `/wuxing/skills`

**查询参数：**
- `wuxing`: 五行属性（可选）

### 15.5 获取装备五行信息

**GET** `/equipments/{equipment_id}/wuxing`

---

## 十六、时空晶体模块 API（新增）

### 16.1 获取时空晶体账户

**GET** `/users/{user_id}/space-time-crystals`

**响应：**
```json
{
    "code": 0,
    "data": {
        "balance": 1500,
        "deposited": 500,
        "interest_rate": 0.05,
        "loan_balance": 0,
        "credit_score": 600
    }
}
```

### 16.2 存入时空晶体

**POST** `/users/{user_id}/space-time-crystals/deposit`

**请求参数：**
```json
{
    "amount": 500
}
```

### 16.3 取出时空晶体

**POST** `/users/{user_id}/space-time-crystals/withdraw`

### 16.4 申请贷款

**POST** `/space-time-loans`

### 16.5 时空穿梭

**POST** `/space-time/teleport`

**请求参数：**
```json
{
    "target_region": "风象星域"
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "from_region": "火象星域",
        "to_region": "风象星域",
        "cost": 100,
        "remaining_crystals": 1400
    }
}
```

### 16.6 使用时空技能

**POST** `/space-time/skills`

**请求参数：**
```json
{
    "skill_type": 1,
    "target_id": 123
}
```

### 16.7 星座匹配搜索

**POST** `/zodiac/search`

**请求参数：**
```json
{
    "search_type": 1,
    "filters": {
        "min_power": 1000,
        "max_power": 5000,
        "online_only": true
    }
}
```

**响应：**
```json
{
    "code": 0,
    "data": {
        "results": [
            {
                "user": {
                    "id": 10005,
                    "nickname": "流星",
                    "zodiac": {"sign": 3, "name": "双子座"},
                    "power": 2800
                },
                "match_level": "最佳匹配",
                "match_bonus": 20.0
            }
        ],
        "cost": 30,
        "remaining_crystals": 1370
    }
}
```

---

## 十七、地图模块 API（新增）

### 17.1 获取星际大地图

**GET** `/map/universe`

**查询参数：**
- `region_id`: 星域ID（可选）

**响应：**
```json
{
    "code": 0,
    "data": {
        "regions": [
            {
                "id": 1,
                "name": "烈焰星域",
                "element": "火",
                "center_x": 100,
                "center_y": 100,
                "player_count": 1500
            }
        ],
        "players": [
            {
                "id": 10001,
                "nickname": "星际旅行者",
                "pos_x": 120,
                "pos_y": 95,
                "zodiac": {"sign": 1, "name": "白羊座"}
            }
        ],
        "resources": [
            {
                "id": 1,
                "type": "金币",
                "pos_x": 150,
                "pos_y": 110,
                "amount": 500,
                "status": 1
            }
        ]
    }
}
```

### 17.2 获取星域详情

**GET** `/map/regions/{region_id}`

### 17.3 获取星域资源点

**GET** `/map/regions/{region_id}/resources`

### 17.4 采集地图资源

**POST** `/map/resources/{resource_id}/collect`

### 17.5 获取地图事件

**GET** `/map/events`

**查询参数：**
- `region_id`: 星域ID（可选）
- `status`: 事件状态（可选）

### 17.6 参与地图事件

**POST** `/map/events/{event_id}/participate`

---

## 十八、占星学星座关系 API（新增）

### 18.1 获取对宫星座信息

**GET** `/zodiac/oppositions/{sign}`

**响应：**
```json
{
    "code": 0,
    "data": {
        "your_sign": {"sign": 1, "name": "白羊座"},
        "opposite_sign": {"sign": 7, "name": "天秤座"},
        "theme": "自我vs他人",
        "battle_bonus": 30.0
    }
}
```

### 18.2 获取星座极性信息

**GET** `/zodiac/polarities/{sign}`

**响应：**
```json
{
    "code": 0,
    "data": {
        "sign": {"sign": 1, "name": "白羊座"},
        "polarity": "主动",
        "polarity_id": 1,
        "description": "发起、推动、领导"
    }
}
```

### 18.3 获取元素相生关系

**GET** `/zodiac/element-relations`

**响应：**
```json
{
    "code": 0,
    "data": {
        "relations": [
            {
                "from": "风",
                "to": "火",
                "type": "相生",
                "team_bonus": 15.0,
                "description": "风助火燃"
            }
        ]
    }
}
```

---

**文档版本：** v2.0  
**更新日期：** 2026-03-09  
**作者：** 小科 🔬