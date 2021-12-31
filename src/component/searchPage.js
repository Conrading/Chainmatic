import React, { Component } from "react";
import './searchPage.css'
import http from './http-axios'
import ReactPlayer from 'react-player';


class Hauptsächlich extends Component {
    constructor () {
        super ();
        this.state = {
            projectSearch: null,
            searchResult: null,
            light: true,

            importDefualtList: [],
            width: window.innerWidth,
        }
        this.sortOutData = this.sortOutData.bind(this) //sort out the data user wants to present
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this) //switch to cellphone
    }
    componentDidMount () {
        http.get("/hauptsachlich").then(res => {
            this.setState({ importDefualtList: res.data.vollList })
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
    sortOutData () {
        if (this.state.projectSearch == null) {
            this.setState({ searchResult: "Please input something before search" })
        } else { 
            this.setState({ searchResult: null })
        }
        http.post("/searchPerformance", {search: this.state.projectSearch.replace(/\W+/g, '-').toLowerCase()}).then((res) => {
           if (res.data.negative === "empty") {
               this.setState({ searchResult: "Search no result" })
            } else if (res.data.negative === "error") {
                this.setState({ searchResult: res.data.error })
            } else {
                this.setState({ importDefualtList: res.data.vollList })
            } 
        })
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
                            controls = {true}
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
                <div className="searchbar">
                    <div className="searchbar-input"><input className="input-project" type="text" onChange={(e) => {this.setState({projectSearch: e.target.value})}}/></div>
                    <div className="searchbar-button" ><button className="search" onClick={() => {this.sortOutData()}}>Search</button></div>
                </div>
                {this.state.searchResult !== null && <div><br /><div className="text-center">{this.state.searchResult}</div></div>}
                <br />
                {this.state.width > 911 &&
                <div className="center-by-margin">{jedesInterpret}</div>}
                {this.state.width < 911 &&
                <div>{phonePageList}</div>}
            </body>
        )
    }
}

export default Hauptsächlich;
