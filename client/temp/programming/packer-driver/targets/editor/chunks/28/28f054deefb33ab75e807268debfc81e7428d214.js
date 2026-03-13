System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, GameState, ApiClient, _crd, ccclass, API_CONFIG, gameState, api;

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
        async wechatLogin() {
          return new Promise((resolve, reject) => {
            if (typeof wx === 'undefined') {
              // 非微信环境，使用测试登录
              console.log('🔍 非微信环境，使用测试登录');
              this.post('/auth/wechat/login', {
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
                  this.post('/auth/wechat/login', {
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
        } // 刷新token


        async refreshToken() {
          const data = await this.post('/auth/refresh', {});
          gameState.token = data.access_token;
          gameState.saveToken();
          return data.access_token;
        } // 尝试使用已保存的token登录


        async tryAutoLogin() {
          if (!gameState.loadToken()) {
            return null;
          }

          try {
            const user = await this.getUserInfo();
            gameState.user = user;
            return user;
          } catch (e) {
            gameState.clearToken();
            return null;
          }
        } // 获取用户信息


        async getUserInfo() {
          const data = await this.get('/users/me');
          gameState.user = data;
          return data;
        } // 心跳（在线时长）


        async heartbeat() {
          return this.post('/users/heartbeat', {});
        } // 获取情绪资源


        async getEmotionResources() {
          return this.get('/emotion/resources');
        } // 收取情绪资源


        async collectEmotion(emotionType) {
          return this.post('/emotion/collect', {
            emotionType
          });
        } // 获取情绪类型列表


        async getEmotionTypes() {
          return this.get('/emotion/types');
        } // 获取用户星系


        async getGalaxies() {
          return this.get('/galaxies');
        } // 创建星系


        async createGalaxy(name, type) {
          return this.post('/galaxies', {
            name,
            type
          });
        } // 获取装备模板


        async getEquipmentTemplates() {
          return this.get('/equipment/templates');
        } // 获取我的装备


        async getMyEquipment() {
          return this.get('/equipment/my');
        } // 装备抽卡


        async equipmentGacha(type) {
          return this.post('/equipment/gacha', {
            type
          });
        } // 获取时间银行信息


        async getTimeBank() {
          return this.get('/users/bank');
        } // 存入时间币


        async depositTimeCoin(amount) {
          return this.post('/users/bank/deposit', {
            amount
          });
        } // 取出时间币


        async withdrawTimeCoin(amount) {
          return this.post('/users/bank/withdraw', {
            amount
          });
        } // 获取本地地图


        async getLocalMap(lat, lng) {
          return this.get(`/map/local?lat=${lat}&lng=${lng}`);
        } // 获取战斗排名


        async getBattleRanking() {
          return this.get('/battle/ranking');
        } // 获取战队排名


        async getTeamRanking() {
          return this.get('/team/ranking');
        } // 获取五行关系


        async getWuxingRelations() {
          return this.get('/wuxing/relations');
        } // 获取市场统计


        async getMarketStats() {
          return this.get('/market/stats');
        } // 通用GET请求


        async get(path) {
          return this.request('GET', path);
        } // 通用POST请求


        async post(path, data) {
          return this.request('POST', path, data);
        } // 通用请求方法


        async request(method, path, data) {
          const url = this.baseUrl + path;
          return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('Request timeout'));
            }, this.timeout);
            const headers = {
              'Content-Type': 'application/json'
            };

            if (gameState.token) {
              headers['Authorization'] = `Bearer ${gameState.token}`;
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
                    const response = res.data;

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
                    reject(new Error(`HTTP ${res.statusCode}`));
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