import React, { Component } from 'react';
import patientGET from './patientGET';
import patientPUT from './patientPUT';
import Patient from './PatientObject';
import PatPropsForm from './PatPropsForm';
import PatPropsFormShowButton from './PatPropsFormShowButton';
import checkPatPropsForm from './checkPatPropsForm';

export default class PatientPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queriedId: props.match.params._id, // initially received from router patient ID
      patData: {}, // patient data received from API
      error: '', // master error message
      formErrors: {}, // if there is an error in patPropsForm field, then [fieldName] = true
      formDiff: false, // true if data filled in patPropsForm is different than in state.patData
      formMessages: [], // messages for update or delete errors or success indication, {id, color, text}
      locale: 'ru', // need to rewrite later
      patPropsFormShow: false,
      patUpdateAllow: 0,
    };

    this.handlePatPropsFormShowHide = this.handlePatPropsFormShowHide.bind(this);
    this.handlePatPropsFormChange = this.handlePatPropsFormChange.bind(this);
    this.handlePatUpdateSubmit = this.handlePatUpdateSubmit.bind(this);
  }

  async componentDidMount() {
    // load the patient's data from API
    let patData = {};
    let errorMessage = '';
    try {
      // first check the _id's format: hex, length=24
      if (this.state.queriedId.search(/[0-9a-f]{24}/) === -1) {
        throw new Error('Wrong patient ID format.');
      }
      // fetch patient data from API
      patData = await patientGET(this.state.queriedId);
    } catch (error) {
      errorMessage = error.message;
    } finally {
      this.setState({ patData: patData, error: errorMessage });
    }
  }

  handlePatPropsFormShowHide() {
    this.setState({ patPropsFormShow: !this.state.patPropsFormShow });
  }

  handlePatPropsFormChange() {
    const { errors, diff } = checkPatPropsForm(this.state.patData);
    // if at least one error - disable submit button (allow=0 - error, allow=1 - no errors)
    const allow = Object.keys(errors).reduce((allow, key) => {
      if (allow === 0) return 0;
      return errors[key] ? 0 : 1;
    }, 1);

    this.setState({ formErrors: errors, formDiff: diff, patUpdateAllow: allow });
  }

  async handlePatUpdateSubmit(event) {
    event.preventDefault();
    
    const { inForm, errors, diff } = checkPatPropsForm(this.state.patData);
    
    // if diff === false - error, we don't need to ping API
    if (!diff) {
      this.showFormMessage('red', 'Error: there is nothing to update.');
      return;
    }
    
    // if there is some errors in fields - show error
    const errsArray = Object.keys(errors).filter(key => errors[key]);
    if (errsArray.length > 0) {
      this.showFormMessage('red', `Erroneous data entered in form.`);
      return;
    }
    
    // check patUpdateAllow
    if (this.state.patUpdateAllow !== 1) {
      this.showFormMessage('red', `Not ready to send.`);
      return;
    }
    
    // set submit button view to 'pending'
    this.setState({ patUpdateAllow: 2 }); 
    
    // try to send data to API
    try {
      const updPat = await patientPUT(inForm, this.state.patData._id);
      this.showFormMessage('green', 'Patient info updated successfully.');
      this.setState({patData: updPat});
    } catch(error) {
      this.showFormMessage('red', error.message);
    } finally {
      this.setState({ patUpdateAllow: 1 });
    }
  }

  showFormMessage(color, text) {
    const id = String(Date.now()) + Math.round(Math.random() * 10000); // unique id
    const newFormMess = this.state.formMessages.slice();
    newFormMess.push({ id: id, color: color, text: text });

    // set timeout to close message
    let messOff = id => {
      const newFormMess = this.state.formMessages.slice().filter(m => !(m.id === id));
      this.setState({ formMessages: newFormMess });
    };
    messOff = messOff.bind(this);
    setTimeout(messOff, 5000, id);
    this.setState({ formMessages: newFormMess });
  }

  render() {
    if (this.state.error !== '') {
      return (
        <p className="tb" style={{ color: 'red' }}>
          {this.state.error}
        </p>
      );
    }

    const pat = new Patient(this.state.patData, this.state.locale);
    return (
      <>
        <p className="cathead">
          {pat.fullName} {pat.actualAge} ({pat.birthday}) {pat.sex}
        </p>
        <PatPropsFormShowButton
          patPropsFormShow={this.state.patPropsFormShow}
          onClick={this.handlePatPropsFormShowHide}
          diff={this.state.formDiff}
        />
        {this.state.patPropsFormShow ? (
          <PatPropsForm
            patData={this.state.patData}
            handlerChange={this.handlePatPropsFormChange}
            errors={this.state.formErrors}
            allow={this.state.patUpdateAllow}
            messages={this.state.formMessages}
            handlerSumbit={this.handlePatUpdateSubmit}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}
