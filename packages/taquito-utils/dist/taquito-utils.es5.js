import { Buffer } from 'buffer';

var prefix = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    KT: new Uint8Array([2, 90, 121]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    edsk2: new Uint8Array([13, 15, 58, 7]),
    spsk: new Uint8Array([17, 162, 224, 201]),
    p2sk: new Uint8Array([16, 81, 238, 189]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    p2pk: new Uint8Array([3, 178, 139, 127]),
    edesk: new Uint8Array([7, 90, 60, 179, 41]),
    spesk: new Uint8Array([0x09, 0xed, 0xf1, 0xae, 0x96]),
    p2esk: new Uint8Array([0x09, 0x30, 0x39, 0x73, 0xab]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    spsig: new Uint8Array([13, 115, 101, 19, 63]),
    p2sig: new Uint8Array([54, 240, 44, 52]),
    sig: new Uint8Array([4, 130, 43]),
    Net: new Uint8Array([87, 82, 0]),
    nce: new Uint8Array([69, 220, 169]),
    b: new Uint8Array([1, 52]),
    o: new Uint8Array([5, 116]),
    Lo: new Uint8Array([133, 233]),
    LLo: new Uint8Array([29, 159, 109]),
    P: new Uint8Array([2, 170]),
    Co: new Uint8Array([79, 179]),
    id: new Uint8Array([153, 103]),
    expr: new Uint8Array([13, 44, 64, 27]),
    // Legacy prefix
    TZ: new Uint8Array([2, 90, 121]),
};

var blake = require('blakejs');
var bs58check = require('bs58check');
function encodeExpr(value) {
    var blakeHash = blake.blake2b(hex2buf(value), null, 32);
    return b58cencode(blakeHash, prefix['expr']);
}
/**
 *
 * @description Base58 encode a string or a Uint8Array and append a prefix to it
 *
 * @param value Value to base58 encode
 * @param prefix prefix to append to the encoded string
 */
function b58cencode(value, prefix) {
    var payloadAr = typeof value === 'string' ? Uint8Array.from(Buffer.from(value, 'hex')) : value;
    var n = new Uint8Array(prefix.length + payloadAr.length);
    n.set(prefix);
    n.set(payloadAr, prefix.length);
    return bs58check.encode(Buffer.from(n.buffer));
}
/**
 *
 * @description Base58 decode a string and remove the prefix from it
 *
 * @param value Value to base58 decode
 * @param prefix prefix to remove from the decoded string
 */
var b58cdecode = function (enc, prefixArg) {
    return bs58check.decode(enc).slice(prefixArg.length);
};
/**
 *
 * @description Base58 decode a string with predefined prefix
 *
 * @param value Value to base58 decode
 */
function b58decode(payload) {
    var _a;
    var buf = bs58check.decode(payload);
    var prefixMap = (_a = {},
        _a[prefix.tz1.toString()] = '0000',
        _a[prefix.tz2.toString()] = '0001',
        _a[prefix.tz3.toString()] = '0002',
        _a);
    var pref = prefixMap[new Uint8Array(buf.slice(0, 3)).toString()];
    if (pref) {
        // tz addresses
        var hex = buf2hex(buf.slice(3));
        return pref + hex;
    }
    else {
        // other (kt addresses)
        return '01' + buf2hex(buf.slice(3, 42)) + '00';
    }
}
/**
 *
 * @description Base58 encode a public key using predefined prefix
 *
 * @param value Public Key to base58 encode
 */
function encodePubKey(value) {
    if (value.substring(0, 2) === '00') {
        var pref = {
            '0000': prefix.tz1,
            '0001': prefix.tz2,
            '0002': prefix.tz3,
        };
        return b58cencode(value.substring(4), pref[value.substring(0, 4)]);
    }
    return b58cencode(value.substring(2, 42), prefix.KT);
}
function encodeKey(value) {
    if (value[0] === '0') {
        var pref = {
            '00': new Uint8Array([13, 15, 37, 217]),
            '01': new Uint8Array([3, 254, 226, 86]),
            '02': new Uint8Array([3, 178, 139, 127]),
        };
        return b58cencode(value.substring(2), pref[value.substring(0, 2)]);
    }
}
function encodeKeyHash(value) {
    if (value[0] === '0') {
        var pref = {
            '00': new Uint8Array([6, 161, 159]),
            '01': new Uint8Array([6, 161, 161]),
            '02': new Uint8Array([6, 161, 164]),
        };
        return b58cencode(value.substring(2), pref[value.substring(0, 2)]);
    }
}
/**
 *
 * @description Convert an hex string to a Uint8Array
 *
 * @param hex Hex string to convert
 */
var hex2buf = function (hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16); }));
};
/**
 *
 * @description Generate a random hex nonce
 *
 * @param length length of the nonce
 */
var hexNonce = function (length) {
    var chars = '0123456789abcedf';
    var hex = '';
    while (length--) {
        hex += chars[(Math.random() * 16) | 0];
    }
    return hex;
};
/**
 *
 * @description Merge 2 buffers together
 *
 * @param b1 First buffer
 * @param b2 Second buffer
 */
var mergebuf = function (b1, b2) {
    var r = new Uint8Array(b1.length + b2.length);
    r.set(b1);
    r.set(b2, b1.length);
    return r;
};
/**
 *
 * @description Convert a michelson string expression to it's json representation
 *
 * @param mi Michelson string expression to convert to json
 */
