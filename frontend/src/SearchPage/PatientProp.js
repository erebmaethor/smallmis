import React from 'react';

// props label, error, value,
export default function PatientProp(props) {
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
}
