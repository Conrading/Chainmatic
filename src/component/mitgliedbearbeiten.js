import React, { Component } from "react";
import './mitgliedbearbeiten.css'
import http from './http-axios'


class Mitgliedbearbeiten extends Component {
    constructor () {
        super ();
        this.state = {
            testpasswordEin: null,
            testpasswordZweite: null,
            letterCheck: "Password no change",

            imgLocation: [
                '/img/01.jpg', 
                '/img/02.jpg', 
                '/img/03.jpg', 
                '/img/04.jpg', 
                '/img/05.jpg', 
                '/img/06.jpg', 
                '/img/07.jpg', 
                '/img/08.jpg', 
                '/img/09.jpg',
                'https://miro.medium.com/max/1400/1*N5w9Ay0VlQBKF4b11C0LdQ.png'
                        ],

            verified: null,
            bildung: null,
            bildungURL: null,
            ort: null,
            follower: null,
            importDefualtList: null,

            updateMessage: null
        }
        this.aktualisieren = this.aktualisieren.bind(this)
        this.passwordCheck = this.passwordCheck.bind(this)
    }
    componentDidMount () {
        http.get(`/mitgliedbearbeiten/id=${this.props.match.params.kontoname}`).then((res) => {
            let bildungLink = ""
            if (res.data.kontodaten.bildung !== null) {
                bildungLink = res.data.kontodaten.bildung
                if (res.data.kontodaten.bildung.length > 51) {bildungLink = bildungLink.substring(0,51) + " ..."}
            }
            this.setState({ 
                verified: res.data.kontodaten.verified,
                bildung: res.data.kontodaten.bildung,
                bildungURL: bildungLink,
                ort: res.data.kontodaten.ort,
                follower: res.data.followers,
                importDefualtList: res.data
            })
        })
    }
    passwordCheck () {
        if (this.state.testpasswordEin !== null) {
            //let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
            //let symble = ["!", "@", "#", "$", "%", "&", "*", "/", "?", "+", "="]
            let letterCount = this.state.testpasswordEin.split('')
            let upperletter = /[A-Z]/g
            let numbers = /[0-9]/g
            if (this.state.testpasswordEin.match(upperletter) === null || this.state.testpasswordEin.match(numbers) === null || letterCount.length < 8) {
                this.setState({ letterCheck: "The Password should include at least one upper letter, numbers, and should be longer than 8 letters" })
            } else {this.setState({ letterCheck: "Valid Password" })}
        }
    }
    aktualisieren () {
        const kontoUpdate = { 
            "konto": localStorage.getItem('user'),
            "password": this.state.testpasswordEin,
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
                updateMessage: "Do you want to update?",
            })
        }
    }
    render () {
        let imagineArray = this.state.imgLocation.map( i => {
            return (
            <div className="img-jedes-block-define" onClick={() => {this.setState({ bildung: i })}}>
                <img top height="51px" width="51px" src={i} alt="access db" />
            </div>)
        })
        return (
            <body>
                <br />
                <div className="text-center">
                    {this.state.bildung !== null && <div><img top height="100px" width="100px"
                        src={this.state.bildung}
                        alt="access db" /></div>}
                    <div className="text-mitglied-title">{localStorage.getItem('user')}</div>
                </div>
                <div className="block-mitglied-information-aktualisieren">
                    <br />
                    <div >
                        <div className="passwort-area">
                            <div className="jedes-linie-aktualisieren">
                                <input className="input-anmeldung" type="password" placeholder="Change Password" onChange={(e) => {
                                    this.setState({ testpasswordEin: e.target.value })
                                    this.passwordCheck()}}/>
                            </div>
                            <div className="jedes-linie-aktualisieren passwort-text">{this.state.letterCheck}</div>
                            <div className="jedes-linie-aktualisieren">
                                <input className="input-anmeldung" type="password" placeholder="type same password again" onChange={(e) => {this.setState({ testpasswordZweite: e.target.value })}}/>
                            </div>
                            {this.state.testpasswordEin === this.state.testpasswordZweite && (this.state.testpasswordEin !== null || this.state.testpasswordEin === "") && 
                            <div className="jedes-linie-aktualisieren passwort-text">same Password!</div>}
                        </div>
                        <div className="img-area-define">
                            <div className="img-text">Choose one for your photo</div>
                            <div className="making-row">{imagineArray}</div>
                        </div>
                        {/*<div className="jedes-linie-aktualisieren making-row">
                            <input type="text" placeholder="Photo" className="input-anmeldung" onChange={(e) => {this.setState({ bildung: e.target.value })}}/>
                            <div className="jedes-linie-jezig-data">{this.state.bildungURL}</div>
                        </div>*/}
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
