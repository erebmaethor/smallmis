import React from 'react';
import tools from '../tools';
import { Link } from 'react-router-dom';

export default function PatientsTable(props) {
  const patsRows = props.patsList.map(patient => {
    return (
      <tr key={patient._id} className="f">
        <td className="tb">
          {patient.familyName + ' ' + patient.firstName + ' ' + patient.fathersName}
        </td>
        <td className="tb">{tools.ruSex(patient.officialSex)}</td>
        <td className="tb">{tools.calculateAge(patient.dateOfBirth, patient.lastUpdate)}</td>
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
