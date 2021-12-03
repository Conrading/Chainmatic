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
        const konto = [{ 
            "user": this.state.userInput,
            "password": this.state.codeInput 
        }]
        if (this.state.userInput !== null && this.state.codeInput !== null) {
            http.post("/anmeldung", konto).then((res) => {
                if (res.data.status === 'fail') {
                    this.setState({ passwordfail: "sorry, incorrect user name or password" })
                } else {
                    //store token in localstorage
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('user', res.data.user)
                    window.location = `/mitglied/id=${localStorage.getItem('user')}`
                }
            })
        } else if (this.state.userInput === null || this.state.codeInput === null) {
            this.setState({ 
                passwordfail: "You can't login with your account and password",
                userInput: null,
                codeInput: null,
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
                <div className="text-center">{this.state.passwordfail}</div>
            </body>
        )
    }
}

export default Mitgliedbearbeiten;
