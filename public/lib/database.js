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
        database: "avenue_point",
        user: "root",
        password: "auto4Avenue_",
        connectionLimit : 30
    }
};
var send_query = null;
Tunnel(config.ssh,function(err, server){
    if (err) {
        return console.log(err);
    }
    var pool = new mysql.createPool(config.mysql);

    exports.query = function(sql,param){
        var defer = promise.defer();

        send_query = pool.query(sql,param,function(err,rows){
            logQuery(send_query.sql);
            if(err){
                defer.reject(err)
            }else{
                rows = JSON.parse(JSON.stringify(rows));
                defer.resolve(rows);
            }
        });

        return defer.promise;
    };

    exports.trans_query = function(sql,param){
        var defer = promise.defer();
        pool.getConnection(function(err,conn){
            conn.beginTransaction(function(err){
                if(err)throw err;
                var rollback = function(err){
                    conn.rollback();
                    conn.release();
                    defer.reject(err);
                };
                send_query = conn.query(sql,param,function(err,rows){
                    logQuery(send_query.sql);
                    if(err){
                        rollback(err);
                    }else{
                        conn.commit(function(err){
                            if(err){rollback(err)}
                            else{
                                rows = JSON.parse(JSON.stringify(rows));
                                defer.resolve(rows);
                                conn.release();
                            }

                        })
                    }
                })
            })
        });

        return defer.promise;
    };
});

var logQuery = function(sql){
    if(process.env.NODE_ENV!='production')
        console.log(sql);
};