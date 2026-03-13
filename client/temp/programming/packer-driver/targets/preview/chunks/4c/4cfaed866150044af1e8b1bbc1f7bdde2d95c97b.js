System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, SpriteFrame, GameManager, api, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, HomePage;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "../managers/ApiClient", _context.meta, extras);
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
      Label = _cc.Label;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      Layers = _cc.Layers;
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      api = _unresolved_3.api;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4fb5946PJVAb4VlPks7h3Sh", "HomePage", undefined); // 首页 - 主界面


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers', 'Sprite', 'SpriteFrame', 'resources', 'Button']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HomePage", HomePage = (_dec = ccclass('HomePage'), _dec2 = property({
        type: SpriteFrame
      }), _dec(_class = (_class2 = class HomePage extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "bgCardSprite", _descriptor, this);
        }

        start() {
          this.createUI();
        }

        createUI() {
          var game = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          var user = game == null ? void 0 : game.userData;
          if (!user) return; // === 顶部区域 ===

          this.addColorBlock(0, 280, 960, 120, new Color(20, 25, 45, 230)); // Logo

          this.addLabel('⭐ 星座帝国', -350, 300, 36, new Color(255, 215, 0)); // 用户卡片

          this.createUserCard(); // === 资源栏 ===

          this.createResourceBar(user); // === 主内容区 ===

          this.addColorBlock(0, 0, 960, 360, new Color(15, 20, 35, 180)); // 欢迎语

          this.addLabel('欢迎来到星座的世界', 0, 120, 32, new Color(255, 255, 255)); // 功能入口

          this.createFeatureCards(); // === 情绪资源区 ===

          this.addLabel('💡 每日情绪资源', 0, -60, 20, new Color(255, 200, 100));
          this.createEmotionCards();
        }

        createUserCard() {
          var _instance;

          var user = (_instance = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance) == null ? void 0 : _instance.userData;
          if (!user) return; // 卡片背景

          this.addColorBlock(200, 280, 300, 100, new Color(40, 50, 80, 200)); // 头像

          this.addLabel('👤', 100, 295, 40, new Color(255, 255, 255)); // 信息

          this.addLabel(user.nickname, 180, 310, 24, new Color(255, 255, 255));
          this.addLabel("Lv." + user.level + "  \u6218\u529B: " + user.power, 180, 270, 18, new Color(255, 215, 0));
          this.addLabel(user.zodiacName, 180, 250, 14, new Color(150, 180, 255));
        }

        createResourceBar(user) {
          this.addColorBlock(0, 200, 960, 60, new Color(30, 35, 55, 220)); // 金币

          this.addLabel('💰', -300, 200, 24, new Color(255, 255, 255));
          this.addLabel(this.formatNum(user.gold), -250, 200, 22, new Color(255, 215, 0)); // 钻石

          this.addLabel('💎', -50, 200, 24, new Color(255, 255, 255));
          this.addLabel(this.formatNum(user.diamond), 0, 200, 22, new Color(100, 200, 255)); // 时间币

          this.addLabel('⏰', 200, 200, 24, new Color(255, 255, 255));
          this.addLabel(this.formatNum(user.timeCoin), 250, 200, 22, new Color(100, 255, 200));
        }

        createFeatureCards() {
          // 银河探索
          this.addColorBlock(-200, 20, 200, 100, new Color(50, 60, 90, 220));
          this.addLabel('🌌 银河探索', -200, 35, 22, new Color(255, 255, 255));
          this.addLabel('探索未知星域', -200, 0, 16, new Color(180, 180, 180)); // 星际战斗

          this.addColorBlock(200, 20, 200, 100, new Color(80, 50, 60, 220));
          this.addLabel('⚔️ 星际战斗', 200, 35, 22, new Color(255, 255, 255));
          this.addLabel('挑战其他玩家', 200, 0, 16, new Color(180, 180, 180));
        }

        createEmotionCards() {
          var _instance2;

          var emotions = ((_instance2 = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance) == null ? void 0 : _instance2.emotionData) || [];
          var config = [{
            type: 1,
            icon: '😊',
            name: '喜悦',
            color: new Color(255, 200, 100)
          }, {
            type: 2,
            icon: '🔥',
            name: '激情',
            color: new Color(255, 100, 100)
          }, {
            type: 3,
            icon: '🌊',
            name: '平静',
            color: new Color(100, 200, 255)
          }, {
            type: 4,
            icon: '📚',
            name: '智慧',
            color: new Color(200, 150, 255)
          }, {
            type: 5,
            icon: '💪',
            name: '意志',
            color: new Color(150, 255, 150)
          }];
          config.forEach((e, i) => {
            var x = -270 + i * 135;
            var data = emotions.find(d => d.emotionType === e.type);
            var amount = (data == null ? void 0 : data.amount) || 0; // 卡片

            this.addColorBlock(x, -140, 120, 70, new Color(40, 50, 70, 200)); // 图标和名称

            this.addLabel(e.icon, x - 30, -130, 24, new Color(255, 255, 255));
            this.addLabel(e.name, x + 20, -130, 14, e.color); // 数量

            this.addLabel(this.formatNum(amount), x, -155, 16, new Color(200, 200, 200)); // 收取按钮

            this.addCollectButton(x, -180, e.type);
          });
        }

        addCollectButton(x, y, emotionType) {
          var node = new Node('Btn_Collect_' + emotionType);
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(80, 28);
          var label = node.addComponent(Label);
          label.string = '收取';
          label.fontSize = 14;
          label.color = new Color(100, 255, 100);
          label.horizontalAlign = Label.HorizontalAlign.CENTER; // 简单的点击效果

          node.on(Node.EventType.TOUCH_END, /*#__PURE__*/_asyncToGenerator(function* () {
            console.log('收取情绪:', emotionType);

            try {
              var _instance3;

              var result = yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                error: Error()
              }), api) : api).collectEmotion(emotionType);
              console.log('收取成功:', result); // 刷新数据

              yield (_instance3 = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
                error: Error()
              }), GameManager) : GameManager).instance) == null ? void 0 : _instance3.refreshUserData();
            } catch (e) {
              console.error('收取失败:', e);
            }
          }));
        } // 辅助方法


        addLabel(text, x, y, fontSize, color) {
          var node = new Node('Label');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(600, fontSize + 10);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = fontSize + 4;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

        addColorBlock(x, y, width, height, color) {
          var node = new Node('Block');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(width, height);
          var label = node.addComponent(Label);
          label.string = '█'.repeat(Math.floor(width / 20));
          label.fontSize = height;
          label.lineHeight = height;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

        formatNum(num) {
          if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
          return num.toLocaleString();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bgCardSprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4cfaed866150044af1e8b1bbc1f7bdde2d95c97b.js.map