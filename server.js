/**
 *
 */
var port = process.env.WHC_PORT || 5002;
var basicAuthUsername = process.env.WHC_BASIC_AUTH_USERNAME || 'wiredcraft';
var basicAuthPassword = process.env.WHC_BASIC_AUTH_PASSWORD || 'wuding1189426';

var http = require('http');
var express = require('express');
var exec = require('child_process').exec;
var redis = require('redis');
var cradle = require('cradle');
var request = require('request');

var checks = {
    redis: function(cb) {
        var client = redis.createClient();

        client.on('error', function(err) {
            cb(err);
        });

        client.on('connect', function() {
            cb(null);
        });
    },
    couchdb: function(cb) {
        request.get('http://127.0.0.1:5984', function(err) {
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
        exec('/usr/local/opt/mongooseim/ejabberd/bin/ejabberdctl status', function(err) {
            return cb(err || null);
        });
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
    console.log(req.params);
    var component = req.params[0];

    var check = checks[component];

    if (!check) return res.send(400, 'Not exit');

    check.call(this, function(err) {
        if (err) return res.send(500);

        return res.send(200);
    });
});

app.listen(port);
