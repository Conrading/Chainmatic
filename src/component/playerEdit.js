import React, { Component } from "react";
import './mainPlayer.css'
import http from './http-axios'

class EditPlayer extends Component {
    constructor (props) {
        super (props);
        this.state = {
            editTurnOn: false
        }
        this.hinzufugen = this.hinzufugen.bind(this); // seek volume value
        this.adjustingParameter = this.adjustingParameter.bind(this) // parameter submit button
    }
    adjustingParameter () {
        http.post("/updateParameter", {"playerList": this.state.playerList}).then((res) => {
            if (res.data.state === "fail") {
                this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
            } else {
                window.location = `/jedes/id=${this.props.url}`
            }
        })
    }
    hinzufugen() { 
        http.post("/hinzufugen", {"jedesleistung": this.state.jedesleistung, "playerList": this.state.playerList}).then((res) => {
            if (res.data.state === "fail") {
                this.setState({ jedesleistung: {"konzertname": "System Failure!"}})
            } else {
                window.location = `/jedes/id=${res.data.link}`
            }
        })
    }
    render() {
        return (
            <body>
                <div className="text-center text-pointer" onClick={() => {this.setState({ 
                    editTurnOn: !this.state.editTurnOn,
                    jedesleistung: this.props.jedesleistung,
                    playerList: this.props.playerList, })}}>Laden Data fur bearbeiten</div>
                {this.state.editTurnOn === true && 
                <div>
                <br />
                <div>Performance Number: {this.state.jedesleistung.spielernumer}</div>
                {this.state.playerList.length > 0 && 
                <body>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[0].jedesspieler = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[0].jedesspieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[0].jedeslink = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[0].jedeslink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[0].jedesspielerzeit = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[0].jedesspielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="1st volumn" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[0].jedesvolume = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[0].jedesvolume}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[0].jedesmute} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[0].jedesmute = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={true}>mute</option>
                                <option value={false}>unmute</option>
                            </select>
                        </div>
                        {this.state.playerList[0].jedesmute === false && 
                        <div className="text-left-gap">No Muted</div>}
                        {this.state.playerList[0].jedesmute === true && 
                        <div className="text-left-gap">Currently is Muted</div>}
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[0].jedesloop} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[0].jedesloop = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        {this.state.playerList[0].jedesloop === true &&
                        <div className="text-left-gap">Loop is turned ON</div>}
                        {this.state.playerList[0].jedesloop === false &&
                        <div className="text-left-gap">Loop is turned Off</div>}
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[0].stellung} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[0].stellung = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={"1"}>1</option>
                                <option value={"2"}>2</option>
                                <option value={"3"}>3</option>
                                <option value={"4"}>4</option>
                            </select>
                        </div>
                        <div className="text-left-gap">Currently position is: {this.state.playerList[0].stellung}</div>
                    </div>
                </body>}
                {this.state.playerList.length > 0 && 
                <body>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[1].jedesspieler = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[1].jedesspieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[1].jedeslink = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[1].jedeslink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[1].jedesspielerzeit = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[1].jedesspielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="2nd volumn" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[1].jedesvolume = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[1].jedesvolume}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[1].jedesmute} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[1].jedesmute = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={true}>mute</option>
                                <option value={false}>unmute</option>
                            </select>
                        </div>
                        {this.state.playerList[1].jedesmute === false && 
                        <div className="text-left-gap">No Muted</div>}
                        {this.state.playerList[1].jedesmute === true && 
                        <div className="text-left-gap">Currently is Muted</div>}
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[1].jedesloop} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[1].jedesloop = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        {this.state.playerList[1].jedesloop === true &&
                        <div className="text-left-gap">Loop is turned ON</div>}
                        {this.state.playerList[1].jedesloop === false &&
                        <div className="text-left-gap">Loop is turned Off</div>}
                    </div>
                    <div className="making-row">
                        <div>
                            <select value={this.state.playerList[1].stellung} 
                                    onChange={(e) => {
                                        let array = this.state.playerList
                                        array[1].stellung = e.target.value
                                        this.setState({ playerList: array })
                                    }}>
                                <option value={"1"}>1</option>
                                <option value={"2"}>2</option>
                                <option value={"3"}>3</option>
                                <option value={"4"}>4</option>
                            </select>
                        </div>
                        <div className="text-left-gap">Currently position is: {this.state.playerList[1].stellung}</div>
                    </div>
                </body>}
                {this.state.playerList.length > 2 && 
                <body>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd Player" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[2].jedesspieler = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[2].jedesspieler}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd Link" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[2].jedeslink = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[2].jedeslink}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd start time" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[2].jedesspielerzeit = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[2].jedesspielerzeit}</div>
                    </div>
                    <div className="making-row">
                        <div>
                            <input className="input-personal-infor" placeholder="3rd volume" type="text" 
                            onChange={(e) => {
                                let array = this.state.playerList
                                array[2].jedesvolume = e.target.value
                                this.setState({ playerList: array })
                            }}/>
                        </div>
                        <div className="text-left-gap">{this.state.playerList[2].jedesvolume}</div>
                    </div>
                </body>}
                <div className="making-row half-center-margin">
                    <button className="player-control" onClick={() => {this.adjustingParameter()}}>Update</button>
                    <button className="player-control" onClick={() => {this.hinzufugen()}}>Create</button>
                </div>
                </div>}
            </body>
        );
    }
}


export default EditPlayer;