const chai = require('chai');
expect = require('chai').expect

const server = require('../server/hapi');
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;


describe('POST /patient/ route test', async function() {
  
  
  it('it should insert new patient to the DB', async function() {

    const res = await server.inject({

      method: 'POST',
      url: '/patient/',
      payload: {
        familyName: 'Кузнецов',
        firstName: 'Иван',
        fathersName: 'Геннадьевич',
        dateOfBirth: '1943-02-12',
        officialSex: 'male',
      },
    });
    
    expect(res.statusCode).to.equal(201); // 201 created
    const payload = JSON.parse(res.payload);
    // get info from DB to check that API has really put info
    const postedPatient = await patientModel.findById(payload._id);
        
    expect(payload.familyName).to.equal('Кузнецов');
    expect(postedPatient.familyName).to.equal('Кузнецов');
    expect(payload.firstName).to.equal('Иван');
    expect(postedPatient.firstName).to.equal('Иван');
    expect(payload.fathersName).to.equal('Геннадьевич');
    expect(postedPatient.fathersName).to.equal('Геннадьевич');
    expect(payload.dateOfBirth).to.equal(new Date('1943-02-12').toISOString());
    expect(postedPatient.dateOfBirth.toISOString()).to.equal(new Date('1943-02-12').toISOString());
    expect(payload.officialSex).to.equal('male');
    expect(postedPatient.officialSex).to.equal('male');
    
    // check the lastUpdate time
    const lastUpdateUnixT = new Date(payload.lastUpdate).getTime();
    expect(lastUpdateUnixT).to.satisfy( (lastUpdate) => {
  
      const now = new Date().getTime();
      return (lastUpdate > now - 30000 && lastUpdate < now + 30000);
    } );
  }); 


});