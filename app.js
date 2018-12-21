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
let client = xadb.adb.createClient();
function monitor() {
    return __awaiter(this, void 0, void 0, function* () {
        return client
            .listDevicesWithPaths()
            .then(function (devicelist) {
            return __awaiter(this, void 0, void 0, function* () {
                client.shell(devicelist[0].id, 'ls')
                    .then(xadb.adb.util.readAll)
                    .then(function (output) {
                    console.log(output.toString().trim());
                });
            });
        })
            .catch(function (err) {
            console.log(err);
        });
    });
}
monitor();
//# sourceMappingURL=app.js.map