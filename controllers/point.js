/**
 * Created by LeonKim on 16. 12. 3..
 */
var user_model = require('../models/user');
var point_model = require('../models/point');
var moment = require('moment'), promise = require('q'), fs = require('fs'),
    crypto = require('crypto'), xlsx = require('node-xlsx').default;
var _Util = require('../public/lib/util'),
    config = _Util.config,
    util = _Util.util,
    message = _Util.message;

/**
 function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

 function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 * */
/*

var key = 'myKey';      // 암호화, 복호화를 위한 키
var input = 'node.js';  // 암호화할 대상

// 암호화
var cipher = crypto.createCipher('aes192', key);    // Cipher 객체 생성
cipher.update(input, 'utf8', 'base64');             // 인코딩 방식에 따라 암호화
var cipheredOutput = cipher.final('base64');        // 암호화된 결과 값

// 복호화
var decipher = crypto.createDecipher('aes192', key); // Decipher 객체 생성
decipher.update(cipheredOutput, 'base64', 'utf8');   // 인코딩 방식에 따라 복호화
var decipheredOutput = decipher.final('utf8');       // 복호화된 결과 값

// 출력
console.log('기존 문자열: ' + input);
console.log('암호화된 문자열: ' + cipheredOutput);
console.log('복호화된 문자열: ' + decipheredOutput);

*/


exports.addPnt = function(req, res) {
    var param = req.body;
    var token = req.params.token;
    util.check_permission(token)
        .then(function(ad){
            if(!ad.status){
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
            }else{
                var pointParam = {adminSeq:ad.adminSeq,admNm:ad.admNm};
            }
            return pointParam;
        })
        .then(function(pointParam){
            if(pointParam)
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
            else
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
        },function(err){
            res.send({
                resultCode : 504,
                message : message[504]
            })
        });
};

exports.usePnt = function(req, res) {
    var param = req.body;
    var token = req.params.token;
    util.check_permission(token)
        .then(function(ad){
            if(!ad.status){
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
            }else{
                var pointParam = {adminSeq:ad.adminSeq,admNm:ad.admNm};
            }
            return pointParam;
        })
        .then(function(pointParam){
            if(pointParam)
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
            else
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
        },function(err){
            res.send({
                resultCode : 504,
                message : message[504]
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

    var token = req.params.token;
console.log(param)
    util.check_permission(token)
        .then(function(ad){
            var returnp = {};
            if(!ad.status){
                res.send({
                    resultCode : 503,
                    message : message[503]
                });
            }else{
                returnp = {upId:ad.adminSeq,admNm:ad.admNm};
            }
            return returnp;
        })
        .then(function(memParam){
            if(memParam){
                param.memCd?getParam.memCd = param.memCd : null;
                param.memInfo?getParam.memInfo = param.memInfo : null;
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
            }else{
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
            }
        },function(err){
            res.send({
                resultCode : 504,
                message : message[504]
            })
        });


};

exports.hc = function(req, res) {
    res.send({status:200});
};

exports.memInfo = function(req,res){
    var param = req.body;
    var token = req.params.token;

    var result = {resultCode:200};
    if(!param.memEmail){
        result.message='M03';
        res.send(result);
        return null;
    }

    util.check_permission(token)
        .then(function(ad){
            if(!ad.status){
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
            }else{
                var memParam = {upId:ad.adminSeq,admNm:ad.admNm};
            }
            return memParam;
        })
        .then(function(memParam){
            if(memParam)
                user_model.getUser({memCd:'2',memInfo:param.memEmail})
                    .then(function(rtn){
                        if(param.infoRmkCd==1){  //join
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
            else
                res.send({
                    resultCode : 503,
                    message : message[503]
                })
        },function(err){
            res.send({
                resultCode : 504,
                message : message[504]
            })
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
        },function(err){
            res.send({
                resultCode : 501,
                message : message[501]
            })
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