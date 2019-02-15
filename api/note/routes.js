const controller = require('./controller');
const Joi = require('joi');
const noteJoiSchema = require('./model').joiSchema;
const v9s = require('../../tools/validations');
const validateInvalidAction = require('../../tools/validateFailAction');

module.exports = [
  {
    method: 'POST',
    path: '/patient/{patientId}/note/',
    handler: controller.addNote,
    options: {
      validate: {
        params: {
          patientId: v9s.id,
        },
        payload: noteJoiSchema,
        failAction: validateInvalidAction,
      },
      tags: ['api', 'note'],
      description: 'Adds medical note to the DB and returns _id).',
    },
  },

  {
    method: 'GET',
    path: '/patient/{patientId}/note/{noteId}',
    handler: controller.getNote,
    options: {
      validate: {
        params: {
          patientId: v9s.id,
          noteId: v9s.id,
        },
        failAction: validateInvalidAction,
      },
      tags: ['api', 'note'],
      description: 'Provides full data of note',
    },
  },
  /*
  {
    method: 'PUT',
    path: '/patient/{id}',
    handler: controller.updatePatient,
    options: {
      validate: {
        params: {
          id: Joi.string()
            .hex()
            .length(24),
        },
        payload: patientJoiSchema.keys({
          updateReason: Joi.string()
            .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-\.,]+$/)
            .max(500),
          updateDateDeJure: Joi.date(),
        }),
        failAction: validateInvalidAction,
      },
      tags: ['api', 'patient'],
    },
  },

  {
    method: 'DELETE',
    path: '/patient/{id}',
    handler: controller.deletePatient,
    options: {
      validate: {
        params: {
          id: Joi.string()
            .hex()
            .length(24),
        },
      },
      tags: ['api', 'patient'],
    },
  },
*/
];
