/**
 *
 */
var port = process.env.WHC_PORT || 5002;
var basicAuthUsername = process.env.WHC_BASIC_AUTH_USERNAME || 'wiredcraft';
var basicAuthPassword = process.env.WHC_BASIC_AUTH_PASSWORD || 'wuding1189426';

var http = require('http');
var express = require('express');

var info = require('debug')('whi:server:info');
var debug = require('debug')('whi:server:debug');


var checks = require('./Checksfile');

var app = express();

// The function
var basicAuth = express.basicAuth(function(username, password, callback) {
    callback(null, (username === basicAuthUsername && password === basicAuthPassword));
});

app.get('^/*$', basicAuth, function(req, res) {
    info("Check: %s", req.params[0]);
    var component = req.params[0];
    var check = checks[component];

    if (!check) {
        debug('Check: %s dose not exit', check);
        return res.send(404);
    }

    check.call(this, function(err) {
        if (err) {
            debug(err.message || err);
            return res.send(500);
        }

        return res.send(200);
    });
});

//
var server = http.createServer(app);

server.listen(port, function(err) {
    if (err) return debug(err.message || err);
    info('Http server listening on port %d', port);
});
