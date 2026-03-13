System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, GameState, ApiClient, _crd, ccclass, API_CONFIG, gameState, api;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  _export("ApiClient", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "be5bfxTNPxH35xy9TP7dENT", "ApiClient", undefined); // 网络请求管理器 - 与后端API对接


      __checkObsolete__(['_decorator']);

      ({
        ccclass
      } = _decorator); // API配置

      API_CONFIG = {
        BASE_URL: 'http://localhost:3000/v1',
        TIMEOUT: 10000
      }; // 用户数据类型
      // 情绪数据类型

      // 全局状态管理
      GameState = class GameState {
        constructor() {
          this._token = '';
          this._user = null;
          this._isNewUser = false;
        }

        static get instance() {
          if (!GameState._instance) {
            GameState._instance = new GameState();
          }

          return GameState._instance;
        }

        get token() {
          return this._token;
        }

        set token(value) {
          this._token = value;
        }

        get user() {
          return this._user;
        }

        set user(value) {
          this._user = value;
        }

        get isLoggedIn() {
          return !!this._token;
        }

        get isNewUser() {
          return this._isNewUser;
        }

        set isNewUser(value) {
          this._isNewUser = value;
        }

        saveToken() {
          if (typeof wx !== 'undefined') {
            wx.setStorageSync('zodiac_token', this._token);
          } else {
            localStorage.setItem('zodiac_token', this._token);
          }
        }

        loadToken() {
          if (typeof wx !== 'undefined') {
            this._token = wx.getStorageSync('zodiac_token') || '';
          } else {
            this._token = localStorage.getItem('zodiac_token') || '';
          }

          return !!this._token;
        }

        clearToken() {
          this._token = '';
          this._user = null;

          if (typeof wx !== 'undefined') {
            wx.removeStorageSync('zodiac_token');
          } else {
            localStorage.removeItem('zodiac_token');
          }
        }

      };
      GameState._instance = void 0;

      _export("gameState", gameState = GameState.instance); // API客户端


      _export("ApiClient", ApiClient = class ApiClient {
        constructor() {
          this.baseUrl = API_CONFIG.BASE_URL;
          this.timeout = API_CONFIG.TIMEOUT;
        }

        static get instance() {
          if (!ApiClient._instance) {
            ApiClient._instance = new ApiClient();
          }

          return ApiClient._instance;
        }

        // 微信登录
        wechatLogin() {
          var _this = this;

          return _asyncToGenerator(function* () {
            return new Promise((resolve, reject) => {
              if (typeof wx === 'undefined') {
                // 非微信环境，使用测试登录
                console.log('🔍 非微信环境，使用测试登录');

                _this.post('/auth/wechat/login', {
                  code: 'dev_test_' + Date.now()
                }).then(data => {
                  gameState.token = data.access_token;
                  gameState.user = data.user;
                  gameState.isNewUser = data.is_new_user;
                  gameState.saveToken();
                  resolve({
                    token: data.access_token,
                    user: data.user,
                    isNewUser: data.is_new_user
                  });
                }).catch(reject);

                return;
              }

              wx.login({
                success: res => {
                  if (res.code) {
                    _this.post('/auth/wechat/login', {
                      code: res.code
                    }).then(data => {
                      gameState.token = data.access_token;
                      gameState.user = data.user;
                      gameState.isNewUser = data.is_new_user;
                      gameState.saveToken();
                      resolve({
                        token: data.access_token,
                        user: data.user,
                        isNewUser: data.is_new_user
                      });
                    }).catch(reject);
                  } else {
                    reject(new Error('wx.login failed: ' + res.errMsg));
                  }
                },
                fail: reject
              });
            });
          })();
        } // 刷新token


        refreshToken() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            var data = yield _this2.post('/auth/refresh', {});
            gameState.token = data.access_token;
            gameState.saveToken();
            return data.access_token;
          })();
        } // 尝试使用已保存的token登录


        tryAutoLogin() {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            if (!gameState.loadToken()) {
              return null;
            }

            try {
              var user = yield _this3.getUserInfo();
              gameState.user = user;
              return user;
            } catch (e) {
              gameState.clearToken();
              return null;
            }
          })();
        } // 获取用户信息


        getUserInfo() {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var data = yield _this4.get('/users/me');
            gameState.user = data;
            return data;
          })();
        } // 心跳（在线时长）


        heartbeat() {
          var _this5 = this;

          return _asyncToGenerator(function* () {
            return _this5.post('/users/heartbeat', {});
          })();
        } // 获取情绪资源


        getEmotionResources() {
          var _this6 = this;

          return _asyncToGenerator(function* () {
            return _this6.get('/emotion/resources');
          })();
        } // 收取情绪资源


        collectEmotion(emotionType) {
          var _this7 = this;

          return _asyncToGenerator(function* () {
            return _this7.post('/emotion/collect', {
              emotionType
            });
          })();
        } // 获取情绪类型列表


        getEmotionTypes() {
          var _this8 = this;

          return _asyncToGenerator(function* () {
            return _this8.get('/emotion/types');
          })();
        } // 获取用户星系


        getGalaxies() {
          var _this9 = this;

          return _asyncToGenerator(function* () {
            return _this9.get('/galaxies');
          })();
        } // 创建星系


        createGalaxy(name, type) {
          var _this10 = this;

          return _asyncToGenerator(function* () {
            return _this10.post('/galaxies', {
              name,
              type
            });
          })();
        } // 获取装备模板


        getEquipmentTemplates() {
          var _this11 = this;

          return _asyncToGenerator(function* () {
            return _this11.get('/equipment/templates');
          })();
        } // 获取我的装备


        getMyEquipment() {
          var _this12 = this;

          return _asyncToGenerator(function* () {
            return _this12.get('/equipment/my');
          })();
        } // 装备抽卡


        equipmentGacha(type) {
          var _this13 = this;

          return _asyncToGenerator(function* () {
            return _this13.post('/equipment/gacha', {
              type
            });
          })();
        } // 获取时间银行信息


        getTimeBank() {
          var _this14 = this;

          return _asyncToGenerator(function* () {
            return _this14.get('/users/bank');
          })();
        } // 存入时间币


        depositTimeCoin(amount) {
          var _this15 = this;

          return _asyncToGenerator(function* () {
            return _this15.post('/users/bank/deposit', {
              amount
            });
          })();
        } // 取出时间币


        withdrawTimeCoin(amount) {
          var _this16 = this;

          return _asyncToGenerator(function* () {
            return _this16.post('/users/bank/withdraw', {
              amount
            });
          })();
        } // 获取本地地图


        getLocalMap(lat, lng) {
          var _this17 = this;

          return _asyncToGenerator(function* () {
            return _this17.get("/map/local?lat=" + lat + "&lng=" + lng);
          })();
        } // 获取战斗排名


        getBattleRanking() {
          var _this18 = this;

          return _asyncToGenerator(function* () {
            return _this18.get('/battle/ranking');
          })();
        } // 获取战队排名


        getTeamRanking() {
          var _this19 = this;

          return _asyncToGenerator(function* () {
            return _this19.get('/team/ranking');
          })();
        } // 获取五行关系


        getWuxingRelations() {
          var _this20 = this;

          return _asyncToGenerator(function* () {
            return _this20.get('/wuxing/relations');
          })();
        } // 获取市场统计


        getMarketStats() {
          var _this21 = this;

          return _asyncToGenerator(function* () {
            return _this21.get('/market/stats');
          })();
        } // 通用GET请求


        get(path) {
          var _this22 = this;

          return _asyncToGenerator(function* () {
            return _this22.request('GET', path);
          })();
        } // 通用POST请求


        post(path, data) {
          var _this23 = this;

          return _asyncToGenerator(function* () {
            return _this23.request('POST', path, data);
          })();
        } // 通用请求方法


        request(method, path, data) {
          var _this24 = this;

          return _asyncToGenerator(function* () {
            var url = _this24.baseUrl + path;
            return new Promise((resolve, reject) => {
              var timeoutId = setTimeout(() => {
                reject(new Error('Request timeout'));
              }, _this24.timeout);
              var headers = {
                'Content-Type': 'application/json'
              };

              if (gameState.token) {
                headers['Authorization'] = "Bearer " + gameState.token;
              }

              if (typeof wx !== 'undefined') {
                wx.request({
                  url,
                  method: method,
                  data,
                  header: headers,
                  success: res => {
                    clearTimeout(timeoutId);

                    if (res.statusCode === 200 || res.statusCode === 201) {
                      var response = res.data;

                      if (response.code === 0) {
                        resolve(response.data);
                      } else {
                        reject(new Error(response.message || 'API Error'));
                      }
                    } else if (res.statusCode === 401) {
                      // Token过期，清除登录状态
                      gameState.clearToken();
                      reject(new Error('Unauthorized'));
                    } else {
                      reject(new Error("HTTP " + res.statusCode));
                    }
                  },
                  fail: err => {
                    clearTimeout(timeoutId);
                    reject(err);
                  }
                });
              } else {
                // 浏览器环境
                fetch(url, {
                  method,
                  headers,
                  body: data ? JSON.stringify(data) : undefined
                }).then(response => response.json()).then(response => {
                  clearTimeout(timeoutId);

                  if (response.code === 0) {
                    resolve(response.data);
                  } else {
                    reject(new Error(response.message || 'API Error'));
                  }
                }).catch(err => {
                  clearTimeout(timeoutId);
                  reject(err);
                });
              }
            });
          })();
        }

      });

      ApiClient._instance = void 0;

      _export("api", api = ApiClient.instance);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=28f054deefb33ab75e807268debfc81e7428d214.js.map