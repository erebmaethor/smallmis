import parseCustomDate from '../common/parseCustomDate';

// first word (divided by whitespaces) in search line is the family name, second - first name,
// third - father's name (if exist),
// chars 'f' or 'm' (or russian 'ж' or 'м') marks officialSex,
// and word that parses to date is the dateOfBirth

const parseSearchLine = line => {
  let textFields = [];
  let sexField, dateOfBirthField;

  // split search line by whitespaces, filter double (or multi) whitespaces, and try to suggest what every element
  // is it
  String(line)
    .split(' ')
    .filter(word => word)
    .forEach(word => {
      // officialSex descriptor
      // Humans' names can contains only one char. Thus, we must process it as a name only if it isn't sex descriptor
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

      // date of birth
      let dOb = parseCustomDate(word);
      if (dOb) {
        dateOfBirthField = dOb;
        return;
      }

      // textFields
      if (isSex) {
        // skip processing as a text field if it is the sex descriptor
        return;
      }
      if (word.search(/^[a-zA-Zа-яА-ЯёЁ0-9 '-]+$/) === -1) {
        textFields.push({ error: true });
      } else {
        textFields.push({ value: word, error: false });
      }
      return;
    });

  let newState = { familyName: {}, firstName: {}, fathersName: {} };

  // textFields[0]: familyName
  if (textFields[0] === undefined) {
    newState.familyName.value = '';
    newState.familyName.error = false;
  } else {
    if (textFields[0].error) {
      newState.familyName.value = '';
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
      newState.firstName.value = '';
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
      newState.fathersName.value = '';
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

  // allowNewPat - is there enough info for create new patient?
  if (
    newState.familyName.value !== '' &&
    !newState.familyName.error &&
    newState.firstName.value !== '' &&
    !newState.firstName.error &&
    !newState.fathersName.error &&
    newState.officialSex !== '' &&
    newState.dateOfBirth !== ''
  ) {
    newState.allowNewPat = 1;
  } else {
    newState.allowNewPat = 0;
  }

  return newState;
};

export default parseSearchLine;
