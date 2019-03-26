import Patient from './PatientObject';

const testPat = {
  _id: '5c88db22c361bf397c75124d',
  dateOfBirth: '1943-02-12T00:00:00.000Z',
  familyName: 'Кузнецов',
  firstName: 'Михаил',
  fathersName: 'Иванович',
  officialSex: 'male',
  lastUpdate: '2019-03-13T10:27:46.461Z',
  notes: [],
  updates: [
    {
      reason: '',
      dateDeJure: '2017-02-15T06:45:14.077Z',
      dateDeFacto: '2019-03-16T06:45:14.077Z',
      update: { officialSex: 'male' },
    },
    {
      reason: '',
      dateDeJure: '',
      dateDeFacto: '2019-03-17T18:25:25.088Z',
      update: { officialSex: 'female' },
    },
    {
      reason: '',
      dateDeJure: '',
      dateDeFacto: '2019-03-18T18:36:50.934Z',
      update: { fathersName: 'Геннадьевич' },
    },
  ],
};

const pat = new Patient(testPat, 'ru');

test('Static properties', () => {
  expect(pat.familyName).toEqual(testPat.familyName);
  expect(pat.dateOfBirth).toEqual(testPat.dateOfBirth);
  expect(pat.fathersName).toEqual(testPat.fathersName);
  expect(pat.firstName).toEqual(testPat.firstName);
  expect(pat.lastUpdate).toEqual(testPat.lastUpdate);
  expect(pat.biologicalSex).toEqual('');
  expect(pat.address).toEqual('');
  expect(pat.phoneNumber).toEqual('');
});

test('Age calculations; some of this tests will turn into a pumpkin after 2020-02-12', () => {
  expect(pat.calcAge('2019-03-26')).toEqual(76);
  expect(pat.calcAge('1943-03-26')).toEqual(0);
  expect(pat.calcAge('1943-02-12')).toEqual(0);
  expect(pat.calcAge('1956-02-12')).toEqual(13);
  expect(pat.actualAge).toEqual(76);
});

test('Locale-dependent props', () => {
  // ru
  expect(pat.fullName).toEqual('Кузнецов Михаил Иванович');
  expect(pat.sex).toEqual('муж.');
  // en
  const patEn = new Patient(testPat, 'en');
  expect(patEn.fullName).toEqual('Михаил Кузнецов');
  expect(patEn.sex).toEqual('male');
});

test('History', () => {
  const h = pat.history; //console.log(h);
  expect(h[0].date).toEqual(1487141114077);
  expect(h[0].pat.fathersName).toEqual('Геннадьевич');
  expect(h[1].date).toEqual(1552847125088);
  expect(h[1].pat.officialSex).toEqual('female');
  expect(h[2].date).toEqual(1552934210934);
});
