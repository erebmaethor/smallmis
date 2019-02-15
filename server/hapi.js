const Hapi = require('hapi');
const config = require('../config/');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');

const server = new Hapi.server({
  port: config.hapi.port,
  host: config.hapi.host,
});

const swaggerOptions = {
  info: {
    title: 'SmallMIS Documentation',
    //version: Pack.version,
  },
};

const plugins = [
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
];

server.route(require('../api/patient/routes'));
server.route(require('../api/note/routes'));

module.exports.server = server;
module.exports.plugins = plugins;
