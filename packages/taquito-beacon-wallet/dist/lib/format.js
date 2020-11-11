"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = require("bignumber.js");
var taquito_1 = require("@taquito/taquito");
var TZ_DECIMALS = 6;
var MTZ_DECIMALS = 3;
function tzFormatter(amount, format) {
    var bigNum = new bignumber_js_1.default(amount);
    if (bigNum.isNaN()) {
        return amount;
    }
    if (format === 'tz') {
        return taquito_1.Tezos.format('mutez', 'tz', amount) + " \uA729";
    }
    else if (format === 'mtz') {
        return taquito_1.Tezos.format('mutez', 'mtz', amount) + " m\uA729";
    }
    else {
        return bigNum.toString();
    }
}
exports.tzFormatter = tzFormatter;
//# sourceMappingURL=format.js.map