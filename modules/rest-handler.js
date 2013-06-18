var config = require('../config/app-config').config,
log   = require('../config/log-config'),
http = require('http');

exports.authenticate = handle( config.authenticateApiHost, config.authenticateApiPort,
    config.authenticateApiUri + '/api/authenticate');


function handle (host, port, url, paramDefaults, actions) {
    var api = {};
    api.url = url;
    api.paramDefaults = paramDefaults;

    // common
    var createPath = function(url, param) {
        // replace all parameters where a value was provided
        if(typeof param == 'object') {
            for(propt in param) {
                if(param.hasOwnProperty(propt)) {
                    url = url.replace(':' + propt, param[propt]);
                }
            }
        } else if(typeof param == 'string' || typeof param == 'number' || typeof param == 'boolean') {
            url = url.replace(':id', param);
        } else {
            // error
        }

        // strip out all parameters that didn't have a value
        url = url.replace(/:[a-zA-Z0-9\-_]+[^:\/]/,'');

        // strip trailing slashes and set the url
        url = url.replace(/\/+$/, '');
        // then replace collapse `/.` if found in the last URL path segment before the query
        // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
        url = url.replace(/\/\.(?=\w+($|\?))/, '.');

        // replace escaped `/\.` with `/.`
        url = url.replace(/\/\\\./, '/.');

        return url;
    };

    // default actions
    var get = function(param, success, failure) {
        var options = {
            host: host,
            port: port,
            path: createPath(url, param),
            method: 'GET',
            headers: {'accept': 'application/json'}
        };
        b
        var restReq = http.request(options);
        var result = '';

        restReq.on('response', function(response) {
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                result += chunk;
            });

            response.on('end', function() {
                var json;
                if (typeof success != 'undefined') {
                    if (typeof result == 'string' && result.indexOf('{') != -1 && result.indexOf('}') != -1) {
                        result = JSON.parse(result);
                    }
                    // todo: attach $save() method
                    success(result, this);
                }
            });

            response.on('error', function(error) {
                if(typeof failure != 'undefined') {
                    failure(error, this);
                }
            });
        });

        restReq.on('error', function(error) {
            failure(error);
        });

        restReq.end();

        return result;
    };

    var put = function(param, data, success, failure) {
        var jsonObject = JSON.stringify(data);

        var options = {
            host: host,
            port: port,
            path: createPath(url, param),
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
            }
        };

        var restReq = http.request(options);
        var result = '';

        restReq.on('response', function(response) {
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                result += chunk;
            });

            response.on('end', function() {
                var json;
                if (typeof success != 'undefined') {
                    if (typeof result == 'string' && result.indexOf('{') != -1 && result.indexOf('}') != -1) {
                        result = JSON.parse(result);
                    }
                    // todo: attach $save() method
                    success(result, this);
                }
            });

            response.on('error', function(error) {
                if(typeof failure != 'undefined') {
                    failure(error, this);
                }
            });
        });

        restReq.on('error', function(error) {
            failure(error);
        });

        restReq.write(jsonObject);

        restReq.end();

        return result;
    };


    var del = function(param, data, success, failure) {
        var options = {
            host: host,
            port: port,
            path: createPath(url, param),
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json'
            }
        };

        var request = http.request(options, function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                if (typeof success != 'undefined') {
                    success(str, this);
                }
            });

            response.on('error', function (e) {
                log.error('Error while saving new item. ' + e);
                if(typeof failure != 'undefined') {
                    failure(error, this);
                }
            });
        });

        request.on('error', function(error) {
            failure(error);
        });

        request.end();
    };

    var post = function(param, data, success, failure) {
        var jsonObject = JSON.stringify(data);

        var options = {
            host: host,
            port: port,
            path: createPath(url, param),
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            }
        };

        var request = http.request(options, function (response) {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                log.debug('posting data success: ' + str);
                success&&success(str, this);
            });

            response.on('error', function (e) {
                log.error('Error posting data to service: ' + e);
                failure&&failure(error);
            });
        });

        request.on('error', function(error) {
            log.error('Error calling service using post method: ');
            failure&&failure(error);
        });

        request.write(jsonObject);
        request.end();

    };

    // attach actions
    api.get = get;
    api.update = put;
    api.delete = del;
    api.post = post;

    return api;
};


