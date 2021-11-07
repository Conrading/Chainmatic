import React, { Component } from "react";
import './frontPage.css'
//import http from './http-axios'


class Front extends Component {
    constructor () {
        super ();
        this.state = {
            change: "0",
            salesLine: null,
            urlSwtiching: null,
        }
    }
    componentDidMount () {
    }
    render () {
        return (
            <div className="mainpage-body">
                <div className="block-black">
                    <div className="block-light-black-text"><span>Chain</span><span>Sound</span></div>
                </div>
                <div className="block-second-layer">
                    <div className="making-row moving-area">
                        <div className="moving-card" onClick={() => {
                            this.setState({ 
                                change: "0",
                                salesLine: "1st Place, 1st Sound, 1 Time",
                                urlSwtiching: null
                            })
                        }}>!st Sound</div>
                        <div className="moving-card" onClick={() => {
                            this.setState({ 
                                change: "0",
                                salesLine: "follow by 2nd Place, 2nd Sound, 2 Time",
                                urlSwtiching: null
                            })
                        }}>2nd Sound</div>
                        <div className="moving-card" onClick={() => {
                            this.setState({ 
                                change: "1",
                                salesLine: "Two sounds connecting without limit, distance, time are no longer the problem",
                                urlSwtiching: '/hauptsachlich'
                            })
                        }}>Chain</div>
                    </div>
                    <div className="salesline-text gap-between-block-show">{this.state.salesLine}</div>
                    {this.state.change !== "0" && <div className="more-customized-button" onClick={() => {window.location = this.state.urlSwtiching}}>More</div>}
                </div>
            </div>
        )
    }
}

export default Front;

