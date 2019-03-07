import React, { Component } from 'react';

/*export default class PatientPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};
  }
  
  render() {
    
  }
}
*/

export default function PatientPage(props) {
  return (
    <p className="cathead">{props.match.params.patId}</p>
  );
}