export default function patientGET(_id) {
  return fetch('http://localhost:3002/patient/' + _id)
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
}
