const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;

describe('/patients/ GET', function() {
  it('it should return list of all patients', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/',
    });

    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.pagination).to.be.a('boolean');
    expect(payload.list).to.be.an('array');
    expect(payload.limit).to.equal(25);
    expect(payload.offset).to.equal(0);
    const patCount = await patientModel.countDocuments({}); // we need an exact quantity of documents in collection, not estimated
    expect(payload.list.length).to.equal(patCount);
  });

  it('it should return patients regarding to search line', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/?familyName=ивано',
    });

    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.pagination).to.be.a('boolean');
    expect(payload.list).to.be.an('array');
    const patCount = await patientModel.countDocuments({ familyName: /^ивано/i });
    expect(payload.list.length).to.equal(patCount);
    expect(payload.list[0].familyName).to.equal('Иванов');
  });

  it('it should reject if search contains not allowed characters', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/?familyName=ивано@%',
    });

    expect(res.statusCode).to.equal(400);
    //console.log(res.payload);
  });

  it('it should return no patients if no match with search line', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/?familyName=хзкто',
    });

    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.pagination).to.be.a('boolean');
    expect(payload.list).to.be.an('array');
    expect(payload.list.length).to.equal(0);
  });

  it('simple pagination test', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/?pagination=true&offset=2&limit=1',
    });

    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.list.length).to.equal(1);
  });

  it('should reject if limit bigger than 100', async function() {
    const res = await server.inject({
      method: 'GET',
      url: '/patients/?pagination=true&offset=20&limit=101',
    });

    expect(res.statusCode).to.equal(400);
  });
});
