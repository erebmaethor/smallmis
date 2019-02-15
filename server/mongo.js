const mongoose = require('mongoose');
const dbURI = require('../config/').db.uri;

mongoose.connection.on('connected', () => {
  console.log('Connection with MongoDB Established');
});

mongoose.connection.on('reconnected', () => {
  console.log('Connection with MongoDB Reestablished');
});

mongoose.connection.on('disconnected', () => {
  console.log('Connection with MongoDB Disconnected');
});

mongoose.connection.on('close', () => {
  console.log('Connection with MongoDB Closed');
});

mongoose.connection.on('error', error => {
  console.error('MongoDB error: ' + error);
});

(async () => {
  try {
    await mongoose.connect(dbURI, {
      autoReconnect: true,
      reconnectTries: 1000000,
      reconnectInterval: 1000,
      useNewUrlParser: true,
    });
  } catch (e) {
    console.error(e);
  }
})();
