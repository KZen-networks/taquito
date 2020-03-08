"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var decoder_1 = require("./decoder");
var encoder_1 = require("./encoder");
var uint8array_consumer_1 = require("./uint8array-consumer");
var constants_2 = require("./constants");
exports.CODEC = constants_2.CODEC;
__export(require("./decoder"));
__export(require("./encoder"));
__export(require("./uint8array-consumer"));
function getCodec(codec) {
    return {
        encoder: encoder_1.encoders[codec],
        decoder: function (hex) {
            var consumer = uint8array_consumer_1.Uint8ArrayConsumer.fromHexString(hex);
            return decoder_1.decoders[codec](consumer);
        },
    };
}
exports.getCodec = getCodec;
var LocalForger = /** @class */ (function () {
    function LocalForger() {
        this.codec = getCodec(constants_1.CODEC.MANAGER);
    }
    LocalForger.prototype.forge = function (params) {
        return Promise.resolve(this.codec.encoder(params));
    };
    LocalForger.prototype.parse = function (hex) {
        return Promise.resolve(this.codec.decoder(hex));
    };
    return LocalForger;
}());
exports.LocalForger = LocalForger;
exports.localForger = new LocalForger();
//# sourceMappingURL=taquito-local-forging.js.map