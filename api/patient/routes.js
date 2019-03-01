const controller = require('./controller');
const Joi = require('joi');
const patientJoiSchema = require('./model').joiSchema;
const v9s = require('../../tools/validations');
const validateInvalidAction = require('../../tools/validateFailAction');

module.exports = [
  {
    method: 'GET',
    path: '/patients/',
    handler: controller.getPatientsList,
    options: {
      validate: {
        query: {
          familyName: Joi.string()
            .regex(v9s.regx.name)
            .max(150)
            .description("Family (last) name or it's beginning part for patient search."),
          firstName: Joi.string()
            .regex(v9s.regx.name)
            .max(100)
            .description('First name or part, same as familyName.'),
          limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(25)
            .description('Amount of patients per page.'),
          offset: Joi.number()
            .integer()
            .default(0)
            .description('How much patients to skip, applicable if pagination is on.'),
          pagination: Joi.boolean()
            .default(false)
            .description('Pagination on/off. Usually off due to better perfomance.'),
        },
        failAction: validateInvalidAction,
      },
      tags: ['api', 'patients'],
      description: 'Provides list of patients.',
      cors: true, /////////////////// it must be changed before deploy to prduction!!!
    },
  },

  {
    method: 'POST',
    path: '/patient/',
    handler: controller.addPatient,
    options: {
      validate: {
        payload: patientJoiSchema,
        failAction: validateInvalidAction,
      },
      tags: ['api', 'patient'],
      description: 'Adds patient to the DB and returns full info of him/her (including _id).',
    },
  },

  {
    method: 'GET',
    path: '/patient/{id}',
    handler: controller.getPatient,
    options: {
      validate: {
        params: {
          id: v9s.id.description('Patient _id'),
        },
        failAction: validateInvalidAction,
      },
      tags: ['api', 'patient'],
      description: 'Returns all patient info.',
    },
  },

  {
    method: 'PUT',
    path: '/patient/{id}',
    handler: controller.updatePatient,
    options: {
      validate: {
        params: {
          id: v9s.id.description('Patient _id'),
        },
        payload: patientJoiSchema.keys({
          updateReason: Joi.string()
            .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-\.,]+$/)
            .max(500)
            .description(
              'Reason of update, must be specified if official information, such as name of birth date, is changed.'
            ),
          updateDateDeJure: Joi.date(),
        }),
        failAction: validateInvalidAction,
      },
      tags: ['api', 'patient'],
      description: 'Updates patient info.',
    },
  },

  {
    method: 'DELETE',
    path: '/patient/{id}',
    handler: controller.deletePatient,
    options: {
      validate: {
        params: {
          id: v9s.id,
        },
      },
      tags: ['api', 'patient'],
      description: 'Deletes patient info.',
    },
  },
];
