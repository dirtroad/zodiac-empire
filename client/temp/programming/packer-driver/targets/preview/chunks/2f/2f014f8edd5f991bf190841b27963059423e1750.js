System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, api, gameState, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, MainPage;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "../managers/ApiClient", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameState(extras) {
    _reporterNs.report("gameState", "../managers/ApiClient", _context.meta, extras);
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
    }, function (_unresolved_2) {
      api = _unresolved_2.api;
      gameState = _unresolved_2.gameState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0a2deqj8pxMqp7uJNrRI5gm", "MainPage", undefined); // 主页面 - 游戏首页


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MainPage", MainPage = (_dec = ccclass('MainPage'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Node), _dec8 = property(Node), _dec(_class = (_class2 = class MainPage extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "nicknameLabel", _descriptor, this);

          _initializerDefineProperty(this, "levelLabel", _descriptor2, this);

          _initializerDefineProperty(this, "powerLabel", _descriptor3, this);

          _initializerDefineProperty(this, "goldLabel", _descriptor4, this);

          _initializerDefineProperty(this, "timeCoinLabel", _descriptor5, this);

          _initializerDefineProperty(this, "tabButtons", _descriptor6, this);

          _initializerDefineProperty(this, "pageContainer", _descriptor7, this);

          this._currentPage = 'home';
          this._heartbeatTimer = 0;
        }

        onLoad() {
          var _this = this;

          return _asyncToGenerator(function* () {
            console.log('🏠 MainPage 加载');
            yield _this.refreshUI();

            _this.startHeartbeat();
          })();
        }

        refreshUI() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            var user = (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
              error: Error()
            }), gameState) : gameState).user;
            if (!user) return;

            if (_this2.nicknameLabel) {
              _this2.nicknameLabel.string = user.nickname || '旅行者';
            }

            if (_this2.levelLabel) {
              _this2.levelLabel.string = "Lv." + user.level;
            }

            if (_this2.powerLabel) {
              _this2.powerLabel.string = "\u6218\u529B: " + user.power;
            }

            if (_this2.goldLabel) {
              _this2.goldLabel.string = "\u91D1\u5E01: " + user.gold;
            }

            if (_this2.timeCoinLabel) {
              _this2.timeCoinLabel.string = "\u65F6\u95F4\u5E01: " + user.timeCoin;
            }
          })();
        }

        startHeartbeat() {
          var _this3 = this;

          // 每60秒发送心跳
          this._heartbeatTimer = this.schedule( /*#__PURE__*/_asyncToGenerator(function* () {
            try {
              var result = yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                error: Error()
              }), api) : api).heartbeat();
              console.log('💓 心跳:', result.onlineMinutes, '分钟');

              if ((_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
                error: Error()
              }), gameState) : gameState).user) {
                (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
                  error: Error()
                }), gameState) : gameState).user.onlineMinutes = result.onlineMinutes;
                (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
                  error: Error()
                }), gameState) : gameState).user.timeCoin = result.timeCoin;
              }

              _this3.refreshUI();
            } catch (e) {
              console.error('心跳失败:', e);
            }
          }), 60);
        }

        onDestroy() {
          this.unschedule(this._heartbeatTimer);
        }

        switchPage(page) {
          if (page === this._currentPage) return;
          console.log('📄 切换页面:', this._currentPage, '->', page);
          this._currentPage = page; // 更新tab按钮状态
          // TODO: 实现页面切换逻辑
        }

        onTabHome() {
          this.switchPage('home');
        }

        onTabGalaxy() {
          this.switchPage('galaxy');
        }

        onTabBattle() {
          this.switchPage('battle');
        }

        onTabMarket() {
          this.switchPage('market');
        }

        onTabProfile() {
          this.switchPage('profile');
        } // 收取情绪资源


        collectEmotions() {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            try {
              var emotions = yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                error: Error()
              }), api) : api).getEmotionResources();
              var totalCollected = 0;

              for (var emotion of emotions) {
                if (emotion.collectable > 0) {
                  yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                    error: Error()
                  }), api) : api).collectEmotion(emotion.emotionType);
                  totalCollected += emotion.collectable;
                }
              }

              console.log('💰 收取情绪资源:', totalCollected);

              _this4.refreshUI();
            } catch (e) {
              console.error('收取失败:', e);
            }
          })();
        } // 查看星系


        viewGalaxies() {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            try {
              var galaxies = yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                error: Error()
              }), api) : api).getGalaxies();
              console.log('🌌 我的星系:', galaxies.length, '个');

              _this5.switchPage('galaxy');
            } catch (e) {
              console.error('获取星系失败:', e);
            }
          })();
        } // 查看地盘列表


        viewTerritories() {
          return _asyncToGenerator(function* () {
            try {
              var _mapData$players, _mapData$resources;

              // 获取用户位置（模拟）
              var lat = 39.9;
              var lng = 116.4;
              var mapData = yield (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                error: Error()
              }), api) : api).getLocalMap(lat, lng);
              console.log('📍 附近玩家:', ((_mapData$players = mapData.players) == null ? void 0 : _mapData$players.length) || 0, '个');
              console.log('📍 附近资源:', ((_mapData$resources = mapData.resources) == null ? void 0 : _mapData$resources.length) || 0, '个'); // TODO: 打开地盘列表页面
            } catch (e) {
              console.error('获取地图失败:', e);
            }
          })();
        } // 退出登录


        logout() {
          (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
            error: Error()
          }), gameState) : gameState).clearToken();

          var {
            director
          } = require('cc');

          director.loadScene('LoginScene');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nicknameLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "levelLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "powerLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "goldLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "timeCoinLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "tabButtons", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pageContainer", [_dec8], {
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
//# sourceMappingURL=2f014f8edd5f991bf190841b27963059423e1750.js.map