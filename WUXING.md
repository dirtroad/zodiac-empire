# 星座帝国 - 五行系统设计

> 五行相生相克战斗系统 v1.0

---

## 一、五行系统概述

### 1.1 核心概念
玩家通过输入生辰八字确定五行主属性，装备和技能也附带五行属性，战斗时触发五行相生相克效果。

### 1.2 五行获取方式

```
玩家输入生日（年月日时）
    ↓
系统计算八字（天干地支）
    ↓
统计五行出现次数
    ↓
确定主属性（出现最多的五行）
```

---

## 二、五行对应关系

### 2.1 天干地支对应五行

| 天干 | 五行 | 地支 | 五行 |
|-----|------|-----|------|
| 甲、乙 | 木 | 寅、卯 | 木 |
| 丙、丁 | 火 | 巳、午 | 火 |
| 戊、己 | 土 | 辰、戌、丑、未 | 土 |
| 庚、辛 | 金 | 申、酉 | 金 |
| 壬、癸 | 水 | 亥、子 | 水 |

### 2.2 五行相生相克

```
相生（生助关系）：
木 → 火 → 土 → 金 → 水 → 木

相克（克制关系）：
木 → 土 → 水 → 火 → 金 → 木
```

**相生解释：**
- 木生火：木材燃烧生火
- 火生土：火烧成灰烬变土
- 土生金：矿藏孕育于土
- 金生水：金属冷凝成水
- 水生木：水滋润草木生长

**相克解释：**
- 木克土：根系破土而出
- 土克水：堤坝阻挡水流
- 水克火：水浇灭火焰
- 火克金：火焰熔化金属
- 金克木：斧锯砍伐树木

---

## 三、五行战斗系统

### 3.1 战斗系数

| 关系 | 攻击方系数 | 防御方系数 | 说明 |
|-----|----------|----------|------|
| 相克 | 1.30 | 0.80 | 木克土、土克水、水克火、火克金、金克木 |
| 相生 | 0.90 | 1.20 | 木生火、火生土、土生金、金生水、水生木 |
| 同行 | 1.00 | 1.00 | 同五行对战 |
| 被克 | 0.80 | 1.10 | 被对方五行克制 |

### 3.2 伤害计算公式

```
实际伤害 = 基础伤害 × 五行攻击系数 × 技能系数 × 暴击系数

防御减伤 = 防御力 × 五行防御系数

最终伤害 = 实际伤害 - 防御减伤
```

### 3.3 战斗示例

#### 示例1：相克战斗
```
攻击方：木属性（玩家A）
防御方：土属性（玩家B）
关系：木克土

攻击方伤害系数：1.30（+30%）
防御方防御系数：0.80（-20%）

基础伤害：1000
实际伤害：1000 × 1.30 = 1300
防御减伤：200 × 0.80 = 160
最终伤害：1300 - 160 = 1140
```

#### 示例2：相生战斗
```
攻击方：木属性（玩家A）
防御方：火属性（玩家B）
关系：木生火

攻击方伤害系数：0.90（-10%）
防御方防御系数：1.20（+20%）

基础伤害：1000
实际伤害：1000 × 0.90 = 900
防御减伤：200 × 1.20 = 240
最终伤害：900 - 240 = 660
```

#### 示例3：同行战斗
```
攻击方：火属性（玩家A）
防御方：火属性（玩家B）
关系：同行

攻击方伤害系数：1.00
防御方防御系数：1.00

基础伤害：1000
实际伤害：1000
防御减伤：200
最终伤害：800
```

---

## 四、五行技能系统

### 4.1 五行技能类型

| 五行 | 技能类型 | 特效 | 技能示例 |
|-----|---------|------|---------|
| 木 | 治疗、增益 | 持续恢复、成长 | 「生生不息」：每回合恢复5%生命 |
| 火 | 攻击、暴击 | 燃烧、爆发 | 「烈焰焚天」：造成150%伤害，附加燃烧 |
| 土 | 防御、控制 | 护盾、定身 | 「山岳屏障」：获得30%护盾，免疫控制 |
| 金 | 穿透、暴伤 | 破甲、斩杀 | 「破金斩」：无视50%防御，暴伤+50% |
| 水 | 治疗、净化 | 回复、解控 | 「清泉洗礼」：恢复20%生命，解除负面状态 |

### 4.2 五行技能伤害系数

```
五行技能伤害 = 基础伤害 × 五行技能系数 × 五行关系系数

五行技能系数：
- 木系技能：0.8（偏辅助）
- 火系技能：1.5（高爆发）
- 土系技能：0.6（偏防御）
- 金系技能：1.3（高穿透）
- 水系技能：0.9（均衡）
```

### 4.3 技能五行相生加成

```
使用与自身五行相生的技能，获得额外加成：

示例：
玩家五行：木
使用技能：火系技能「烈焰焚天」
关系：木生火

效果：技能伤害 +15%
```

---

## 五、五行装备系统

### 5.1 装备五行属性

| 装备类型 | 可附带五行 | 主属性加成 |
|---------|----------|----------|
| 武器 | 金、火、木 | 攻击力 +10-30% |
| 防具 | 土、水 | 防御力 +10-25% |
| 饰品 | 全五行 | 特殊效果 |

### 5.2 装备五行效果

```
装备五行与自身五行相生：
→ 装备属性 +20%

装备五行与自身五行相克：
→ 装备属性 -10%

装备五行与自身五行同行：
→ 装备属性 +10%
```

### 5.3 五行套装效果

