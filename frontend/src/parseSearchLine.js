//import v9s from '../../tools.validations';

import parseCustomDate from './parseCustomDate';

// first word in search line is the family name, second - first name,
// third - father's name (if exist),
// chars 'f' or 'm' (or russian 'ж' or 'м') marks officialSex,
// and word that parses to date is the dateOfBirth

const parseSearchLine = (line, state) => {
  // split search line by whitespace and filter double (or multi) whitespaces
  let textFields = [];
  let sexField, dateOfBirthField;

  line
    .split(' ')
    .filter(word => word)
    .forEach(word => {
      // word is sex descriptor
      // Names can contains only one char. Thus, we must process it only if it isn't sex descriptor
      let isSex = false;
      if (word.length === 1) {
        if (word === 'f' || word === 'ж') {
          sexField = 'female';
          isSex = true;
        } else if (word === 'm' || word === 'м') {
          sexField = 'male';
          isSex = true;
        }
      }

      // try to parse date of birth
      let dOb = parseCustomDate(word);
      if (dOb) {
        dateOfBirthField = dOb;
        return;
      }

      // processing textFields
      if (isSex) { // skip processing as a text field if it is the sex descriptor
        return;
      }
      if (word.search(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/) === -1) {
        textFields.push({ error: true });
      } else {
        textFields.push({ value: word, error: false });
      }
      return;
    });

  const newState = Object.assign({}, state);

  // textFields[0]: familyName
  if (textFields[0] === undefined) {
    newState.familyName.value = '';
    newState.familyName.error = false;
  } else {
    if (textFields[0].error) {
      newState.familyName.error = true;
    } else {
      newState.familyName.value = textFields[0].value;
      newState.familyName.error = false;
    }
  }

  // textFields[1]: firstName
  if (textFields[1] === undefined) {
    newState.firstName.value = '';
    newState.firstName.error = false;
  } else {
    if (textFields[1].error) {
      newState.firstName.error = true;
    } else {
      newState.firstName.value = textFields[1].value;
      newState.firstName.error = false;
    }
  }

  // textFields[2]: fathersName
  if (textFields[2] === undefined) {
    newState.fathersName.value = '';
    newState.fathersName.error = false;
  } else {
    if (textFields[2].error) {
      newState.fathersName.error = true;
    } else {
      newState.fathersName.value = textFields[2].value;
      newState.fathersName.error = false;
    }
  }

  // sexField - officialSex
  if (sexField) {
    newState.officialSex = sexField;
  } else {
    newState.officialSex = '';
  }

  // dateOfBirthField - dateOfBirth
  if (dateOfBirthField) {
    newState.dateOfBirth = dateOfBirthField;
  } else {
    newState.dateOfBirth = '';
  }

  return newState;
};

export default parseSearchLine;
