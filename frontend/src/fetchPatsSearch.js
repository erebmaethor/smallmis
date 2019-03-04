export default function fetchPatsSearch(newState) {
  const rawQuery = {
    familyName: newState.familyName.value,
    firstName: newState.firstName.value,
    fathersName: newState.fathersName.value,
  };
  const query = Object.keys(rawQuery)
    .filter(k => rawQuery[k])
    .map(k => k + '=' + encodeURIComponent(rawQuery[k]))
    .join('&');
  return fetch('http://localhost:3002/patients/?' + query)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('API request error');
      }
    })
    .then(data => data.list)
    .catch(error => {
      throw error;
    });
}
