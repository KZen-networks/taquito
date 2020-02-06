(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ws')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ws'], factory) :
  (global = global || self, factory(global.taquitoStreamer = {}, global.WS));
}(this, (function (exports, WS) { 'use strict';

  WS = WS && WS.hasOwnProperty('default') ? WS['default'] : WS;

  var DEFAULT_STREAMER_URL = 'wss://api.tez.ie/streamer/mainnet/subscribe';
  var Subscription = /** @class */ (function () {
      function Subscription(ws) {
          var _this = this;
          this.ws = ws;
          this.errorListeners = [];
          this.messageListeners = [];
          this.closeListeners = [];
          ws.onmessage = function (event) {
              _this.call(_this.messageListeners, JSON.parse(event.data.toString()));
          };
          ws.onclose = function (_event) {
              _this.call(_this.closeListeners);
          };
          ws.onerror = function (event) {
              _this.call(_this.messageListeners, event.error);
          };
      }
      Subscription.prototype.call = function (listeners, value) {
          for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
              var l = listeners_1[_i];
              try {
                  l(value);
              }
              catch (ex) {
                  console.error(ex);
              }
          }
      };
      Subscription.prototype.remove = function (listeners, value) {
          var idx = listeners.indexOf(value);
          if (idx !== -1) {
              listeners.splice(idx, 1);
          }
      };
      Subscription.prototype.on = function (type, cb) {
          switch (type) {
              case 'data':
                  this.messageListeners.push(cb);
                  break;
              case 'error':
                  this.errorListeners.push(cb);
                  break;
              case 'close':
                  this.closeListeners.push(cb);
                  break;
              default:
                  throw new Error("Trying to register on an unsupported event: " + type);
          }
      };
      Subscription.prototype.off = function (type, cb) {
          switch (type) {
              case 'data':
                  this.remove(this.messageListeners, cb);
                  break;
              case 'error':
                  this.remove(this.errorListeners, cb);
                  break;
              case 'close':
                  this.remove(this.closeListeners, cb);
                  break;
              default:
                  throw new Error("Trying to unregister on an unsupported event: " + type);
          }
      };
      Subscription.prototype.close = function () {
          this.ws.close();
      };
      return Subscription;
  }());
  var StreamerProvider = /** @class */ (function () {
      function StreamerProvider(url) {
          if (url === void 0) { url = DEFAULT_STREAMER_URL; }
          this.url = url;
      }
      StreamerProvider.prototype.subscribe = function (_filter) {
          var ws = new WS(this.url);
          return new Subscription(ws);
      };
      return StreamerProvider;
  }());

  exports.StreamerProvider = StreamerProvider;
  exports.Subscription = Subscription;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=taquito-streamer.umd.js.map
