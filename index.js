const server = require('./server/hapi');
const mongoose = require('mongoose');
require('./server/mongo');

(async () => {

  try {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    
  } catch(e) {

    console.error(e);
  }

})();

const gracefulExit = () => { 
  mongoose.connection.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);