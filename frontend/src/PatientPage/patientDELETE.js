export default async function patientDELETE(patId) {
  const result = await fetch('http://localhost:3002/patient/' + patId, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        return;
      } else {
        throw new Error('API request error');
      }
    })
    .catch(error => {
      throw error;
    });

  return result;
}
