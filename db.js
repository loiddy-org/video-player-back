const mysql = require('mysql2/promise');
require('dotenv').config();

var pool = null;

const getConfig = () => {
  return {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  };
};

exports.connect = async function (done) {
  let dbConfig;
  dbConfig = getConfig();
  pool = mysql.createPool(dbConfig);
};

exports.get = function () {
  return pool;
};
