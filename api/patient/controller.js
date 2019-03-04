const patientModel = require('./model').model;
const joiSchema = require('./model').joiSchema;

exports.getPatientsList = async (req, h) => {
  try {
    const select = 'familyName firstName fathersName dateOfBirth officialSex lastUpdate';
    let filter = {};

    if (req.query.familyName) {
      filter.familyName = new RegExp('^' + req.query.familyName, 'i');
    }
    if (req.query.firstName) {
      filter.firstName = new RegExp('^' + req.query.firstName, 'i');
    }

    if (req.query.fathersName) {
      filter.fathersName = new RegExp('^' + req.query.fathersName, 'i');
    }

    const answer = {
      pagination: req.query.pagination,
      limit: req.query.limit,
      offset: req.query.offset,
    };

    answer.list = await patientModel
      .find(filter, select)
      .limit(req.query.limit)
      .sort('-lastUpdate')
      .skip(req.query.offset);

    if (req.query.pagination) {
      answer.count = await patientModel.countDocuments(filter);
    }

    return answer;
  } catch (err) {
    throw err;
  }
};

exports.addPatient = async (req, h) => {
  try {
    const newPatient = new patientModel(req.payload);
    newPatient.lastUpdate = new Date();

    await newPatient.save();

    return h.response(newPatient).code(201);
  } catch (err) {
    throw err;
  }
};

exports.getPatient = async (req, h) => {
  try {
    const patient = await patientModel.findById(req.params.id, '-notes.data');
    if (!patient) {
      return h.response('No patient with this ID').code(400);
    }
    return patient;
  } catch (err) {
    throw err;
  }
};

exports.updatePatient = async (req, h) => {
  try {
    const patient = await patientModel.findById(req.params.id);
    if (!patient) {
      return h.response('No patient with this ID').code(400);
    }

    // get the difference (because we store differences in `updates` subdocuments
    // array for proper processing of notes from the past)

    const prepForCompare = x => {
      if (typeof x === 'undefined') return '';
      else return x.toString();
    };

    let diff = {};
    for (let i = 0; i < joiSchema._inner.children.length; i++) {
      let propName = joiSchema._inner.children[i].key; // extract list of allowed props from Joi schema object

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
    }
    return h.response('Patient deleted successfully').code(204);
  } catch (err) {
    throw err;
  }
};
