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

            searchParty: null,

            spielerZahlen: "",

            iphoneLimit: false,

            editorVersionBeiKonrad: false,
            projektTeilnahmen: false,
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
            const zertifikat = {"token": localStorage.getItem('token')}
            http.post("/api/post", zertifikat).then((res) => {
                if (res.data.status === 'login' && localStorage.getItem('user') === "conrading") { 
                    this.setState({ editorVersionBeiKonrad: true, projektTeilnahmen: true  })
                } 
                if (res.data.status === 'login') {
                    for (let i = 0; i < this.state.playerList.length; i++) {
                        if (this.state.playerList[i].jedesspieler === localStorage.getItem('user')) {
                            this.setState({ projektTeilnahmen: true })
                        } else if (this.state.jedesleistung.spielernumer === "default") {
                            this.setState({ projektTeilnahmen: true })
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
        this.setState({ playing: true  })
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
            let verifySource = []
            if (i.jedeslink !== null) {verifySource = i.jedeslink.split('/')}
            if (i.stellung === "1") {
                return (
                    <div className='react-player'>
                        <div className="general-text jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${i.konto}`}}>{i.konto}</b> in {i.ort}</div>
                        <br />
                        {this.state.bearbeitenHautBeiMitglied === true && 
                        <body className="jedes-edit-body-height">
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="Search Participant" type="text" 
                                    onChange={(e) => { this.setState({ searchParty: e.target.value }) }}/>
                                </div>
                                <div className="text-pointer jedes-player-edit-text"
                                onClick={() => {
                                    http.post("/searchParticipants", {"searchParty": this.state.searchParty}).then( res => {
                                        switch (res.data.status) {
                                            case "Found":
                                                let array = this.state.playerList
                                                array[array.findIndex(f => f.stellung === "1")].jedesspieler = res.data.spieler
                                                array[array.findIndex(f => f.stellung === "1")].konto = res.data.spieler
                                                array[array.findIndex(f => f.stellung === "1")].ort = res.data.ort
                                                this.setState({ playerList: array })
                                                break
                                            case "KeinFinden":
                                                alert("No found, please try again")
                                                break
                                        }
                                    })
                                }}>Search</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="YouTube Link" type="text" 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "1")].jedeslink = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">{i.jedeslink}</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="at least 1, can be 1.1, 1.2, so on..." type="text" 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "1")].jedesspielerzeit = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">video starts from: {i.jedesspielerzeit} seconds</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" type="range" min="0" max="1" step="0.1" 
                                    value={this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].jedesvolume}
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "1")].jedesvolume = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">Volume: {i.jedesvolume}</div>
                            </div>
                            <div>
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].jedesmute === false && 
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "1")].jedesmute = true
                                            this.setState({ playerList: array })
                                        }}>No Muted</div>}
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].jedesmute === true && 
                                <div className="jedes-player-toggle-swtch"
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "1")].jedesmute = false
                                            this.setState({ playerList: array })
                                        }}>Currently is Muted</div>}
                            </div>
                            <div>
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].jedesloop === true &&
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "1")].jedesloop = false
                                            this.setState({ playerList: array })
                                        }}>Loop is turned ON</div>}
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].jedesloop === false &&
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "1")].jedesloop = true
                                            this.setState({ playerList: array })
                                        }}>Loop is turned Off</div>}
                            </div>
                            <div className="making-row">
                                <div className="jedes-player-toggle-swtch">Video position is: </div>
                                <div className="jedes-position-selection-area">
                                    <select className="jedes-position-edit-selection"
                                            value={this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "1")].stellung} 
                                            onChange={(e) => {
                                                let array = this.state.playerList
                                                if (e.target.value === "2") {
                                                    array[array.findIndex(f => f.stellung === "1")].stellung = "2"
                                                    array[array.findIndex(f => f.stellung === "2")].stellung = "1"
                                                }
                                                this.setState({ playerList: array })
                                            }}>
                                        <option value={"1"}>Left</option>
                                        <option value={"2"}>Right</option>
                                        {/*<option value={"3"}>3</option>
                                        <option value={"4"}>4</option>*/}
                                    </select>
                                </div>
                            </div>
                        </body>}
                        {verifySource[0] === "https:" && this.state.bearbeitenHautBeiMitglied === false && 
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        ref={erstePlayer => (this.erstePlayer = erstePlayer)} 
                        onReady={() => {this.erstePlayer.seekTo(parseFloat(i.jedesspielerzeit))}} 
                        url={i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />}
                        {verifySource[0] !== "https:" && this.state.bearbeitenHautBeiMitglied === false && 
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        url={i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />}
                        {/*verifySource[0] !== "https:" &&
                        <video ref="erstePlayer" className="player-itself" controls width={this.state.dynamicWidth} height={this.state.dynamicHeight}>
                            <source src={i.jedeslink}/>
                        </video>*/}
                    </div>
                    )
                }
        })
        let zweiteDesktopPlayer = this.state.playerList.map( i => {
            let verifySource = []
            if (i.jedeslink !== null) {verifySource = i.jedeslink.split('/')}
            if (i.stellung === "2") {
                return (
                    <div className='react-player'>
                        <div className="general-text jedes-spieler-infor">
                            <b className="text-pointer" onClick={() => {window.location = `/mitglied/id=${i.konto}`}}>{i.konto}</b> in {i.ort}</div>
                        <br />
                        {this.state.bearbeitenHautBeiMitglied === true && 
                        <body className="jedes-edit-body-height">
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="Search Participant" type="text" 
                                    onChange={(e) => { this.setState({ searchParty: e.target.value }) }}/>
                                </div>
                                <div className="text-pointer jedes-player-edit-text"
                                onClick={() => {
                                    http.post("/searchParticipants", {"searchParty": this.state.searchParty}).then( res => {
                                        switch (res.data.status) {
                                            case "Found":
                                                let array = this.state.playerList
                                                array[array.findIndex(f => f.stellung === "2")].jedesspieler = res.data.spieler
                                                array[array.findIndex(f => f.stellung === "2")].konto = res.data.spieler
                                                array[array.findIndex(f => f.stellung === "2")].ort = res.data.ort
                                                this.setState({ playerList: array })
                                                break
                                            case "KeinFinden":
                                                alert("No found, please try again")
                                                break
                                        }
                                    })
                                }}>Search</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="YouTube Link" type="text" 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "2")].jedeslink = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">{i.jedeslink}</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" placeholder="at least 1, can be 1.1, 1.2, so on..." type="text" 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "2")].jedesspielerzeit = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">video starts from: {i.jedesspielerzeit} seconds</div>
                            </div>
                            <div className="making-row">
                                <div>
                                    <input className="jedes-player-edit-input" type="range" min="0" max="1" step="0.1" 
                                    value={this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].jedesvolume}
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[array.findIndex(f => f.stellung === "2")].jedesvolume = e.target.value
                                        this.setState({ playerList: array })
                                    }}/>
                                </div>
                                <div className="jedes-player-edit-text">volume: {i.jedesvolume}</div>
                            </div>
                            <div>
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].jedesmute === false && 
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "2")].jedesmute = true
                                            this.setState({ playerList: array })
                                        }}>No Muted</div>}
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].jedesmute === true && 
                                <div className="jedes-player-toggle-swtch"
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "2")].jedesmute = false
                                            this.setState({ playerList: array })
                                        }}>Currently is Muted</div>}
                            </div>
                            <div>
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].jedesloop === true &&
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "2")].jedesloop = false
                                            this.setState({ playerList: array })
                                        }}>Loop is turned ON</div>}
                                {this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].jedesloop === false &&
                                <div className="jedes-player-toggle-swtch" 
                                        onClick={() => {
                                            let array = this.state.playerList
                                            array[array.findIndex(f => f.stellung === "2")].jedesloop = true
                                            this.setState({ playerList: array })
                                        }}>Loop is turned Off</div>}
                            </div>
                            <div className="making-row">
                                <div className="jedes-player-toggle-swtch">Video position is: </div>
                                <div className="jedes-position-selection-area">
                                    <select className="jedes-position-edit-selection"
                                            value={this.state.playerList[this.state.playerList.findIndex(f => f.stellung === "2")].stellung} 
                                            onChange={(e) => {
                                                let array = this.state.playerList
                                                if (e.target.value === "1") {
                                                    array[array.findIndex(f => f.stellung === "1")].stellung = "2"
                                                    array[array.findIndex(f => f.stellung === "2")].stellung = "1"
                                                }
                                                this.setState({ playerList: array })
                                            }}>
                                        <option value={"1"}>Left</option>
                                        <option value={"2"}>Right</option>
                                        {/*<option value={"3"}>3</option>
                                        <option value={"4"}>4</option>*/}
                                    </select>
                                </div>
                            </div>
                        </body>}
                        {verifySource[0] === "https:" && this.state.bearbeitenHautBeiMitglied === false && 
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        ref={zweitePlayer => (this.zweitePlayer = zweitePlayer)} 
                        onReady={() => {this.zweitePlayer.seekTo(parseFloat(i.jedesspielerzeit))}} 
                        url={i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />}
                        {verifySource[0] !== "https:" && this.state.bearbeitenHautBeiMitglied === false && 
                        <ReactPlayer
                        key={i.id}
                        className="player-itself"
                        url={i.jedeslink}
                        width={this.state.dynamicWidth}
                        height={this.state.dynamicHeight}
                        playing={this.state.playing}
                        volume={i.jedesvolume}
                        muted = {i.jedesmute}
                        loop = {i.jedesloop}
                        controls = {this.state.controls}
                        />}
                    </div>
                    )
                }
        })
        return (
            <div>
            {this.state.width > 911 && 
                <body>
                    <div className="text-center title-jedes-collaboration general-text">{this.state.jedesleistung.konzertname}</div>
                    <div className="making-row general-text"><div className="text-courier-infor">Debut:</div> {this.state.jedesleistung.datenundzeit}</div>
                    <br />
                    {this.state.projektTeilnahmen === true && <div 
                        onClick={() => { this.setState({ bearbeitenHautBeiMitglied: !this.state.bearbeitenHautBeiMitglied })}} 
                        className="edit-create-project-button">
                            {this.state.bearbeitenHautBeiMitglied === false && <div>Edit/Create Project</div>}
                            {this.state.bearbeitenHautBeiMitglied === true && <div>Close</div>}
                            </div>}
                    <div className="making-row player-wrapper">{ersteDesktopPlayer}{zweiteDesktopPlayer}</div>
                    <br />
                    {this.state.bearbeitenHautBeiMitglied === false &&
                    <div className="making-row object-center-margin">
                        {this.state.playing === false && this.state.jedesleistung.spielernumer !== "default" && 
                        <button className="player-control" onClick={() => {this.spielerZählen()}}>
                            <div className="making-row spieler-symble">
                                ▷
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        {this.state.playing === true && this.state.jedesleistung.spielernumer !== "default" && 
                        <button className="player-control" onClick={() => {this.setState({ playing: false })}}>
                            <div className="making-row spieler-symble">
                                II
                                <div className="spieler-zahlen general-text">{this.state.spielerZahlen}</div>
                            </div>
                        </button>}
                        <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>
                    </div>}
                    <br />
                    <div className="making-row">
                        <div className="business-link-click">
                            {this.state.jedesleistung.geschafturl === null && <div className="business-link-click-text-null">No Link</div>}
                            {this.state.jedesleistung.geschafturl !== null && <div className="business-link-click-text-value" onClick={() => {window.location.href = this.state.jedesleistung.geschafturl }}>Go to Link</div>}
                        </div>
                        <div className="textarea-public-text">{this.state.jedesleistung.beschreibung}</div>
                    </div>
                    {this.state.bearbeitenHautBeiMitglied === true && 
                    <div className="modify-title-commend-area">
                        <br />
                        <input className="modify-title-input" placeholder="change title..." onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.konzertname = e.target.value
                            this.setState({ jedesleistung: object })
                        }}/>
                        <br />
                        <input className="modify-title-input" placeholder="add/change business link .." onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.geschafturl = e.target.value
                            this.setState({ jedesleistung: object })
                        }}/>
                        <br />
                        <textarea className="modify-commend-input" placeholder="change commend.." onChange={(e) => {
                            let object = this.state.jedesleistung
                            object.beschreibung = e.target.value
                            this.setState({ jedesleistung: object })
                        }}/>
                        <div className="making-row">
                            {this.state.jedesleistung.spielernumer !== "default" && 
                            <div className="modify-save" onClick={() => {
                                http.post("/updateParameter", {"jedesleistung": this.state.jedesleistung, "playerList": this.state.playerList }).then((res) => {
                                    if (res.data.state === "fail") {
                                        this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
                                    } else {
                                        window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`
                                    }
                                })
                            }}>Upadte</div>}
                            <div className="modify-save" onClick={() => {
                                http.post("/hinzufugen", {"jedesleistung": this.state.jedesleistung, "playerList": this.state.playerList }).then((res) => {
                                    if (res.data.state === "fail") {
                                        this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
                                    } else {
                                        window.location = `/jedes/id=${res.data.link}`
                                    }
                                })
                            }}>Create</div>
                            {this.state.jedesleistung.spielernumer !== "default" && 
                            <div className="modify-save" onClick={() => {
                                if (window.confirm("Are you sure you want to delete this prject?")) {
                                    http.get(`/deleteProjekt/id=${this.props.match.params.jedesVideoSpieler}`).then((res) => {
                                        if (res.data.state === "fail") {
                                            this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
                                        } else {
                                            window.location = `/mitglied/id=${localStorage.getItem('user')}`
                                        }
                                    })
                                }
                            }}>Delete</div>}
                        </div>
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
                {this.state.iphoneLimit === false && <div className="making-column player-wrapper">{ersteDesktopPlayer}<br />{zweiteDesktopPlayer}</div>}
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
                        {this.state.iphoneLimit === false &&
                        <button className="player-control" onClick={() => {window.location = `/jedes/id=${this.props.match.params.jedesVideoSpieler}`}}>Refresh</button>}
                    </div>
                    <div className="making-row gap-upper">
                        <div className="business-link-click">
                            {this.state.jedesleistung.geschafturl === null && <div className="business-link-click-text-null">No Link</div>}
                            {this.state.jedesleistung.geschafturl !== null && <div className="business-link-click-text-value" onClick={() => {window.location.href = this.state.jedesleistung.geschafturl }}>Go to Link</div>}
                        </div>
                        <div className="textarea-public-text">{this.state.jedesleistung.beschreibung}</div>
                    </div>
                </body>}
            </div>
        );
    }
}


export default TestPlayer;