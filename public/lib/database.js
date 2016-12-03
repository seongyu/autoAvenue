/**
 * Created by LeonKim on 16. 12. 3..
 */
'use strict';

var mysql = require('mysql'),
    Tunnel = require('tunnel-ssh'),
    fs = require('fs'),
    promise = require("q");
var config = {
    ssh : {
        host: '52.78.241.59',
        port: 22,
        username: 'ubuntu',
        privateKey: require('fs').readFileSync("public/assets/autoavenue4.pem"),
        dstPort: 3306
    },
    mysql : {
        host: '127.0.0.1',
        port: 3306,
        database: "sys",
        user: "root",
        password: "auto4Avenue_",
        connectionLimit : 30
    }
};

Tunnel(config.ssh,function(err, server){
    if (err) {
        return console.log(err);
    }
    var pool = new mysql.createPool(config.mysql);

    exports.query = function(sql,param){
        var defer = promise.defer();

        pool.query(sql,param,function(err,rows){
            if(err){
                defer.reject(err)
            }

            rows = JSON.parse(JSON.stringify(rows));
            defer.resolve(rows);
        });

        return defer.promise;
    };
});