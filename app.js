"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const xadb = require("./index");
const stream = require("stream");
let client = xadb.adb.createClient();
function monitor() {
    return __awaiter(this, void 0, void 0, function* () {
        let version = yield client.version();
        console.log(version);
        let listDevicesWithPaths = yield client.listDevicesWithPaths();
        console.log(listDevicesWithPaths);
        let Properties = yield client.getProperties(listDevicesWithPaths[0].id);
        console.log(Properties);
        let a = new stream.PassThrough();
        yield client.push(listDevicesWithPaths[0].id, a, "/sdcard/aa.txt");
        a.write("aaaa");
        a.end();
        return { errcode: 0, msg: "写入完毕" };
    });
}
monitor();
//# sourceMappingURL=app.js.map