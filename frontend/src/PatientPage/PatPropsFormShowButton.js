import React from 'react';

export default function PatPropsFormShowButton(props) {
  const text = props.patPropsFormShow ? 'Hide' : 'Edit patient data';
  return (
    <button name="formShow" onClick={props.onClick} disabled={props.diff}>
      {text}
    </button>
  );
}
