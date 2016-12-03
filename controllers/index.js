/**
 * Created by LeonKim on 16. 12. 3..
 */
var index = require('../models');

exports.get = function(req, res) {
    index.get()
    .then(function(rtn){
            res.send({status:200,data:rtn});
        },function(err){
            res.send({status:500,message:err});
        })
};