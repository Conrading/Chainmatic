import React, { Component } from 'react';
import http from './component/http-axios'
import './App.css';
import MainPlayer from './component/mainPlayer'
import FrontPage from './component/frontPage'
import SearchPage from './component/searchPage' 
import Anmeldung from './component/anmeldung'
import Mitglied from './component/mitglied'
import Mitgliedbearbeiten from './component/mitgliedbearbeiten'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


class Mainframe extends Component {
  constructor () {
    super ();
    this.state = {
      logStauts: "LogIn",
    }
  }
  componentDidMount () {
    //check whether it is log-in
    //get token certificate
    //get token from localstorage
    //but couldn't confirm token expire
    const zertifikat = {"token": localStorage.getItem('token')}
    http.post("/api/post", zertifikat).then((res) => {
        //verify whether token is accept
        if (res.data.status === 'login') { 
          this.setState({ logStauts: "@" })
        } else if (res.data.status === '400' || res.data.status === '401') {
            //token expire
            this.setState({ logStauts: "登" })
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        } else {
          //token expire
            this.setState({ logStauts: "登" })
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
    })
  }
  render () {
    return (
      <Router>
        <body className="main-frame-tighten">
          <div className="making-row separate-two-side">
            <div className="title text text-pointer" onClick={() => {window.location = `/`}}>Chainmatic | 鏈 鎖 機 制</div>
            <div className="making-row">
              <div className="width-option text-pointer text" onClick={() => {window.location = '/hauptsachlich'}}>門</div>
              {this.state.logStauts === "登" && <div className="width-option text-pointer text" onClick={() => {window.location = '/anmeldung'}}>{this.state.logStauts}</div>}
              {this.state.logStauts === "@" && <div className="width-option text-pointer text" onClick={() => {window.location = `/mitglied/id=${localStorage.getItem('user')}`}}>{this.state.logStauts}</div>}
            </div>
          </div>
          <hr />
          <Switch>
            <Route exact path='/' component={FrontPage} />
            <Route exact path='/hauptsachlich' component={SearchPage} />
            <Route exact path='/jedes/id=:jedesVideoSpieler' component={MainPlayer} />
            <Route exact path='/anmeldung' component={Anmeldung} />
            <Route exact path='/mitglied/id=:kontoname' component={Mitglied} />
            <Route exact path='/mitgliedbearbeiten/id=:kontoname' component={Mitgliedbearbeiten} />
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
