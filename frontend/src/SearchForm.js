import React, { Component } from 'react';
import parseSearchLine from './parseSearchLine';
import PatientProp from './PatientProp';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      familyName: { value: '', error: false },
      firstName: { value: '', error: false },
      fathersName: { value: '', error: false },
      officialSex: '',
      dateOfBirth: '',
    };

    this.handleSearchType = this.handleSearchType.bind(this);
  }

  handleSearchType(event) {
    const newState = parseSearchLine(event.target.value, this.state);

    this.setState(newState);
  }

  render() {
    return (
      <form name="searchForm">
        <p className="cathead">Search:</p>
        <br />
        <input
          type="text"
          name="searchField"
          size="100"
          className="seachfield"
          onKeyUp={this.handleSearchType}
        />
        <p className="patProps">
          <PatientProp
            label="Ф"
            error={this.state.familyName.error}
            value={this.state.familyName.value}
          />
          <PatientProp
            label="И"
            error={this.state.firstName.error}
            value={this.state.firstName.value}
          />
          <PatientProp
            label="О"
            error={this.state.fathersName.error}
            value={this.state.fathersName.value}
          />
          <PatientProp label="пол" value={this.state.officialSex} />
          <PatientProp label="Дата рожд." value={this.state.dateOfBirth.substr(0, 10)} />
        </p>
      </form>
    );
  }
}

export default SearchForm;
