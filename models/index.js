/**
 * Created by LeonKim on 16. 12. 3..
 */
var db = require('../public/lib/database'),
    sql= '';

exports.get = function(){
    sql = 'SELECT * FROM sys.sys_config';

    return db.query(sql);
};