const chai = require('chai');
expect = require('chai').expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;

const now = new Date().getTime();

const getRandPatient = require('./common').getRandPatient;

describe('PUT /patient/ route test', async function() {
  
  
  it('it should update patient', async function() {
    
    // first, get info or random patient
    const patient = await getRandPatient();

    const res = await server.inject({

      method: 'PUT',
      url: '/patient/' + patient._id,
      payload: {
        familyName: 'Кузнецов',
        firstName: 'Иван',
        fathersName: 'Геннадьевич',
        dateOfBirth: '1943-02-12',
        officialSex: 'male',
        updateReason: 'Исправление ошибок',
      },
    });
    
    expect(res.statusCode).to.equal(200);
    const payload = JSON.parse(res.payload);
    expect(payload.familyName).to.equal('Кузнецов');
    expect(payload.firstName).to.equal('Иван');
    expect(payload.fathersName).to.equal('Геннадьевич');
    expect(payload.dateOfBirth).to.equal(new Date('1943-02-12').toISOString());
    expect(payload.officialSex).to.equal('male');

    // check the lastUpdate time
    const lastUpdateUnixT = new Date(payload.lastUpdate).getTime();
    expect(lastUpdateUnixT).to.satisfy( (lastUpdate) => {return (lastUpdate > now - 30000 && lastUpdate < now + 30000)} );
    
    // check the `updates` section
    expect(payload.updates[0].reason).to.equal('Исправление ошибок');
    const dateDeFactoUnixT = new Date(payload.updates[0].dateDeFacto).getTime();
    expect(dateDeFactoUnixT).to.satisfy( (ddf) => {return (ddf > now - 30000 && ddf < now + 30000);} );
  }); 

  it('it should reject with wrong _id', async function() {
    
    const res = await server.inject({

      method: 'PUT',
      url: '/patient/5c5daf6c8d3019015457f2e3',
    });
    
    expect(res.statusCode).to.equal(400);
  }); 

  it('it should reject if _id has non-valid length', async function() {
    
    const res = await server.inject({

      method: 'PUT',
      url: '/patient/5c5daf6c8d3019015457f2e345bcd89',
    });
    
    expect(res.statusCode).to.equal(400);
  }); 

  it('it should reject if _id is not hex', async function() {
    
    const res = await server.inject({

      method: 'PUT',
      url: '/patient/5c5daf6c8d30190s5457fke3',
    });
    
    expect(res.statusCode).to.equal(400);
  }); 

});