import React, { Component } from "react";
import './mainPage.css'
import http from './http-axios'


class Main extends Component {
    constructor () {
        super ();
        this.state = {
            change: "0",
            salesLine: null,
            urlSwtiching: null,
            sprachsetting: 0,
        }
    }
    componentDidMount () {
        http.post("/getlanguage", {"user": localStorage.getItem('user')}).then(res => {
            if (res.data.status === "success") {
                this.setState({ sprachsetting: res.data.sprache })
            } 
        })
    }
    render () {
        return (
            <body>
            <div className="block-black">
                <div className="block-light-black-text"><span>Chain</span><span>Sound</span></div>
            </div>
            <div className="block-second-layer">
                <div className="making-row moving-area">
                    <div className="moving-card" onClick={() => {
                        this.setState({ 
                            change: "1",
                            salesLine: "1st Place, 1st Sound, 1 Time",
                            urlSwtiching: null
                         })
                    }}>!st Sound</div>
                    <div className="moving-card" onClick={() => {
                        this.setState({ 
                            change: "1",
                            salesLine: "follow by 2nd Place, 2nd Sound, 2 Time",
                            urlSwtiching: null
                         })
                    }}>2nd Sound</div>
                    <div className="moving-card" onClick={() => {
                        this.setState({ 
                            change: "0",
                            salesLine: "Two sounds connecting without limit, distance, time are no longer the problem",
                            urlSwtiching: '/hauptsachlich'
                         })
                    }}>Chain</div>
                </div>
                <div className="salesline-text gap-between-block-show">{this.state.salesLine}</div>
                {this.state.change !== "0" && <div className="more-customized-button" onClick={() => {window.location = this.state.urlSwtiching}}>{mainPageSprache[this.state.sprachsetting].moreButton}</div>}
            </div>
            </body>
        )
    }
}

export default Main;

