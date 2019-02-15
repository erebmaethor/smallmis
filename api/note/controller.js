const patientModel = require('../patient/model').model;
const joiSchema = require('./model').joiSchema;

exports.addNote = async (req, h) => {
  try {
    const patient = await patientModel.findById(req.params.patientId);
    if (!patient) {
      return h.response('No patient with this ID').code(400);
    }

    patient.lastUpdate = new Date(); // this is for sorting patients in the order of their appointments' dates
    req.payload.dateAdded = new Date();
    patient.notes.push(req.payload);
    const updPatient = await patient.save();

    return h.response({ noteId: updPatient.notes[updPatient.notes.length - 1]._id }).code(201);
  } catch (err) {
    throw err;
  }
};

exports.getNote = async (req, h) => {
  try {
    const patient = await patientModel.findOne(
      { 'notes._id': req.params.noteId },
      { notes: { $elemMatch: { _id: req.params.noteId } } }
    );

    if (!patient) {
      return h.response('No note with this ID').code(400);
    }
    if (patient._id != req.params.patientId) {
      return h.response('Posted patientId is wrong').code(400);
    }

    return patient.notes[0];
  } catch (err) {
    throw err;
  }
};

exports.updatePatient = async (req, h) => {
  try {
    const patient = await exports.getPatient(req, h);

    // get the difference (because we store differences in `updates` subdocuments
    // array for proper processing of records from the past)

    const prepForCompare = x => {
      if (typeof x === 'undefined') return '';
      else return x.toString();
    };

    let diff = {};
    for (let i = 0; i < joiSchema._inner.children.length; i++) {
      let propName = joiSchema._inner.children[i].key;

      // The `diff` object will contains only updated properties with old values.
      // Values coming from frontend and from DB can be different
      // types: String, Date (and `undefined`), function prepForCompare()
      // will turn them all to comparable form.
      if (prepForCompare(patient[propName]) != prepForCompare(req.payload[propName])) {
        diff[propName] = patient[propName];
        patient[propName] = req.payload[propName];
      }
    }

    const update = {
      reason: req.payload.updateReason,
      dateDeJure: req.payload.updateDateDeJure,
      dateDeFacto: new Date(),
      update: diff,
    };

    patient.updates.push(update);

    await patient.save();

    return patient;
  } catch (err) {
    throw err;
  }
};

exports.deletePatient = async (req, h) => {
  try {
    const patient = await patientModel.findByIdAndDelete(req.params.id);
    if (!patient) {
      return h.response('No patient with this ID').code(400);
    } else {
      return h.response('Patient deleted successfully').code(204);
    }
  } catch (err) {
    throw err;
  }
};
