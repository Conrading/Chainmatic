import React, { Component } from 'react';
import './App.css';
//import MainPlayer from './component/mainPlayer'
import FrontPage from './component/frontPage'
import SearchPage from './component/searchPage' 
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
        <body className="main-frame-tighten">
          <div className="making-row separate-two-side">
            <div className="title text text-pointer" onClick={() => {window.location = `/`}}>Chainmatic | 鏈 鎖 機 制</div>
            <div className="making-row">
              <div className="width-option text-pointer text" onClick={() => {window.location = '/hauptsachlich'}}>門</div>
            </div>
          </div>
          <hr />
          <Switch>
            <Route exact path='/' component={FrontPage} />
            <Route exact path='/hauptsachlich' component={SearchPage} />
          </Switch>
          <br />
          <div className="text-center">
            <div>@2021 Chainmatic | 鏈 鎖 機 制, All Rights Reserved</div>
          </div>
        </body>
      </Router>
    );
  }
}



export default Mainframe;
