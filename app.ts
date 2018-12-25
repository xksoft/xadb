//测试

import xadb = require('./index');
import * as stream from "stream";

let client = xadb.adb.createClient();

async function monitor() {

    let version = await client.version();
    console.log(version);
    let listDevicesWithPaths = await client.listDevicesWithPaths();
    console.log(listDevicesWithPaths);
    let Properties = await client.getProperties(listDevicesWithPaths[0].id);
    console.log(Properties);
    let a = new stream.PassThrough();
    await client.push(listDevicesWithPaths[0].id, a, "/sdcard/aa.txt");
    a.write("aaaa");
    a.end();
    return {errcode: 0, msg: "写入完毕"};


    // return client
    //     .listDevicesWithPaths()
    //     .then(async function (devicelist) {
    //         client.shell(devicelist[0].id, 'ls')
    //             .then(xadb.adb.util.readAll)
    //             .then(function (output) {
    //                 console.log(output.toString().trim());
    //             });
    //     })
    //     .catch(function (err) {
    //         console.log(err)
    //     })
}

monitor();