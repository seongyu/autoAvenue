/**
 * Created by LeonKim on 16. 12. 3..
 */
var db = require('../public/lib/database'),
    promise = require('q'),
    sql= '';

exports.getUser = function(param){
    sql = 'select memSeq from tblMem where isDel = 0 ';
    var findParam = param.memInfo?param.memInfo:'';
    if(param.memCd){
        switch(param.memCd.toString()){
            case '1' : sql+='and memPne like ?';
                break;
            case '2' : sql+='and memEmail like ?';
                break;
            default : sql+='limit 0';
                break;
        }
    }else{
        sql+='limit 0';
    }

    return db.query(sql,findParam);
};

exports.editUser = function(param){
    console.log('---------coms useredit')
    var sql = '';
    var editParam = [];
    if(param.infoRmkCd==1){
        sql = 'insert into tblMem ' +
        '(comGrp,comCd,memRoles,memID,memName,memEmail,memPne,memAddr,addrCd,memBrt,memGdr,upId) ' +
        'values(?,?,?,?,?,?,?,?,?,?,?,?)';
        editParam = [
            param.comGrp,
            param.comCd,
            param.memRoles?param.memRoles:'101',
            param.memID,
            param.memName,
            param.memEmail,
            param.memPne,
            param.memAddr,
            param.addrCd,
            param.memBrt,
            param.memGdr,
            param.upId];
    }else if(param.infoRmkCd==2){
        var udtParam = {};
        param.comGrp&&param.comGrp!='' ? udtParam.comGrp = param.comGrp : null;
        param.comCd&&param.comCd!='' ? udtParam.comCd = param.comCd : null;
        param.memRoles&&param.memRoles!='' ? udtParam.memRoles = param.memRoles : null;
        param.memID&&param.memID!='' ? udtParam.memID = param.memID : null;
        param.memName&&param.memName!='' ? udtParam.memName = param.memName : null;
        param.memPne&&param.memPne!='' ? udtParam.memPne = param.memPne : null;
        param.memAddr&&param.memAddr!='' ? udtParam.memAddr = param.memAddr : null;
        param.addrCd&&param.addrCd!='' ? udtParam.addrCd = param.addrCd : null;
        param.memBrt&&param.memBrt!='' ? udtParam.memBrt = param.memBrt : null;
        param.memGdr&&param.memGdr!='' ? udtParam.memGdr = param.memGdr : null;
        param.upId&&param.upId!='' ? udtParam.upId = param.upId : null;
        sql = 'update tblMem set ? where ?';

        editParam.push(udtParam,{memSeq:param.memSeq});
    }else if(param.infoRmkCd==3){
        sql = 'update tblMem set isDel = 1, delDt = now() where ?';
        editParam.push({memSeq:param.memSeq});
    }
    return db.trans_query(sql,editParam);
};

exports.editCar = function(param){
    var defer = promise.defer();
    if(!param.carNo){
        defer.resolve();
        return defer.promise;
    }
    db.query('select memSeq from tblMem where memEmail = ?',param.memEmail)
        .then(function(rtn){
            if(rtn.length==0) {
                return false
            }else if(rtn.length>0) {
                param.memSeq = rtn[0].memSeq;
                return true
            };
        })
        .then(function(code){
            if(!code){
                defer.resolve();
                return defer.promise;
            }
            var getParam = [param.memEmail,param.carNo];
            db.query('select tc.carID, tm.memSeq from tblCar as tc ' +
            'left join tblMem as tm on tc.memSeq = tm.memSeq ' +
            'where tm.memEmail = ? and tc.carNo = ?',getParam)
                .then(function(rtn){
                    var udtParam;
                    if(rtn.length>0){
                        udtParam = {};
                        param.carMdl&&param.carMdl!='' ? udtParam.carMdl = param.carMdl : null;
                        param.inserCd&&param.inserCd!='' ? udtParam.inserCd = param.inserCd : null;
                        param.inserInf&&param.inserInf!='' ? udtParam.inserInf = param.inserInf : null;
                        param.carCmt&&param.carCmt!='' ? udtParam.carCmt = param.carCmt : null;
                        param.upId&&param.upId!='' ? udtParam.upId = param.upId : null;
                        sql = 'update tblCar set ? where carID = '+rtn[0].carID;
                    }else{
                        udtParam = [
                            param.memSeq,
                            param.carNo,
                            param.carMdl,
                            param.inserCd,
                            param.inserInf,
                            param.carCmt,
                            param.upId];
                        sql = 'insert into tblCar ' +
                        '(memSeq,carNo,carMdl,inserCd,inserInf,carCmt,upId) ' +
                        'values(?,?,?,?,?,?,?)';
                    }
                    db.trans_query(sql,udtParam)
                        .then(function(){
                            defer.resolve()
                        })
                });
        });

    return defer.promise;
};