import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchPage from './SearchPage/';
import PatientPage from './PatientPage/';

class App extends Component {
  render() {
    return (
      <div className="content">
        <Switch>
          <Route exact path="/" component={SearchPage} />
          <Route path="/patient/:patId" component={PatientPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
