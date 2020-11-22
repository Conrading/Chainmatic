import React, { Component } from "react";
import './account.css'
import { Input, Col, Container, Alert, Row } from 'reactstrap'

class Account extends Component {
    constructor () {
        super ();
        this.state = {
            userName: null,
            Email: null
        }
    }
    render () {
        return (
            <Container>
                <Alert className="general-text">
                    Open your account here, you can subscribe for all video available, 
                    or support single artist, 
                    or invest single collaboration
                </Alert>
                <Row className="center-object"> 
                    <Col sm={2} className="general-text">Name</Col>
                    <Col sm={5} className="general-text">
                    <Input  type='text'
                            onChange={(e) => {this.setState({ userName: e.target.value})}}/>
                    </Col>
                </Row>
                <Row className="center-object">
                    <Col sm={2} className="general-text">Email</Col>
                    <Col sm={5} className="general-text">
                    <Input  type="text" 
                            onChange={(e) => this.setState({ Email: e.target.value })}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default Account;