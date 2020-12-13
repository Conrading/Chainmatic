import React, { Component } from "react";
import './status.css'
import { Input, Col, Container, Alert, Row } from 'reactstrap'

class Status extends Component {
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
                    Here we show the block that demostrating each desire collaboration that user initiate and the progress
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


export default Status;