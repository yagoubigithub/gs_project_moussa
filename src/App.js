import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Connexion from "./components/auth/Connexion";

//redux
import { connect } from "react-redux";

import "./App.css";
import MaitreDouvrage from "./components/MaitreDouvrage";
import Agence from "./components/Agence";
import Projet from "./components/Projet";
import PhasesProjet from "./components/PhasesProjet";
import EtatProjet from "./components/EtatProjet";
import Devis from "./components/Devis";
import Facture from "./components/Facture";
import EtatDuFacture from "./components/EtatDuFacture";
import User from "./components/User";
import Statistique from "./components/Statistique";
import TaskBar from "./components/TaskBar";
import Key from "./components/Key";

class App extends Component {
  componentDidMount(){
    const {remote} = window.require('electron')
    const {Menu, MenuItem} = remote

    const menu = new Menu()

    // Build menu one item at a time, unlike
    menu.append(new MenuItem ({label: 'Cut',role: 'cut'}))
    menu.append(new MenuItem ({label: 'Copy',role: 'copy'}))
    menu.append(new MenuItem ({label: 'Paste',role: 'paste'}))
    
    menu.append(new MenuItem({type: 'separator'}))
    menu.append(new MenuItem ({label: 'Select all',role: 'selectall'}))
  
   
   
    // Prevent default action of right click in chromium. Replace with our menu.
    window.addEventListener('contextmenu', (e) => {
       e.preventDefault()
       menu.popup(remote.getCurrentWindow())
    }, false)
  }
  render() {
    return (
      <Router>
       <Key />
        <div className="container"  style={{backgroundColor : "black"}}>
          {this.props.auth.user !== undefined ? (
            <Navbar />
          ) : (
            <Redirect to="/" />
          )}
          <div className={"content"}>
            <Switch>
              <Route exact path="/" component={Connexion} />
              <Route path="/maitre_douvrage" component={MaitreDouvrage} />
              <Route path="/projet" component={Projet} />
              <Route path="/etat_projet" component={EtatProjet} />
              <Route path="/phases_projet" component={PhasesProjet} />
              <Route path="/devis" component={Devis} />
              <Route path="/facture" component={Facture} />
              <Route path="/etat_facture" component={EtatDuFacture} />    
              <Route path="/agence" component={Agence} />
              <Route path="/statistique" component={Statistique} />
              <Route path="/user" component={User} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(App);
