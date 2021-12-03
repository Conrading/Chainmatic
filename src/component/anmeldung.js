import React, { Component } from "react";
import './anmeldung.css'
import http from './http-axios'


class Anmeldung extends Component {
    constructor () {
        super ();
        this.state = {
            userInput: null,
            codeInput: null,
            passwordfail: null, // showing log-in status
        }
        this.anmelden = this.anmelden.bind(this)
    }
    anmelden () {
        //send password to back
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
                    //jump to correct page
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
                <div className="block-anmeldung">
                    <div className="text-center logo-anmeldung gap-upper">
                        <div className="text-anmeldung-title">Chainmatic</div>
                        <div className="text-anmeldung-title">鏈 鎖 機 制</div>
                    </div>
                    <div className="text-center">
                        <input type="text" placeholder="Account" className="input-anmeldung" onChange={(e) => {this.setState({ userInput: e.target.value })}}/>
                        <input type="password" placeholder="Passwort" className="input-anmeldung gap-upper" onChange={(e) => {this.setState({ codeInput: e.target.value })}}/>
                    </div>
                    <div className="gap-upper text-center">
                        <div className="text-center making-row">
                            <div className="width-control-drei gap-both-siebzehn"><hr /></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button className="anmeldung" onClick={() => this.anmelden()}>Login</button>
                    </div>
                </div>
                <br />
                <div className="text-center">{this.state.passwordfail}</div>
            </body>
        )
    }
}

export default Anmeldung;
