const Parser = require('./parser');
const Auth = require('./auth');

export let readAll = (stream,) =>
    new Parser(stream).readAll(stream);


export let parsePublicKey = (keyString,) =>
    Auth.parsePublicKey(keyString);

