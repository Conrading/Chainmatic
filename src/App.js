import React, { Component } from 'react';
import './App.css';
import MainPlayer from './component/mainPlayer'
import MainPage from './component/mainPage'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class Mainframe extends Component {
  constructor (props) {
    super (props)
    this.search = this.search.bind(this)
  }
  search () {
    alert ("Sorry, we are still working on this part")
  }
  render () {
    return (
      <Router>
      <div>
        <div className="making-row separate-two-side">
          <div className="title text text-pointer" onClick={() => {window.location = `/`}}>Chainmatic | 鏈 鎖 機 制</div>
          <div className="making-row">
            <div className="width-option text-pointer text" onClick={() => {window.location = '/hauptsachlich'}}>門</div>
          </div>
        </div>
        <hr />
        <Switch>
          <Route exact path='/' component={MainPage} />
        </Switch>
      </div>
      <div className="center-text">
        <div>@2021 Chainmatic | 鏈 鎖 機 制, All Rights Reserved</div>
      </div>
      </Router>
    );
  }
}



export default Mainframe;
