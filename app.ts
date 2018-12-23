//测试

import xadb = require('./index');

let client = xadb.adb.createClient();

async function monitor() {

    let version = await client.version();
    console.log(version);
    let listDevicesWithPaths = await client.listDevicesWithPaths();
    console.log(listDevicesWithPaths);
    let Properties = await client.getProperties(listDevicesWithPaths[0].id);
    console.log(Properties);
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