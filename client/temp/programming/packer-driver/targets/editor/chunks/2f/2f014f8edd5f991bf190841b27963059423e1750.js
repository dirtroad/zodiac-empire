System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, api, gameState, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, MainPage;

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
        constructor(...args) {
          super(...args);

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

        async onLoad() {
          console.log('🏠 MainPage 加载');
          await this.refreshUI();
          this.startHeartbeat();
        }

        async refreshUI() {
          const user = (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
            error: Error()
          }), gameState) : gameState).user;
          if (!user) return;

          if (this.nicknameLabel) {
            this.nicknameLabel.string = user.nickname || '旅行者';
          }

          if (this.levelLabel) {
            this.levelLabel.string = `Lv.${user.level}`;
          }

          if (this.powerLabel) {
            this.powerLabel.string = `战力: ${user.power}`;
          }

          if (this.goldLabel) {
            this.goldLabel.string = `金币: ${user.gold}`;
          }

          if (this.timeCoinLabel) {
            this.timeCoinLabel.string = `时间币: ${user.timeCoin}`;
          }
        }

        startHeartbeat() {
          // 每60秒发送心跳
          this._heartbeatTimer = this.schedule(async () => {
            try {
              const result = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
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

              this.refreshUI();
            } catch (e) {
              console.error('心跳失败:', e);
            }
          }, 60);
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


        async collectEmotions() {
          try {
            const emotions = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).getEmotionResources();
            let totalCollected = 0;

            for (const emotion of emotions) {
              if (emotion.collectable > 0) {
                await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
                  error: Error()
                }), api) : api).collectEmotion(emotion.emotionType);
                totalCollected += emotion.collectable;
              }
            }

            console.log('💰 收取情绪资源:', totalCollected);
            this.refreshUI();
          } catch (e) {
            console.error('收取失败:', e);
          }
        } // 查看星系


        async viewGalaxies() {
          try {
            const galaxies = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).getGalaxies();
            console.log('🌌 我的星系:', galaxies.length, '个');
            this.switchPage('galaxy');
          } catch (e) {
            console.error('获取星系失败:', e);
          }
        } // 查看地盘列表


        async viewTerritories() {
          try {
            var _mapData$players, _mapData$resources;

            // 获取用户位置（模拟）
            const lat = 39.9;
            const lng = 116.4;
            const mapData = await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
              error: Error()
            }), api) : api).getLocalMap(lat, lng);
            console.log('📍 附近玩家:', ((_mapData$players = mapData.players) == null ? void 0 : _mapData$players.length) || 0, '个');
            console.log('📍 附近资源:', ((_mapData$resources = mapData.resources) == null ? void 0 : _mapData$resources.length) || 0, '个'); // TODO: 打开地盘列表页面
          } catch (e) {
            console.error('获取地图失败:', e);
          }
        } // 退出登录


        logout() {
          (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
            error: Error()
          }), gameState) : gameState).clearToken();

          const {
            director
          } = require('cc');

          director.loadScene('LoginScene');
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nicknameLabel", [_dec2], {
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "goldLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "timeCoinLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "tabButtons", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pageContainer", [_dec8], {
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
//# sourceMappingURL=2f014f8edd5f991bf190841b27963059423e1750.js.map