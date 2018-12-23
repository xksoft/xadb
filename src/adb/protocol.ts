class Protocol {
    static OKAY = 'OKAY';
    static FAIL = 'FAIL';
    static STAT = 'STAT';
    static LIST = 'LIST';
    static DENT = 'DENT';
    static RECV = 'RECV';
    static DATA = 'DATA';
    static DONE = 'DONE';
    static SEND = 'SEND';
    static QUIT = 'QUIT';

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

export = Protocol;