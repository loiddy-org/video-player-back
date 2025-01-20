var express = require('express');
var router = express.Router();
let videosInListModel = require('../models/videos-in-list.js');

router.post('/', async (req, res, next) => {
  //console.log('😘 adding vid to list, req.body: ', req.body, ', uid: ', req.user.uid);
  try {
    const insertID = await videosInListModel.addVideoToList(req.body.videoID, req.body.listID, req.user.uid);
    //console.log('💜 added video to list');
    res.json({ insertID });
  } catch (error) {
    return next(error);
  }
});

router.get('/:listID', async (req, res, next) => {
  //console.log('😘 getting videos in list, listID: ', req.params, ', uid: ', req.user.uid);
  try {
    const rows = await videosInListModel.getAllVideosFromList(req.params.listID, req.user.uid);
    //console.log('💜 got the videos, rows: ', rows);
    res.json(rows);
  } catch (error) {
    //console.log('ERROR', error);
    return next(error);
  }
});

router.put('/', async (req, res, next) => {
  //console.log('😘 updating video in history list, req.body: ', req.body, ', uid: ', req.user.uid);
  try {
    await videosInListModel.updateVideoInList(req.body.videoID, req.body.listID, req.user.uid);
    //console.log('💜 video updated');
    res.json({ success: 'Video updated' });
  } catch (error) {
    return next(error);
  }
});

router.delete('/', async (req, res, next) => {
  //console.log('😘 deleting video in list, req.body: ', req.body, ', req.user.uid: ', req.user.uid);
  try {
    await videosInListModel.deleteVideoInList(req.body.videoID, req.body.listID, req.user.uid);
    //console.log('💜 video deleted');
    res.json({ success: 'Video deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
