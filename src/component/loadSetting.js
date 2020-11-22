import React, { Component } from "react";
import './mainPlayer.css'
import { Container, Button, Row, Input, Col, InputGroupAddon, InputGroupText, Form, FormGroup, Label } from 'reactstrap'

class FileSetting extends Component {
    
    constructor (props) {
        super (props)
        this.state = {
            //renderingDB: this.props.passingDB, // receiving the db from parent

            volumeUpdate: 0.3, //just defualt value
            startPlayUpdate: null,
            dropDownValue: "Select Type",
        }
        this.settingVolume = this.settingVolume.bind(this);
    }
    settingVolume(e) {
        this.setState({ volumeUpdate: parseFloat(e.target.value) })
    }
    render () {
        let dynamicButton = this.props.passingDB.map((file) => {
            return (
                <Button>{file.source}</Button>
            )
        })
        return (
            <Container>
                <Row>
                    <Col>{ dynamicButton }</Col>
                </Row>
                <Row>
                    <Col className="uploading">
                        <Form>
                            <FormGroup row>
                                <Label sm={2}>Creator</Label>
                                <Col sm={10}>
                                    <Input type="text" />
                                </Col>
                            </FormGroup>
                            {/*
                            <FormGroup row>
                                <Label sm={2}>Type</Label>
                                <Col sm={10}>
                                    <select onChange={(e) => this.setState({ dropDownValue: e.target.value })}>
                                        <option value="">Selet Type</option>
                                        <option value="Video">Video</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Link">Link</option>
                                    </select>
                                </Col>
                            </FormGroup>
                            */}
                            <FormGroup row>
                                <Label sm={2}>Link</Label>
                                <Col sm={10}>
                                    <Input type="text" />
                                </Col>
                            </FormGroup>
                            {/*
                            <FormGroup row>
                                <Label sm={2}>File</Label>
                                <Col sm={10}>
                                    <Input type="file" />
                                </Col>
                            </FormGroup>
                            */}
                        </Form>
                        <Button className="button-setting">Add/Replace</Button>
                    </Col>
                    <Col className="parameterSetting">
                        <Row>
                            <Col sm={2}>
                                <InputGroupAddon addonType="prepend" >
                                    <InputGroupText>Start Time</InputGroupText>
                                </InputGroupAddon>
                            </Col>
                            <Col sm={7}>
                                <Input placeholder="song play at..." 
                                        type='text'
                                        onChange={(e) => {this.setState({startPlayUpdate: e.target.value})}}/>
                            </Col>
                            <Col sm={2}>
                                <InputGroupAddon addonType="append" >
                                    <InputGroupText>{this.state.startPlayUpdate}</InputGroupText>
                                </InputGroupAddon>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>Volume</InputGroupText>
                                </InputGroupAddon></Col>
                            <Col sm={7}>
                            <Input type='range' min={0} max={1} 
                                step='any' 
                                value={this.state.volumeUpdate} 
                                onChange={this.settingVolume} />
                            </Col>
                            <Col sm={2}>
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>Current: {this.state.volumeUpdate.toFixed(3)}</InputGroupText>
                                </InputGroupAddon></Col>
                        </Row>
                        <Button className="button-setting">Submit</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default FileSetting;