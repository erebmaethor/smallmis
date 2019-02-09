// Hapi
const Hapi = require('hapi');
const config = require('../config/');

const server = Hapi.server({
    port: config.hapi.port,
    host: config.hapi.host,
});

server.route(require('../api/patient/routes'));

module.exports = server;