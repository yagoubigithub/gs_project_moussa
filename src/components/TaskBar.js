import React, { Component } from "react";

import CloseIcon from "@material-ui/icons/Close";
import RemoveIcon from "@material-ui/icons/Remove";
import Crop54Icon from "@material-ui/icons/Crop54";
import FilterNoneIcon from '@material-ui/icons/FilterNone';


const electron = window.require("electron");
    const { ipcRenderer } = electron;

export default class TaskBar extends Component {
  state = {
    isFullScreen: false,
    screenIcon : <Crop54Icon />
  };

  close = () => {
    

    ipcRenderer.send("closeWindow");
  };

  chnageScreen = () =>{
    ipcRenderer.send("changeScreen",{isFullScreen :this.state.isFullScreen});
    this.setState({
        isFullScreen: ! this.state.isFullScreen,
        screenIcon : this.state.isFullScreen ? <Crop54Icon />  :  <FilterNoneIcon />
    })
  }
  minimize = () =>{
    ipcRenderer.send("minimizeWindow");
  }

  render() {
    return (
      <div
        style={{
          position: "fixed",
          zIndex: 99,
          backgroundColor: "black",
          width: "100%",
          height: 35,
          textAlign: "right",
        }}
      >
        <nav>
          <button
            id="close-btn"
            className="btn-taskbar"
            onClick={this.minimize}
            style={{ cursor: "pointer", color: "white" }}
          >
            <RemoveIcon />
          </button>
          <button
            id="close-btn"
            className="btn-taskbar"
            onClick={this.chnageScreen}
            style={{ cursor: "pointer", color: "white" }}
          >
           {this.state.screenIcon}
          </button>
          <button
            id="close-btn"
            className="btn-taskbar"
            onClick={this.close}
            style={{ cursor: "pointer", color: "white" }}
          >
            <CloseIcon />
          </button>
        </nav>
      </div>
    );
  }
}
