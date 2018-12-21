const Parser = require('./parser');
const Auth = require('./auth');

export let readAll = (stream, callback) =>
    new Parser(stream).readAll(stream)
        .nodeify(callback);


export let parsePublicKey = (keyString, callback) =>
    Auth.parsePublicKey(keyString)
        .nodeify(callback);

