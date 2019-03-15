import React from 'react';

export default function SubmitButton({ allow, text }) {
  // allow: 0 - disabled, 1 - enabled, 2 - sending (disabled)
  let disabled = true;
  //let text = 'New patient';

  if (allow === 1) {
    disabled = false;
  }

  if (allow === 2) {
    text = 'Sending...';
  } 

  return (
    <button type="submit" name="submitButton" disabled={disabled}>
      {text}
    </button>
  );
}
