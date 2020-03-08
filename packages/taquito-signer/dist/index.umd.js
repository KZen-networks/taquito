(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/utils'), require('libsodium-wrappers'), require('typedarray-to-buffer'), require('pbkdf2'), require('bip39')) :
    typeof define === 'function' && define.amd ? define(['exports', '@taquito/utils', 'libsodium-wrappers', 'typedarray-to-buffer', 'pbkdf2', 'bip39'], factory) :
    (global = global || self, factory(global.taquitoSigner = {}, global.utils, global.sodium$2, global.toBuffer$2, global.pbkdf2, global.bip39));
}(this, (function (exports, utils, sodium$2, toBuffer$2, pbkdf2, bip39) { 'use strict';

    sodium$2 = sodium$2 && sodium$2.hasOwnProperty('default') ? sodium$2['default'] : sodium$2;
    toBuffer$2 = toBuffer$2 && toBuffer$2.hasOwnProperty('default') ? toBuffer$2['default'] : toBuffer$2;
    pbkdf2 = pbkdf2 && pbkdf2.hasOwnProperty('default') ? pbkdf2['default'] : pbkdf2;

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

    /**
     * @description Provide signing logic for ed25519 curve based key (tz1)
     */
    var Tz1 = /** @class */ (function () {
        /**
         *
         * @param key Encoded private key
         * @param encrypted Is the private key encrypted
         * @param decrypt Decrypt function
         */
        function Tz1(key, encrypted, decrypt) {
            this.key = key;
            var keyPrefix = key.substr(0, encrypted ? 5 : 4);
            if (!utils.isValidPrefix(keyPrefix)) {
                throw new Error('key contains invalid prefix');
            }
            this._key = decrypt(utils.b58cdecode(this.key, utils.prefix[keyPrefix]));
            this._publicKey = this._key.slice(32);
            if (!this._key) {
                throw new Error('Unable to decode key');
            }
            this.isInit = this.init();
        }
        Tz1.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, publicKey, privateKey;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, sodium$2.ready];
                        case 1:
                            _b.sent();
                            if (this._key.length !== 64) {
                                _a = sodium$2.crypto_sign_seed_keypair(new Uint8Array(this._key), 'uint8array'), publicKey = _a.publicKey, privateKey = _a.privateKey;
                                this._publicKey = publicKey;
                                this._key = privateKey;
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         *
         * @param bytes Bytes to sign
         * @param bytesHash Blake2b hash of the bytes to sign
         */
        Tz1.prototype.sign = function (bytes, bytesHash) {
            return __awaiter(this, void 0, void 0, function () {
                var signature, signatureBuffer, sbytes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isInit];
                        case 1:
                            _a.sent();
                            signature = sodium$2.crypto_sign_detached(new Uint8Array(bytesHash), new Uint8Array(this._key));
                            signatureBuffer = toBuffer$2(signature);
                            sbytes = bytes + utils.buf2hex(signatureBuffer);
                            return [2 /*return*/, {
                                    bytes: bytes,
                                    sig: utils.b58cencode(signature, utils.prefix.sig),
                                    prefixSig: utils.b58cencode(signature, utils.prefix.edsig),
                                    sbytes: sbytes,
                                }];
                    }
                });
            });
        };
        /**
         * @returns Encoded public key
         */
        Tz1.prototype.publicKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isInit];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, utils.b58cencode(this._publicKey, utils.prefix['edpk'])];
                    }
                });
            });
        };
        /**
         * @returns Encoded public key hash
         */
        Tz1.prototype.publicKeyHash = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isInit];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, sodium$2.ready];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, utils.b58cencode(sodium$2.crypto_generichash(20, new Uint8Array(this._publicKey)), utils.prefix.tz1)];
                    }
                });
            });
        };
        /**
         * @returns Encoded private key
         */
        Tz1.prototype.secretKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                var key, privateKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isInit];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, sodium$2.ready];
                        case 2:
                            _a.sent();
                            key = this._key;
                            privateKey = sodium$2.crypto_sign_seed_keypair(new Uint8Array(key).slice(0, 32), 'uint8array').privateKey;
                            key = toBuffer$2(privateKey);
                            return [2 /*return*/, utils.b58cencode(key, utils.prefix["edsk"])];
                    }
                });
            });
        };
        return Tz1;
    }());

    var sodium = require('libsodium-wrappers');
    var toBuffer = require('typedarray-to-buffer');
    var elliptic = require('elliptic');
    var pref = {
        p256: {
            pk: utils.prefix['p2pk'],
            sk: utils.prefix['p2sk'],
            pkh: utils.prefix.tz3,
            sig: utils.prefix.p2sig,
        },
        secp256k1: {
            pk: utils.prefix['sppk'],
            sk: utils.prefix['spsk'],
            pkh: utils.prefix.tz2,
            sig: utils.prefix.spsig,
        },
    };
    /**
     * @description Provide signing logic for elliptic curve based key (tz2, tz3)
     */
    var ECKey = /** @class */ (function () {
        /**
         *
         * @param curve Curve to use with the key
         * @param key Encoded private key
         * @param encrypted Is the private key encrypted
         * @param decrypt Decrypt function
         */
        function ECKey(curve, key, encrypted, decrypt) {
            this.curve = curve;
            this.key = key;
            var keyPrefix = key.substr(0, encrypted ? 5 : 4);
            if (!utils.isValidPrefix(keyPrefix)) {
                throw new Error('key contains invalid prefix');
            }
            this._key = decrypt(utils.b58cdecode(this.key, utils.prefix[keyPrefix]));
            var keyPair = new elliptic.ec(this.curve).keyFromPrivate(this._key);
            var pref = keyPair
                .getPublic()
                .getY()
                .toArray()[31] % 2
                ? 3
                : 2;
            this._publicKey = toBuffer(new Uint8Array([pref].concat(keyPair
                .getPublic()
                .getX()
                .toArray())));
        }
        /**
         *
         * @param bytes Bytes to sign
         * @param bytesHash Blake2b hash of the bytes to sign
         */
        ECKey.prototype.sign = function (bytes, bytesHash) {
            return __awaiter(this, void 0, void 0, function () {
                var key, sig, signature, signatureBuffer, sbytes;
                return __generator(this, function (_a) {
                    key = new elliptic.ec(this.curve).keyFromPrivate(this._key);
                    sig = key.sign(bytesHash, { canonical: true });
                    signature = new Uint8Array(sig.r.toArray().concat(sig.s.toArray()));
                    signatureBuffer = toBuffer(signature);
                    sbytes = bytes + utils.buf2hex(signatureBuffer);
                    return [2 /*return*/, {
                            bytes: bytes,
                            sig: utils.b58cencode(signature, utils.prefix.sig),
                            prefixSig: utils.b58cencode(signature, pref[this.curve].sig),
                            sbytes: sbytes,
                        }];
                });
            });
        };
        /**
         * @returns Encoded public key
         */
        ECKey.prototype.publicKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, utils.b58cencode(this._publicKey, pref[this.curve].pk)];
                });
            });
        };
        /**
         * @returns Encoded public key hash
         */
        ECKey.prototype.publicKeyHash = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sodium.ready];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, utils.b58cencode(sodium.crypto_generichash(20, new Uint8Array(this._publicKey)), pref[this.curve].pkh)];
                    }
                });
            });
        };
        /**
         * @returns Encoded private key
         */
        ECKey.prototype.secretKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                var key;
                return __generator(this, function (_a) {
                    key = this._key;
                    return [2 /*return*/, utils.b58cencode(key, pref[this.curve].sk)];
                });
            });
        };
        return ECKey;
    }());
    /**
     * @description Tz3 key class using the p256 curve
     */
    var Tz3 = ECKey.bind(null, 'p256');
    /**
     * @description Tz3 key class using the secp256k1 curve
     */
    var Tz2 = ECKey.bind(null, 'secp256k1');

    var sodium$1 = require('libsodium-wrappers');
    var toBuffer$1 = require('typedarray-to-buffer');
    /**
     * @description A local implementation of the signer. Will represent a Tezos account and be able to produce signature in its behalf
     *
     * @warn If running in production and dealing with tokens that have real value, it is strongly recommended to use a HSM backed signer so that private key material is not stored in memory or on disk
     *
     * @warn Calling this constructor directly is discouraged as it do not await for sodium library to be loaded.
     *
     * Consider doing:
     *
     * ```const sodium = require('libsodium-wrappers'); await sodium.ready;```
     *
     * The recommended usage is to use InMemorySigner.fromSecretKey('edsk', 'passphrase')
     */
    var InMemorySigner = /** @class */ (function () {
        /**
         *
         * @param key Encoded private key
         * @param passphrase Passphrase to decrypt the private key if it is encrypted
         *
         */
        function InMemorySigner(key, passphrase) {
            var encrypted = key.substring(2, 3) === 'e';
            var decrypt = function (k) { return k; };
            if (encrypted) {
                if (!passphrase) {
                    throw new Error('Encrypted key provided without a passphrase.');
                }
                decrypt = function (constructedKey) {
                    var salt = toBuffer$1(constructedKey.slice(0, 8));
                    var encryptedSk = constructedKey.slice(8);
                    var encryptionKey = pbkdf2.pbkdf2Sync(passphrase, salt, 32768, 32, 'sha512');
                    return sodium$1.crypto_secretbox_open_easy(new Uint8Array(encryptedSk), new Uint8Array(24), new Uint8Array(encryptionKey));
                };
            }
            switch (key.substr(0, 4)) {
                case 'edes':
                case 'edsk':
                    this._key = new Tz1(key, encrypted, decrypt);
                    break;
                case 'spsk':
                case 'spes':
                    this._key = new Tz2(key, encrypted, decrypt);
                    break;
                case 'p2sk':
                case 'p2es':
                    this._key = new Tz3(key, encrypted, decrypt);
                    break;
                default:
                    throw new Error('Unsupported key type');
            }
        }
        InMemorySigner.fromFundraiser = function (email, password, mnemonic) {
            var seed = bip39.mnemonicToSeedSync(mnemonic, "" + email + password);
            var key = utils.b58cencode(seed.slice(0, 32), utils.prefix.edsk2);
            return new InMemorySigner(key);
        };
        InMemorySigner.fromSecretKey = function (key, passphrase) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, sodium$1.ready];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, new InMemorySigner(key, passphrase)];
                    }
                });
            });
        };
        /**
         *
         * @param bytes Bytes to sign
         * @param watermark Watermark to append to the bytes
         */
        InMemorySigner.prototype.sign = function (bytes, watermark) {
            return __awaiter(this, void 0, void 0, function () {
                var bb, bytesHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bb = utils.hex2buf(bytes);
                            if (typeof watermark !== 'undefined') {
                                bb = utils.mergebuf(watermark, bb);
                            }
                            // Ensure sodium is ready before calling crypto_generichash otherwise the function do not exists
                            return [4 /*yield*/, sodium$1.ready];
                        case 1:
                            // Ensure sodium is ready before calling crypto_generichash otherwise the function do not exists
                            _a.sent();
                            bytesHash = toBuffer$1(sodium$1.crypto_generichash(32, bb));
                            return [2 /*return*/, this._key.sign(bytes, bytesHash)];
                    }
                });
            });
        };
        /**
         * @returns Encoded public key
         */
        InMemorySigner.prototype.publicKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._key.publicKey()];
                });
            });
        };
        /**
         * @returns Encoded public key hash
         */
        InMemorySigner.prototype.publicKeyHash = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._key.publicKeyHash()];
                });
            });
        };
        /**
         * @returns Encoded private key
         */
        InMemorySigner.prototype.secretKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._key.secretKey()];
                });
            });
        };
        return InMemorySigner;
    }());

    exports.InMemorySigner = InMemorySigner;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
