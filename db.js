const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');
require('dotenv').config();

var pool = null;

const getIpType = () => (process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === true ? 'PRIVATE' : 'PUBLIC');

const getDevelopmentConfig = () => {
  return {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
};

const getProductionConfig = async () => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    ipType: getIpType(),
  });
  return {
    ...clientOpts,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
};

exports.connect = async function (done) {
  let dbConfig;
  if (process.env.NODE_ENV === 'development') {
    dbConfig = getDevelopmentConfig();
  } else if (process.env.NODE_ENV === 'production') {
    dbConfig = await getProductionConfig();
  }
  pool = mysql.createPool(dbConfig);
};

exports.get = function () {
  return pool;
};
