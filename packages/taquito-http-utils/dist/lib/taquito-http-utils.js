"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBackend = exports.HttpRequestFailed = exports.HttpResponseError = void 0;
// tslint:disable: strict-type-predicates
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
// tslint:enable: strict-type-predicates
var XMLHttpRequestCTOR = isNode ? require('xhr2-cookies').XMLHttpRequest : XMLHttpRequest;
__exportStar(require("./status_code"), exports);
var defaultTimeout = 30000;
var HttpResponseError = /** @class */ (function () {
    function HttpResponseError(message, status, statusText, body, url) {
        this.message = message;
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.url = url;
        this.name = 'HttpResponse';
    }
    return HttpResponseError;
}());
exports.HttpResponseError = HttpResponseError;
var HttpRequestFailed = /** @class */ (function () {
    function HttpRequestFailed(url, innerEvent) {
        this.url = url;
        this.innerEvent = innerEvent;
        this.name = 'HttpRequestFailed';
        this.message = "Request to " + url + " failed";
    }
    return HttpRequestFailed;
}());
exports.HttpRequestFailed = HttpRequestFailed;
var HttpBackend = /** @class */ (function () {
    function HttpBackend() {
    }
    HttpBackend.prototype.serialize = function (obj) {
        if (!obj) {
            return '';
        }
        var str = [];
        var _loop_1 = function (p) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                var prop = typeof obj[p].toJSON === 'function' ? obj[p].toJSON() : obj[p];
                // query arguments can have no value so we need some way of handling that
                // example https://domain.com/query?all
                if (prop === null) {
                    str.push(encodeURIComponent(p));
                    return "continue";
                }
                // another use case is multiple arguments with the same name
                // they are passed as array
                if (Array.isArray(prop)) {
                    prop.forEach(function (item) {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item));
                    });
                    return "continue";
                }
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(prop));
            }
        };
        for (var p in obj) {
            _loop_1(p);
        }
        var serialized = str.join('&');
        if (serialized) {
            return "?" + serialized;
        }
        else {
            return '';
        }
    };
    HttpBackend.prototype.createXHR = function () {
        return new XMLHttpRequestCTOR();
    };
    /**
     *
     * @param options contains options to be passed for the HTTP request (url, method and timeout)
     */
    HttpBackend.prototype.createRequest = function (_a, data) {
        var _this = this;
        var url = _a.url, method = _a.method, timeout = _a.timeout, query = _a.query, _b = _a.headers, headers = _b === void 0 ? {} : _b, _c = _a.json, json = _c === void 0 ? true : _c;
        return new Promise(function (resolve, reject) {
            var request = _this.createXHR();
            request.open(method || 'GET', "" + url + _this.serialize(query));
            request.setRequestHeader('Content-Type', 'application/json');
            for (var k in headers) {
                request.setRequestHeader(k, headers[k]);
            }
            request.timeout = timeout || defaultTimeout;
            request.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    if (json) {
                        try {
                            resolve(JSON.parse(request.response));
                        }
                        catch (ex) {
                            reject(new Error("Unable to parse response: " + request.response));
                        }
                    }
                    else {
                        resolve(request.response);
                    }
                }
                else {
                    reject(new HttpResponseError("Http error response: (" + this.status + ") " + request.response, this.status, request.statusText, request.response, url));
                }
            };
            request.ontimeout = function () {
                reject(new Error("Request timed out after: " + request.timeout + "ms"));
            };
            request.onerror = function (err) {
                reject(new HttpRequestFailed(url, err));
            };
            if (data) {
                var dataStr = JSON.stringify(data);
                request.send(dataStr);
            }
            else {
                request.send();
            }
        });
    };
    return HttpBackend;
}());
exports.HttpBackend = HttpBackend;
//# sourceMappingURL=taquito-http-utils.js.map