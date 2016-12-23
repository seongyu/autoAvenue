/**
 * Created by LeonKim on 16. 12. 3..
 */
var user_model = require('../models/user');
var point_model = require('../models/point');
var moment = require('moment');
var promise = require('q');
var Util = require('../public/lib/util'),
    config = Util.config,
    message = Util.message;

exports.addPnt = function(req, res) {
    var param = req.body;
    var token = req.params.token;
    var pointParam = {};
    if(token==config.sampleAdmin.token){
        pointParam.adminSeq = config.sampleAdmin.adminSeq;
        pointParam.admNm = config.sampleAdmin.admNm;
    }else if(token==config.leonAdmin.token){
        pointParam.adminSeq = config.leonAdmin.adminSeq;
        pointParam.admNm = config.leonAdmin.admNm;
    }
    user_model.getUser(param)
    .then(function(rtn){
            var defer = promise.defer();
            if(rtn.length!=1){
                defer.reject();
                return;
            }
            pointParam.memSeq = rtn[0].memSeq;
            pointParam.addPnt = param.addPnt;
            pointParam.regDt = param.timeStp?param.timeStp:moment().toDate();
            point_model.addPnt(pointParam)
            .then(function(rtn){
                    defer.resolve({status:true})
                },function(){
                    defer.resolve({status:false})
                });
            return defer.promise;
        })
    .done(function(rtn){
        if(!rtn.status){
            res.send({
                resultCode : 500,
                message : message[500]
            })
        }else{
            res.send({
                resultCode : 200,
                result : null
            })
        }
    },function(err){
        res.send({
            resultCode : 501,
            message : message[501]
        })
    })
};

exports.usePnt = function(req, res) {
    var param = req.body;
    var token = req.params.token;
    var pointParam = {};
    if(token==config.sampleAdmin.token){
        pointParam.adminSeq = config.sampleAdmin.adminSeq;
        pointParam.admNm = config.sampleAdmin.admNm;
    }else if(token==config.leonAdmin.token){
        pointParam.adminSeq = config.leonAdmin.adminSeq;
        pointParam.admNm = config.leonAdmin.admNm;
    }
    user_model.getUser(param)
        .then(function(rtn){
            var defer = promise.defer();
            if(rtn.length!=1){
                defer.reject();
                return;
            }
            pointParam.memSeq = rtn[0].memSeq;
            pointParam.usePnt = param.usePnt;
            pointParam.pntType = param.pntType;
            pointParam.regDt = param.timeStp?param.timeStp:moment().toDate();
            point_model.usePnt(pointParam)
                .then(function(rtn){
                    defer.resolve({status:true})
                },function(err){
                    defer.resolve({status:false,message:err.message})
                });
            return defer.promise;
        })
        .done(function(rtn){
            if(!rtn.status){
                res.send({
                    resultCode : 500,
                    message : rtn.message
                })
            }else{
                res.send({
                    resultCode : 200,
                    result : null
                })
            }
        },function(err){
            res.send({
                resultCode : 501,
                message : message[501]
            })
        })
};

exports.statPntAll = function(req, res) {
    var param = req.body;
    var getParam = {
        limit : param.limit?param.limit:20,
        page : param.page?param.page:0
    };
    var result = {
        nowPage :0,
        totalPage : 0,
        total : 0
    };

    user_model.getUser(param)
        .then(function(rtn){
            if(param.memCd&&param.memInfo){
                result.rows = [];
                res.send({
                    resultCode : 200,
                    result : result
                });
                return;
            }
            rtn.length>0?getParam.memSeq = rtn[0].memSeq : null;
            param.pntType?getParam.pntType = param.pntType : null;
            point_model.statPntCnt(getParam)
            .then(function(rows){
                    result.nowPage = getParam.page;
                    result.totalPage = Math.ceil(rows[0].countNum/getParam.limit);
                    result.total = rows[0].countNum;

                    point_model.statPntAll(getParam)
                        .then(function(rows){
                            result.rows = rows;
                            res.send({
                                resultCode : 200,
                                result : result
                            })
                        },function(err){
                            res.send({
                                resultCode : 501,
                                message : message[501]
                            })
                        });
                },function(err){
                    res.send({
                        resultCode : 501,
                        message : message[501]
                    })
                })
        })

};

exports.hc = function(req, res) {
    res.send({status:200});
};