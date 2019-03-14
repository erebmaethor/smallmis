import React from 'react';

export default function PatPropInput({ label, name, value = '', size = 15, handler, errors }) {
  const style = errors[name] ? { backgroundColor: '#ffb3b3' } : {};
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        name={name}
        style={style}
        defaultValue={value}
        size={size}
        onChange={handler}
      />
    </label>
  );
}
