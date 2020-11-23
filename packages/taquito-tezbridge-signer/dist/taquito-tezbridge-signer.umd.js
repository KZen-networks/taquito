(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/utils'), require('typedarray-to-buffer')) :
    typeof define === 'function' && define.amd ? define(['exports', '@taquito/utils', 'typedarray-to-buffer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.taquitoTezbridgeSigner = {}, global.utils, global.toBuffer));
}(this, (function (exports, utils, toBuffer) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var toBuffer__default = /*#__PURE__*/_interopDefaultLegacy(toBuffer);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var TezBridgeSigner = /** @class */ (function () {
        function TezBridgeSigner() {
            if (typeof tezbridge === 'undefined') {
                throw new Error('tezbridge plugin could not be detected in your browser');
            }
        }
        TezBridgeSigner.prototype.publicKeyHash = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tezbridge.request({ method: 'get_source' })];
                });
            });
        };
        TezBridgeSigner.prototype.publicKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error('Public key cannot be exposed');
                });
            });
        };
        TezBridgeSigner.prototype.secretKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error('Secret key cannot be exposed');
                });
            });
        };
        TezBridgeSigner.prototype.sign = function (bytes, _watermark) {
            return __awaiter(this, void 0, void 0, function () {
                var prefixSig, pref, decoded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tezbridge.request({
                                method: 'raw_sign',
                                bytes: bytes,
                            })];
                        case 1:
                            prefixSig = _a.sent();
                            pref = prefixSig.substr(0, 5);
                            if (!utils.isValidPrefix(pref)) {
                                throw new Error('Unsupported signature given by tezbridge: ' + prefixSig);
                            }
                            decoded = utils.b58cdecode(prefixSig, utils.prefix[pref]);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    sig: utils.b58cencode(decoded, utils.prefix.sig),
                                    prefixSig: prefixSig,
                                    sbytes: bytes + utils.buf2hex(toBuffer__default['default'](decoded)),
                                }];
                    }
                });
            });
        };
        return TezBridgeSigner;
    }());

    exports.TezBridgeSigner = TezBridgeSigner;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=taquito-tezbridge-signer.umd.js.map
