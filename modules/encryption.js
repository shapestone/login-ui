var crypto = require('crypto');
var config = require('../config/app-config').config;

exports.encrypt = function encrypt(text) {
    var cipher = crypto.createCipher('aes-128-ecb', config.cookieEncryptionKey);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function decrypt(crypted) {
    var decipher = crypto.createDecipher('aes-128-ecb', config.cookieEncryptionKey);
    var dec = decipher.update(crypted,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};

