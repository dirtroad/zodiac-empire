System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, _dec, _class, _crd, ccclass, property, GalaxyPage;

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

      _cclegacy._RF.push({}, "5b7c0Wi/WZJyq2Mr7wZR17j", "GalaxyPage", undefined); // 银河探索页


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GalaxyPage", GalaxyPage = (_dec = ccclass('GalaxyPage'), _dec(_class = class GalaxyPage extends Component {
        start() {
          this.createUI();
        }

        createUI() {
          // 标题
          this.addLabel('🌌 银河探索', 0, 280, 36, new Color(255, 255, 255)); // 背景区域

          this.addColorBlock(0, 50, 920, 450, new Color(20, 30, 50, 200)); // 我的银河

          this.addLabel('我的银河', -350, 240, 24, new Color(255, 215, 0)); // 银河卡片

          this.createGalaxyCards(); // 探索按钮

          this.addLabel('🔍 探索新星域', 0, -200, 28, new Color(100, 200, 255));
          this.addLabel('消耗 100 金币探索未知星域', 0, -240, 16, new Color(150, 150, 150));
        }

        createGalaxyCards() {
          const galaxies = [{
            name: '银河一号',
            type: '普通星系',
            level: 1,
            production: 100
          }, {
            name: '银河二号',
            type: '星云',
            level: 2,
            production: 250
          }, {
            name: '银河三号',
            type: '黑洞',
            level: 3,
            production: 500
          }];
          galaxies.forEach((g, i) => {
            const x = -300 + i * 300; // 卡片

            this.addColorBlock(x, 50, 250, 180, new Color(40, 50, 80, 220)); // 银河名称

            this.addLabel(g.name, x, 100, 24, new Color(255, 255, 255)); // 类型

            this.addLabel(g.type, x, 60, 18, new Color(150, 180, 255)); // 等级

            this.addLabel(`Lv.${g.level}`, x, 20, 16, new Color(255, 215, 0)); // 产量

            this.addLabel(`产量: ${g.production}/h`, x, -20, 16, new Color(100, 255, 100));
          });
        }

        addLabel(text, x, y, fontSize, color) {
          const node = new Node('Label');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          const uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(600, fontSize + 10);
          const label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = fontSize + 4;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

        addColorBlock(x, y, width, height, color) {
          const node = new Node('Block');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          const uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(width, height);
          const label = node.addComponent(Label);
          label.string = '█'.repeat(Math.floor(width / 20));
          label.fontSize = height;
          label.lineHeight = height;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=56545cf34a5d79665c093531e799646a28fab7ba.js.map