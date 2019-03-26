import parseCustomDate from './parseCustomDate';

test('Wrong format', () => {
  expect(parseCustomDate(12)).toBeFalsy;
  expect(parseCustomDate('12')).toBeFalsy;
  expect(parseCustomDate('12.2')).toBeFalsy;
  expect(parseCustomDate('12.2.')).toBeFalsy;
  expect(parseCustomDate('12..45')).toBeFalsy;
});

test('Normal parsing', () => {
  const d = new Date(parseCustomDate('1.1.1974'));

  expect(d.getUTCDate()).toEqual(1);
  expect(d.getUTCMonth()).toEqual(0);
  expect(d.getUTCFullYear()).toEqual(1974);
  expect(d.getUTCHours()).toEqual(0);
  expect(d.getUTCMinutes()).toEqual(0);
  expect(d.getUTCSeconds()).toEqual(0);
});

test('2-digit year calculating', () => {
  const currentYear4 = new Date().getFullYear();
  const currentYear2 = currentYear4 % 100;
  expect(new Date(parseCustomDate('1.1.13')).getUTCFullYear()).toEqual(2013);
  expect(new Date(parseCustomDate('1.1.' + currentYear2)).getUTCFullYear()).toEqual(currentYear4);
  expect(new Date(parseCustomDate('1.1.' + (currentYear2 + 4))).getUTCFullYear()).toEqual(
    currentYear4 + 4 - 100
  );
});
