import React, { Component } from "react";
import ReactPlayer from 'react-player';
import './mainPlayer.css'
import http from './http-axios'
import EditPlayer from './playerEdit'

class TestPlayer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            jedesleistung: {},
            playerList: [],

            //other player setting
            controls: true,
            playing: false,
            dynamicWidth: "800px",
            dynamicHeight: "460px",

            spielerZahlen: "",

            iphoneLimit: false,

            editorVersionBeiKonrad: false,
            bearbeitenHautBeiMitglied: false,
            width: window.innerWidth,
        }
        this.spielerZählen = this.spielerZählen.bind(this)
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this) //switch to cellphone
    }
    componentDidMount () {
        //navigator.userAgent.toLowerCase().indexOf("iphone") !== -1
        if(/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            this.setState({ iphoneLimit: true })
        } else { 
            this.setState({ iphoneLimit: false })
        }
        http.get(`/jedes/id=${this.props.match.params.jedesVideoSpieler}`).then(res => {
            this.setState({ 
                jedesleistung: res.data.jedesleistung[0], 
                playerList: res.data.playerList,
                spielerZahlen: res.data.spielerzahlen.count 
            })
        })
        const zertifikat = {"token": localStorage.getItem('token')}
        http.post("/api/post", zertifikat).then((res) => {
            if (res.data.status === 'login' && localStorage.getItem('user') === "conrading") { 
                this.setState({ editorVersionBeiKonrad: true, bearbeitenHautBeiMitglied: true  })
            } else if (res.data.status === 'login') {
                for (let i = 0; i < this.state.playerList.length; i++) {
                    if (this.state.playerList[i].jedesspieler === localStorage.getItem('user')) {
                        this.setState({ bearbeitenHautBeiMitglied: true })
                    }
                }
            } else if (res.data.status === '400' || res.data.status === '401') {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                this.setState({ editorVersionBeiKonrad: false })
            } else {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                this.setState({ editorVersionBeiKonrad: false })
            }
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
      if (this.state.width < 911) {
          this.setState({dynamicWidth: '320px', dynamicHeight: '240px'}) 
      } else {
            this.setState({dynamicWidth: '800px', dynamicHeight: '460px'})
        }
    };
    spielerZählen () {
        this.setState({ playing: true })
        http.post("/spielerZahlen", {"spielernumer": this.props.match.params.jedesVideoSpieler}).then((res) => {
            if (res.data.state === "fail") {
                this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
            } else {
                this.setState({ spielerZahlen: res.data.numer })
            }
        })
    }
    render() {
        let ersteDesktopPlayer = this.state.playerList.map( i => {
            if (i.stellung === "1") {
                return (
                    <div className='react-player'>
                        <div className="general-text jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${i.konto}`}}>{i.konto}</b> in {i.ort}</div>
                        <br />
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        ref={erstePlayer => (this.erstePlayer = erstePlayer)} 
                        onReady={() => {this.erstePlayer.seekTo(parseFloat(i.jedesspielerzeit))}} 
                        url= {i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />
                    </div>
                    )
                }
        })
        let zweiteDesktopPlayer = this.state.playerList.map( i => {
            if (i.stellung === "2") {
                return (
                    <div className='react-player'>
                        <div className="general-text jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${i.konto}`}}>{i.konto}</b> in {i.ort}</div>
                        <br />
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        ref={zweitePlayer => (this.zweitePlayer = zweitePlayer)} 
                        onReady={() => {this.zweitePlayer.seekTo(parseFloat(i.jedesspielerzeit))}} 
                        url= {i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />
                    </div>
                    )
                }
        })
        let ersteCellPhonePlayer = this.state.playerList.map( i => {
            return (
                <div className='react-player'>
                    <div className="text-trademakr-infor text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${i.konto}`}}>{i.konto}</b> in {i.ort}</div>
                    <br />
                    <ReactPlayer
                    key={i.id}
                    className="player-itself"
                    ref={erstePlayer => (this.erstePlayer = erstePlayer)} 
                    onReady={() => {this.erstePlayer.seekTo(parseFloat(i.jedesspielerzeit))}} 
                    url= {i.jedeslink}
                    width='320px'
                    height='240px'
                    playing={this.state.playing}
                    volume={i.jedesvolume}
                    muted = {i.jedesmute}
                    loop = {i.jedesloop}
                    controls = {this.state.controls}
                    />
                </div>
                )
        })
        return (
            <div>
            {this.state.width > 911 && 
                <body>
                    <div className="text-center title-jedes-collaboration general-text">{this.state.jedesleistung.konzertname}</div>
                    <div className="making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.jedesleistung.datenundzeit}</div>
                    <br />
                    <div className="making-row player-wrapper">{ersteDesktopPlayer}{zweiteDesktopPlayer}</div>
                    <br />
                    <div className="making-row object-center-margin">
                        {this.state.playing === false && 
                        <button className="player-control" onClick={() => {this.spielerZählen()}}>
                            <div className="making-row spieler-symble">
                                ▷
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        {this.state.playing === true && 
                        <button className="player-control" onClick={() => {this.setState({ playing: false })}}>
                            <div className="making-row spieler-symble">
                                II
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>
                    </div>
                    <br />
                    <div className="textarea-public-text">{this.state.jedesleistung.beschreibung}</div>
                    {this.state.bearbeitenHautBeiMitglied === true && 
                    <div className="modify-title-commend-area">
                        <br />
                        <input className="modify-title-input" placeholder="change title..." onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.konzertname = e.target.value
                            this.setState({ jedesleistung: object })
                        }}/>
                        <br />
                        <textarea className="modify-commend-input" placeholder="change commend.." onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.beschreibung = e.target.value
                            this.setState({ jedesleistung: object })
                        }}/>
                        <div className="modify-save" onClick={() => {
                            http.post("/updateTitleandCommend", {"jedesleistung": this.state.jedesleistung}).then((res) => {
                                if (res.data.state === "fail") {
                                    this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
                                } else {
                                    window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`
                                }
                            })
                        }}>Upadte</div>
                    </div>}
                    {this.state.editorVersionBeiKonrad === true && 
                    <div>
                        <hr />
                        <input placeholder="Iphone local location" onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.vollspieleraddress = e.target.value
                            this.setState({ jedesleistung: object })
                        }}></input>
                        <EditPlayer 
                            jedesleistung={this.state.jedesleistung}
                            playerList={this.state.playerList}
                            url={this.props.match.params.jedesVideoSpieler}/>
                    </div>}
                </body>}
            {this.state.width < 911 && 
                <body>
                <div className="text-center title-jedes-collaboration">{this.state.jedesleistung.konzertname}</div>
                <div className="text-center making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.jedesleistung.datenundzeit}</div>
                <br />
                {this.state.iphoneLimit === true && 
                <video className="play-control-center-margin" width="320" height="240" autoplay controls>
                    <source src={this.state.jedesleistung.vollspieleraddress}></source>
                </video>}
                {this.state.iphoneLimit === false && <div className="making-column player-wrapper">{ersteDesktopPlayer}{zweiteDesktopPlayer}</div>}
                <br />
                    <div className="making-row play-control-center-margin">
                        {this.state.playing === false && this.state.iphoneLimit === false && 
                        <button className="player-control" onClick={() => {this.spielerZählen()}}>
                            <div className="making-row spieler-symble">
                                ▷
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        {this.state.playing === true && this.state.iphoneLimit === false && 
                        <button className="player-control" onClick={() => {this.setState({ playing: false })}}>
                            <div className="making-row spieler-symble">
                                II
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        {this.state.playing === true && this.state.iphoneLimit === false &&
                        <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>}
                    <br />
                    <div className="textarea-public-text">{this.state.jedesleistung.beschreibung}</div>
                    </div>
                </body>}
            </div>
        );
    }
}


export default TestPlayer;