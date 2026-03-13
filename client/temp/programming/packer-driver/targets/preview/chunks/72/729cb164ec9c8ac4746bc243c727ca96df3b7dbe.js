System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, NetworkConfig, GameConfig, StorageKeys;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7f99eVv1IpJMrPUir/miNtR", "Config", undefined);

      // 网络配置
      _export("NetworkConfig", NetworkConfig = {
        API_BASE_URL: 'http://localhost:3000/v1',
        WS_URL: 'ws://localhost:3000',
        TIMEOUT: 10000
      }); // 游戏配置


      _export("GameConfig", GameConfig = {
        // 12星座配置
        ZODIAC_SIGNS: [{
          id: 1,
          name: '白羊座',
          element: '火',
          dateRange: '3.21-4.19'
        }, {
          id: 2,
          name: '金牛座',
          element: '土',
          dateRange: '4.20-5.20'
        }, {
          id: 3,
          name: '双子座',
          element: '风',
          dateRange: '5.21-6.21'
        }, {
          id: 4,
          name: '巨蟹座',
          element: '水',
          dateRange: '6.22-7.22'
        }, {
          id: 5,
          name: '狮子座',
          element: '火',
          dateRange: '7.23-8.22'
        }, {
          id: 6,
          name: '处女座',
          element: '土',
          dateRange: '8.23-9.22'
        }, {
          id: 7,
          name: '天秤座',
          element: '风',
          dateRange: '9.23-10.23'
        }, {
          id: 8,
          name: '天蝎座',
          element: '水',
          dateRange: '10.24-11.22'
        }, {
          id: 9,
          name: '射手座',
          element: '火',
          dateRange: '11.23-12.21'
        }, {
          id: 10,
          name: '摩羯座',
          element: '土',
          dateRange: '12.22-1.19'
        }, {
          id: 11,
          name: '水瓶座',
          element: '风',
          dateRange: '1.20-2.18'
        }, {
          id: 12,
          name: '双鱼座',
          element: '水',
          dateRange: '2.19-3.20'
        }],
        // 元素配置
        ELEMENTS: ['火', '土', '风', '水'],
        // 五行配置
        WUXING: ['金', '木', '水', '火', '土'],
        // 装备类型
        EQUIPMENT_TYPES: [{
          id: 1,
          name: '武器',
          slots: [1]
        }, {
          id: 2,
          name: '头盔',
          slots: [2]
        }, {
          id: 3,
          name: '衣服',
          slots: [3]
        }, {
          id: 4,
          name: '鞋子',
          slots: [4]
        }, {
          id: 5,
          name: '饰品',
          slots: [5, 6]
        }],
        // 稀有度
        RARITIES: [{
          id: 1,
          name: '普通',
          color: '#FFFFFF'
        }, {
          id: 2,
          name: '稀有',
          color: '#00FF00'
        }, {
          id: 3,
          name: '史诗',
          color: '#9900FF'
        }, {
          id: 4,
          name: '传说',
          color: '#FFD700'
        }]
      }); // 本地存储Key


      _export("StorageKeys", StorageKeys = {
        TOKEN: 'zodiac_token',
        USER_INFO: 'zodiac_user',
        SETTINGS: 'zodiac_settings'
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=729cb164ec9c8ac4746bc243c727ca96df3b7dbe.js.map