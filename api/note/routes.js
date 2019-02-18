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

  {
    method: 'DELETE',
    path: '/patient/{patientId}/note/{noteId}',
    handler: controller.deleteNote,
    options: {
      validate: {
        params: {
          patientId: v9s.id,
          noteId: v9s.id,
        },
      },
      tags: ['api', 'note'],
      description: 'Delete note',
    },
  },
];
