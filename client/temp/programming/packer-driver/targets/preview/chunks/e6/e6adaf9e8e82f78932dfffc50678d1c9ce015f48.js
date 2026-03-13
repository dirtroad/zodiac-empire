System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, TabBar;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0af75F5d25L7oNlVoyztWf4", "TabBar", undefined); // 底部导航栏组件


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TabBar", TabBar = (_dec = ccclass('TabBar'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Node
      }), _dec4 = property({
        type: Node
      }), _dec5 = property({
        type: Node
      }), _dec6 = property({
        type: Node
      }), _dec(_class = (_class2 = class TabBar extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "homeTab", _descriptor, this);

          _initializerDefineProperty(this, "galaxyTab", _descriptor2, this);

          _initializerDefineProperty(this, "battleTab", _descriptor3, this);

          _initializerDefineProperty(this, "marketTab", _descriptor4, this);

          _initializerDefineProperty(this, "profileTab", _descriptor5, this);

          this.currentTab = 'home';
          this.onTabChange = null;
          this.tabs = [{
            id: 'home',
            icon: '🏠',
            name: '首页'
          }, {
            id: 'galaxy',
            icon: '🌌',
            name: '银河'
          }, {
            id: 'battle',
            icon: '⚔️',
            name: '战斗'
          }, {
            id: 'market',
            icon: '🏪',
            name: '市场'
          }, {
            id: 'profile',
            icon: '👤',
            name: '我的'
          }];
        }

        start() {
          this.initTabs();
        }

        initTabs() {
          // 动态创建Tab按钮
          this.tabs.forEach((tab, index) => {
            var x = -320 + index * 160;
            var isActive = tab.id === this.currentTab;
            this.createTabButton(tab, x, isActive);
          });
        }

        createTabButton(tab, x, active) {
          var node = new Node('Tab_' + tab.id);
          node.parent = this.node;
          node.setPosition(x, 0, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(120, 70);
          var color = active ? new Color(255, 215, 0) : new Color(150, 150, 150); // Icon

          this.addLabelToNode(node, tab.icon, 0, 10, 28, color); // Name

          this.addLabelToNode(node, tab.name, 0, -15, 16, color);
        }

        addLabelToNode(parent, text, x, y, fontSize, color) {
          var node = new Node('Label');
          node.parent = parent;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(100, fontSize + 4);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = fontSize + 2;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

        setOnTabChange(callback) {
          this.onTabChange = callback;
        }

        switchTab(tab) {
          if (tab !== this.currentTab) {
            this.currentTab = tab;

            if (this.onTabChange) {
              this.onTabChange(tab);
            } // 重新渲染TabBar


            this.node.removeAllChildren();
            this.initTabs();
          }
        }

        getCurrentTab() {
          return this.currentTab;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "homeTab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "galaxyTab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "battleTab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "marketTab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "profileTab", [_dec6], {
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
//# sourceMappingURL=e6adaf9e8e82f78932dfffc50678d1c9ce015f48.js.map