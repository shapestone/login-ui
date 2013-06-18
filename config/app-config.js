exports.config = {
    appMode: "prod",
    applicationUrl: 'http://localhost:3001/',

    authenticateApiHost: 'localhost',
    authenticateApiPort: 5001,
    authenticateApiUri: '/login-api',
    forgotPassword:'/forgot-password',
    authenticate:'/authenticate',

    // cookie settings
    cookie: 'localhost_client',
    cookieDomain: 'localhost',
    cookieMaxAge: 86400000,
    cookieHttpOnly: false,
    cookieEncryptionKey: 'InmbuvP6Z8Inmbuv',
    sessionTimeout: 300,

    pathsToSkip: ['/session-timeout', '/home','/login','/partials/login.html' ,'/api/authenticate']

};
