export default async function patientPUT(inForm, patId) {
  const reqHeaders = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });

  const result = await fetch('http://localhost:3002/patient/' + patId, {
    method: 'PUT',
    body: JSON.stringify(inForm),
    headers: reqHeaders,
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('API request error');
      }
    })
    .catch(error => {
      throw error;
    });

  return result;
}
