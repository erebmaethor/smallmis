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

exports.deleteNote = async (req, h) => {
  try {
    const patient = await patientModel.findOne({ 'notes._id': req.params.noteId }, 'notes._id');

    if (!patient) {
      return h.response('No note with this ID').code(400);
    }
    if (patient._id != req.params.patientId) {
      return h.response('Posted patientId is wrong').code(400);
    }

    patient.notes.id(req.params.noteId).remove();
    await patient.save();

    return h.response('Note deleted successfully').code(204);
  } catch (err) {
    throw err;
  }
};
