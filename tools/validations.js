const Joi = require('joi');
let v9s = {};
v9s.regx = {};
// here lies RegExps and Joi objects for validation of different values

// MongoDB (and Mongoose) _id
v9s.id = Joi.string()
  .hex()
  .length(24);

// Names (family and last name)
v9s.regx.name = /^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/;

module.exports = v9s;
