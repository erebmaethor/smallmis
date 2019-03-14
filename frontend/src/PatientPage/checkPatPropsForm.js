import parseCustomDate from '../common/parseCustomDate';

export default function checkPatPropsForm(patData) {
  const propsList = {
    familyName: /^[a-zA-Zа-яА-ЯёЁ0-9 '-{0,150}]+$/,
    firstName: /^[a-zA-Zа-яА-ЯёЁ0-9 '-{0,150}]+$/,
    fathersName: /^[a-zA-Zа-яА-ЯёЁ0-9 '-{,150}]+$/,
    dateOfBirth: false,
    officialSex: /^[male|female]+$/,
    biologicalSex: /^[a-zA-Zа-яА-ЯёЁ0-9{0,30}]+$/,
    address: /^[a-zA-Zа-яА-ЯёЁ0-9 '-.,()/{0,250}]+$/,
    phoneNumber: /^[0-9()-+{0,25}]+$/,
    updateReason: /^[a-zA-Zа-яА-ЯёЁ0-9 '-.,{0,500}]+$/,
    updateDateDeJure: false,
  };

  // access the form data and convert it to object
  const form = document.getElementsByName('patPropsForm')[0];
  let formValues = {};
  for (let i = 0; i < form.length; i++) {
    if (form[i].type === 'text') {
      formValues[form[i].name] = form[i].value;
    }
    if (form[i].type === 'radio' && form[i].checked === true) {
      formValues[form[i].name] = form[i].value;
    }
  }

  // check
  let inForm = {}; // values that filled in form; dates are converted to ISOstring format
  let errors = {}; // {fieldName: true} if there is an error in form field
  let diff = false; // true if there is a difference between state.patData and that filled in form

  // check text and radio fields
  Object.keys(propsList).forEach(key => {
    if (!propsList[key]) return;
    inForm[key] = formValues[key];
    errors[key] = false;
    if (formValues[key].search(propsList[key]) === -1 && formValues[key] !== '') {
      errors[key] = true;
    }
  });

  // check dates fields
  let dateFields = ['dateOfBirth'];
  if (formValues.updateDateDeJure === '') {
    // updateDateDeJure can be empty
    inForm.updateDateDeJure = '';
    errors.updateDateDeJure = false;
  } else {
    dateFields.push('updateDateDeJure');
  }
  dateFields.forEach(fieldName => {
    const fieldValue = parseCustomDate(formValues[fieldName]);
    if (fieldValue) {
      inForm[fieldName] = fieldValue;
      errors[fieldName] = false;
    } else {
      inForm[fieldName] = formValues[fieldName];
      errors[fieldName] = true;
    }
  });

  // calculate diff
  Object.keys(propsList).forEach(key => {
    if (patData[key] !== undefined && patData[key] !== inForm[key]) {
      diff = true;
    } else if (patData[key] === undefined && inForm[key] !== '') {
      diff = true;
    }
  });

  return { inForm: inForm, errors: errors, diff: diff };
}
