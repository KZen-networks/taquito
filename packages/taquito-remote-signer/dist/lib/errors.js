"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadSigningDataError = exports.OperationNotAuthorizedError = exports.KeyNotFoundError = void 0;
var KeyNotFoundError = /** @class */ (function () {
    function KeyNotFoundError(message, innerException) {
        this.message = message;
        this.innerException = innerException;
        this.name = 'KeyNotFoundError';
    }
    return KeyNotFoundError;
}());
exports.KeyNotFoundError = KeyNotFoundError;
var OperationNotAuthorizedError = /** @class */ (function () {
    function OperationNotAuthorizedError(message, innerException) {
        this.message = message;
        this.innerException = innerException;
        this.name = 'OperationNotAuthorized';
    }
    return OperationNotAuthorizedError;
}());
exports.OperationNotAuthorizedError = OperationNotAuthorizedError;
var BadSigningDataError = /** @class */ (function () {
    function BadSigningDataError(message, innerException, data) {
        this.message = message;
        this.innerException = innerException;
        this.data = data;
        this.name = 'BadSigningData';
    }
    return BadSigningDataError;
}());
exports.BadSigningDataError = BadSigningDataError;
//# sourceMappingURL=errors.js.map