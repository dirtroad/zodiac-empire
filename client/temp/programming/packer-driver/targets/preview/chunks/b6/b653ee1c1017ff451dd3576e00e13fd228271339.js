System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, GameTester;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3d42d1DZlZMObepoWFji3Y1", "GameTester", undefined); // 星座帝国 - 自动测试脚本


      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameTester", GameTester = (_dec = ccclass('GameTester'), _dec(_class = class GameTester extends Component {
        constructor() {
          super(...arguments);
          this.results = [];
        }

        start() {
          console.log('🧪 ========== 开始自动测试 ==========');
          this.runTests();
        }

        runTests() {
          var _this = this;

          return _asyncToGenerator(function* () {
            // 测试1: 检查主脚本是否存在
            yield _this.test('主脚本加载', () => {
              var testScene = _this.node.getComponent('TestScene');

              return testScene !== null;
            }); // 测试2: 检查素材是否加载

            yield _this.test('素材加载', () => {
              var testScene = _this.node.getComponent('TestScene');

              if (!testScene) return false;
              return testScene.iconGold !== null || testScene.iconDiamond !== null;
            }); // 测试3: 检查页面容器是否存在

            yield _this.test('页面容器', () => {
              var testScene = _this.node.getComponent('TestScene');

              if (!testScene) return false;
              return testScene.contentNode !== null;
            }); // 测试4: 检查TabBar是否存在

            yield _this.test('TabBar存在', () => {
              var tabBar = _this.node.getChildByName('TabBar');

              return tabBar !== null;
            }); // 测试5: 检查TabBar点击区域

            yield _this.test('TabBar点击区域', () => {
              var tabBar = _this.node.getChildByName('TabBar');

              if (!tabBar) return false;
              var clickAreas = tabBar.children.filter(c => c.name === 'Click');
              return clickAreas.length === 5;
            }); // 输出测试结果

            _this.printResults();
          })();
        }

        test(name, check) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            return new Promise(resolve => {
              setTimeout(() => {
                try {
                  var passed = check();

                  _this2.results.push({
                    name,
                    passed,
                    message: passed ? '✅ 通过' : '❌ 失败'
                  });
                } catch (e) {
                  _this2.results.push({
                    name,
                    passed: false,
                    message: "\u274C \u9519\u8BEF: " + e
                  });
                }

                resolve();
              }, 100);
            });
          })();
        }

        printResults() {
          console.log('');
          console.log('📋 ========== 测试结果 ==========');
          var passed = 0;
          var failed = 0;
          this.results.forEach(r => {
            console.log("  " + r.name + ": " + r.message);
            if (r.passed) passed++;else failed++;
          });
          console.log('');
          console.log("\uD83D\uDCCA \u603B\u8BA1: " + passed + " \u901A\u8FC7, " + failed + " \u5931\u8D25");
          console.log('================================');

          if (failed === 0) {
            console.log('🎉 所有测试通过！');
          } else {
            console.log('⚠️ 有测试失败，请检查上述错误');
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b653ee1c1017ff451dd3576e00e13fd228271339.js.map