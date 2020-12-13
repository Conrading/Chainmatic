import React, { Component } from "react";
import './purchase.css'
import { Col, Container, Alert, Row } from 'reactstrap'

class Purchase extends Component {
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
                    Here we list all the marchendize
                </Alert>
                <Row>
                    <Col>first product</Col>
                    <Col>product detail</Col>
                </Row>
            </Container>
        );
    }
}


export default Purchase;