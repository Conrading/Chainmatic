import React, { Component } from "react";
import './mitglied.css'
import './searchPage.css'
import http from './http-axios'
import ReactPlayer from 'react-player';


class Mitglied extends Component {
    constructor () {
        super ();
        this.state = {
            verified: null,
            bildung: null,
            ort: null,
            follower: null,
            importDefualtList: null,

            followerStatus: false
        }
        this.abmeldung = this.abmeldung.bind(this)
        this.hinzufugenAnhänger = this.hinzufugenAnhänger.bind(this)
    }
    componentDidMount () {
        http.post(`/mitglied/id=${this.props.match.params.kontoname}`, {"user": localStorage.getItem('user')}).then((res) => {
            this.setState({ 
                verified: res.data.kontodaten.verified,
                bildung: res.data.kontodaten.bildung,
                ort: res.data.kontodaten.ort,
                follower: res.data.followers,
                importDefualtList: res.data
            })
            if (res.data.followerStatus === 0) { this.setState({ followerStatus: false })} else {this.setState({ followerStatus: true })}
        })
    }
    hinzufugenAnhänger () {
        http.post('/hinzufugenAnhänger', {"follower": localStorage.getItem('user'), "player": this.props.match.params.kontoname}).then((res) => {
            if (res.data.status === "fail") {
                alert("System mistake, please try again")
            } else {  window.location = `/mitglied/id=${this.props.match.params.kontoname}` }
        })
    }
    abmeldung () {
        if (window.confirm("Are you sure you want to lot-out?")) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location = `/anmeldung`
        }
    }
    render () {
        let erstenCard = null
        let zweitenCard = null
        let dreiCard = null
        let vierCard = null
        if (this.state.importDefualtList !== null) {
            erstenCard = this.state.importDefualtList.firstLine.map( i => {
                let title = i.konzertname
                if (i.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
                return (
                    <div className='card-project'>
                        <div className='up-gap'>
                            <ReactPlayer
                                key={i.erstespieler}
                                className="player-itself"
                                url= {i.erstelink}
                                width='271px'
                                height='150px'
                                light={this.state.light}
                                controls = 'true'
                                />
                        </div>
                        <div className="limit-width-sieben"><hr /></div>
                        <div className="container">
                            <div className="making-row text-row-height">
                                <div className="text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.spielernumer}`}}><b>{title}</b></div>
                            </div>
                            <div className="zweite-infor">
                                <div className="text-left-gap" >Debut: {i.datenundzeit}</div>
                            </div>
                        </div>
                    </div>
                )
            })
            zweitenCard = this.state.importDefualtList.secondLine.map( i => {
                let title = i.konzertname
                if (i.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
                return (
                    <div className='card-project'>
                        <div className='up-gap'>
                            <ReactPlayer
                                key={i.erstespieler}
                                className="player-itself"
                                url= {i.erstelink}
                                width='271px'
                                height='150px'
                                light={this.state.light}
                                controls = 'true'
                                />
                        </div>
                        <div className="limit-width-sieben"><hr /></div>
                        <div className="container">
                            <div className="making-row text-row-height">
                                <div className="text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.spielernumer}`}}><b>{title}</b></div>
                            </div>
                            <div className="zweite-infor">
                                <div className="text-left-gap" >Debut: {i.datenundzeit}</div>
                            </div>
                        </div>
                    </div>
                )
            })
            dreiCard = this.state.importDefualtList.thridLine.map( i => {
                let title = i.konzertname
                if (i.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
                return (
                    <div className='card-project'>
                        <div className='up-gap'>
                            <ReactPlayer
                                key={i.erstespieler}
                                className="player-itself"
                                url= {i.erstelink}
                                width='271px'
                                height='150px'
                                light={this.state.light}
                                controls = 'true'
                                />
                        </div>
                        <div className="limit-width-sieben"><hr /></div>
                        <div className="container">
                            <div className="making-row text-row-height">
                                <div className="text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.spielernumer}`}}><b>{title}</b></div>
                            </div>
                            <div className="zweite-infor">
                                <div className="text-left-gap" >Debut: {i.datenundzeit}</div>
                            </div>
                        </div>
                    </div>
                )
            })
            vierCard = this.state.importDefualtList.vierLine.map( i => {
                let title = i.konzertname
                if (i.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
                return (
                    <div className='card-project'>
                        <div className='up-gap'>
                            <ReactPlayer
                                key={i.erstespieler}
                                className="player-itself"
                                url= {i.erstelink}
                                width='271px'
                                height='150px'
                                light={this.state.light}
                                controls = 'true'
                                />
                        </div>
                        <div className="limit-width-sieben"><hr /></div>
                        <div className="container">
                            <div className="making-row text-row-height">
                                <div className="text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.spielernumer}`}}><b>{title}</b></div>
                            </div>
                            <div className="zweite-infor">
                                <div className="text-left-gap" >Debut: {i.datenundzeit}</div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return (
            <body>
            <br />
            <div className="personal-upper">
                <div className="photo-area">
                    {this.state.bildung === null && <div><img top height="100px" width="100px" class="center"
                        src="https://miro.medium.com/max/1400/1*N5w9Ay0VlQBKF4b11C0LdQ.png"
                        alt="no account image" /></div>}
                    {this.state.bildung !== null && <div><img top height="100px" width="100px" class="center"
                        src={this.state.bildung}
                        alt="no account image" /></div>}
                </div>
                <div >
                    <div className="personal-left-gap making-row personal-upper-right-gap">
                        {localStorage.getItem('user') === null && <b>{this.props.match.params.kontoname.toUpperCase()}</b>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') !== this.props.match.params.kontoname && <b>{localStorage.getItem('user').toUpperCase()}</b>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') === this.props.match.params.kontoname &&
                        <div className="text-pointer" onClick={() => {window.location = `/mitgliedbearbeiten/id=${localStorage.getItem('user')}`}}>
                            <b>{localStorage.getItem('user').toUpperCase()}</b>
                        </div>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') === this.props.match.params.kontoname &&
                        <div className="text-pointer logout-text" onClick={() => {this.abmeldung()}}>Log-Out</div>}
                        {this.state.verified === true && 
                        <div className="making-row"><img top height="21px" width="21px" class="center"
                        src="https://www.myusfra.org/images/1.3_1.png"
                        alt="no verified image" /><b>verified!</b></div>}
                    </div>
                    <div className="personal-left-gap making-row personal-upper-right-gap-second">
                        <div>in {this.state.ort} |</div>
                        <div><div className="follower-text">{this.state.follower} Followers</div></div>
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') !== this.props.match.params.kontoname && 
                        <div className="follow-tab" onClick={() => {this.hinzufugenAnhänger()}}>
                            {this.state.followerStatus === false && <b>Following</b>}
                            {this.state.followerStatus === true && <b>unFollow</b>}
                            </div>}
                    </div>
                </div>
            </div>
            <br />
            <div className="making-row center-by-margin">
                <div className="width-column">{erstenCard}</div>
                <div className="width-column">{zweitenCard}</div>
                <div className="width-column">{dreiCard}</div>
                <div className="width-column">{vierCard}</div>
            </div>
            </body>
        )
    }
}

export default Mitglied;
