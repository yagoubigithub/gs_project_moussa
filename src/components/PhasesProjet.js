import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//util
import LoadingComponent from "../utils/loadingComponent";

//redux
import {
  getAllPhasesProjet,
  addToCorbeille,
  undoDeletePhasesProjet,
} from "../store/actions/pahsesProjetAction";
import { connect } from "react-redux";
import AjouterPhasesProjet from "./ajouter/AjouterPhasesProjet";
import PhasesProjetTable from "./tables/PhasesProjetTable";

class PhasesProjet extends Component {
  state = {
    delete_button_text: "Suprimer",
    phasesProjets: [],
    phasesProjetCorebeille: [],
    rowsSelected: [],
    tab: "projets",
    addToCorbeilleDialog: false,
  };
  componentDidMount() {
    this.props.getAllPhasesProjet();
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.phasesProjets) {
      const phasesProjetCorebeille = [];
      const phasesProjets = [];
      nextProps.phasesProjets.map((phasesProjet) => {
        if (phasesProjet.status === "undo") {
          phasesProjets.push(phasesProjet);
        }

        if (phasesProjet.status === "corbeille") {
          phasesProjetCorebeille.push(phasesProjet);
        }
      });

      this.setState({ phasesProjetCorebeille, phasesProjets });
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
          <NavLink onClick={this.props.getAllPhasesProjet} to="/phases_projet">
            <button className="btn btn-nav">Actualisé</button>
          </NavLink>

          <NavLink to="/phases_projet/ajouter">
            <button className="btn btn-nav">Ajouter</button>
          </NavLink>

          <button className="btn btn-nav" onClick={this.Supprimer}>
            {this.state.delete_button_text}
          </button>
        </div>

        <Route path="/phases_projet/ajouter" component={AjouterPhasesProjet} />

        <Tabs>
          <Tab
            index={0}
            title="Tous les Phases du Projet"
            onClick={() => this.handleChangeTab("pahsesProjet")}
          >
            <PhasesProjetTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.phasesProjets}
            />
          </Tab>
          <Tab
            index={1}
            title="Corbeille"
            onClick={() => this.handleChangeTab("pahsesProjetCorebeille")}
          >
            <PhasesProjetTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.phasesProjetCorebeille}
              type={"corbeille"}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => ({
  getAllPhasesProjet: () => dispatch(getAllPhasesProjet()),
  addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  undoDeletePhasesProjet: (id) => dispatch(undoDeletePhasesProjet(id)),
});
const mapStateToProps = (state) => ({
  phasesProjets: state.phases_projet.phasesProjets,
  loading: state.projet.loading,
});
export default connect(mapStateToProps, mapActionToProps)(PhasesProjet);
