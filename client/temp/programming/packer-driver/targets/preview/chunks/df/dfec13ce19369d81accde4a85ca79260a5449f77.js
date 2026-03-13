System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, _dec, _class, _crd, ccclass, property, BattlePage;

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

      _cclegacy._RF.push({}, "a9d3ckARX1N/qcKaCZo8XR+", "BattlePage", undefined); // 星际战斗页


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattlePage", BattlePage = (_dec = ccclass('BattlePage'), _dec(_class = class BattlePage extends Component {
        start() {
          this.createUI();
        }

        createUI() {
          // 标题
          this.addLabel('⚔️ 星际战斗', 0, 280, 36, new Color(255, 100, 100)); // 背景区域

          this.addColorBlock(0, 50, 920, 450, new Color(50, 20, 30, 200)); // 战斗模式选择

          this.addLabel('选择战斗模式', 0, 220, 24, new Color(255, 255, 255)); // 模式卡片

          this.createModeCards(); // 战斗记录

          this.addLabel('━━━━ 最近战绩 ━━━━', 0, -100, 18, new Color(150, 150, 150));
          this.addLabel('胜: 10  负: 3  胜率: 76.9%', 0, -140, 20, new Color(255, 255, 255)); // 排名

          this.addLabel('当前排名: #128', 0, -180, 18, new Color(255, 215, 0));
        }

        createModeCards() {
          var modes = [{
            name: '快速对战',
            desc: '随机匹配对手',
            icon: '⚡',
            color: new Color(100, 200, 255)
          }, {
            name: '排位赛',
            desc: '冲击更高排名',
            icon: '🏆',
            color: new Color(255, 215, 0)
          }, {
            name: '团队战',
            desc: '与队友并肩作战',
            icon: '👥',
            color: new Color(100, 255, 150)
          }];
          modes.forEach((m, i) => {
            var x = -300 + i * 300; // 卡片

            this.addColorBlock(x, 50, 250, 200, new Color(60, 40, 50, 220)); // 图标

            this.addLabel(m.icon, x, 100, 48, m.color); // 名称

            this.addLabel(m.name, x, 30, 24, new Color(255, 255, 255)); // 描述

            this.addLabel(m.desc, x, -10, 16, new Color(180, 180, 180)); // 开始按钮

            this.addLabel('[ 开始 ]', x, -60, 18, new Color(100, 255, 100));
          });
        }

        addLabel(text, x, y, fontSize, color) {
          var node = new Node('Label');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(600, fontSize + 10);
          var label = node.addComponent(Label);
          label.string = text;
          label.fontSize = fontSize;
          label.lineHeight = fontSize + 4;
          label.color = color;
          label.horizontalAlign = Label.HorizontalAlign.CENTER;
        }

        addColorBlock(x, y, width, height, color) {
          var node = new Node('Block');
          node.parent = this.node;
          node.setPosition(x, y, 0);
          node.layer = Layers.Enum.UI_2D;
          var uiTransform = node.addComponent(UITransform);
          uiTransform.setContentSize(width, height);
          var label = node.addComponent(Label);
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
//# sourceMappingURL=dfec13ce19369d81accde4a85ca79260a5449f77.js.map