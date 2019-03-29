import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchPage from './SearchPage/';
import PatientPage from './PatientPage/';
import Menu from './Menu';

class App extends Component {
  render() {
    return (
      <>
        <div className="main">
          <div className="content">
            <Switch>
              <Route exact path="/" component={SearchPage} />
              <Route path="/patient/" component={PatientPage} />
            </Switch>
          </div>
        </div>
        <div className="menu">
          <Menu />
        </div>
      </>
    );
  }
}

export default App;
