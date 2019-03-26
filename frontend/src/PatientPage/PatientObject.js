/**
 * Constructor for object "Patient", that contains all info about given patient
 * @constructor
 * @param {Object} patData - object with patient's data, as comes from API
 * @apram {string} locale - 2-letter code of locale
 * @param [atTime] - the moment on which info should be actual according to updates' history; can be a Date object, timestamp number or dateString
 */
export default function Patient(patData, locale, atTime = Date.now()) {
  // define regular properties comes from patData
  const propList = [
    'familyName',
    'firstName',
    'fathersName',
    'dateOfBirth',
    'officialSex',
    'biologicalSex',
    'address',
    'phoneNumber',
    'lastUpdate',
  ];
  propList.forEach(propName => {
    if (patData[propName]) {
      this[propName] = patData[propName];
    } else {
      this[propName] = '';
    }
  });

  // only if patData.updates is presented
  if (patData.updates) {
    // atTime also can be a Date object or a dateString, if so convert it to timestamp format
    if (atTime.getTime) {
      atTime = atTime.getTime();
    } else if (isNaN(atTime)) {
      atTime = Date.parse(atTime);
    }

    // build the patient's updates history timeline
    //console.log(patData.updates)
    let i = patData.updates.length - 1;
    let iTime = Infinity;
    const histProp = key => {
      this[key] = patData.updates[i].update[key];
    };
    while (iTime > atTime && i > -1) {
      // get time of update
      iTime = getUpdateDate(patData.updates[i].dateDeJure, patData.updates[i].dateDeFacto);
      if (atTime > iTime) break;

      Object.keys(patData.updates[i].update).forEach(histProp);
      i--;
    }
  }

  // method at(atTime) returns object same as this (Patient) object with data actual at a 'atTime' time
  // according to updates' history. So, it provides chainable interface
  this.at = atTime => new Patient(patData, locale, atTime);

  // history contains array:
  // [{pat: Patient object with info actual at update time, date: Update date as timestamp (deJure, if absent - deFacto)}, {...}, ...]
  if (patData.updates) {
    Object.defineProperty(this, 'history', {
      get: () => {
        let history = [];
        patData.updates.forEach(updateData => {
          let upd = {};
          upd.date = getUpdateDate(updateData.dateDeJure, updateData.dateDeFacto);
          upd.pat = this.at(upd.date);
          history.push(upd);
        });
        return history;
      },
    });
  }

  // age at the given time (argument - timestamp)
  this.calcAge = momentTime => {
    const birth = new Date(this.dateOfBirth);
    const moment = new Date(momentTime);

    let age = moment.getFullYear() - birth.getFullYear(); // only *after* birthday
    if (moment.getMonth() > birth.getMonth()) {
      return age;
    } else if (moment.getMonth() < birth.getMonth()) {
      return age - 1;
    }
    // if birthMONTH is now we need to compare day's numbers
    if (moment.getDate() >= birth.getDate()) {
      return age;
    } else {
      return age - 1;
    }
  };

  // age at current moment
  Object.defineProperty(this, 'actualAge', {
    get: () => this.calcAge(new Date()),
  });

  // dateOfBirth toLocaleDateString
  Object.defineProperty(this, 'birthday', {
    get: () => new Date(this.dateOfBirth).toLocaleDateString(),
  });

  // define locale-dependent props
  switch (locale) {
    default:
    case 'ru':
      this.fullName = `${this.familyName} ${this.firstName} ${this.fathersName}`;
      this.sex = this.officialSex === 'female' ? 'жен.' : 'муж.';
      break;
    case 'en':
      this.fullName = `${this.firstName} ${this.familyName}`;
      this.sex = this.officialSex;
      break;
  }
}

function getUpdateDate(dateDeJure, dateDeFacto) {
  if (dateDeJure) {
    return Date.parse(dateDeJure);
  }
  return Date.parse(dateDeFacto);
}
