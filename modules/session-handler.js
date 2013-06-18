var config = require('../config/app-config').config,
encryption = require('./encryption'),
common = require('./common'),
log = require('./../config/log-config');


exports.handler = function (req, res, next) {

    if(skipSessionCheck(req.path)){
        next();
    }else{
        log.debug('Method: Url: ' + req.method + ' : '+req.url);
        var cookie = req.cookies[config.cookie];
        if(typeof cookie === "undefined" || typeof cookie.maxAge != 'undefined') {
            res.redirect(302, '/');
            return;
        }

        var decryptedCookie = JSON.parse(encryption.decrypt(cookie));
        if(! isValidSession(decryptedCookie) && !/expiry/.test(req.path)  ) {
            res.redirect(302, '/');
            return;
        }

        updateCookie(req, res, decryptedCookie);
        req.session = decryptedCookie;

        // Continue web controller
        next();
    }
}

function skipSessionCheck(path){
    // don't process cookie data for specific types
    if(/\.jpg|\.ico|\.png|\.gif|\.js|\.css/.test(path) || common.inArray(config.pathsToSkip,path)) {
        return true;
    }
    return false;
}

function updateCookie(req, res, decryptedCookie){
    // last access
    decryptedCookie.lastAccess = new Date().getTime();
    res.cookie(config.cookie, encryption.encrypt(JSON.stringify(decryptedCookie)), { domain: config.cookieDomain, maxAge: config.cookieMaxAge, httpOnly: config.cookieHttpOnly });
}

function isValidSession(cookie) {
    // check session age
    var lastAccess = Number(cookie.lastAccess);
    if(isNaN(lastAccess)) {
        return false;
    }
    var sessionAge = new Date().getTime() - lastAccess;
    if(sessionAge > config.sessionTimeout * 1000) {
        // session expired
        return false;
    }
    return true;
}

