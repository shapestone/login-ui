var http = require('http'),
    express = require('express'),
    cons = require('consolidate'),
    fs = require("fs"),
    main = require('./main');
    userSession = require('./modules/session-handler');

var app = module.exports = express();

// maxSockets greater ethan 10 sockets
http.globalAgent.maxSockets = 1200;

var port = 3001;

// Configuration
app.configure(function () {
    app.set("views", __dirname + '/app');
    app.set('view engine', 'html');
    app.engine("html", cons.underscore);
    app.use(express.cookieParser());
    app.use(express.bodyParser({
        keepExtensions: true,
        limit: 10000000, // 10M bytes limit
        defer: true
    }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(function noCachePlease(req, res, next) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);
        next();
    });

    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

app.get('/health-check',function(req,res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
    }
);

app.all('*', userSession.handler);

// Bootstrap controllers
var controllers_path = __dirname + '/web-controllers'
    , controller_files = fs.readdirSync(controllers_path);

controller_files.forEach(function (file) {
    console.log('reading file' + file);
    require(controllers_path + '/' + file)(app)
});

app.get('/landing', main.index);
/* redirect to index  Start */
app.get('/', main.index);
app.get('*', main.index);
/* redirect to index  End    */

app.listen(port, function () {
    console.log("Node server is running on port %d in %s mode", this.address().port, app.settings.env);
});
