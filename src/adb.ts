const Client = require('./adb/client');

const Keycode = require('./adb/keycode');

const util = require('./adb/util');

export class adb {
    public static createClient(options?) {
        if (options == null) {
            options = {};
        }
        options.host || (options.host = process.env.ADB_HOST);
        options.port || (options.port = process.env.ADB_PORT);
        return new Client(options);
    };

    public static Keycode = Keycode;

    public static util = util;
}


