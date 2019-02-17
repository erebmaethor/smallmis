const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;

const getRandPatient = require('./common').getRandPatient;

describe('/patient/ GET', async function() {
  it('it should return info about one patient regarding to _id', async function() {
    // first, get info or random patient
    const patient = await getRandPatient();

    const res = await server.inject({
      method: 'GET',
      url: '/patient/' + patient._id,
    });

    expect(res.statusCode).to.equal(200);   
    const payload = JSON.parse(res.payload);
    expect(payload.familyName).to.equal(patient.familyName);
    expect(payload.firstName).to.equal(patient.firstName);
  });

  it('it should reject with wrong _id', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d3019015457f2e3',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id has non-valid length', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d3019015457f2e345bcd89',
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id is not hex', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patient/5c5daf6c8d30190s5457fke3',
    });

    expect(res.statusCode).to.equal(400);
  });
});
