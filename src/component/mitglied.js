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
            importDefualtList: [],

            followerStatus: false,
            width: window.innerWidth,
        }
        this.abmeldung = this.abmeldung.bind(this)
        this.hinzufugenAnhänger = this.hinzufugenAnhänger.bind(this)
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this) //switch to cellphone
    }
    componentDidMount () {
        http.post(`/mitglied/id=${this.props.match.params.kontoname}`, {"user": localStorage.getItem('user')}).then((res) => {
            this.setState({ 
                verified: res.data.kontodaten.verified,
                bildung: res.data.kontodaten.bildung,
                ort: res.data.kontodaten.ort,
                follower: res.data.followers,
                importDefualtList: res.data.vollList
            })
            if (res.data.followerStatus === 0) { this.setState({ followerStatus: false })} else {this.setState({ followerStatus: true })}
        })
    }
    componentWillMount() {
      window.addEventListener('resize', this.handleWindowSizeChange);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange () {
      this.setState({ width: window.innerWidth });
    };
    hinzufugenAnhänger () {
        http.post('/hinzufugenanhanger', {"follower": localStorage.getItem('user'), "player": this.props.match.params.kontoname}).then((res) => {
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
        let jedesInterpret = this.state.importDefualtList.map( i => {
            let title = i.jedesleistung.konzertname
            if (i.jedesleistung.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
            return (
                <div className='card-project'>
                    <div className='up-gap'>
                        <ReactPlayer
                            key={i.jedesteilnehmen[0].jedesspieler}
                            className="player-itself"
                            url= {i.jedesteilnehmen[0].jedeslink}
                            width='271px'
                            height='150px'
                            light={this.state.light}
                            controls = 'true'
                            />
                    </div>
                    <div className="limit-width-sieben"><hr /></div>
                    <div className="container">
                        <div className="making-row text-row-height">
                            <div className="text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.jedesleistung.spielernumer}`}}><b>{title}</b></div>
                        </div>
                        <div className="zweite-infor">
                            <div className="text-left-gap" >Debut: {i.jedesleistung.datenundzeit}</div>
                        </div>
                    </div>
                </div>
            )
        })
        let phonePageList = this.state.importDefualtList.map( i => {
            let title = i.jedesleistung.konzertname
            if (i.jedesleistung.konzertname.length > 37) {title = title.substring(0,37) + " ..."}
            return (
                <div className="making-row">
                    <div className="table-video-column">
                        <ReactPlayer
                            key={i.jedesteilnehmen[0].jedesspieler}
                            className="player-itself"
                            url= {i.jedesteilnehmen[0].jedeslink}
                            width='79px'
                            height='59px'
                            light={true}
                            controls = {true}
                            />
                    </div>
                    <div className="phone-list-text text-pointer text-left-gap" onClick={() => {window.location = `/jedes/id=${i.jedesleistung.spielernumer}`}}>{title}</div>
                </div>
            )
        })
        return (
            <body>
            <br />
            {this.state.width > 911 &&
            <div>
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
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') !== this.props.match.params.kontoname && <b>{this.props.match.params.kontoname.toUpperCase()}</b>}
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
                        <div className="text-pointer follow-tab" onClick={() => {this.hinzufugenAnhänger()}}>
                            {this.state.followerStatus === false && <b>Following</b>}
                            {this.state.followerStatus === true && <b>unFollow</b>}
                            </div>}
                    </div>
                </div>
            </div>
            <br />
            <div className="center-by-margin">{jedesInterpret}</div>
            </div>}
            {this.state.width < 911 &&
            <div>
            <div  className="personal-upper">
                <div className="photo-area">
                    {this.state.bildung === null && <div><img top height="51px" width="51px" class="center"
                        src="https://miro.medium.com/max/1400/1*N5w9Ay0VlQBKF4b11C0LdQ.png"
                        alt="no account image" /></div>}
                    {this.state.bildung !== null && <div><img top height="51px" width="51px" class="center"
                        src={this.state.bildung}
                        alt="no account image" /></div>}
                </div>
                <div >
                    <div className="personal-left-gap making-row personal-upper-right-gap">
                        {localStorage.getItem('user') === null && <b>{this.props.match.params.kontoname.toUpperCase()}</b>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') !== this.props.match.params.kontoname && <b>{this.props.match.params.kontoname.toUpperCase()}</b>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') === this.props.match.params.kontoname &&
                        <div className="text-pointer" onClick={() => {window.location = `/mitgliedbearbeiten/id=${localStorage.getItem('user')}`}}>
                            <b>{localStorage.getItem('user').toUpperCase()}</b>
                        </div>}
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') === this.props.match.params.kontoname &&
                        <div className="text-pointer logout-text" onClick={() => {this.abmeldung()}}>Log-Out</div>}
                        {this.state.verified === true && 
                        <div className="making-row"><img top height="15px" width="15px" class="center"
                        src="https://www.myusfra.org/images/1.3_1.png"
                        alt="no verified image" /><b>verified!</b></div>}
                    </div>
                    <div className="personal-left-gap making-row personal-upper-right-gap-second">
                        <div>in {this.state.ort} |</div>
                        <div><div className="follower-text">{this.state.follower} Followers</div></div>
                        {localStorage.getItem('user') !== null && localStorage.getItem('user') !== this.props.match.params.kontoname && 
                        <div className="text-pointer follow-tab" onClick={() => {this.hinzufugenAnhänger()}}>
                            {this.state.followerStatus === false && <b>Following</b>}
                            {this.state.followerStatus === true && <b>unFollow</b>}
                        </div>}
                    </div>
                </div>
            </div>
            <br />
            <div>{phonePageList}</div>
            </div>}
            </body>
        )
    }
}

export default Mitglied;
