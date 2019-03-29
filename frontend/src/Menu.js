import React from 'react';
import { Link } from 'react-router-dom';

export default function Menu(props) {
  return (
    <>
      <p className="menu_h">Navigation:</p>
      <br />
      <Link to="/">
        <p className="menu">Patients search</p>
      </Link>
    </>
  );
}
