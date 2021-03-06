const mongoose = require('mongoose');

const patientModel = require('../api/patient/model').model;
const testContent = require('./patients.content').patients;

before(async () => {
  await require('../server/mongo');

  if (await patientModel.countDocuments()) {
    await mongoose.connection.dropCollection('patients');
  }

  await Promise.all(
    testContent.map(async patient => {
      const newPatient = new patientModel(patient);
      await newPatient.save();
    })
  );
});

after(done => {
  mongoose.connection.close(() => {
    done();
  });
});

// function that randomly choose one patient from DB for GET, PUT and DELETE routes tests
exports.getRandPatient = async () => {
  try {
    const patCount = await patientModel.countDocuments(); // we need an exact count, not estimated
    randomPat = Math.round(Math.random() * (patCount - 1));
    const patients = await patientModel
      .find({})
      .limit(1)
      .skip(randomPat);
    return patients[0];
  } catch (err) {
    console.error(err);
  }
};
