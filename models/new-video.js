const db = require('../db');
const youtubeModel = require('./../models/youtube');
const videosInListModel = require('./../models/videos-in-list');

exports.handleGetNewVideo = async (youtubeID, userID) => {
  let video = await getVideoDataFromDB(youtubeID);
  if (video) {
    const inListData = (await getVideoInListData(video.videoID, userID)) || { histID: null, inLists: [] };
    if (!inListData.histID) {
      inListData.histID = await videosInListModel.addVideoToList(video.videoID, 1, userID);
      inListData.inLists.push(1);
    }
    return {
      ...inListData,
      ...video,
    };
  } else {
    video = await youtubeModel.getVideoData(youtubeID);
    const newIDs = await addVideoToDB(video, userID);
    video.videoID = newIDs.videoID;
    video.histID = newIDs.histID;
    video.inLists = [1];
    return video;
  }
};

const getVideoDataFromDB = async (youtubeID) => {
  const [rows] = await db.get().query('SELECT id as videoID, youtubeID, title, thumbnailURL FROM videos WHERE youtubeID = ?', [youtubeID]);
  return rows[0];
};

const getVideoInListData = async (videoID, userID) => {
  const [rows] = await db
    .get()
    .query('WITH histID AS (SELECT id AS histID FROM videos_lists WHERE videoID = ? AND listID = 1 AND userID = ?), inLists AS (SELECT JSON_ARRAYAGG(listID) AS inLists FROM videos_lists WHERE videoID = videoID AND userID = userID GROUP BY videoID LIMIT 1) SELECT * FROM histID JOIN inLists', [
      videoID,
      userID,
      videoID,
      userID,
    ]);
  return rows[0];
};

const addVideoToDB = async (vid, userID) => {
  const connection = await db.get().getConnection();
  try {
    await connection.beginTransaction();
    const [videoTable] = await connection.query('INSERT INTO videos (youtubeID, title, thumbnailURL) VALUES (? , ? , ?);', [vid.youtubeID, vid.title, vid.thumbnailURL]);
    const [videosInTable] = await connection.query('INSERT INTO videos_lists (videoID, userID, listID, date_last_modified) VALUES (LAST_INSERT_ID(), ?, 1,NOW());', [userID]);
    await connection.commit();
    await db.get().releaseConnection();
    return { videoID: videoTable.insertId, histID: videosInTable.insertId };
  } catch (error) {
    await connection.rollback();
    await db.get().releaseConnection();
    throw new Error(error); // TODO
  }
};
