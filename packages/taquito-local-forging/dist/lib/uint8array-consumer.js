"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Uint8ArrayConsumer = /** @class */ (function () {
    function Uint8ArrayConsumer(arr, offset) {
        if (offset === void 0) { offset = 0; }
        this.arr = arr;
        this.offset = offset;
    }
    Uint8ArrayConsumer.fromHexString = function (hex) {
        var lowHex = hex.toLowerCase();
        if (/^(([a-f]|\d){2})*$/.test(lowHex)) {
            var arr = new Uint8Array((lowHex.match(/([a-z]|\d){2}/g) || []).map(function (byte) { return parseInt(byte, 16); }));
            return new Uint8ArrayConsumer(arr);
        }
        else {
            throw new Error('Invalid hex string');
        }
    };
    Uint8ArrayConsumer.prototype.consume = function (count) {
        var subArr = this.arr.subarray(this.offset, this.offset + count);
        this.offset += count;
        return subArr;
    };
    Uint8ArrayConsumer.prototype.get = function (idx) {
        return this.arr[this.offset + idx];
    };
    Uint8ArrayConsumer.prototype.length = function () {
        return this.arr.length - this.offset;
    };
    return Uint8ArrayConsumer;
}());
exports.Uint8ArrayConsumer = Uint8ArrayConsumer;
//# sourceMappingURL=uint8array-consumer.js.map