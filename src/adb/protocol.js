"use strict";
class Protocol {
    static decodeLength(length) {
        return parseInt(length, 16);
    }
    static encodeLength(length) {
        return (`0000${length.toString(16)}`).slice(-4).toUpperCase();
    }
    static encodeData(data) {
        if (!Buffer.isBuffer(data)) {
            data = Buffer.from(data);
        }
        return Buffer.concat([Buffer.from(Protocol.encodeLength(data.length)), data]);
    }
}
Protocol.OKAY = 'OKAY';
Protocol.FAIL = 'FAIL';
Protocol.STAT = 'STAT';
Protocol.LIST = 'LIST';
Protocol.DENT = 'DENT';
Protocol.RECV = 'RECV';
Protocol.DATA = 'DATA';
Protocol.DONE = 'DONE';
Protocol.SEND = 'SEND';
Protocol.QUIT = 'QUIT';
module.exports = Protocol;
//# sourceMappingURL=protocol.js.map