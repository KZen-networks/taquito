"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concat = function () {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
    }
    return arr.reduce(function (a, b) {
        var c = new Uint8Array(a.length + b.length);
        c.set(a);
        c.set(b, a.length);
        return c;
    }, new Uint8Array());
};
exports.toHexString = function (bytes) {
    return bytes.reduce(function (str, byte) { return str + byte.toString(16).padStart(2, '0'); }, '');
};
exports.pad = function (num, paddingLen) {
    if (paddingLen === void 0) { paddingLen = 8; }
    return num.toString(16).padStart(paddingLen, '0');
};
//# sourceMappingURL=utils.js.map