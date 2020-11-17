(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/http-utils'), require('@taquito/utils'), require('libsodium-wrappers'), require('elliptic'), require('typedarray-to-buffer')) :
    typeof define === 'function' && define.amd ? define(['exports', '@taquito/http-utils', '@taquito/utils', 'libsodium-wrappers', 'elliptic', 'typedarray-to-buffer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.taquitoRemoteSigner = {}, global.httpUtils, global.utils, global.sodium, global.elliptic, global.toBuffer));
}(this, (function (exports, httpUtils, utils, sodium, elliptic, toBuffer) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var sodium__default = /*#__PURE__*/_interopDefaultLegacy(sodium);
    var elliptic__default = /*#__PURE__*/_interopDefaultLegacy(elliptic);
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

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
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

    var pref = {
        ed: {
            pk: utils.prefix['edpk'],
            sk: utils.prefix['edsk'],
            pkh: utils.prefix.tz1,
            sig: utils.prefix.edsig,
        },
        p2: {
            pk: utils.prefix['p2pk'],
            sk: utils.prefix['p2sk'],
            pkh: utils.prefix.tz3,
            sig: utils.prefix.p2sig,
        },
        sp: {
            pk: utils.prefix['sppk'],
            sk: utils.prefix['spsk'],
            pkh: utils.prefix.tz2,
            sig: utils.prefix.spsig,
        },
    };
    var RemoteSigner = /** @class */ (function () {
        function RemoteSigner(pkh, rootUrl, options, http) {
            if (options === void 0) { options = {}; }
            if (http === void 0) { http = new httpUtils.HttpBackend(); }
            this.pkh = pkh;
            this.rootUrl = rootUrl;
            this.options = options;
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
                                    headers: this.options.headers,
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
                var bb, watermarkedBytes, signature, pref_1, decoded, signatureVerified, ex_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            bb = utils.hex2buf(bytes);
                            if (typeof watermark !== 'undefined') {
                                bb = utils.mergebuf(watermark, bb);
                            }
                            watermarkedBytes = utils.buf2hex(toBuffer__default['default'](bb));
                            return [4 /*yield*/, this.http.createRequest({
                                    url: this.createURL("/keys/" + this.pkh),
                                    method: 'POST',
                                    headers: this.options.headers,
                                }, watermarkedBytes)];
                        case 1:
                            signature = (_a.sent()).signature;
                            pref_1 = signature.startsWith('sig')
                                ? signature.substring(0, 3)
                                : signature.substring(0, 5);
                            if (!utils.isValidPrefix(pref_1)) {
                                throw new Error("Unsupported signature given by remote signer: " + signature);
                            }
                            decoded = utils.b58cdecode(signature, utils.prefix[pref_1]);
                            return [4 /*yield*/, this.verify(watermarkedBytes, signature)];
                        case 2:
                            signatureVerified = _a.sent();
                            if (!signatureVerified) {
                                throw new Error("Signature failed verification against public key:\n          {\n            bytes: " + watermarkedBytes + ",\n            signature: " + signature + "\n          }");
                            }
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    sig: utils.b58cencode(decoded, utils.prefix.sig),
                                    prefixSig: signature,
                                    sbytes: bytes + utils.buf2hex(toBuffer__default['default'](decoded)),
                                }];
                        case 3:
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
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        RemoteSigner.prototype.verify = function (bytes, signature) {
            return __awaiter(this, void 0, void 0, function () {
                var publicKey, curve, _publicKey, signaturePrefix, publicKeyHash, sig, bytesHash, key, hexSig, match, _a, r, s, key, hexSig, match, _b, r, s;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, sodium__default['default'].ready];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, this.publicKey()];
                        case 2:
                            publicKey = _c.sent();
                            curve = publicKey.substring(0, 2);
                            _publicKey = toBuffer__default['default'](utils.b58cdecode(publicKey, pref[curve].pk));
                            signaturePrefix = signature.startsWith('sig')
                                ? signature.substr(0, 3)
                                : signature.substr(0, 5);
                            if (!utils.isValidPrefix(signaturePrefix)) {
                                throw new Error("Unsupported signature given by remote signer: " + signature);
                            }
                            publicKeyHash = utils.b58cencode(sodium__default['default'].crypto_generichash(20, _publicKey), pref[curve].pkh);
                            if (publicKeyHash !== this.pkh) {
                                throw new Error("Requested public key does not match the initialized public key hash: {\n          publicKey: " + publicKey + ",\n          publicKeyHash: " + this.pkh + "\n        }");
                            }
                            if (signature.substring(0, 3) === 'sig') {
                                sig = utils.b58cdecode(signature, utils.prefix.sig);
                            }
                            else if (signature.substring(0, 5) === curve + "sig") {
                                sig = utils.b58cdecode(signature, pref[curve].sig);
                            }
                            else {
                                throw new Error("Invalid signature provided: " + signature);
                            }
                            bytesHash = sodium__default['default'].crypto_generichash(32, utils.hex2buf(bytes));
                            if (curve === 'ed') {
                                try {
                                    return [2 /*return*/, sodium__default['default'].crypto_sign_verify_detached(sig, bytesHash, _publicKey)];
                                }
                                catch (e) {
                                    return [2 /*return*/, false];
                                }
                            }
                            if (curve === 'sp') {
                                key = new elliptic__default['default'].ec('secp256k1').keyFromPublic(_publicKey);
                                hexSig = utils.buf2hex(toBuffer__default['default'](sig));
                                match = hexSig.match(/([a-f\d]{64})/gi);
                                if (match) {
                                    try {
                                        _a = __read(match, 2), r = _a[0], s = _a[1];
                                        return [2 /*return*/, key.verify(bytesHash, { r: r, s: s })];
                                    }
                                    catch (e) {
                                        return [2 /*return*/, false];
                                    }
                                }
                                return [2 /*return*/, false];
                            }
                            if (curve === 'p2') {
                                key = new elliptic__default['default'].ec('p256').keyFromPublic(_publicKey);
                                hexSig = utils.buf2hex(toBuffer__default['default'](sig));
                                match = hexSig.match(/([a-f\d]{64})/gi);
                                if (match) {
                                    try {
                                        _b = __read(match, 2), r = _b[0], s = _b[1];
                                        return [2 /*return*/, key.verify(bytesHash, { r: r, s: s })];
                                    }
                                    catch (e) {
                                        return [2 /*return*/, false];
                                    }
                                }
                                return [2 /*return*/, false];
                            }
                            throw new Error("Curve '" + curve + "' not supported");
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
