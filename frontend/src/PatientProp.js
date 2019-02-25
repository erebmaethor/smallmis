import React from 'react';

// props label, error, value,
const PatientProp = props => {
  let style = {};
  if (props.error) {
    style = { color: 'red' };
  }

  return (
    <>
      <span style={style}>{props.label}: </span>
      <strong>{props.value} </strong>
    </>
  );
};

export default PatientProp;
