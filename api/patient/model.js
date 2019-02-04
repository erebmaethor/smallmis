const Joi = require('joi');
const mongoose = require('mongoose');

// Joi schema is only for Hapi validation
const joiSchema = Joi.object({
  
  familyName: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/).max(150).required(),
  firstName: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/).max(100).required(),
  fathersName: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/).max(100),
  dateOfBirth: Joi.date().max('now').required(),
  officialSex: Joi.string().only('female', 'male').required(),
  biologicalSex: Joi.string().alphanum().max(30),
  address: Joi.string().regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-.,()/]+$/),
  phoneNumber: Joi.string().regex(/^[0-9()-+]+$/),
});


const updatesSchema = new mongoose.Schema({
  reason: String,
  dateDeJure: Date,
  dateDeFacto: Date,
  update: {}
});

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
});

const Model = mongoose.model('Patient', schema);

exports.joiSchema = joiSchema;
exports.model = Model;