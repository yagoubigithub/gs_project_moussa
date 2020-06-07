import React, { Component } from "react";

import { NavLink } from "react-router-dom";

// redux
import { connect } from "react-redux";

//icons
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DomainIcon from "@material-ui/icons/Domain";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import DescriptionIcon from "@material-ui/icons/Description";
import WorkIcon from "@material-ui/icons/Work";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

class Navbar extends Component {
  render() {
    return (
      <nav className="nav">
        <div className="navbar">
          <h2 className="project-title">
            {this.props.auth.user.employe && this.props.auth.user.employe}
          </h2>

          <NavLink
            activeClassName="nav-active"
            to="/maitre_douvrage"
            className="nav-link"
          >
            <span className="nav-link-icon">
              <AssignmentIndIcon />
            </span>

            <span>Maitre d'ouvrage</span>
          </NavLink>
          <NavLink
            activeClassName="nav-active"
            to="/phases_projet"
            className="nav-link"
          >
            <span className="nav-link-icon">
              <FormatListNumberedIcon />
            </span>

            <span>Phases du Projet</span>
          </NavLink>
          <NavLink
            activeClassName="nav-active"
            to="/projet"
            className="nav-link"
          >
            <span className="nav-link-icon">
              <DomainIcon />
            </span>

            <span>Projet</span>
          </NavLink>

          <NavLink
            activeClassName="nav-active"
            to="/etat_projet"
            className="nav-link"
          >
            <span className="nav-link-icon">
              
              <AccessTimeIcon />
            </span>

            <span>Etat de Projet</span>
          </NavLink>

          <NavLink
            activeClassName="nav-active"
            to="/devis"
            className="nav-link"
          >
            <span className="nav-link-icon">
              <AssignmentIcon />
            </span>
            <span>Devis</span>
          </NavLink>
          <NavLink
            activeClassName="nav-active"
            to="/facture"
            className="nav-link"
          >
            <span>
              
              <DescriptionIcon />
            </span>
            <span>Facture</span>
          </NavLink>
          <NavLink
            activeClassName="nav-active"
            to="/agence"
            className="nav-link"
          >
            <span className="nav-link-icon">
              
              <WorkIcon />
            </span>

            <span> bureau d'étude</span>
          </NavLink>
          <NavLink
            activeClassName="nav-active"
            to="/statistique"
            className="nav-link"
          >
            <span className="nav-link-icon">
              
              <AssessmentIcon />
            </span>

            <span> Statistique</span>
          </NavLink>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(Navbar);
