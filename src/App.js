import React, { Component } from 'react';
import TestPlayer from './component/mainPlayer'
import Account from './component/account'
import { Button, NavLink, InputGroup, Input, Container, Row, Col, Nav, NavItem } from 'reactstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'


class App extends Component {
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
      <Container>
        <div>
          <div className="main-page">
            <Row><p><h3>Silex | Oasis</h3></p></Row>
          </div>
          <Row>
            <Col xs="7">
              <Nav>
                <NavItem>
                  <Link to={'/'} className="nav-link">Main Page</Link>  
                </NavItem>
                <NavItem>
                  <Link to={'/account'} className="nav-link">Account</Link>
                </NavItem>
                <NavItem>
                  <NavLink>Search Result</NavLink>
                </NavItem>
              </Nav>
            </Col>
            <Col>
              <InputGroup>
                <Input placeholder="search" />
              </InputGroup>
            </Col>
            <Col xs="2">
              <Button color="link" onClick={this.search}>search</Button>
            </Col>
          </Row>
          <hr />
          <Switch>
            <Route exact path='/' component={TestPlayer} />
            <Route exact path='/account' component={Account} />
          </Switch>
        </div>
        <div className="main-page">
          <h6>2020 Silex Oasis. All Rights Reserved</h6>
        </div>
      </Container>
      </Router>
    );
  }
}



export default App;
