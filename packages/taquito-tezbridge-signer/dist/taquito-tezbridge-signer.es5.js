import { isValidPrefix, b58cdecode, prefix, b58cencode, buf2hex } from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
                        if (!isValidPrefix(pref)) {
                            throw new Error('Unsupported signature given by tezbridge: ' + prefixSig);
                        }
                        decoded = b58cdecode(prefixSig, prefix[pref]);
                        return [2 /*return*/, {
                                bytes: bytes,
                                sig: b58cencode(decoded, prefix.sig),
                                prefixSig: prefixSig,
                                sbytes: bytes + buf2hex(toBuffer(decoded)),
                            }];
                }
            });
        });
    };
    return TezBridgeSigner;
}());

export { TezBridgeSigner };
//# sourceMappingURL=taquito-tezbridge-signer.es5.js.map
