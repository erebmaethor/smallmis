let env = process.env.NODE_ENV;
if (env === undefined) {
  env = 'dev';
}

const dev = {
  hapi: {
    host: 'localhost',
    port: 3000,
  },
  db: {
    uri: '',
  },
};

const test = {
  hapi: {
    host: 'localhost',
    port: 3000,
  },
  db: {
    uri: '',
  },
};

const config = {
  dev,
  test,
};

module.exports = config[env];

/* hapi: {
   port: parseInt(process.env.DEV_APP_PORT) || 3000
 },
 db: {
   host: process.env.DEV_DB_HOST || 'localhost',
   port: parseInt(process.env.DEV_DB_PORT) || 27017,
   name: process.env.DEV_DB_NAME || 'db'
*/
