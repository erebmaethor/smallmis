// Hapi
const Hapi = require("hapi");
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// Mongoose
const mongoose = require('mongoose');
const dbURI = require('../config/db').uri;

mongoose.connection.on('connected', () => {
  console.log('Connection with MongoDB Established')
})

mongoose.connection.on('reconnected', () => {
  console.log('Connection with MongoDB Reestablished')
})

mongoose.connection.on('disconnected', () => {
  console.log('Connection with MongoDB Disconnected')
})

mongoose.connection.on('close', () => {
  console.log('Connection with MongoDB Closed')
})

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error: ' + error)
})


// run function
const run = async () => {

  try {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    
    await mongoose.connect(dbURI, {
      autoReconnect: true,
      reconnectTries: 1000000,
      reconnectInterval: 1000,
      useNewUrlParser: true
    });
  } catch(e) {

    console.error(e);
  }

};


server.route(require('../api/patient/routes'));

const gracefulExit = () => { 
  mongoose.connection.close(() => {
    console.log('DB connection closed.');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

module.exports = run;