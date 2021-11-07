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

            importDefualtList: {
                "firstLine": [],
                "secondLine": [],
                "thridLine": [],
                "vierLine": []
            } 
        }
        //sort out how to present data
        this.sortOutData = this.sortOutData.bind(this) //sort out the data user wants to present
        this.resetAll = this.resetAll.bind(this) //reset variable after sort data
    }
    componentDidMount () {
        //show data without log-in
        http.get("/hauptsachlich").then(res => {
            this.setState({ importDefualtList: res.data })
        }) 
    }
    sortOutData () {
        //lower case of applicant
        if (this.state.projectSearch == null) {
            this.setState({ searchResult: "Please input something before search" })
        } else { 
            this.setState({ searchResult: null })
        }
        //submit the data sort out critaria
        http.post("/searchPerformance", {search: this.state.projectSearch.replace(/\W+/g, '-').toLowerCase()}).then((res) => {
           if (res.data.negative === "empty") {
               this.setState({ searchResult: "Search no result" })
            } else if (res.data.negative === "error") {
                this.setState({ searchResult: res.data.error })
            } else {
                this.setState({ importDefualtList: res.data })
            } 
        })
    }
    resetAll () {
        //set several variable to defualt
    }
    render () {
        let erstenCard = this.state.importDefualtList.firstLine.map( i => {
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
        let zweitenCard = this.state.importDefualtList.secondLine.map( i => {
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
        let dreiCard = this.state.importDefualtList.thridLine.map( i => {
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
        let vierCard = this.state.importDefualtList.vierLine.map( i => {
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
        return (
            <div>
                <div className="searchbar">
                    <div className="searchbar-input"><input className="input-project" type="text" onChange={(e) => {this.setState({projectSearch: e.target.value})}}/></div>
                    <div className="searchbar-button" ><button className="search" onClick={() => {this.sortOutData()}}>Search</button></div>
                </div>
                {this.state.searchResult !== null && <div><br /><div className="text-center">{this.state.searchResult}</div></div>}
                <br />
                <div className="making-row center-by-margin">
                    <div className="width-column">{erstenCard}</div>
                    <div className="width-column">{zweitenCard}</div>
                    <div className="width-column">{dreiCard}</div>
                    <div className="width-column">{vierCard}</div>
                </div>
            </div>
        )
    }
}

export default Hauptsächlich;
