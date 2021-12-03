import React, { Component } from "react";
import './mitgliedbearbeiten.css'
import http from './http-axios'


class Mitgliedbearbeiten extends Component {
    constructor () {
        super ();
        this.state = {
            verified: null,
            bildung: null,
            ort: null,
            follower: null,
            importDefualtList: null,

            updateMessage: null
        }
        this.aktualisieren = this.aktualisieren.bind(this)
    }
    componentDidMount () {
        http.post(`/mitglied/id=${localStorage.getItem('user')}`, {"user": localStorage.getItem('user')}).then((res) => {
            this.setState({ 
                verified: res.data.kontodaten.verified,
                bildung: res.data.kontodaten.bildung,
                ort: res.data.kontodaten.ort,
                follower: res.data.followers,
                importDefualtList: res.data
            })
        })
    }
    aktualisieren () {
        const kontoUpdate = { 
            "konto": localStorage.getItem('user'),
            "bildung": this.state.bildung,
            "ort": this.state.ort 
        }
        if (this.state.bildung !== null || this.state.ort !== null) {
            http.post("/mitgliedbearbeiten", kontoUpdate).then((res) => {
                if (res.data.status === 'fail') {
                    this.setState({ updateMessage: "sorry, system mistake" })
                } else {
                    this.setState({ updateMessage: "Update success!!" })
                }
            })
        } else if (this.state.bildung === null && this.state.ort === null) {
            this.setState({ 
                updateMessage: "Wha do you want to update?",
            })
        }
    }
    render () {
        return (
            <body>
                <br />
                <div className="text-center">
                    {this.state.bildung !== null && <div><img top height="100px" width="100px"
                        src={this.state.bildung}
                        alt="no account image" /></div>}
                    <div className="text-mitglied-title">{localStorage.getItem('user')}</div>
                </div>
                <div className="block-mitglied-information-aktualisieren">
                    <br />
                    <div >
                        <div className="jedes-linie-aktualisieren making-row">
                            <input type="text" placeholder="Photo" className="input-anmeldung" onChange={(e) => {this.setState({ bildung: e.target.value })}}/>
                            <div className="jedes-linie-jezig-data">{this.state.bildung}</div>
                        </div>
                        <div className="jedes-linie-aktualisieren making-row">
                            <input type="text" placeholder="Location" className="input-anmeldung" onChange={(e) => {this.setState({ ort: e.target.value })}}/>
                            <div className="jedes-linie-jezig-data">{this.state.ort}</div>
                        </div>
                    </div>
                    <div className="gap-upper text-center">
                        <div className="text-center making-row">
                            <div className="width-control-drei gap-both-siebzehn"><hr /></div>
                        </div>
                    </div>
                    <div className="text-center gap-upper">
                        <button className="anmeldung" onClick={() => this.aktualisieren()}>Update</button>
                    </div>
                </div>
                <br />
                <div className="text-center">{this.state.updateMessage}</div>
            </body>
        )
    }
}

export default Mitgliedbearbeiten;