| 套装 | 五行组合 | 套装效果 |
|-----|---------|---------|
| 生生套装 | 木+木+木 | 治疗+50%，每回合恢复10%生命 |
| 烈焰套装 | 火+火+火 | 攻击+30%，燃烧伤害+100% |
| 厚土套装 | 土+土+土 | 防御+40%，护盾+50% |
| 锐金套装 | 金+金+金 | 穿透+30%，暴伤+50% |
| 流水套装 | 水+水+水 | 治疗+30%，净化效果+100% |

---

## 六、五行与星座结合

### 6.1 星座元素与五行对应

```
火象星座（白羊、狮子、射手）→ 火属性技能加成 +10%
土象星座（金牛、处女、摩羯）→ 土属性技能加成 +10%
风象星座（双子、天秤、水瓶）→ 木属性技能加成 +10%
水象星座（巨蟹、天蝎、双鱼）→ 水属性技能加成 +10%
```

### 6.2 五行星座组合战斗

```
战斗时计算：
1. 玩家五行（生辰八字）
2. 装备五行
3. 技能五行
4. 星座元素加成

综合效果 = 五行关系系数 × 装备五行系数 × 技能五行系数 × 星座元素加成
```

**完整示例：**
```
玩家A：白羊座 + 火五行 + 火系武器 + 火系技能
vs
玩家B：金牛座 + 土五行 + 土系防具 + 土系技能

五行关系：火克土

攻击方（A）计算：
- 五行关系系数：1.30（相克）
- 装备五行系数：1.10（火武器与火五行同行）
- 技能五行系数：1.50（火系技能）
- 星座元素加成：1.10（白羊座火象）
攻击系数 = 1.30 × 1.10 × 1.50 × 1.10 = 2.36

防御方（B）计算：
- 五行关系系数：0.80（被克）
- 装备五行系数：1.20（土防具与土五行同行+20%）
- 技能五行系数：0.60（土系技能偏防御）
- 星座元素加成：1.10（金牛座土象）
防御系数 = 0.80 × 1.20 × 0.60 × 1.10 = 0.63

最终伤害倍率：2.36 × 0.63 = 1.49
结论：玩家A造成 +49% 伤害
```

---

## 七、五行算法实现

### 7.1 八字计算算法

```typescript
// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行
const TIAN_GAN_WUXING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

// 地支五行
const DI_ZHI_WUXING = {
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
};

// 计算五行主属性
function calculateWuxing(birthDate: Date): string {
    const bazi = calculateBazi(birthDate);
    
    const wuxingCount = {
        '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    // 统计天干五行
    wuxingCount[TIAN_GAN_WUXING[bazi.yearGan]]++;
    wuxingCount[TIAN_GAN_WUXING[bazi.monthGan]]++;
    wuxingCount[TIAN_GAN_WUXING[bazi.dayGan]]++;
    wuxingCount[TIAN_GAN_WUXING[bazi.hourGan]]++;
    
    // 统计地支五行
    wuxingCount[DI_ZHI_WUXING[bazi.yearZhi]]++;
    wuxingCount[DI_ZHI_WUXING[bazi.monthZhi]]++;
    wuxingCount[DI_ZHI_WUXING[bazi.dayZhi]]++;
    wuxingCount[DI_ZHI_WUXING[bazi.hourZhi]]++;
    
    // 返回出现最多的五行
    let maxWuxing = '木';
    let maxCount = 0;
    for (const [wuxing, count] of Object.entries(wuxingCount)) {
        if (count > maxCount) {
            maxCount = count;
            maxWuxing = wuxing;
        }
    }
    
    return maxWuxing;
}
```

### 7.2 五行关系查询

```typescript
// 五行相生相克关系
const WUXING_RELATIONS = {
    '木': { generates: '火', overcomes: '土' },
    '火': { generates: '土', overcomes: '金' },
    '土': { generates: '金', overcomes: '水' },
    '金': { generates: '水', overcomes: '木' },
    '水': { generates: '木', overcomes: '火' }
};

// 获取五行关系
function getWuxingRelation(attacker: string, defender: string): string {
    if (WUXING_RELATIONS[attacker].overcomes === defender) {
        return '相克';
    }
    if (WUXING_RELATIONS[attacker].generates === defender) {
        return '相生';
    }
    if (attacker === defender) {
        return '同行';
    }
    if (WUXING_RELATIONS[defender].overcomes === attacker) {
        return '被克';
    }
    return '无关';
}

// 获取战斗系数
function getBattleCoefficient(relation: string): { attack: number, defense: number } {
    const coefficients = {
        '相克': { attack: 1.30, defense: 0.80 },
        '相生': { attack: 0.90, defense: 1.20 },
        '同行': { attack: 1.00, defense: 1.00 },
        '被克': { attack: 0.80, defense: 1.10 },
        '无关': { attack: 1.00, defense: 1.00 }
    };
    return coefficients[relation];
}
```

---

## 八、数据库设计

### 8.1 用户五行表

```sql
CREATE TABLE user_wuxing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    birth_date DATETIME COMMENT '出生日期',
    bazi_json JSON COMMENT '八字数据',
    main_wuxing VARCHAR(10) COMMENT '主五行',
    wuxing_count JSON COMMENT '五行统计',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户五行表';
```

### 8.2 装备五行表

```sql
CREATE TABLE equipment_wuxing (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_id BIGINT NOT NULL COMMENT '装备ID',
    wuxing VARCHAR(10) NOT NULL COMMENT '五行属性',
    wuxing_bonus JSON COMMENT '五行加成',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    KEY idx_equipment_id (equipment_id),
    KEY idx_wuxing (wuxing)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='装备五行表';
```

---

**文档版本：** v1.0  
**创建日期：** 2026-03-09  
**作者：** 小科 🔬