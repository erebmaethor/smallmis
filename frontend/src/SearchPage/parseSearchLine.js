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
      if (word.search(/^["]{0,1}[a-zA-Zа-яА-ЯёЁ0-9 '-]{0,}["]{0,1}$/) === -1) {
        textFields.push({ value: '', error: true });
      } else {
        textFields.push({ value: word, error: false });
      }
      return;
    });

  // words (now - textFields) wrapped into quotes (") we join into one word
  let textFieldsJoined = [];
  let j = 0;
  let quotesAreOpened = false;
  for (let i = 0; i < textFields.length; i++) {
    if (!textFieldsJoined[j]) {
      textFieldsJoined[j] = { value: '', error: false };
    }
    let ioq = textFields[i].value.indexOf('"');
    // quotes opening
    if (ioq === 0) {
      textFieldsJoined[j].value = textFieldsJoined[j].value + ' ' + textFields[i].value.slice(1);
      // if textFields[i].error === false, it doesn't change textFieldsJoined[j].error back to false
      // if it already true
      if (textFields[i].error) {
        textFieldsJoined[j].error = true;
      }
      quotesAreOpened = true;
      continue;
    }
    // quotes closing
    if (ioq === textFields[i].value.length - 1) {
      textFieldsJoined[j].value =
        textFieldsJoined[j].value + ' ' + textFields[i].value.slice(0, -1);
      textFieldsJoined[j].value = textFieldsJoined[j].value.slice(1); // remove leading whitespace
      if (textFields[i].error) {
        textFieldsJoined[j].error = true;
      }
      j++;
      quotesAreOpened = false;
      continue;
    }
    // quotes opened
    if (ioq === -1 && quotesAreOpened) {
      textFieldsJoined[j].value = textFieldsJoined[j].value + ' ' + textFields[i].value;
      continue;
    }
    // if not wrapped - change first char to uppercase, other - to lowercase
    if (ioq === -1) {
      if (!textFields[i].error) {
        textFields[i].value =
          textFields[i].value[0].toUpperCase() + textFields[i].value.slice(1).toLowerCase();
      }
      textFieldsJoined[j].value = textFields[i].value;
      textFieldsJoined[j].error = textFields[i].error;
      j++;
    }
  }

  let newState = { familyName: {}, firstName: {}, fathersName: {} };

  // textFieldsJoined[0]: familyName
  if (textFieldsJoined[0] === undefined) {
    newState.familyName.value = '';
    newState.familyName.error = false;
  } else {
    if (textFieldsJoined[0].error) {
      newState.familyName.value = '';
      newState.familyName.error = true;
    } else {
      newState.familyName.value = textFieldsJoined[0].value;
      newState.familyName.error = false;
    }
  }

  // textFieldsJoined[1]: firstName
  if (textFieldsJoined[1] === undefined) {
    newState.firstName.value = '';
    newState.firstName.error = false;
  } else {
    if (textFieldsJoined[1].error) {
      newState.firstName.value = '';
      newState.firstName.error = true;
    } else {
      newState.firstName.value = textFieldsJoined[1].value;
      newState.firstName.error = false;
    }
  }

  // textFieldsJoined[2]: fathersName
  if (textFieldsJoined[2] === undefined) {
    newState.fathersName.value = '';
    newState.fathersName.error = false;
  } else {
    if (textFieldsJoined[2].error) {
      newState.fathersName.value = '';
      newState.fathersName.error = true;
    } else {
      newState.fathersName.value = textFieldsJoined[2].value;
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
