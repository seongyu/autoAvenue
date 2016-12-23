/**
 * Created by LeonKim on 16. 12. 3..
 */
var index = require('../models');

exports.get = function(req, res) {
    res.render('index', {
        title: 'AutoAvenue',
        env : process.env.NODE_ENV
    });
};