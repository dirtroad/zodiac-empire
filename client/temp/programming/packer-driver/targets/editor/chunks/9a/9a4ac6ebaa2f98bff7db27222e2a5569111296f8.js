System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, api, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, LoginPage;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "../managers/ApiClient", _context.meta, extras);
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
      Button = _cc.Button;
    }, function (_unresolved_2) {
      api = _unresolved_2.api;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "51083Je8XpET5P0XPJOPrIf", "LoginPage", undefined); // 登录页面 - 微信登录


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Sprite', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LoginPage", LoginPage = (_dec = ccclass('LoginPage'), _dec2 = property(Label), _dec3 = property(Button), _dec4 = property(Node), _dec(_class = (_class2 = class LoginPage extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "statusLabel", _descriptor, this);

          _initializerDefineProperty(this, "loginButton", _descriptor2, this);

          _initializerDefineProperty(this, "loadingNode", _descriptor3, this);

          this._isLoggingIn = false;
        }

        onLoad() {
          console.log('📱 LoginPage 加载');
          this.initUI();
        }

        async start() {
          // 尝试自动登录
          await this.tryAutoLogin();
        }

        initUI() {
          if (this.statusLabel) {
            this.statusLabel.string = '欢迎来到星座帝国';
          }

          if (this.loginButton) {
            this.loginButton.node.on(Button.EventType.CLICK, this.onLoginClick, this);
          }

          if (this.loadingNode) {
            this.loadingNode.active = false;
          }
        }

        async tryAutoLogin() {
          const user = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
            error: Error()
          }), api) : api).tryAutoLogin();

          if (user) {
            console.log('✅ 自动登录成功:', user.nickname);
            this.onLoginSuccess(user, false);
          }
        }

        async onLoginClick() {
          if (this._isLoggingIn) return;
          this._isLoggingIn = true;
          this.showLoading(true);
          this.setStatus('正在登录...');

          try {
            const result = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).wechatLogin();
            console.log('✅ 登录成功:', result.user.nickname, '新用户:', result.isNewUser);
            this.onLoginSuccess(result.user, result.isNewUser);
          } catch (e) {
            console.error('❌ 登录失败:', e);
            this.setStatus('登录失败: ' + (e.message || '未知错误'));
            this.showLoading(false);
          } finally {
            this._isLoggingIn = false;
          }
        }

        onLoginSuccess(user, isNewUser) {
          this.showLoading(false);
          this.setStatus(`欢迎, ${user.nickname}!`); // 延迟跳转到主界面

          this.scheduleOnce(() => {
            this.enterGame(user, isNewUser);
          }, 1);
        }

        enterGame(user, isNewUser) {
          console.log('🎮 进入游戏, 用户:', user.nickname); // 如果是新用户，跳转到星座选择页面

          if (isNewUser && !user.zodiacSign) {
            console.log('⭐ 新用户，跳转星座选择'); // TODO: 跳转到星座选择页面

            this.goToMainScene();
          } else {
            this.goToMainScene();
          }
        }

        goToMainScene() {
          // 加载主场景
          const {
            director
          } = require('cc');

          director.loadScene('MainScene', err => {
            if (err) {
              console.error('加载主场景失败:', err);
              return;
            }

            console.log('🎮 主场景加载完成');
          });
        }

        setStatus(text) {
          if (this.statusLabel) {
            this.statusLabel.string = text;
          }
        }

        showLoading(show) {
          if (this.loadingNode) {
            this.loadingNode.active = show;
          }

          if (this.loginButton) {
            this.loginButton.interactable = !show;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loginButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "loadingNode", [_dec4], {
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
//# sourceMappingURL=9a4ac6ebaa2f98bff7db27222e2a5569111296f8.js.map