"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser = require('./parser');
const Auth = require('./auth');
exports.readAll = (stream) => new Parser(stream).readAll(stream);
exports.parsePublicKey = (keyString) => Auth.parsePublicKey(keyString);
//# sourceMappingURL=util.js.map