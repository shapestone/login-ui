var config = require('../config/app-config').config;
encryption = require('./encryption'),
log   = require('../config/log-config');

exports.handler = function (req, res, user) {
    resetOldCookieToEmpty(res);
    setNewCookie(res,user);
};

function resetOldCookieToEmpty(res){
    res.cookie(config.cookie,'',{ domain: config.cookieDomain, maxAge: 0, expires: new Date(1), path: config.cookieDomain });
    res.header("P3P","CP='IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT'");
}

function setNewCookie(res, user){
    var createTime = new Date().getTime();
    var cookie = encryption.encrypt(JSON.stringify(
            {userID:user.userID,userName:user.userName,companyID:user.companyID,roles:user.roles,createdTime:createTime,lastAccessTime:createTime}
        ));

    if (config.cookieDomain == "localhost") {
        res.cookie(config.cookie, cookie, { maxAge: config.cookieMaxAge, httpOnly: config.cookieHttpOnly });
    } else {
        res.cookie(config.cookie, cookie, { domain: config.cookieDomain, maxAge: config.cookieMaxAge, httpOnly: config.cookieHttpOnly });
    }
}

