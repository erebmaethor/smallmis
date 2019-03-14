/**
 * function parses date in following custom format:
 *  d(d).m(m).yy(yy)
 *  2-digit years from current + 1 ('20' for 2019) to '99' (1999) interprets as 19xx, less as 20xx
 *
 * returns false if string is not a date
 * returns Date ISO string if parsed successfully
 */

export default function parseCustomDate(str) {
  let dateElements = str.split('.');
  if (dateElements.length !== 3) {
    return false;
  }
  // [0] - day, [1] - month, [2] - year
  if (dateElements[0] === '' || dateElements[1] === '' || dateElements[2] === '') {
    return false;
  }
  let day = +dateElements[0];
  let month = +dateElements[1] - 1;
  let year = +dateElements[2];
  if (year < 100) {
    // find the current year in 2-digit format
    const currentYear = new Date().getFullYear() % 100;

    if (year > currentYear) {
      year = 1900 + year;
    } else {
      year = 2000 + year;
    }
  }
  try {
    return new Date(Date.UTC(year, month, day)).toISOString();
  } catch {
    return false;
  }
}
