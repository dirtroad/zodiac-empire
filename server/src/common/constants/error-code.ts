// 统一错误码定义
export enum ErrorCode {
    // 通用错误 1-99
    SUCCESS = 0,
    UNKNOWN_ERROR = 1,
    INVALID_PARAM = 2,
    NOT_FOUND = 3,
    PERMISSION_DENIED = 4,
    
    // 认证错误 100-199
    UNAUTHORIZED = 100,
    TOKEN_EXPIRED = 101,
    TOKEN_INVALID = 102,
    LOGIN_FAILED = 103,
    WECHAT_LOGIN_FAILED = 104,
    
    // 用户错误 200-299
    USER_NOT_FOUND = 200,
    USER_BANNED = 201,
    USER_ALREADY_EXISTS = 202,
    
    // 资源错误 300-399
    GOLD_NOT_ENOUGH = 300,
    DIAMOND_NOT_ENOUGH = 301,
    CRYSTAL_NOT_ENOUGH = 302,
    
    // 星系错误 400-499
    GALAXY_NOT_FOUND = 400,
    GALAXY_LIMIT_REACHED = 401,
    
    // 装备错误 500-599
    EQUIPMENT_NOT_FOUND = 500,
    EQUIPMENT_ALREADY_EQUIPPED = 501,
    EQUIPMENT_SLOT_OCCUPIED = 502,
    
    // 战斗错误 600-699
    TARGET_NOT_FOUND = 600,
    TARGET_HAS_SHIELD = 601,
    BATTLE_COOLDOWN = 602,
    
    // 战队错误 700-799
    TEAM_NOT_FOUND = 700,
    TEAM_FULL = 701,
    ALREADY_IN_TEAM = 702,
    NOT_TEAM_LEADER = 703,
    
    // 市场错误 800-899
    LISTING_NOT_FOUND = 800,
    LISTING_SOLD = 801,
    LISTING_CANCELLED = 802,
    CANNOT_BUY_OWN_ITEM = 803,
    TOO_MANY_LISTINGS = 804,
}

// 错误消息映射
export const ErrorMessages: Record<number, string> = {
    [ErrorCode.SUCCESS]: '成功',
    [ErrorCode.UNKNOWN_ERROR]: '未知错误',
    [ErrorCode.INVALID_PARAM]: '参数错误',
    [ErrorCode.NOT_FOUND]: '资源不存在',
    [ErrorCode.PERMISSION_DENIED]: '权限不足',
    
    [ErrorCode.UNAUTHORIZED]: '未登录',
    [ErrorCode.TOKEN_EXPIRED]: '登录已过期，请重新登录',
    [ErrorCode.TOKEN_INVALID]: '登录状态无效',
    [ErrorCode.LOGIN_FAILED]: '登录失败',
    [ErrorCode.WECHAT_LOGIN_FAILED]: '微信登录失败',
    
    [ErrorCode.USER_NOT_FOUND]: '用户不存在',
    [ErrorCode.USER_BANNED]: '账号已被封禁',
    [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
    
    [ErrorCode.GOLD_NOT_ENOUGH]: '金币不足',
    [ErrorCode.DIAMOND_NOT_ENOUGH]: '钻石不足',
    [ErrorCode.CRYSTAL_NOT_ENOUGH]: '时空晶体不足',
    
    [ErrorCode.GALAXY_NOT_FOUND]: '星系不存在',
    [ErrorCode.GALAXY_LIMIT_REACHED]: '星系数量已达上限',
    
    [ErrorCode.EQUIPMENT_NOT_FOUND]: '装备不存在',
    [ErrorCode.EQUIPMENT_ALREADY_EQUIPPED]: '装备已穿戴',
    [ErrorCode.EQUIPMENT_SLOT_OCCUPIED]: '该槽位已有装备',
    
    [ErrorCode.TARGET_NOT_FOUND]: '目标不存在',
    [ErrorCode.TARGET_HAS_SHIELD]: '目标有护盾保护',
    [ErrorCode.BATTLE_COOLDOWN]: '战斗冷却中',
    
    [ErrorCode.TEAM_NOT_FOUND]: '战队不存在',
    [ErrorCode.TEAM_FULL]: '战队成员已满',
    [ErrorCode.ALREADY_IN_TEAM]: '已加入其他战队',
    [ErrorCode.NOT_TEAM_LEADER]: '只有队长可以操作',
    
    [ErrorCode.LISTING_NOT_FOUND]: '商品不存在',
    [ErrorCode.LISTING_SOLD]: '商品已售出',
    [ErrorCode.LISTING_CANCELLED]: '商品已下架',
    [ErrorCode.CANNOT_BUY_OWN_ITEM]: '不能购买自己的商品',
    [ErrorCode.TOO_MANY_LISTINGS]: '挂单数量已达上限',
};

// 获取错误消息
export function getErrorMessage(code: number): string {
    return ErrorMessages[code] || '未知错误';
}