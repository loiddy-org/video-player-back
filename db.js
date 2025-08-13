const mysql = require('mysql2/promise');
const ssmParams = require('./ssm-params');

var pool = null;

const getConfig = async () => {
  const params = await ssmParams.get();
  return {
    host: params.HOST,
    user: params.USER,
    password: params.PASSWORD,
    database: params.DATABASE,
    port: params.PORT,
  };
};

exports.connect = async function (done) {
  let dbConfig = await getConfig();
  pool = mysql.createPool(dbConfig);
};

exports.get = function () {
  return pool;
};
