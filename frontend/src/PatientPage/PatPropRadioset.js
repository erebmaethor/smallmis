import React from 'react';

export default function PatPropRadioset({ list, label, value, name, handler }) {
  let listRadios = list.map(radio => {
    return (
      <label key={radio.value}>
        <input
          type="radio"
          name={name}
          value={radio.value}
          defaultChecked={radio.value === value}
          onChange={handler}
        />{' '}
        {radio.label}
      </label>
    );
  });
  return (
    <>
      {label}: {listRadios}
    </>
  );
}
