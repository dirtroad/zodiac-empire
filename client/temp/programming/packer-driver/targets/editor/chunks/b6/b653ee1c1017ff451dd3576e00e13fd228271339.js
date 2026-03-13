System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, GameTester;

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
        constructor(...args) {
          super(...args);
          this.results = [];
        }

        start() {
          console.log('🧪 ========== 开始自动测试 ==========');
          this.runTests();
        }

        async runTests() {
          // 测试1: 检查主脚本是否存在
          await this.test('主脚本加载', () => {
            const testScene = this.node.getComponent('TestScene');
            return testScene !== null;
          }); // 测试2: 检查素材是否加载

          await this.test('素材加载', () => {
            const testScene = this.node.getComponent('TestScene');
            if (!testScene) return false;
            return testScene.iconGold !== null || testScene.iconDiamond !== null;
          }); // 测试3: 检查页面容器是否存在

          await this.test('页面容器', () => {
            const testScene = this.node.getComponent('TestScene');
            if (!testScene) return false;
            return testScene.contentNode !== null;
          }); // 测试4: 检查TabBar是否存在

          await this.test('TabBar存在', () => {
            const tabBar = this.node.getChildByName('TabBar');
            return tabBar !== null;
          }); // 测试5: 检查TabBar点击区域

          await this.test('TabBar点击区域', () => {
            const tabBar = this.node.getChildByName('TabBar');
            if (!tabBar) return false;
            const clickAreas = tabBar.children.filter(c => c.name === 'Click');
            return clickAreas.length === 5;
          }); // 输出测试结果

          this.printResults();
        }

        async test(name, check) {
          return new Promise(resolve => {
            setTimeout(() => {
              try {
                const passed = check();
                this.results.push({
                  name,
                  passed,
                  message: passed ? '✅ 通过' : '❌ 失败'
                });
              } catch (e) {
                this.results.push({
                  name,
                  passed: false,
                  message: `❌ 错误: ${e}`
                });
              }

              resolve();
            }, 100);
          });
        }

        printResults() {
          console.log('');
          console.log('📋 ========== 测试结果 ==========');
          let passed = 0;
          let failed = 0;
          this.results.forEach(r => {
            console.log(`  ${r.name}: ${r.message}`);
            if (r.passed) passed++;else failed++;
          });
          console.log('');
          console.log(`📊 总计: ${passed} 通过, ${failed} 失败`);
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