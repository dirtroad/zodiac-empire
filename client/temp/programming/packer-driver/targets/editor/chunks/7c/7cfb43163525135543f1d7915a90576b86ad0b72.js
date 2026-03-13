System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, api, gameState, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, ResourceBar;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfapi(extras) {
    _reporterNs.report("api", "../managers/ApiClient", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgameState(extras) {
    _reporterNs.report("gameState", "../managers/ApiClient", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUserData(extras) {
    _reporterNs.report("UserData", "../managers/ApiClient", _context.meta, extras);
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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      api = _unresolved_2.api;
      gameState = _unresolved_2.gameState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "09837tueMhJIZnT5CsisQWO", "ResourceBar", undefined); // 资源栏组件


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'UITransform', 'Layers']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ResourceBar", ResourceBar = (_dec = ccclass('ResourceBar'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Label), _dec(_class = (_class2 = class ResourceBar extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "goldLabel", _descriptor, this);

          _initializerDefineProperty(this, "diamondLabel", _descriptor2, this);

          _initializerDefineProperty(this, "timecoinLabel", _descriptor3, this);
        }

        start() {
          this.refresh();
        }

        async refresh() {
          const user = (_crd && gameState === void 0 ? (_reportPossibleCrUseOfgameState({
            error: Error()
          }), gameState) : gameState).user || (await (_crd && api === void 0 ? (_reportPossibleCrUseOfapi({
            error: Error()
          }), api) : api).getUserInfo());
          this.updateDisplay(user);
        }

        updateDisplay(user) {
          if (this.goldLabel) {
            this.goldLabel.string = this.formatNumber(user.gold);
          }

          if (this.diamondLabel) {
            this.diamondLabel.string = this.formatNumber(user.diamond);
          }

          if (this.timecoinLabel) {
            this.timecoinLabel.string = this.formatNumber(user.timeCoin);
          }
        }

        formatNumber(num) {
          if (num >= 10000) {
            return (num / 10000).toFixed(1) + 'w';
          }

          return num.toLocaleString();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "goldLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "diamondLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "timecoinLabel", [_dec4], {
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
//# sourceMappingURL=7cfb43163525135543f1d7915a90576b86ad0b72.js.map