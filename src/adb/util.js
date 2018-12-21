"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser = require('./parser');
const Auth = require('./auth');
exports.readAll = (stream, callback) => new Parser(stream).readAll(stream)
    .nodeify(callback);
exports.parsePublicKey = (keyString, callback) => Auth.parsePublicKey(keyString)
    .nodeify(callback);
//# sourceMappingURL=util.js.map