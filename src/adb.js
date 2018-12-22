"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keycode = require("./adb/keycode");
const util = require("./adb/util");
const client_1 = require("./adb/client");
class adb {
    static createClient(options = {}) {
        if (!options.host) {
            options.host = process.env.ADB_HOST;
        }
        if (!options.port) {
            options.port = process.env.ADB_PORT;
        }
        return new client_1.Client(options);
    }
}
adb.Keycode = Keycode.keycode;
adb.util = util;
exports.adb = adb;
//# sourceMappingURL=adb.js.map