var express = require('express');
var router = express.Router();
var index = require('../controllers');
var point = require('../controllers/point');

/* GET home page. */
router.get('/', index.get);
router.post('/:token/addPnt',point.addPnt);
router.post('/:token/usePnt',point.usePnt);
router.post('/:token/statPntAll',point.statPntAll);
router.post('/:token/hc',point.hc);
router.post('/:token/memInfo',point.memInfo);
router.get('/:token/stepbatch',point.stepbatch);

router.post('/v1/point/:token/addPnt',point.addPnt);
router.post('/v1/point/:token/usePnt',point.usePnt);
router.post('/v1/point/:token/statPntAll',point.statPntAll);
router.post('/v1/point/:token/hc',point.hc);
router.post('/v1/point/:token/memInfo',point.memInfo);
router.get('/v1/point/:token/stepbatch',point.stepbatch);

module.exports = router;
