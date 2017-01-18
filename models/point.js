/**
 * Created by LeonKim on 16. 12. 3..
 */
var db = require('../public/lib/database'),
    promise = require('q'),
    sql= '';

exports.addPnt = function(param){
    var defer = promise.defer();
    sql = 'SELECT totPnt FROM tblPnt where memSeq = ? order by regDt desc limit 1';
    db.query(sql,param.memSeq)
    .then(function(rtn){
            var addParam = [
                param.memSeq,
                param.addPnt,
                param.regDt,
                rtn.length==1&&rtn[0].totPnt?rtn[0].totPnt+parseInt(param.addPnt):param.addPnt,
                param.paymentType?param.paymentType:null,
                param.status?param.status:1,
                param.adminSeq,
                param.admNm
            ];

            sql = 'insert into tblPnt ' +
            '(memSeq,memPnt,regDt,totPnt,paymentType,status,admSeq,admNm) ' +
            'values (?,?,?,?,?,?,?,?)';

            db.trans_query(sql,addParam)
            .then(function(){
                    defer.resolve();
                },function(){
                    defer.reject();
                })
        });

    return defer.promise;
};

exports.usePnt = function(param){
    var defer = promise.defer();
    sql = 'SELECT totPnt FROM tblPnt where memSeq = ? order by regDt desc limit 1';
    db.query(sql,param.memSeq)
        .then(function(rtn){
            if(rtn.length!=1||rtn[0].totPnt<param.usePnt){
                defer.reject({message:'포인트가 없거나 사용하려는 포인트보다 작습니다.'});
                return;
            }
            var addParam = [
                param.memSeq,
                param.usePnt,
                param.regDt,
                rtn[0].totPnt-param.usePnt,
                param.pntType==1?'포인트사용':param.pntType==2?'정액쿠폰':null,
                param.status?param.status:2,
                param.adminSeq,
                param.admNm
            ];

            sql = 'insert into tblPnt ' +
            '(memSeq,memPnt,regDt,totPnt,paymentType,status,admSeq,admNm) ' +
            'values (?,?,?,?,?,?,?,?)';

            db.trans_query(sql,addParam)
                .then(function(){
                    defer.resolve();
                },function(){
                    defer.reject();
                })
        });

    return defer.promise;
};
exports.statPntCnt = function(param){
    var getParam = [];

    sql = 'select count(*) as countNum from tblPnt as tp ' +
    'left join tblMem as tm on tp.memSeq = tm.memSeq ';

    var wherei = 0;
    if(param.memCd=='1'){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tm.memPne like ? ';

        getParam.push(param.memInfo);
        wherei++;
    }else if(param.memCd=='2'){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tm.memEmail like ? ';

        getParam.push(param.memInfo);
        wherei++;
    }

    if(param.pntType){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tp.status = ? ';

        getParam.push(param.pntType);
    }

    return db.query(sql,getParam);
};

exports.statPntAll = function(param){
    var getParam = [];
    sql = 'select tp.pntSeq, tm.memName, tm.memEmail,tm.memPne, ' +
    'tp.memPnt,tp.totPnt,tp.paymentType,tp.status, tp.admNm, tp.regDt ' +
    'from tblPnt as tp ' +
    'left join tblMem as tm on tp.memSeq = tm.memSeq ';

    var wherei = 0;
    if(param.memCd=='1'){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tm.memPne like ? ';

        getParam.push(param.memInfo);
        wherei++;
    }else if(param.memCd=='2'){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tm.memEmail like ? ';

        getParam.push(param.memInfo);
        wherei++;
    }

    if(param.pntType){
        wherei==0? sql+='where ':sql+='and ';
        sql+=' tp.status = ? ';

        getParam.push(param.pntType);
    }

    sql+= 'order by tp.regDt desc limit ?,?';
    getParam.push(param.page,param.limit);
    return db.query(sql,getParam);
};

exports.hc = function(param){
    sql = 'SELECT * FROM sys.sys_config';

    return db.query(sql);
};