// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const Command = require('../../command');
const Protocol = require('../../protocol');

class HostDevicesWithPathsCommand extends Command {
    execute() {
        this._send('host:devices-l');
        return this.parser.readAscii(4)
            .then(reply => {
                switch (reply) {
                    case Protocol.OKAY:
                        return this._readDevices();
                    case Protocol.FAIL:
                        return this.parser.readError();
                    default:
                        return this.parser.unexpected(reply, 'OKAY or FAIL')
                }
            })
    }

    _readDevices() {
        return this.parser.readValue()
            .then(value => {
                return this._parseDevices(value)
            })
    }

    _parseDevices(value) {
        const devices = [];
        if (!value.length) {
            return devices
        }
        for (let line of value.toString('ascii').split('\n')) {
            if (line) {
                let array = Array.from(line.split(/\s+/));
                let [id, type, path, transport_id] = Array.from(line.split(/\s+/));
                for (let i = 0; i < array.length; i++) {
                    let strs = array[i].split(':');
                    if (strs[0] == 'transport_id') {
                        transport_id = strs[1];
                    }
                }
                devices.push({id, type, path, transport_id})
            }
        }
        return devices
    }
}

module.exports = HostDevicesWithPathsCommand;
