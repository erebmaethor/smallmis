const Joi = require('joi');
const mongoose = require('mongoose');
const v9s = require('../../tools/validations');

// Joi schema is for Hapi validation and swagger
const joiSchema = Joi.object({
  familyName: Joi.string()
    .regex(v9s.regx.name)
    .max(150)
    .required()
    .description('Family (last) name of patient.'),

  firstName: Joi.string()
    .regex(v9s.regx.name)
    .max(100)
    .required()
    .description('First name of patient.'),

  fathersName: Joi.string()
    .regex(v9s.regx.name)
    .max(100)
    .allow('')
    .description("Father's name of patient, if specified."),

  dateOfBirth: Joi.date()
    .max('now')
    .required()
    .description('Date of birth, as given in official papers.'),

  officialSex: Joi.string()
    .only('female', 'male')
    .required()
    .description('There is only 2 variants in Russia - male or female.'),

  biologicalSex: Joi.string()
    .alphanum()
    .max(30)
    .allow('')
    .description('Any medical variants of sex.'),

  address: Joi.string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-.,()/]+$/)
    .max(250)
    .allow(''),

  phoneNumber: Joi.string()
    .regex(/^[0-9()+-]+$/)
    .allow('')
    .max(25),
});

const updatesSchema = new mongoose.Schema({
  _id: false,
  reason: String,
  dateDeJure: Date,
  dateDeFacto: Date,
  update: {},
});

const noteSchema = require('../note/model').mongooseSchema;

const schema = new mongoose.Schema({
  familyName: String,
  firstName: String,
  fathersName: String,
  dateOfBirth: Date,
  officialSex: String,
  biologicalSex: String,
  address: String,
  phoneNumber: String,
  lastUpdate: Date,
  updates: [updatesSchema],
  notes: [noteSchema],
});

const Model = mongoose.model('Patient', schema);

exports.joiSchema = joiSchema;
exports.model = Model;
