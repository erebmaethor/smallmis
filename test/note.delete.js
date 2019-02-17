const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;
const getRandPatient = require('./common').getRandPatient;

describe('/patient/{patientId}/note/{noteId} DELETE', async function() {
  it('it should delete note regarding to patient and note IDs', async function() {
    const randPatient = await getRandPatient();

    const res = await server.inject({
      method: 'DELETE',
      url: '/patient/' + randPatient._id + '/note/' + randPatient.notes[0]._id,
    });

    expect(res.statusCode).to.equal(204); // 204 deleted
    // check that patient is absent in DB after deleting
    const deletedPatient = await patientModel.findOne({ 'notes._id': randPatient.notes[0]._id });
    expect(deletedPatient).to.be.null;
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
