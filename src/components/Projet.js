import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//util
import LoadingComponent from "../utils/loadingComponent";

//redux
import {
  getAllProjet,
  addToCorbeille,
  undoDeleteProjet,
} from "../store/actions/projetAction";
import { connect } from "react-redux";
import AjouterProjet from "./ajouter/AjouterProjet";
import ProjetTable from "./tables/ProjetTable";

class Projet extends Component {
  state = {
    delete_button_text: "Suprimer",
    projets: [],
    projetCorebeille: [],
    rowsSelected: [],
    tab: "projets",
    addToCorbeilleDialog: false,
  };
  componentDidMount() {
    this.props.getAllProjet();
  }
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.projets) {
      const projetCorebeille = [];
      const projets = [];
      nextProps.projets.map((projet) => {
        if (projet.status === "undo") {
          projets.push(projet);
        }

        if (projet.status === "corbeille") {
          projetCorebeille.push(projet);
        }
      });
     

      this.setState({ projetCorebeille, projets });
    }
  }
  render() {
    return (
      <div>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        <div className="sous-nav-container">
          <NavLink onClick={this.props.getAllProjet} to="/projet">
            <button className="btn btn-nav">Actualisé</button>
          </NavLink>

          <NavLink to="/projet/ajouter">
            <button className="btn btn-nav">Ajouter</button>
          </NavLink>

          <button className="btn btn-nav" onClick={this.Supprimer}>
            {this.state.delete_button_text}
          </button>
        </div>

        <Route path="/projet/ajouter" component={AjouterProjet} />


        <Tabs>
          <Tab
            index={0}
            title="Tous les Projets"
            onClick={() => this.handleChangeTab("projets")}
          >
            <ProjetTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.projets}
            />
          </Tab>
          <Tab
            index={1}
            title="Corbeille"
            onClick={() => this.handleChangeTab("projetCorebeille")}
           
          >
            <ProjetTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.projetCorebeille}
              type={"corbeille"}
            />
          </Tab>
        </Tabs>

       </div>
    );
  }
}
const mapActionToProps = (dispatch) => ({
  getAllProjet: () => dispatch(getAllProjet()),
  addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  undoDeleteProjet: (id) => dispatch(undoDeleteProjet(id)),
});
const mapStateToProps = (state) => ({
  projets: state.projet.projets,
  loading: state.projet.loading,
});
export default connect(mapStateToProps, mapActionToProps)(Projet);
