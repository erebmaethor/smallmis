import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PatientPage from './PatientPage';

export default function PatientPageRouter(props) {
  return (
    <Switch>
      <Route exact path="/patient/" render={props => <Redirect to="/" />} />
      <Route path="/patient/:_id" component={PatientPage} />
    </Switch>
  );
}
