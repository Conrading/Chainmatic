import React, { Component } from "react";
import ReactPlayer from 'react-player';
import './mainPlayer.css'
import http from './http-axios'

class TestPlayer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            currentDB: [], // for uploading and reading current buttons
            oddPlayList: [], // separate renderingDB to odd colume
            evenPlayList: [], // separate renderingDB to even colume

            //player setting
            playing: false,
            controls: true,
            light: false,
            muted: false,
            loop: false,

            spielerZahlen: "",

            editorVersion: false,
        }
        this.hinzufugen = this.hinzufugen.bind(this); // seek volume value
        this.adjustingParameter = this.adjustingParameter.bind(this) // parameter submit button
        this.spielerZählen = this.spielerZählen.bind(this)
    }
    componentDidMount () {
        http.get(`/jedes/id=${this.props.match.params.jedesVideoSpieler}`).then(res => {
            this.setState({ currentDB: res.data.callOutCollaboration, spielerZahlen: res.data.spielerzahlen.count })
            const oddMemory = []
            const evenMemory = []
            if (this.state.currentDB.erstelink !== null) {
                oddMemory.push({
                    "source": this.state.currentDB.erstelink,
                    "spieler": this.state.currentDB.erstespieler,
                    "ort": this.state.currentDB.ersteort,
                    "startPlay": this.state.currentDB.erstespielerzeit,
                    "volume": this.state.currentDB.erstevolumne
                })
            } 
            if (this.state.currentDB.zweitelink !== null) {
                evenMemory.push({
                    "source": this.state.currentDB.zweitelink,
                    "spieler": this.state.currentDB.zweitespieler,
                    "ort": this.state.currentDB.zweiteort,
                    "startPlay": this.state.currentDB.zweitespielerzeit,
                    "volume": this.state.currentDB.zweitevolumne
                })
            } 
            if (this.state.currentDB.dreilink !== null) {
                oddMemory.push({
                    "source": this.state.currentDB.dreilink,
                    "spieler": this.state.currentDB.dreispieler,
                    "ort": this.state.currentDB.dreiort,
                    "startPlay": this.state.currentDB.dreispielerzeit,
                    "volume": this.state.currentDB.dreivolumne
                })
            } 
            if (this.state.currentDB.viertelink !== null) {
                evenMemory.push({
                    "source": this.state.currentDB.viertelink,
                    "spieler": this.state.currentDB.viertespieler,
                    "ort": this.state.currentDB.vierteort,
                    "startPlay": this.state.currentDB.viertespielerzeit,
                    "volume": this.state.currentDB.viertevolumne
                })
            }
            this.setState({ oddPlayList: oddMemory, evenPlayList: evenMemory})
        })
        const zertifikat = {"token": localStorage.getItem('token')}
        http.post("/api/post", zertifikat).then((res) => {
            //verify whether token is accept
            if (res.data.status === 'login' && localStorage.getItem('user') === "conrading") { 
                //log-in success
                this.setState({ editorVersion: true })
            } else if (res.data.status === 'login') {
                //
            } else if (res.data.status === '400' || res.data.status === '401') {
                //token expire
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                this.setState({ editorVersion: false })
            } else {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                this.setState({ editorVersion: false })
            }
        })
    }
    adjustingParameter () {
        http.post("/updateParameter", {"update": this.state.currentDB}).then((res) => {
            if (res.data.state === "fail") {
                this.setState({ currentDB: {"konzertname": "System Failure!"}})
            } else {
                window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`
            }
        })
    }
    hinzufugen() { 
        http.post("/hinzufugen", {"hinzufugen": this.state.currentDB}).then((res) => {
            if (res.data.state === "fail") {
                this.setState({ currentDB: {"konzertname": "System Failure!"}})
            } else {
                window.location = `/jedes/id=${res.data.link}`
            }
        })
    }
    spielerZählen () {
        if (this.state.playing === false) {
            this.setState({ playing: true })
            http.post("/spielerZahlen", {"spielernumer": this.props.match.params.jedesVideoSpieler}).then((res) => {
                if (res.data.state === "fail") {
                    this.setState({ currentDB: {"konzertname": "System Failure!"}})
                } else {
                    this.setState({ spielerZahlen: res.data.numer })
                }
            })
        }
    }
    render() {
        // this is for odd colume player
        let dynamicOddPlayer = this.state.oddPlayList.map((items) => {
            return (
                <div>
                    <div className="general-text text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${items.spieler}`}}>{items.spieler}</b> in {items.ort}</div>
                    <br />
                    <ReactPlayer
                    key={items.source}
                    className="player-itself"
                    ref={oddPlayer => (this.oddPlayer = oddPlayer)} //set this player ref
                    onReady={() => {this.oddPlayer.seekTo(parseFloat(items.startPlay))}} //set start time once it is ready
                    url= {items.source}
                    width='480px'
                    height='270px'
                    light={this.state.light}
                    playing={this.state.playing}
                    volume={items.volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                </div>
                )
        })
        //this is for even colume player
        let dynamicEvenPlayer = this.state.evenPlayList.map((items) => {
            return (
                <div>
                    <div className="general-text text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${items.spieler}`}}>{items.spieler}</b> in {items.ort}</div>
                    <br />
                    <ReactPlayer
                    key={items.source}
                    className="player-itself"
                    ref={evenPlayer => (this.evenPlayer = evenPlayer)} //set this player ref
                    onReady={() => {this.evenPlayer.seekTo(parseFloat(items.startPlay))}} //set start time once it is ready
                    url= {items.source}
                    width='480px'
                    height='270px'
                    light={this.state.light}
                    playing={this.state.playing}
                    volume={items.volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                </div>
            )
        })
        return (
            <body>
                <div className="text-center title-jedes-collaboration general-text">{this.state.currentDB.konzertname}</div>
                <div className="making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.currentDB.datenundzeit}</div>
                <br />
                <div className="making-row player-wrapper">
                    <div className='react-player'>{dynamicOddPlayer}</div>
                    <div className='react-player'>{dynamicEvenPlayer}</div>
                </div>
                <br />
                <div className="making-row half-center-margin">
                    <button className="player-control" onClick={() => {this.spielerZählen()}}>
                        <div className="making-row spieler-symble">
                            ▷
                            <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                        </div>
                    </button>
                    <button className="player-control" onClick={() => {this.setState({ playing: false })}}>| |</button>
                    <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>
                </div>
                <br />
                {this.state.editorVersion === true && 
                <div>
                    <br />
                    <div>Performance Number: {this.state.currentDB.spielernumer}</div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="Performance Title" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.konzertname = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.konzertname}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="Debut Date" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.datenundzeit = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.datenundzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.erstespieler = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.erstespieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.erstelink = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.erstelink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st Location" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.ersteort = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.ersteort}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.erstespielerzeit = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.erstespielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st volumn" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.erstevolumne = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.erstevolumne}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.zweitespieler = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.zweitespieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.zweitelink = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.zweitelink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd Location" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.zweiteort = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.zweiteort}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.zweitespielerzeit = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.zweitespielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd volumn" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.zweitevolumne = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.zweitevolumne}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.dreispieler = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.dreispieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.dreilink = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.dreilink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd Location" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.dreiort = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.dreiort}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.dreispielerzeit = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.dreispielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd volumn" type="text" 
                            onChange={(e) => {
                                let array = this.state.currentDB
                                array.dreivolumne = e.target.value
                                this.setState({ currentDB: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.currentDB.dreivolumne}</div>
                    </div>
                <div className="making-row half-center-margin">
                    <button className="player-control" onClick={() => {this.adjustingParameter()}}>Update</button>
                    <button className="player-control" onClick={() => {this.hinzufugen()}}>Create</button>
                    <button className="player-control" onClick={() => {
                                                        if (window.confirm("Are you sure you want to lot-out?")) {
                                                            localStorage.removeItem('token')
                                                            localStorage.removeItem('user')
                                                            window.location = `/`
                                                        }}}>log-out</button>
                </div>
                </div>}
            </body>
        );
    }
}


export default TestPlayer;