const Joi = require('joi');
const mongoose = require('mongoose');

// Joi schema is for Hapi validation and swagger
const joiSchema = Joi.object({
  
  familyName: Joi
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/)
    .max(150)
    .required()
    .description('Family (last) name of patient.'),
    
  firstName: Joi
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/)
    .max(100)
    .required()
    .description('First name of patient.'),
    
  fathersName: Joi
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/)
    .max(100)
    .description('Father\'s name of patient, if specified.'),
    
  dateOfBirth: Joi
    .date()
    .max('now')
    .required()
    .description('Date of birth, as given in official papers.'),
    
  officialSex: Joi
    .string()
    .only('female', 'male')
    .required()
    .description('There is only 2 variants in Russia - male or female.'),
    
  biologicalSex: Joi
    .string()
    .alphanum()
    .max(30)
    .description('Any medical variants of sex.'),
    
  address: Joi
    .string()
    .regex(/^[a-zA-Zа-яА-ЯёЁ0-9 '-.,()/]+$/),
    
  phoneNumber: Joi
    .string()
    .regex(/^[0-9()-+]+$/),
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