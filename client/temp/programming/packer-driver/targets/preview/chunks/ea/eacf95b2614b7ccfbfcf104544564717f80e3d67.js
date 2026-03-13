System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, _dec, _class, _crd, ccclass, property, GameEntry;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ecb5cxRpDRBLKDszKqSQXi6", "GameEntry", undefined); // 星座帝国 - 游戏入口


      __checkObsolete__(['_decorator', 'Component', 'director']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏入口脚本
       * 负责初始化游戏并加载登录场景
       */

      _export("GameEntry", GameEntry = (_dec = ccclass('GameEntry'), _dec(_class = class GameEntry extends Component {
        onLoad() {
          console.log('🚀 星座帝国启动');
          console.log('📅 版本: 1.0.0');
          console.log('🎮 平台:', this.getPlatform());
        }

        start() {
          // 延迟加载登录场景
          this.scheduleOnce(() => {
            this.loadLoginScene();
          }, 0.5);
        }

        loadLoginScene() {
          console.log('📱 加载登录场景...');
          director.loadScene('LoginScene', err => {
            if (err) {
              console.error('❌ 加载登录场景失败:', err);
              return;
            }

            console.log('✅ 登录场景加载完成');
          });
        }

        getPlatform() {
          if (typeof wx !== 'undefined') {
            return '微信小游戏';
          } else if (typeof window !== 'undefined') {
            return '浏览器';
          } else {
            return 'Cocos Creator';
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eacf95b2614b7ccfbfcf104544564717f80e3d67.js.map