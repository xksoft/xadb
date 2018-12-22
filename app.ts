//测试

import xadb = require('./index');

let client = xadb.adb.createClient();

async function monitor() {

    let version = await client.listDevices();
    console.log(version);
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