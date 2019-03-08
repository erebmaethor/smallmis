export default async function sendNewPatient(state) {
  const body = {
    familyName: state.familyName.value,
    firstName: state.firstName.value,
    dateOfBirth: state.dateOfBirth,
    officialSex: state.officialSex,
  };
  if (state.fathersName.value !== '') {
    body.fathersName = state.fathersName.value;
  }

  const reqHeaders = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });

  const result = await fetch('http://localhost:3002/patient/', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: reqHeaders,
  })
    .then(response => response.json())
    .catch(error => {
      throw error;
    });

  return result;
}
