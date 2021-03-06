import React, { Component } from 'react';
import parseSearchLine from './parseSearchLine';
import PatientProp from './PatientProp';
import PatientsTable from './PatientsTable';
import patientsGET from './patientsGET';
import SubmitButton from '../common/SubmitButton';
import patientPOST from './patientPOST';
import { Redirect } from 'react-router-dom';

export default class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      familyName: { value: 0, error: false }, // 0 but not '' for initial filling of pats' table, see handleSearchType() method
      firstName: { value: '', error: false },
      fathersName: { value: '', error: false },
      officialSex: '',
      dateOfBirth: '',
      patsList: [],
      errorMessage: '',
      reqTimer: false,
      allowNewPat: 0, // if we have enouth info for create new patient, switch to 1; pending - 2
      redirect: false,
    };

    this.handleSearchType = this.handleSearchType.bind(this);
    this.requestPatsList = this.requestPatsList.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    // fill the patients table immidiately after loading page, before typing anything in search field
    this.handleSearchType({ target: { value: '' } });
  }

  handleSearchType(event) {
    const newState = parseSearchLine(event.target.value);
    // compare old and new 'Names', if equal - deny request to API
    if (
      this.state.familyName.value !== newState.familyName.value ||
      this.state.firstName.value !== newState.firstName.value ||
      this.state.fathersName.value !== newState.fathersName.value
    ) {
      if (!newState.familyName.error && !newState.firstName.error) {
        // use setTimeout to avoid excess API reqiests at every type
        if (this.state.reqTimer) {
          clearTimeout(this.state.reqTimer);
        }
        newState.reqTimer = setTimeout(this.requestPatsList(newState), 300);
      }
    }
    this.setState(newState);
  }

  requestPatsList(newState) {
    const fetchReq = async () => {
      try {
        newState.patsList = await patientsGET(newState);
        newState.errorMessage = '';
      } catch (error) {
        newState.patsList = [];
        newState.errorMessage = error.message;
      } finally {
        newState.reqTimer = false;
        this.setState(newState);
      }
    };
    return fetchReq; // returns function for use as a callback in setTimeout
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    let newState = {};

    if (this.state.allowNewPat !== 1) return; // maybe it's be useful to show some error message in this case, but not now

    this.setState({ allowNewPat: 2 }); // set submit button view to 'pending'
    try {
      const newPat = await patientPOST(this.state);
      newState.redirect = '/patient/' + newPat._id;
    } catch (error) {
      newState.errorMessage = error.message;
    } finally {
      newState.allowNewPat = 1; // set submit button view again to 'allowed'
      this.setState(newState);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    let bDateStr = new Date(this.state.dateOfBirth).toLocaleDateString();
    if (bDateStr === 'Invalid Date') bDateStr = '';
    return (
      <form name="searchForm" onSubmit={this.handleFormSubmit}>
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
        &nbsp;
        <SubmitButton allow={this.state.allowNewPat} text="New patient" />
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
          <PatientProp label="Дата рожд." value={bDateStr} />
        </p>
        <p style={{ color: 'red' }}>{this.state.errorMessage}</p>
        <PatientsTable patsList={this.state.patsList} />
      </form>
    );
  }
}
