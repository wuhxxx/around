import React, { Component } from "react";
import logo from "../assets/images/logo.svg";

class TopBar extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className="App-title">Around</div>
                </header>
            </div>
        );
    }
}

export default TopBar;