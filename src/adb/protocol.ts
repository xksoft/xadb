export class Protocol {
    OKAY = 'OKAY';
    FAIL = 'FAIL';
    STAT = 'STAT';
    LIST = 'LIST';
    DENT = 'DENT';
    RECV = 'RECV';
    DATA = 'DATA';
    DONE = 'DONE';
    SEND = 'SEND';
    QUIT = 'QUIT';

    static decodeLength(length) {
        return parseInt(length, 16)
    }

    static encodeLength(length) {
        return (`0000${length.toString(16)}`).slice(-4).toUpperCase()
    }

    static encodeData(data) {
        if (!Buffer.isBuffer(data)) {
            data = new Buffer(data)
        }
        return Buffer.concat([new Buffer(Protocol.encodeLength(data.length)), data])
    }
}

