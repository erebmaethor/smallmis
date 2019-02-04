const controller = require('./controller');
const Joi = require('joi');
const patientJoiSchema = require('./model').joiSchema;

const validateInvalidAction = async (request, h, err) => {return h.response(err.details[0].message).code(400).takeover()};


module.exports = [
{
  method:   'GET',
  path:     '/patients/',
  handler:  controller.getPatientsList,
  options: {
    validate: {
      query: {
        familyName: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/).max(150),
        firstName: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/).max(100),
        limit: Joi.number().integer().min(1).max(100).default(25),
        offset: Joi.number().integer().default(0),
        pagination: Joi.boolean().default(false),
      },
      failAction: validateInvalidAction,
    },
  },
},

{
  method:   'POST',
  path:     '/patient/',
  handler:  controller.addPatient,
  options: {
    validate: {
      payload: patientJoiSchema,
      failAction: validateInvalidAction,
    },
  }
},

{
  method:   'GET',
  path:     '/patient/{id}',
  handler:  controller.getPatient,
  options: {
    validate: {
      params: {
        id: Joi.string().hex().length(24),
      },
      failAction: validateInvalidAction,
    },
  },
},

{
  method:   'PUT',
  path:     '/patient/{id}',
  handler:  controller.updatePatient,
  options: {
    validate: {
      params: {
        id: Joi.string().hex().length(24),
      },
      payload: patientJoiSchema.keys({
        updateReason: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-\.,]+$/).max(500),
        updateDateDeJure: Joi.date(),
      }),
      failAction: validateInvalidAction,
    },
  },
},

{
  method:   'DELETE',
  path:     '/patient/{id}',
  handler:  controller.deletePatient,
  options: {
   validate: {
      params: {
        id: Joi.string().hex().length(24),
      },
    },  
  },
},
];