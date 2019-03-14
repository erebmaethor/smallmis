export default function Patient(patData, locale) {
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
      this.sex = this.officialSex === 'f' ? 'жен.' : 'муж.';
      break;
    case 'en':
      this.fullName = `${this.firstName} ${this.familyName}`;
      this.sex = this.officialSex;
      break;
  }
}
