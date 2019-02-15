const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;
const getRandPatient = require('./common').getRandPatient;

describe('/patient/{patientId}/note/{noteId} GET', async function() {
  it('it should return info about one note regarding to patient and note IDs', async function() {
    const randPatient = await getRandPatient();

    const res = await server.inject({
      method: 'GET',
      url: '/patient/' + randPatient._id + '/note/' + randPatient.notes[0]._id,
    });

    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.doctor).to.equal(randPatient.notes[0].doctor);
    expect(payload.cardNumber).to.equal(randPatient.notes[0].cardNumber);
    expect(payload.noteType).to.equal(randPatient.notes[0].noteType);
    expect(payload.data.complaints).to.equal(randPatient.notes[0].data.complaints);
    expect(payload.data.objective).to.equal(randPatient.notes[0].data.objective);
    expect(payload.data.neurStatus).to.equal(randPatient.notes[0].data.neurStatus);
  });

  it('it should reject with wrong patientId', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d3019015457f2e3/note/' + randPatient.notes[0]._id,
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject with wrong noteId', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/' + randPatient._id + '/note/5c5daf6c8d3019015457f2e3',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if patientId has non-valid length', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d3019015457f2e345bcd89/note/' + randPatient.notes[0]._id,
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if noteId has non-valid length', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/' + randPatient._id + '/note/5c5daf6c8d3019015457f2e345bcd89',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if patientId is not hex', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d30190s5457fke3/note/' + randPatient.notes[0]._id,
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if noteId is not hex', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'GET',
      url: '/patient/' + randPatient._id + '/note/5c5daf6c8d30190s5457fke3',
    });

    expect(res.statusCode).to.equal(400);
  });
});
