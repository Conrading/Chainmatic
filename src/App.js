import React, { Component } from 'react';
import MainPlayer from './component/mainPlayer'
import Status from './component/status'
import Chain from './component/chain'
import Purchase from './component/purchase'
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
                  <Link to={'/status'} className="nav-link">Status</Link>
                </NavItem>
                <NavItem>
                  <Link to={'/purchase'} className="nav-link">Purchase</Link>
                </NavItem>
                <NavItem>
                  <Link to={'/chain'} className="nav-link">Chain</Link>
                </NavItem>
                <NavItem>
                  <NavLink>Conversation</NavLink>
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
            <Route exact path='/' component={MainPlayer} />
            <Route exact path='/status' component={Status} />
            <Route exact path='/purchase' component={Purchase} />
            <Route exact path='/chain' component={Chain} />
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
