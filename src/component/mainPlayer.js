import React, { Component } from "react";
import ReactPlayer from 'react-player';
import './mainPlayer.css'
import http from './http-axios'

class TestPlayer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            currentDB: [], // for uploading and reading current buttons
            erstelink: [], 
            erstePlaying: false,
            zweitelink: [], 
            zweitePlaying: false,
            dreilink: [],
            dreiPlaying: false,
            viertelink: [],
            viertePlaying: false,

            //other player setting
            controls: true,
            muted: false,
            loop: false,

            spielerZahlen: "",

            iphoneLimit: false,

            editorVersion: false,
            width: window.innerWidth,
        }
        this.hinzufugen = this.hinzufugen.bind(this); // seek volume value
        this.adjustingParameter = this.adjustingParameter.bind(this) // parameter submit button
        this.spielerZählen = this.spielerZählen.bind(this)
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this) //switch to cellphone
    }
    componentDidMount () {
        http.get(`/jedes/id=${this.props.match.params.jedesVideoSpieler}`).then(res => {
            this.setState({ currentDB: res.data.callOutCollaboration, spielerZahlen: res.data.spielerzahlen.count })
            if (this.state.currentDB.erstelink !== null) {
                const erinnerung = []
                erinnerung.push({
                    "source": this.state.currentDB.erstelink,
                    "spieler": this.state.currentDB.erstespieler,
                    "ort": this.state.currentDB.ersteort,
                    "startPlay": this.state.currentDB.erstespielerzeit,
                    "volume": this.state.currentDB.erstevolumne
                })
                this.setState({ erstelink: erinnerung })
            } 
            if (this.state.currentDB.zweitelink !== null) {
                const erinnerung = []
                erinnerung.push({
                    "source": this.state.currentDB.zweitelink,
                    "spieler": this.state.currentDB.zweitespieler,
                    "ort": this.state.currentDB.zweiteort,
                    "startPlay": this.state.currentDB.zweitespielerzeit,
                    "volume": this.state.currentDB.zweitevolumne
                })
                this.setState({ zweitelink: erinnerung })
            } 
            if (this.state.currentDB.dreilink !== null) {
                const erinnerung = []
                erinnerung.push({
                    "source": this.state.currentDB.dreilink,
                    "spieler": this.state.currentDB.dreispieler,
                    "ort": this.state.currentDB.dreiort,
                    "startPlay": this.state.currentDB.dreispielerzeit,
                    "volume": this.state.currentDB.dreivolumne
                })
                this.setState({ dreilink: erinnerung })
            } 
            if (this.state.currentDB.viertelink !== null) {
                const erinnerung = []
                erinnerung.push({
                    "source": this.state.currentDB.viertelink,
                    "spieler": this.state.currentDB.viertespieler,
                    "ort": this.state.currentDB.vierteort,
                    "startPlay": this.state.currentDB.viertespielerzeit,
                    "volume": this.state.currentDB.viertevolumne
                })
                this.setState({ viertelink: erinnerung })
            }
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
    componentWillMount() {
      window.addEventListener('resize', this.handleWindowSizeChange);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange () {
      this.setState({ width: window.innerWidth });
    };
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
        if(navigator.userAgent.toLowerCase().indexOf("iphone") !== -1) {
            this.setState({ iphoneLimit: true })
        } else { 
            this.setState({ iphoneLimit: false })
            this.setState({ erstePlaying: true, zweitePlaying: true, dreiPlaying: true, viertePlaying: true })
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
        return (
            <div>
                {this.state.width > 911 && 
            <body>
                <div className="text-center title-jedes-collaboration general-text">{this.state.currentDB.konzertname}</div>
                <div className="making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.currentDB.datenundzeit}</div>
                <br />
                <div className="making-row player-wrapper">
                    {this.state.erstelink.length > 0 && 
                    <div  className='react-player'>
                        <div className="general-text text-center jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.erstelink[0].spieler}`}}>{this.state.erstelink[0].spieler}</b> in {this.state.erstelink[0].ort}</div>
                        <br />
                        {this.state.iphoneLimit === true && <div>now ihpone?</div>}
                        <ReactPlayer
                        key={this.state.erstelink[0].source}
                        className="player-itself"
                        ref={erstePlayer => (this.erstePlayer = erstePlayer)} //set this player ref
                        onReady={() => {this.erstePlayer.seekTo(parseFloat(this.state.erstelink[0].startPlay))}} //set start time once it is ready
                        url= {this.state.erstelink[0].source}
                        width='480px'
                        height='270px'
                        playing={this.state.erstePlaying}
                        volume={this.state.erstelink[0].volume}
                        loop = {this.state.loop}
                        controls = {this.state.controls}
                        />
                    </div>}
                    {this.state.zweitelink.length > 0 && 
                    <div  className='react-player'>
                        <div className="general-text text-center jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.zweitelink[0].spieler}`}}>{this.state.zweitelink[0].spieler}</b> in {this.state.zweitelink[0].ort}</div>
                        <br />
                        <ReactPlayer
                        key={this.state.zweitelink[0].source}
                        className="player-itself"
                        ref={zweitePlayer => (this.zweitePlayer = zweitePlayer)} //set this player ref
                        onReady={() => {this.zweitePlayer.seekTo(parseFloat(this.state.zweitelink[0].startPlay))}} //set start time once it is ready
                        url= {this.state.zweitelink[0].source}
                        width='480px'
                        height='270px'
                        playing={this.state.zweitePlaying}
                        volume={this.state.zweitelink[0].volume}
                        loop = {this.state.loop}
                        controls = {this.state.controls}
                        />
                    </div>}
                </div>
                <div className="making-row player-wrapper">
                    {this.state.dreilink.length > 0 && 
                    <div  className='react-player'>
                        <div className="general-text text-center jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.dreilink[0].spieler}`}}>{this.state.dreilink[0].spieler}</b> in {this.state.dreilink[0].ort}</div>
                        <br />
                        <ReactPlayer
                        key={this.state.dreilink[0].source}
                        className="player-itself"
                        ref={dreiPlayer => (this.dreiPlayer = dreiPlayer)} //set this player ref
                        onReady={() => {this.dreiPlayer.seekTo(parseFloat(this.state.dreilink[0].startPlay))}} //set start time once it is ready
                        url= {this.state.dreilink[0].source}
                        width='480px'
                        height='270px'
                        playing={this.state.dreiPlaying}
                        volume={this.state.dreilink[0].volume}
                        loop = {this.state.loop}
                        controls = {this.state.controls}
                        />
                    </div>}
                    {this.state.viertelink.length > 0 && 
                    <div  className='react-player'>
                        <div className="general-text text-center jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.viertelink[0].spieler}`}}>{this.state.viertelink[0].spieler}</b> in {this.state.viertelink[0].ort}</div>
                        <br />
                        <ReactPlayer
                        key={this.state.viertelink[0].source}
                        className="player-itself"
                        ref={viertePlayer => (this.viertePlayer = viertePlayer)} //set this player ref
                        onReady={() => {this.viertePlayer.seekTo(parseFloat(this.state.viertelink[0].startPlay))}} //set start time once it is ready
                        url= {this.state.viertelink[0].source}
                        width='480px'
                        height='270px'
                        playing={this.state.viertePlaying}
                        volume={this.state.viertelink[0].volume}
                        loop = {this.state.loop}
                        controls = {this.state.controls}
                        />
                    </div>}
                </div>
                <br />
                <div className="making-row half-center-margin">
                    <button className="player-control" onClick={() => {this.spielerZählen()}}>
                        <div className="making-row spieler-symble">
                            ▷
                            <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                        </div>
                    </button>
                    <button className="player-control" onClick={() => {this.setState({ erstePlaying: false, zweitePlaying: false, dreiPlaying: false, viertePlaying: false })}}>| |</button>
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
            </body>}
            {this.state.width < 911 && 
            <body>
            <div className="text-center title-jedes-collaboration">{this.state.currentDB.konzertname}</div>
            <div className="text-center making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.currentDB.datenundzeit}</div>
            <br />
            {this.state.iphoneLimit === true && 
            <video width="320" height="240" autoplay controls>
                <source src="/video/mobile_guitar_low.mp4"></source>
            </video>}
            <div className="making-column player-wrapper">
                {this.state.erstelink.length > 0 && this.state.iphoneLimit === false &&
                <div  className='react-player'>
                    <div className="text-trademakr-infor text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.erstelink[0].spieler}`}}>{this.state.erstelink[0].spieler}</b> in {this.state.erstelink[0].ort}</div>
                    <div className="center-player">
                    <ReactPlayer
                    key={this.state.erstelink[0].source}
                    className="player-itself"
                    ref={erstePlayer => (this.erstePlayer = erstePlayer)} //set this player ref
                    onReady={() => {this.erstePlayer.seekTo(parseFloat(this.state.erstelink[0].startPlay))}} //set start time once it is ready
                    url= {this.state.erstelink[0].source}
                    width='320px'
                    height='240px'
                    playing={this.state.erstePlaying}
                    volume={this.state.erstelink[0].volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                    </div>
                </div>}
                {this.state.zweitelink.length > 0 && this.state.iphoneLimit === false &&
                <div  className='react-player'>
                    <div className="text-trademakr-infor text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.zweitelink[0].spieler}`}}>{this.state.zweitelink[0].spieler}</b> in {this.state.zweitelink[0].ort}</div>
                    <div className="center-player">
                    <ReactPlayer
                    key={this.state.zweitelink[0].source}
                    className="player-itself"
                    ref={zweitePlayer => (this.zweitePlayer = zweitePlayer)} //set this player ref
                    onReady={() => {this.zweitePlayer.seekTo(parseFloat(this.state.zweitelink[0].startPlay))}} //set start time once it is ready
                    url= {this.state.zweitelink[0].source}
                    width='320px'
                    height='240px'
                    playing={this.state.zweitePlaying}
                    volume={this.state.zweitelink[0].volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                    </div>
                </div>}
            </div>
            <div className="making-column player-wrapper">
                {this.state.dreilink.length > 0 && this.state.iphoneLimit === false &&
                <div  className='react-player'>
                    <div className="text-trademakr-infor text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.dreilink[0].spieler}`}}>{this.state.dreilink[0].spieler}</b> in {this.state.dreilink[0].ort}</div>
                    <div className="center-player">
                    <ReactPlayer
                    key={this.state.dreilink[0].source}
                    className="player-itself"
                    ref={dreiPlayer => (this.dreiPlayer = dreiPlayer)} //set this player ref
                    onReady={() => {this.dreiPlayer.seekTo(parseFloat(this.state.dreilink[0].startPlay))}} //set start time once it is ready
                    url= {this.state.dreilink[0].source}
                    width='320px'
                    height='240px'
                    playing={this.state.dreiPlaying}
                    volume={this.state.dreilink[0].volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                    </div>
                </div>}
                {this.state.viertelink.length > 0 && this.state.iphoneLimit === false &&
                <div  className='react-player'>
                    <div className="text-trademakr-infor text-center jedes-spieler-infor">
                        <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${this.state.viertelink[0].spieler}`}}>{this.state.viertelink[0].spieler}</b> in {this.state.viertelink[0].ort}</div>
                    <div className="center-player">
                    <ReactPlayer
                    key={this.state.viertelink[0].source}
                    className="player-itself"
                    ref={viertePlayer => (this.viertePlayer = viertePlayer)} //set this player ref
                    onReady={() => {this.viertePlayer.seekTo(parseFloat(this.state.viertelink[0].startPlay))}} //set start time once it is ready
                    url= {this.state.viertelink[0].source}
                    width='320px'
                    height='240px'
                    playing={this.state.viertePlaying}
                    volume={this.state.viertelink[0].volume}
                    loop = {this.state.loop}
                    controls = {this.state.controls}
                    />
                    </div>
                </div>}
            </div>
            <br />
                <div className="making-row play-control-center-margin">
                    {this.state.iphoneLimit === false && <button className="player-control" onClick={() => {this.spielerZählen()}}>
                        <div className="making-row spieler-symble">
                            ▷
                            <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                        </div>
                    </button>}
                    {this.state.iphoneLimit === false && <button className="player-control" 
                        onClick={() => {this.setState({ 
                            erstePlaying: false, 
                            zweitePlaying: false, 
                            dreiPlaying: false, 
                            viertePlaying: false })}}>| |</button>}
                    <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>
                </div>
            </body>}
            </div>
        );
    }
}


export default TestPlayer;