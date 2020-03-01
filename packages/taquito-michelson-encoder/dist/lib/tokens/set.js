"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = require("./token");
var SetValidationError = /** @class */ (function (_super) {
    __extends(SetValidationError, _super);
    function SetValidationError(value, token, message) {
        var _this = _super.call(this, value, token, message) || this;
        _this.value = value;
        _this.token = token;
        _this.name = 'SetValidationError';
        return _this;
    }
    return SetValidationError;
}(token_1.TokenValidationError));
exports.SetValidationError = SetValidationError;
var SetToken = /** @class */ (function (_super) {
    __extends(SetToken, _super);
    function SetToken(val, idx, fac) {
        var _this = _super.call(this, val, idx, fac) || this;
        _this.val = val;
        _this.idx = idx;
        _this.fac = fac;
        return _this;
    }
    Object.defineProperty(SetToken.prototype, "KeySchema", {
        get: function () {
            return this.createToken(this.val.args[0], 0);
        },
        enumerable: true,
        configurable: true
    });
    SetToken.prototype.isValid = function (value) {
        if (Array.isArray(value)) {
            return null;
        }
        return new SetValidationError(value, this, 'Value must be an array');
    };
    SetToken.prototype.Encode = function (args) {
        var _this = this;
        var val = args.pop();
        var err = this.isValid(val);
        if (err) {
            throw err;
        }
        return val.sort(this.KeySchema.compare).reduce(function (prev, current) {
            return __spreadArrays(prev, [_this.KeySchema.EncodeObject(current)]);
        }, []);
    };
    SetToken.prototype.Execute = function (val, semantics) {
        var _this = this;
        return val.reduce(function (prev, current) {
            return __spreadArrays(prev, [_this.KeySchema.Execute(current, semantics)]);
        }, []);
    };
    SetToken.prototype.EncodeObject = function (args) {
        var _this = this;
        var err = this.isValid(args);
        if (err) {
            throw err;
        }
        return args.sort(this.KeySchema.compare).reduce(function (prev, current) {
            return __spreadArrays(prev, [_this.KeySchema.EncodeObject(current)]);
        }, []);
    };
    SetToken.prototype.ExtractSchema = function () {
        return SetToken.prim;
    };
    SetToken.prim = 'set';
    return SetToken;
}(token_1.Token));
exports.SetToken = SetToken;
//# sourceMappingURL=set.js.map