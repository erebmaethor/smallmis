import React, { Component } from 'react';
import parseSearchLine from './parseSearchLine';
import PatientProp from './PatientProp';
import PatientsTable from './PatientsTable';
import fetchPatsSearch from './fetchPatsSearch';

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      familyName: { value: '', error: false },
      firstName: { value: '', error: false },
      fathersName: { value: '', error: false },
      officialSex: '',
      dateOfBirth: '',
      patsList: [],
      errorMessage: '',
      reqTimer: false,
    };

    this.handleSearchType = this.handleSearchType.bind(this);
    this.requestPatsList = this.requestPatsList.bind(this);
  }

  componentDidMount() {
    // fill the patients table immidiately after loading page, before typing anything in search field
    this.handleSearchType({target: {value: ''}});
  }

  handleSearchType(event) {
    const newState = parseSearchLine(event.target.value, this.state); // there is Object.assign() in this function
    if (!this.state.familyName.error && !this.state.firstName.error) {
      if (this.state.reqTimer) {
        clearTimeout(this.state.reqTimer);
      }
      newState.reqTimer = setTimeout(this.requestPatsList(newState), 200);
    }
    this.setState(newState);
  }
  
  requestPatsList(newState) {
    const fetchReq = async () => {
      try {
        newState.patsList = await fetchPatsSearch(newState);
        newState.errorMessage = '';
        newState.reqTimer = false;
      } catch(error) {
        newState.patsList = [];
        newState.errorMessage = error.message;
        newState.reqTimer = false;
      }
      this.setState(newState);
    }
    return fetchReq;
  }

  render() {
    return (
      <form name="searchForm">
        <p className="cathead">Search:</p>
        <br />
        <input
          type="text"
          name="searchField"
          id="searchField"
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
        <p style={{ color: 'red' }}>{this.state.errorMessage}</p>

        <PatientsTable
          familyName={this.state.familyName.error ? '' : this.state.familyName.value}
          firstName={this.state.firstName.error ? '' : this.state.firstName.value}
          patsList={this.state.patsList}
        />
      </form>
    );
  }
}

export default SearchForm;
