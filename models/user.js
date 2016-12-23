/**
 * Created by LeonKim on 16. 12. 3..
 */
var db = require('../public/lib/database'),
    sql= '';

exports.getUser = function(param){
    sql = 'select memSeq from tblMem where isDel = 0 ';
    var findParam = param.memInfo?param.memInfo:'';
    param.memCd = param.memCd?param.memCd : 9;
    switch(param.memCd.toString()){
        case '1' : sql+='and memEmail like ?';
            break;
        case '2' : sql+='and memPne like ?';
            break;
        default : sql+='limit 0';
            break;
    }

    return db.query(sql,findParam);
};