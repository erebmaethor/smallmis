import React from 'react';
import { Link } from 'react-router-dom';
import Patient from '../PatientPage/PatientObject';

export default function PatientsTable(props) {
  const patsRows = props.patsList.map(patient => {
    const pat = new Patient(patient, 'ru'); // MUST access to locale after implementing locale management subsystem
    return (
      <tr key={patient._id} className="f">
        <td className="tb">{pat.fullName}</td>
        <td className="tb">{pat.sex}</td>
        <td className="tb">
          {pat.calcAge(pat.lastUpdate)} {pat.actualAge}
        </td>
        <td className="tb">{patient.lastUpdate.substr(0, 10)}</td>
        <td className="tb">
          <Link to={`/patient/${patient._id}`}>view</Link>
        </td>
      </tr>
    );
  });

  return (
    <table border="0" cellPadding="0" cellSpacing="0" id="patstab" width="700px">
      <tbody>
        <tr>
          <td className="tablehead">имя</td>
          <td className="tablehead">пол</td>
          <td className="tablehead">возраст</td>
          <td className="tablehead">посл. запись</td>
          <td className="tablehead" />
        </tr>
        <tr>
          <td colSpan="4">
            <hr size="1" width="60%" align="center" />
          </td>
        </tr>
        {patsRows}
      </tbody>
    </table>
  );
}
