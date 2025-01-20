const db = require('../db');

let getAll = async (userID) => {
  const [rows] = await db.get().query('SELECT id AS listID, name FROM lists WHERE userID IN (?, ?)', ['common', userID]);
  return rows;
};

let createNewListWithOrWithoutVideo = async (listName, videoID, userID) => {
  if (!videoID) {
    const [fields] = await db.get().query('INSERT INTO lists (name, userID) VALUES (?, ?)', [listName, userID]);
    return { listID: fields.insertId };
  }
  const connection = await db.get().getConnection();
  try {
    await connection.beginTransaction();
    const [result1] = await connection.query('INSERT INTO lists (name, userID) VALUES (?, ?)', [listName, userID]);
    const [result2] = await connection.query('INSERT INTO videos_lists (videoID, listID, userID, date_last_modified) VALUES (?, ?, ?, NOW())', [videoID, result1.insertId, userID]);
    await connection.commit();
    await db.get().releaseConnection();
    return { listID: result1.insertId, inlistID: result2.insertId };
  } catch (error) {
    await connection.rollback();
    await db.get().releaseConnection();
    throw new Error(error);
  }
};

let deleteListAndVideosInList = async (listID, userID) => {
  await db.get().query('DELETE FROM lists WHERE id = ? AND userID = ?', [listID, userID]);
  // foregin key in database deletes videos in list
};

module.exports = {
  getAll: getAll,
  createNewListWithOrWithoutVideo: createNewListWithOrWithoutVideo,
  deleteListAndVideosInList: deleteListAndVideosInList,
};
