var express = require('express');
var router = express.Router();
let newVideoModel = require('../models/new-video');

/* GET new video info listing */
router.get('/:sourceID', async function (req, res, next) {
  //console.log('😘 getting vidInfo if it exists, ', req.params, ', uid: ', req.user.uid);
  try {
    const result = await newVideoModel.handleGetNewVideo(req.params.sourceID, req.user.uid);
    //console.log('💜 got video info ', result);
    res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
