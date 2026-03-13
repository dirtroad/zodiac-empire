System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, api, gameState, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, UserInfo;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "../managers/ApiClient", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameState(extras) {
    _reporterNs.report("gameState", "../managers/ApiClient", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUserData(extras) {
    _reporterNs.report("UserData", "../managers/ApiClient", _context.meta, extras);
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
    }, function (_unresolved_2) {
      api = _unresolved_2.api;
      gameState = _unresolved_2.gameState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e66d49lETZDgaA3IhnHo4+y", "UserInfo", undefined); // 用户信息组件


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UserInfo", UserInfo = (_dec = ccclass('UserInfo'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec(_class = (_class2 = class UserInfo extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "nameLabel", _descriptor, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor2, this);

          _initializerDefineProperty(this, "powerLabel", _descriptor3, this);

          _initializerDefineProperty(this, "zodiacLabel", _descriptor4, this);
        }

        start() {
          this.refresh();
        }

        async refresh() {
          const user = (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
            error: Error()
          }), gameState) : gameState).user || (await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
            error: Error()
          }), api) : api).getUserInfo());
          this.updateDisplay(user);
        }

        updateDisplay(user) {
          if (this.nameLabel) {
            this.nameLabel.string = user.nickname;
          }

          if (this.levelLabel) {
            this.levelLabel.string = `Lv.${user.level}`;
          }

          if (this.powerLabel) {
            this.powerLabel.string = `战力: ${user.power}`;
          }

          if (this.zodiacLabel) {
            this.zodiacLabel.string = user.zodiacName;
          }
        } // 静态方法：创建用户信息UI


        static createUserInfoUI(parent, user) {
          const container = new Node('UserInfo');
          container.parent = parent;
          container.setPosition(200, 280, 0);
          container.layer = Layers.Enum.UI_2D;
          const uiTransform = container.addComponent(UITransform);
          uiTransform.setContentSize(300, 100); // 头像占位

          const avatarNode = new Node('Avatar');
          avatarNode.parent = container;
          avatarNode.setPosition(-80, 0, 0);
          avatarNode.layer = Layers.Enum.UI_2D;
          const avatarTransform = avatarNode.addComponent(UITransform);
          avatarTransform.setContentSize(60, 60);
          const avatarLabel = avatarNode.addComponent(Label);
          avatarLabel.string = '👤';
          avatarLabel.fontSize = 40;
          avatarLabel.color = new Color(255, 255, 255); // 用户名

          const nameNode = new Node('Name');
          nameNode.parent = container;
          nameNode.setPosition(30, 20, 0);
          nameNode.layer = Layers.Enum.UI_2D;
          const nameTransform = nameNode.addComponent(UITransform);
          nameTransform.setContentSize(150, 30);
          const nameLabel = nameNode.addComponent(Label);
          nameLabel.string = user.nickname;
          nameLabel.fontSize = 24;
          nameLabel.color = new Color(255, 255, 255); // 等级和战力

          const levelNode = new Node('Level');
          levelNode.parent = container;
          levelNode.setPosition(30, -15, 0);
          levelNode.layer = Layers.Enum.UI_2D;
          const levelTransform = levelNode.addComponent(UITransform);
          levelTransform.setContentSize(150, 25);
          const levelLabel = levelNode.addComponent(Label);
          levelLabel.string = `Lv.${user.level}  战力: ${user.power}`;
          levelLabel.fontSize = 18;
          levelLabel.color = new Color(255, 215, 0);
          return container;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "powerLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "zodiacLabel", [_dec5], {
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
//# sourceMappingURL=774eeffc621fe0a78ae0eed015a1d636eeb9dded.js.map