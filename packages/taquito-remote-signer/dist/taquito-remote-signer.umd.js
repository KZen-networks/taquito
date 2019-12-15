(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/utils'), require('@taquito/http-utils'), require('typedarray-to-buffer')) :
    typeof define === 'function' && define.amd ? define(['exports', '@taquito/utils', '@taquito/http-utils', 'typedarray-to-buffer'], factory) :
    (global = global || self, factory(global.taquitoRemoteSigner = {}, global.utils, global.httpUtils, global.toBuffer));
}(this, (function (exports, utils, httpUtils, toBuffer) { 'use strict';

    toBuffer = toBuffer && toBuffer.hasOwnProperty('default') ? toBuffer['default'] : toBuffer;

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

    var KeyNotFoundError = /** @class */ (function () {
        function KeyNotFoundError(message, innerException) {
            this.message = message;
            this.innerException = innerException;
            this.name = 'KeyNotFoundError';
        }
        return KeyNotFoundError;
    }());
    var OperationNotAuthorizedError = /** @class */ (function () {
        function OperationNotAuthorizedError(message, innerException) {
            this.message = message;
            this.innerException = innerException;
            this.name = 'OperationNotAuthorized';
        }
        return OperationNotAuthorizedError;
    }());
    var BadSigningDataError = /** @class */ (function () {
        function BadSigningDataError(message, innerException, data) {
            this.message = message;
            this.innerException = innerException;
            this.data = data;
            this.name = 'BadSigningData';
        }
        return BadSigningDataError;
    }());

    var RemoteSigner = /** @class */ (function () {
        function RemoteSigner(pkh, rootUrl, http) {
            if (http === void 0) { http = new httpUtils.HttpBackend(); }
            this.pkh = pkh;
            this.rootUrl = rootUrl;
            this.http = http;
        }
        RemoteSigner.prototype.publicKeyHash = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pkh];
                });
            });
        };
        RemoteSigner.prototype.createURL = function (path) {
            // Trim trailing slashes because it is assumed to be included in path
            return "" + this.rootUrl.replace(/\/+$/g, '') + path;
        };
        RemoteSigner.prototype.publicKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                var public_key, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.http.createRequest({
                                    url: this.createURL("/keys/" + this.pkh),
                                    method: 'GET',
                                })];
                        case 1:
                            public_key = (_a.sent()).public_key;
                            return [2 /*return*/, public_key];
                        case 2:
                            ex_1 = _a.sent();
                            if (ex_1 instanceof httpUtils.HttpResponseError) {
                                if (ex_1.status === httpUtils.STATUS_CODE.NOT_FOUND) {
                                    throw new KeyNotFoundError("Key not found: " + this.pkh, ex_1);
                                }
                            }
                            throw ex_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        RemoteSigner.prototype.secretKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error('Secret key cannot be exposed');
                });
            });
        };
        RemoteSigner.prototype.sign = function (bytes, watermark) {
            return __awaiter(this, void 0, void 0, function () {
                var bb, signature, pref, decoded, ex_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            bb = utils.hex2buf(bytes);
                            if (typeof watermark !== 'undefined') {
                                bb = utils.mergebuf(watermark, bb);
                            }
                            return [4 /*yield*/, this.http.createRequest({ url: this.createURL("/keys/" + this.pkh), method: 'POST' }, utils.buf2hex(toBuffer(bb)))];
                        case 1:
                            signature = (_a.sent()).signature;
                            pref = signature.startsWith('sig') ? signature.substr(0, 3) : signature.substr(0, 5);
                            decoded = utils.b58cdecode(signature, utils.prefix[pref]);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    sig: utils.b58cencode(decoded, utils.prefix.sig),
                                    prefixSig: signature,
                                    sbytes: bytes + utils.buf2hex(toBuffer(decoded)),
                                }];
                        case 2:
                            ex_2 = _a.sent();
                            if (ex_2 instanceof httpUtils.HttpResponseError) {
                                if (ex_2.status === httpUtils.STATUS_CODE.NOT_FOUND) {
                                    throw new KeyNotFoundError("Key not found: " + this.pkh, ex_2);
                                }
                                else if (ex_2.status === httpUtils.STATUS_CODE.FORBIDDEN) {
                                    throw new OperationNotAuthorizedError('Signing Operation not authorized', ex_2);
                                }
                                else if (ex_2.status === httpUtils.STATUS_CODE.BAD_REQUEST) {
                                    throw new BadSigningDataError('Invalid data', ex_2, {
                                        bytes: bytes,
                                        watermark: watermark,
                                    });
                                }
                            }
                            throw ex_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return RemoteSigner;
    }());

    exports.RemoteSigner = RemoteSigner;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=taquito-remote-signer.umd.js.map
