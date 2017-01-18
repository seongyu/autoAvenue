/**
 * Created by LeonKim on 16. 12. 23..
 */
var Q = require('q'), config = {}, util = {};
var md5 = require('md5'),promise = require('q'),
    user_model = require('../../models/user');

exports.config = config;
exports.util = util;
exports.message = {
    500 : 'Error : Processing denied',
    501 : 'Error : Unavailable Parameter exists',
    502 : 'Error : Parameter error',
    503 : 'Error : Permission denied',
    504 : 'Error : Permission error',
    510 : 'Error : Request Timeout error.'
};

util.check_permission = function(token){
    var defer = promise.defer();
    var result = {status:false};
    if(token==config.sampleAdmin.token){
        result.status=true;
        result.adminSeq = config.sampleAdmin.adminSeq;
        result.admNm = config.sampleAdmin.admNm;
        defer.resolve(result);
    }else if(token==config.leonAdmin.token){
        result.status=true;
        result.adminSeq = config.leonAdmin.adminSeq;
        result.admNm = config.leonAdmin.admNm;
        defer.resolve(result);
    }else if(token.indexOf('@')>0){
        user_model.check_permission({memEmail:token})
            .then(function(rtn){
                if(rtn.length==1){
                    var rt = rtn[0];
                    result.status=true;
                    result.adminSeq=rt.adminSeq;
                    result.admNm=rt.admNm;
                    defer.resolve(result);
                }else{
                    defer.resolve(result);
                }
            })
    }
    return defer.promise;
};

config.fsUrl = 'public/data/';
config.sampleAdmin = {
    token : '098f6bcd4621d373cade4e832627b4f6',
    adminSeq : 98,
    admNm : '테스트관리자'
};

config.leonAdmin = {
    token : '8fe1b4808c9bc3083eb4f33ad4086b41',
    adminSeq : 99,
    admNm : '김선규'
};

/**
 var idx = 0;
 Util.loop(function(){return idx<length},function(){

 }).then(function(){

 });
 */
util.loop = function(condition, body) {
    var done = Q.defer();
    function loop() {
        if (!condition()) return done.resolve();
        Q.when(body(), loop, done.reject);
    }
    Q.nextTick(loop);
    return done.promise;
};
/**
 obj [a,b,c,d,e]
 array [{a:1,b:2...}]
 */
util.parse_xlsx = function(array,obj){
    var master_arr = [obj];
    array.forEach(function(v,i,a){
        var slave_arr = [];
        for(var j in obj){
            slave_arr.push(v[obj[j]])
        };
        master_arr.push(slave_arr);
    });

    return master_arr;
};

config.testData = [{
    "comGrp": 99,
    "comCd": "01",
    "memPne": "01010011001",
    "memEmail": "abc@abc.com",
    "memName": "홍길동01",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:34"
}, {
    "comGrp": 99,
    "comCd": "02",
    "memPne": "01010011002",
    "memEmail": "abc@abc.com",
    "memName": "홍길동02",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:35"
}, {
    "comGrp": 99,
    "comCd": "03",
    "memPne": "01010011003",
    "memEmail": "abc@abc.com",
    "memName": "홍길동03",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:36"
}, {
    "comGrp": 99,
    "comCd": "04",
    "memPne": "01010011004",
    "memEmail": "abc@abc.com",
    "memName": "홍길동04",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:37"
}, {
    "comGrp": 99,
    "comCd": "01",
    "memPne": "01010011005",
    "memEmail": "abc@abc.com",
    "memName": "홍길동05",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:38"
}, {
    "comGrp": 99,
    "comCd": "02",
    "memPne": "01010011006",
    "memEmail": "abc@abc.com",
    "memName": "홍길동06",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:39"
}, {
    "comGrp": 99,
    "comCd": "03",
    "memPne": "01010011007",
    "memEmail": "abc@abc.com",
    "memName": "홍길동07",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:40"
}, {
    "comGrp": 99,
    "comCd": "04",
    "memPne": "01010011008",
    "memEmail": "abc@abc.com",
    "memName": "홍길동08",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:41"
}, {
    "comGrp": 99,
    "comCd": "01",
    "memPne": "01010011009",
    "memEmail": "abc@abc.com",
    "memName": "홍길동09",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:42"
}, {
    "comGrp": 99,
    "comCd": "02",
    "memPne": "01010011010",
    "memEmail": "abc@abc.com",
    "memName": "홍길동10",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:43"
}, {
    "comGrp": 99,
    "comCd": "03",
    "memPne": "01010011011",
    "memEmail": "abc@abc.com",
    "memName": "홍길동11",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:44"
}, {
    "comGrp": 99,
    "comCd": "04",
    "memPne": "01010011012",
    "memEmail": "abc@abc.com",
    "memName": "홍길동12",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:45"
}, {
    "comGrp": 99,
    "comCd": "01",
    "memPne": "01010011013",
    "memEmail": "abc@abc.com",
    "memName": "홍길동13",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:46"
}, {
    "comGrp": 99,
    "comCd": "02",
    "memPne": "01010011014",
    "memEmail": "abc@abc.com",
    "memName": "홍길동14",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:47"
}, {
    "comGrp": 99,
    "comCd": "03",
    "memPne": "01010011015",
    "memEmail": "abc@abc.com",
    "memName": "홍길동15",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:48"
}, {
    "comGrp": 99,
    "comCd": "04",
    "memPne": "01010011016",
    "memEmail": "abc@abc.com",
    "memName": "홍길동16",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:49"
}, {
    "comGrp": 99,
    "comCd": "01",
    "memPne": "01010011017",
    "memEmail": "abc@abc.com",
    "memName": "홍길동17",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:50"
}, {
    "comGrp": 99,
    "comCd": "02",
    "memPne": "01010011018",
    "memEmail": "abc@abc.com",
    "memName": "홍길동18",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:51"
}, {
    "comGrp": 99,
    "comCd": "03",
    "memPne": "01010011019",
    "memEmail": "abc@abc.com",
    "memName": "홍길동19",
    "infoRmkCd": "02",
    "timeStp": "2016-10-31T10:22:52"
}];
