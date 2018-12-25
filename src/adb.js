"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require('./adb/client');
const Keycode = require('./adb/keycode');
const util = require('./adb/util');
class adb {
    static createClient(options) {
        if (options == null) {
            options = {};
        }
        options.host || (options.host = process.env.ADB_HOST);
        options.port || (options.port = process.env.ADB_PORT);
        return new Client(options);
    }
    ;
}
adb.Keycode = Keycode;
adb.util = util;
exports.adb = adb;
//# sourceMappingURL=adb.js.map