var sexp2mic = function me(mi) {
    mi = mi
        .replace(/(?:@[a-z_]+)|(?:#.*$)/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (mi.charAt(0) === '(')
        mi = mi.slice(1, -1);
    var pl = 0;
    var sopen = false;
    var escaped = false;
    var ret = {
        prim: '',
        args: [],
    };
    var val = '';
    for (var i = 0; i < mi.length; i++) {
        if (escaped) {
            val += mi[i];
            escaped = false;
            continue;
        }
        else if ((i === mi.length - 1 && sopen === false) ||
            (mi[i] === ' ' && pl === 0 && sopen === false)) {
            if (i === mi.length - 1)
                val += mi[i];
            if (val) {
                if (val === parseInt(val, 10).toString()) {
                    if (!ret.prim)
                        return { int: val };
                    ret.args.push({ int: val });
                }
                else if (val[0] === '0' && val[1] === 'x') {
                    val = val.substr(2);
                    if (!ret.prim)
                        return { bytes: val };
                    ret.args.push({ bytes: val });
                }
                else if (ret.prim) {
                    ret.args.push(me(val));
                }
                else {
                    ret.prim = val;
                }
                val = '';
            }
            continue;
        }
        else if (mi[i] === '"' && sopen) {
            sopen = false;
            if (!ret.prim)
                return { string: val };
            ret.args.push({ string: val });
            val = '';
            continue;
        }
        else if (mi[i] === '"' && !sopen && pl === 0) {
            sopen = true;
            continue;
        }
        else if (mi[i] === '\\')
            escaped = true;
        else if (mi[i] === '(')
            pl++;
        else if (mi[i] === ')')
            pl--;
        val += mi[i];
    }
    return ret;
};
/**
 *
 * @description Flatten a michelson json representation to an array
 *
 * @param s michelson json
 */
var mic2arr = function me2(s) {
    var ret = [];
    if (Object.prototype.hasOwnProperty.call(s, 'prim')) {
        if (s.prim === 'Pair') {
            ret.push(me2(s.args[0]));
            ret = ret.concat(me2(s.args[1]));
        }
        else if (s.prim === 'Elt') {
            ret = {
                key: me2(s.args[0]),
                val: me2(s.args[1]),
            };
        }
        else if (s.prim === 'True') {
            ret = true;
        }
        else if (s.prim === 'False') {
            ret = false;
        }
    }
    else if (Array.isArray(s)) {
        var sc = s.length;
        for (var i = 0; i < sc; i++) {
            var n = me2(s[i]);
            if (typeof n.key !== 'undefined') {
                if (Array.isArray(ret)) {
                    ret = {
                        keys: [],
                        vals: [],
                    };
                }
                ret.keys.push(n.key);
                ret.vals.push(n.val);
            }
            else {
                ret.push(n);
            }
        }
    }
    else if (Object.prototype.hasOwnProperty.call(s, 'string')) {
        ret = s.string;
    }
    else if (Object.prototype.hasOwnProperty.call(s, 'int')) {
        ret = parseInt(s.int, 10);
    }
    else {
        ret = s;
    }
    return ret;
};
/**
 *
 * @description Convert a michelson string to it's json representation
 *
 * @param mi Michelson string to convert to json
 *
 * @warn This implementation of the Michelson parser is a prototype. The current implementation is naïve. We are likely going to switch to using the Nomadic Michelson encoder in the future, as per Issue https://gitlab.com/tezos/tezos/issues/581
 */
var ml2mic = function me(mi) {
    var ret = [];
    var inseq = false;
    var seq = '';
    var val = '';
    var pl = 0;
    var bl = 0;
    var sopen = false;
    var escaped = false;
    for (var i = 0; i < mi.length; i++) {
        if (val === '}' || val === ';') {
            val = '';
        }
        if (inseq) {
            if (mi[i] === '}') {
                bl--;
            }
            else if (mi[i] === '{') {
                bl++;
            }
            if (bl === 0) {
                var st = me(val);
                ret.push({
                    prim: seq.trim(),
                    args: [st],
                });
                val = '';
                bl = 0;
                inseq = false;
            }
        }
        else if (mi[i] === '{') {
            bl++;
            seq = val;
            val = '';
            inseq = true;
            continue;
        }
        else if (escaped) {
            val += mi[i];
            escaped = false;
            continue;
        }
        else if ((i === mi.length - 1 && sopen === false) ||
            (mi[i] === ';' && pl === 0 && sopen === false)) {
            if (i === mi.length - 1)
                val += mi[i];
            if (val.trim() === '' || val.trim() === '}' || val.trim() === ';') {
                val = '';
                continue;
            }
            ret.push(sexp2mic(val));
            val = '';
            continue;
        }
        else if (mi[i] === '"' && sopen) {
            sopen = false;
        }
        else if (mi[i] === '"' && !sopen) {
            sopen = true;
        }
        else if (mi[i] === '\\') {
            escaped = true;
        }
        else if (mi[i] === '(') {
            pl++;
        }
        else if (mi[i] === ')') {
            pl--;
        }
        val += mi[i];
    }
    return ret;
};
/**
 *
 * @description Convert a buffer to an hex string
 *
 * @param buffer Buffer to convert
 */
var buf2hex = function (buffer) {
    var byteArray = new Uint8Array(buffer);
    var hexParts = [];
    byteArray.forEach(function (byte) {
        var hex = byte.toString(16);
        var paddedHex = ("00" + hex).slice(-2);
        hexParts.push(paddedHex);
    });
    return hexParts.join('');
};

export { b58cdecode, b58cencode, b58decode, buf2hex, encodeExpr, encodeKey, encodeKeyHash, encodePubKey, hex2buf, hexNonce, mergebuf, mic2arr, ml2mic, prefix, sexp2mic };
//# sourceMappingURL=taquito-utils.es5.js.map
