const Joi = require('joi');
const mongoose = require('mongoose');

// Joi schema is for Hapi validation and swagger
const joiSchema = Joi.object({
  date: Joi.date()
    .max('now')
    .required()
    .description('Note factual date.'),
  doctor: Joi.string()
    .max(100)
    .required()
    .description('Id of medical practitioner.'),
  medcenter: Joi.string()
    .max(10)
    .required()
    .description('Id or name of medical center.'),
  cardNumber: Joi.string().max(10),
  noteType: Joi.string()
    .max(10)
    .description('Type of note.'),
  data: Joi.object().description('All data.'),
});

const schema = new mongoose.Schema({
  date: Date,
  dateAdded: Date,
  doctor: String,
  medcenter: String,
  cardNumber: String,
  noteType: String,
  data: {},
});

exports.joiSchema = joiSchema;
exports.mongooseSchema = schema;
