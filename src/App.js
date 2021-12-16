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

      width: window.innerWidth,
    }
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
  }
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  componentDidMount () {
    const zertifikat = {"token": localStorage.getItem('token')}
    http.post("/api/post", zertifikat).then((res) => {
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
  handleWindowSizeChange () {
    this.setState({ width: window.innerWidth });
  };
  render () {
    return (
      <Router>
        {this.state.width > 911 &&
        <body className="main-frame-tighten">
          <div className="title-row separate-two-side">
            <div className="title text text-pointer" onClick={() => {window.location = `/`}}>Chainmatic | 鏈 鎖 機 制</div>
            <div className="title-row">
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
          <div className="boden-text">
            <div className="boden-linie"></div>
            <div className="text-pointer boden-linie-height" onClick={() => {window.location.href = 'https://31withnowhere.wixsite.com/chainmatic'}}>About</div>
            <div className="text-pointer boden-linie-height" onClick={() => {window.location.href = 'https://31withnowhere.wixsite.com/chainmatic/feedback'}}>Feedback</div>
            <div>@2021 Chainmatic | 鏈 鎖 機 制, All Rights Reserved</div>
          </div>
        </body>}
        {this.state.width < 911 &&
        <body>
          <div className="title-row separate-two-side">
            <div className="title text text-pointer" onClick={() => {window.location = `/`}}>Chainmatic | 鏈 鎖 機 制</div>
            <div className="title-row">
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
        </body>}
      </Router>
    );
  }
}



export default Mainframe;
