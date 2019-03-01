let tools = {};

tools.calculateAge = (birth, moment) => {
  return Math.round((new Date(moment) - new Date(birth)) / (3600000 * 24 * 365)); // MUST write the proper age calculator!!!!!!!!!!!!!!!
};
//export default calculateAge;

tools.ruSex = sex => {
  if (sex === 'male') {
    return 'м';
  } else if (sex === 'female') {
    return 'ж';
  } else {
    throw new Error('unknow sex');
  }
};

export default tools;
//export ruSex;
