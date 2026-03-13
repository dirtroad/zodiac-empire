System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, director, api, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "./managers/ApiClient", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      director = _cc.director;
    }, function (_unresolved_2) {
      api = _unresolved_2.api;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ecf42N/U8BMwoAKvUPdJCR4", "GameManager", undefined); // 星座帝国 - 游戏管理器


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'resources', 'director']);

      ({
        ccclass,
        property
      } = _decorator); // 页面类型

      // 游戏管理器 - 单例
      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Node), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "pageContainer", _descriptor, this);

          this._currentPage = 'home';
          this._pages = new Map();
          // 用户数据
          this._userData = null;
          this._emotionData = [];
        }

        static get instance() {
          return GameManager._instance;
        }

        get userData() {
          return this._userData;
        }

        get emotionData() {
          return this._emotionData;
        }

        get currentPage() {
          return this._currentPage;
        }

        onLoad() {
          if (GameManager._instance) {
            this.destroy();
            return;
          }

          GameManager._instance = this; // 保持节点不被销毁

          director.addPersistRootNode(this.node);
        }

        async start() {
          console.log('🎮 GameManager 启动');
          await this.loadGameData();
        }

        async loadGameData() {
          try {
            var _this$_userData;

            this._userData = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).getUserInfo();
            this._emotionData = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).getEmotionResources();
            console.log('📊 用户数据:', (_this$_userData = this._userData) == null ? void 0 : _this$_userData.nickname);
            console.log('💫 情绪资源:', this._emotionData.length, '种');
          } catch (e) {
            console.error('加载游戏数据失败:', e); // 使用默认数据

            this._userData = {
              id: 1,
              nickname: '旅行者',
              level: 1,
              power: 100,
              gold: 1000,
              diamond: 50,
              timeCoin: 100,
              zodiacSign: 1,
              zodiacName: '白羊座'
            };
            this._emotionData = [{
              emotionType: 1,
              amount: 500
            }, {
              emotionType: 2,
              amount: 800
            }, {
              emotionType: 3,
              amount: 600
            }, {
              emotionType: 4,
              amount: 400
            }, {
              emotionType: 5,
              amount: 300
            }];
          }
        } // 切换页面


        switchPage(page) {
          if (page === this._currentPage) return;
          console.log('📄 切换页面:', this._currentPage, '->', page); // 隐藏当前页面

          const currentPageNode = this._pages.get(this._currentPage);

          if (currentPageNode) {
            currentPageNode.active = false;
          } // 显示新页面


          let newPageNode = this._pages.get(page);

          if (!newPageNode) {
            // 创建新页面（动态创建）
            newPageNode = this.createPage(page);

            if (newPageNode && this.pageContainer) {
              newPageNode.parent = this.pageContainer;

              this._pages.set(page, newPageNode);
            }
          }

          if (newPageNode) {
            newPageNode.active = true;
          }

          this._currentPage = page;
        } // 创建页面


        createPage(page) {
          // 页面创建逻辑由各页面脚本自己实现
          const node = new Node(page + '_page');
          return node;
        } // 刷新用户数据


        async refreshUserData() {
          await this.loadGameData();
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pageContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=dbca30552440e94d43811557113e8ba193cf86d8.js.map