var express = require('express');
var router = express.Router();
var listsModel = require('./../models/lists');

router.get('/', async (req, res, next) => {
  //console.log('😘 getting lists, uid: ', req.user.uid);
  try {
    const rows = await listsModel.getAll(req.user.uid);
    //console.log('💜 got the lists', rows);
    res.json(rows);
  } catch (error) {
    console.log('🤬', error);
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  //console.log('😘 creating a new list, req.body: ', req.body, ', uid: ', req.user.uid);
  try {
    const result = await listsModel.createNewListWithOrWithoutVideo(req.body.listName, req.body.videoID, req.user.uid);
    //console.log('💜 list created, res: ', result);
    res.json(result);
  } catch (error) {
    //console.log('🤬', error);
    return next(error);
  }
});

router.delete('/', async (req, res, next) => {
  //console.log('😘 deleting a list, req.body: ', req.body, ' uid: ', req.user.uid);
  try {
    listsModel.deleteListAndVideosInList(req.body.listID, req.user.uid);
    //console.log('💜 list deleted');
    res.json({
      success: 'List deleted',
    });
  } catch (error) {
    //console.log('🤬', error);
    return next(error);
  }
});

module.exports = router;
