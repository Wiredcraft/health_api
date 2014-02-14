/**
 *
 */
var port = process.env.WHC_PORT || 5002;
var basicAuthUsername = process.env.WHC_BASIC_AUTH_USERNAME || 'wiredcraft';
var basicAuthPassword = process.env.WHC_BASIC_AUTH_PASSWORD || 'wuding1189426';

var tcp = require('net');
var http = require('http');
var exec = require('child_process').exec;

var express = require('express');
var request = require('request');

var info = require('debug')('whi:server:info');
var debug = require('debug')('whi:server:debug');

var checks = {
    redis: function(cb) {
        var arg = null;
        try {
            tcp.connect({port:6379})
                 .destroy();
        } catch(err) {
            arg = err;
        }
        return cb(arg);
    },
    couchdb: function(cb) {
        request.get('http://127.0.0.1:5984', function(err) {
            return cb(err || null);
        });
    },
    couchbase: function(cb) {
        request.get('http://127.0.0.1:8091', function(err) {
            return cb(err || null);
        });
    },
    elasticsearch: function(cb) {
        request.get('http://127.0.0.1:9200', function(err) {
            return cb(err || null);
        });
    },
    http: function(cb) {
        request.get('http://127.0.0.1:80', function(err) {
            return cb(err || null);
        });
    },
    https: function(cb) {
        request.get('http://127.0.0.1:443', function(err) {
            return cb(err || null);
        });
    },
    mongooseim: function(cb) {
        var arg = null;
        try {
            tcp.connect({port:5222})
                 .destroy();
        } catch(err) {
            arg = err;
        }

        return cb(arg);
    },
    docker: function(cb) {
        return cb(null);
    },
    api: function(cb) {
        request.get('http://127.0.0.1:3000/ping', function(err) {
            return cb(err || null);
        });
    }
};

var app = express();

// The function
var basicAuth = express.basicAuth(function(username, password, callback) {
    callback(null, (username === basicAuthUsername && password === basicAuthPassword));
});

app.get('^/*$', basicAuth, function(req, res) {
    info("Checking %s", req.params[0]);
    var component = req.params[0];
    var check = checks[component];

    if (!check) {
        debug('Check: %s dose not exit', check);
        return res.send(404);
    }

    check.call(this, function(err) {
        if (err) {
            info("%s is NOT ok", req.params[0]);
            debug(err.message || err);
            return res.send(500);
        }

        info("%s is ok", req.params[0]);
        return res.send(200);
    });
});

//
var server = http.createServer(app);

server.listen(port, function(err) {
    if (err) return debug(err.message || err);
    info('Http server listening on port %d', port);
});
