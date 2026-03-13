System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Color, UITransform, Layers, _dec, _class, _crd, ccclass, property, MarketPage;

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

      _cclegacy._RF.push({}, "bcb5bLsxAZAr5ITYn+jmVwV", "MarketPage", undefined); // 市场页


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MarketPage", MarketPage = (_dec = ccclass('MarketPage'), _dec(_class = class MarketPage extends Component {
        start() {
          this.createUI();
        }

        createUI() {
          // 标题
          this.addLabel('🏪 星际市场', 0, 280, 36, new Color(100, 255, 200)); // 背景区域

          this.addColorBlock(0, 50, 920, 450, new Color(20, 40, 40, 200)); // 分类标签

          this.createCategoryTabs(); // 商品列表

          this.createProductList();
        }

        createCategoryTabs() {
          var tabs = ['全部', '装备', '资源', '道具'];
          tabs.forEach((t, i) => {
            var x = -350 + i * 180;
            var isActive = i === 0;
            this.addColorBlock(x, 230, 140, 40, isActive ? new Color(60, 100, 100, 220) : new Color(40, 60, 60, 180));
            this.addLabel(t, x, 230, 18, isActive ? new Color(100, 255, 200) : new Color(150, 150, 150));
          });
        }

        createProductList() {
          var products = [{
            name: '⚡ 星辰之剑',
            rarity: '史诗',
            price: 5000,
            seller: '星河旅人'
          }, {
            name: '🛡️ 银河护盾',
            rarity: '稀有',
            price: 2500,
            seller: '星际商人'
          }, {
            name: '💎 时间水晶x100',
            rarity: '普通',
            price: 1000,
            seller: '时光猎人'
          }, {
            name: '🔥 烈焰核心',
            rarity: '传说',
            price: 10000,
            seller: '炎帝'
          }];
          products.forEach((p, i) => {
            var y = 120 - i * 90; // 商品卡片

            this.addColorBlock(0, y, 880, 75, new Color(40, 60, 60, 200)); // 名称

            this.addLabel(p.name, -300, y + 15, 22, new Color(255, 255, 255)); // 稀有度

            var rarityColor = p.rarity === '传说' ? new Color(255, 180, 0) : p.rarity === '史诗' ? new Color(200, 100, 255) : p.rarity === '稀有' ? new Color(100, 180, 255) : new Color(180, 180, 180);
            this.addLabel(p.rarity, 50, y + 15, 16, rarityColor); // 价格

            this.addLabel("\uD83D\uDCB0 " + p.price, 250, y + 15, 18, new Color(255, 215, 0)); // 卖家

            this.addLabel("\u5356\u5BB6: " + p.seller, -300, y - 20, 14, new Color(150, 150, 150)); // 购买按钮

            this.addLabel('[ 购买 ]', 350, y, 16, new Color(100, 255, 100));
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
//# sourceMappingURL=ea4011acce444fc8cad7f553e903ed130bb1780d.js.map