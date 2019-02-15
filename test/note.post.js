const chai = require('chai');
expect = chai.expect;

const server = require('../server/hapi').server;
//const mongoose = require('mongoose');
const patientModel = require('../api/patient/model').model;
const getRandPatient = require('./common').getRandPatient;

const now = new Date().getTime();

const testPayload = {
  date: new Date('2018-12-30'),
  doctor: 'Smolin',
  medcenter: 'Luch',
  cardNumber: '4958',
  noteType: 'ambneur',
  data: {
    complaints: 'Не болит голова',
    objective: 'BP 130/80 mmHg, HR 80 min, живот мягкий, б/б.',
    neurStatus: 'В сознании. Со стороны ЧН - б/о. СПР D=S, оживлены. Всё хорошо.',
  },
};

describe('/patient/{patientId}/note/ POST', async function() {
  it('it should insert new note to random patient', async function() {
    const randPatient = await getRandPatient();
    const res = await server.inject({
      method: 'POST',
      url: '/patient/' + randPatient._id + '/note/',
      payload: testPayload,
    });

    expect(res.statusCode).to.equal(201); // 201 created
    const payload = JSON.parse(res.payload);

    // get info from DB
    const postedPatient = await patientModel.findById(randPatient._id);
    const postedNote = postedPatient.notes.id(payload.noteId);

    expect(postedNote.date.toISOString()).to.equal(new Date('2018-12-30').toISOString());
    expect(postedNote.cardNumber).to.equal('4958');
    expect(postedNote.data.complaints).to.equal('Не болит голова');
    expect(postedNote.data.neurStatus).to.equal(
      'В сознании. Со стороны ЧН - б/о. СПР D=S, оживлены. Всё хорошо.'
    );

    // check that lastUpdate is updated
    expect(new Date(postedPatient.lastUpdate).getTime()).to.satisfy(lastUpdate => {
      return lastUpdate > now - 30000 && lastUpdate < now + 30000;
    });
    // check the note dateAdded
    expect(new Date(postedNote.dateAdded).getTime()).to.satisfy(lastUpdate => {
      return lastUpdate > now - 30000 && lastUpdate < now + 30000;
    });
  });

  it('it should reject with wrong patientId', async function() {
    const res = await server.inject({
      method: 'POST',
      url: '/patient/5c5daf6c8d3019235457f2e3/note/',
      payload: testPayload,
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id has non-valid length', async function() {
    const res = await server.inject({
      method: 'POST',
      url: '/patient/5c5daf6c8d3019015457f2e345bcd89/note/',
      payload: testPayload,
    });

    expect(res.statusCode).to.equal(400);
  });

  it('it should reject if _id is not hex', async function() {
    const res = await server.inject({
      method: 'POST',
      url: '/patient/5c5daf6c8d30190s5457fke3/note/',
      payload: testPayload,
    });

    expect(res.statusCode).to.equal(400);
  });
});
