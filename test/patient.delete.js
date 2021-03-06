const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;

const now = new Date().getTime();

const getRandPatient = require('./common').getRandPatient;

describe('/patient/ DELETE', async function() {
  it('it should delete patient', async function() {
    // first, get info or random patient
    const randPatient = await getRandPatient();

    const res = await server.inject({
      method: 'DELETE',
      url: '/patient/' + randPatient._id,
    });

    expect(res.statusCode).to.equal(204); // 204 deleted
    // check that patient is absent in DB after deleting
    const deletedPatient = await patientModel.findById(randPatient._id);
    expect(deletedPatient).to.be.null;
  });

  it('it should reject with wrong _id', async function() {
    const res = await server.inject({
      method: 'DELETE',
      url: '/patient/5c5daf6c8d3019015457f2e3',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id has non-valid length', async function() {
    const res = await server.inject({
      method: 'DELETE',
      url: '/patient/5c5daf6c8d3019015457f2e345bcd89',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id is not hex', async function() {
    const res = await server.inject({
      method: 'DELETE',
      url: '/patient/5c5daf6c8d30190s5457fke3',
    });

    expect(res.statusCode).to.equal(400);
  });
});
