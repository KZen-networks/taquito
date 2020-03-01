"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@taquito/utils");
var typedarray_to_buffer_1 = require("typedarray-to-buffer");
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
                        if (!utils_1.isValidPrefix(pref)) {
                            throw new Error('Unsupported signature given by tezbridge: ' + prefixSig);
                        }
                        decoded = utils_1.b58cdecode(prefixSig, utils_1.prefix[pref]);
                        return [2 /*return*/, {
                                bytes: bytes,
                                sig: utils_1.b58cencode(decoded, utils_1.prefix.sig),
                                prefixSig: prefixSig,
                                sbytes: bytes + utils_1.buf2hex(typedarray_to_buffer_1.default(decoded)),
                            }];
                }
            });
        });
    };
    return TezBridgeSigner;
}());
exports.TezBridgeSigner = TezBridgeSigner;
//# sourceMappingURL=taquito-tezbridge-signer.js.map