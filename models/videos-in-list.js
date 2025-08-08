const db = require('../db');

const addVideoToList = async (videoID, listID, userID) => {
  const res = await db.get().query('INSERT INTO videos_lists (videoID, listID, userID, date_last_modified) VALUES (?, ?, ?, NOW())', [videoID, listID, userID]);
  return res[0].insertId;
};

const getAllVideosFromList = async (listID, userID) => {
  const [rows] = await db
    .get()
    .query(
      'SELECT v.id as videoID, Sub1.histID, Sub2.inLists, v.title, v.youtubeID, v.thumbnailURL FROM videos_lists AS v_l INNER JOIN videos AS v ON v.id = v_l.videoID LEFT JOIN (SELECT videoID, id AS histID FROM videos_lists WHERE listID = 1 AND userID = ?) Sub1 ON v.id = Sub1.videoID INNER JOIN (SELECT videoID, JSON_ARRAYAGG(listID) AS inLists FROM videos_lists WHERE userID = ? GROUP BY videoID) Sub2 ON v.id = Sub2.videoID WHERE v_l.userID = ? AND v_l.listID = ? ORDER BY v_l.date_last_modified DESC',
      [userID, userID, userID, listID]
    );
  return rows;
};

const updateVideoInList = async (videoID, listID, userID) => {
  await db.get().query('UPDATE videos_lists SET date_last_modified = NOW() WHERE videoID = ? AND listID = ? AND userID = ?', [videoID, listID, userID]);
};

const deleteVideoInList = async (videoID, listID, userID) => {
  await db.get().query('DELETE FROM videos_lists WHERE videoID = ? AND listID = ? AND userID = ?', [videoID, listID, userID]);
};

module.exports = {
  addVideoToList: addVideoToList,
  getAllVideosFromList: getAllVideosFromList,
  updateVideoInList: updateVideoInList,
  deleteVideoInList: deleteVideoInList,
};
