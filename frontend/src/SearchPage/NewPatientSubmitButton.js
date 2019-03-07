import React from 'react';

export default function NewPatientSubmitButton(props) {
  let disabled = true;
  let text = 'New patient';

  if (props.allow === 1) {
    disabled = false;
  }

  if (props.allow === 2) {
    text = 'Sending...';
  }

  return (
    <button type="submit" name="submitButton" disabled={disabled}>
      {text}
    </button>
  );
}
