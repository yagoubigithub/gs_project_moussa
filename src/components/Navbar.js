import React, { Component } from "react";



import { NavLink } from "react-router-dom";




// redux
import {connect} from 'react-redux';

class Navbar extends Component {
  render() {
  
 
    return (
      <nav className="nav">
        <div className="navbar">
          <h2 className="project-title">{this.props.auth.user.employe && this.props.auth.user.employe}</h2>
         
          <NavLink activeClassName="nav-active" to="/maitre_douvrage" className="nav-link">
        Maitre d'ouvrage{" "}
      </NavLink>
      <NavLink activeClassName="nav-active" to="/phases_projet" className="nav-link">
        Phases du Projet{" "}
      </NavLink>
      <NavLink activeClassName="nav-active" to="/projet" className="nav-link">
        Projet{" "}
      </NavLink>

      <NavLink activeClassName="nav-active" to="/etat_projet" className="nav-link">
       Etat de Projet{" "}
      </NavLink>
   
     
      <NavLink activeClassName="nav-active" to="/facture" className="nav-link">
        Facture{" "}
      </NavLink>
      <NavLink activeClassName="nav-active" to="/agence" className="nav-link">
      bureau d'étude{" "}
      </NavLink>
      <NavLink activeClassName="nav-active" to="/statistique" className="nav-link">
        Statistique{" "}
      </NavLink>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = state =>{
  return {
    
    auth  : state.auth
  }
}
export default connect(mapStateToProps)(Navbar);
