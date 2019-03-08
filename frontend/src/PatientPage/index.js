import React, { Component } from 'react';

export default class PatientPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queriedId: props.match.params._id,
      patData: {},
      error: '',
    };
  }

  async componentDidMount() {
    //this.state.patData._id =
  }

  render() {
    return <p className="cathead">{this.state.queriedId}</p>;
  }
}
