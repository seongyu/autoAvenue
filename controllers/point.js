/**
 * Created by LeonKim on 16. 12. 3..
 */
var user_model = require('../models/user');
var point_model = require('../models/point');
var moment = require('moment');
var promise = require('q');
var fs = require('fs');
var xlsx = require('node-xlsx').default;
var _Util = require('../public/lib/util'),
    config = _Util.config,
    util = _Util.util,
    message = _Util.message;

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
                return defer.promise;
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
        }).done(function(rtn){
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
                return defer.promise;
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
        }).done(function(rtn){
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
    var limit = param.limit?parseInt(param.limit):20;
    var page = param.page?param.page:0;
    var pageS = limit*parseInt(page);
    var getParam = {};
    var result = {
        nowPage :0,
        totalPage : 0,
        total : 0
    };
    user_model.getUser(param)
        .then(function(rtn){
            if(param.memCd&&rtn.length==0){
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
                    result.nowPage = page;
                    result.totalPage = Math.ceil(rows[0].countNum/limit);
                    result.total = rows[0].countNum;
                    getParam.page = pageS;
                    getParam.limit = limit;
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

exports.memInfo = function(req,res){
    var param = req.body;
    var token = req.params.token;
    var memParam = {};
    if(token==config.sampleAdmin.token){
        memParam.upId = config.sampleAdmin.adminSeq;
    }else if(token==config.leonAdmin.token){
        memParam.upId = config.leonAdmin.adminSeq;
    }

    var result = {resultCode:200};

    if(!param.memEmail){
        result.message='M03';
        res.send(result);
        return null;
    }

    var infoRmkCd = param.infoRmkCd;
    user_model.getUser({memCd:'2',memInfo:param.memEmail})
        .then(function(rtn){
            if(infoRmkCd==1){  //join
                if(rtn.length>0){
                    result.message='M02';
                    res.send(result);
                    return null;
                }
            }else{             //udt / del
                if(rtn.length==0){
                    result.message='M03';
                    res.send(result);
                    return null;
                }
                param.memSeq = rtn[0].memSeq;
            }

            writeBatch(param).then(function(){
                res.send(result);
            });
        });
};

exports.stepbatch = function(req,res){
    var xlsx_obj = ['comGrp','comCd','memPne','memEmail','memName','infoRmkCd','timeStp','resultCode'];
    var batchUrl = config.fsUrl+ moment().format('YYYY-MM-DD') +'_batchFile';
    try{
        var row = fs.readFileSync(batchUrl,'utf8');
        row = '['+row+']';
        var array = JSON.parse(row);
        var idx = 0;
        util.loop(function(){return idx<array.length;},function(){
            var defer = promise.defer();
            user_model.editUser(array[idx])
                .then(function(){
                    array[idx].resultCode = 200;
                    return true;
                },function(){
                    array[idx].resultCode = 500;
                    return false;
                }).then(function(rtt){
                    if(rtt){
                        user_model.editCar(array[idx])
                            .then(function(){
                                idx++;
                                defer.resolve();
                            },function(err){
                                console.log(err)
                            })
                    }else{
                        idx++;
                        defer.resolve();
                    }
                });
            return defer.promise;
        }).then(function(){

            var arr = util.parse_xlsx(array,xlsx_obj);
            var buffer = xlsx.build([{name: 'result', data: arr}]);
            var filename = config.fsUrl + moment().format('YYYY-MM-DD') +'_result.xlsx';
            fs.writeFile(filename, buffer, function (err) {
                //fs.unlinkSync(batchUrl);
                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.download(filename);
            });
        })
    }catch(exception){
        //fs.unlinkSync(batchUrl);
        res.send({resultCode:500,message:message[500]});
    }
};
/**
 try{
        var array = JSON.parse(param.array);
    }catch(exception){
        result.status = 502;
        result.message = message[502];
        res.send(result);
        return;
    }
 */

var writeBatch = function(obj){
    obj = JSON.stringify(obj);
    var defer = promise.defer();
    var file_url = config.fsUrl+ moment().format('YYYY-MM-DD') +'_batchFile';
    fs.exists(file_url, function(isExists){
        if(isExists){
            obj = ','+obj;
            fs.appendFile(file_url,obj,function(err){
                if(err){
                    console.log(err);
                    defer.reject();
                    return;
                }
                defer.resolve();
            })
        }else{
            fs.writeFile(file_url,obj,function(err){
                if(err){
                    console.log(err);
                    defer.reject();
                    return;
                }
                defer.resolve();
            })
        }
    });
    return defer.promise;
};