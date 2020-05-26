import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//util
import LoadingComponent from "../utils/loadingComponent";


//Mui
import Dialog from '@material-ui/core/Dialog'

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
    delete_button_text: "Supprimer",
    phasesProjets: [],
    phasesProjetCorebeille: [],
    rowsSelected: [],
    tab: "pahsesProjets",
    addToCorbeilleDialog: false,
  };
  componentDidMount() {
    this.props.getAllPhasesProjet();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.phasesProjets) {
      const phasesProjetCorebeille = [];
      const phasesProjets = [];
     let phasesProjetsCounter = 1 ;
    let  phasesProjetCorebeilleCounter = 1;
      nextProps.phasesProjets.map((phasesProjet) => {
        if (phasesProjet.status === "undo") {
          phasesProjets.push({number : phasesProjetsCounter ,...phasesProjet});
          phasesProjetsCounter++;
        }

        if (phasesProjet.status === "corbeille") {
          phasesProjetCorebeille.push({number : phasesProjetCorebeilleCounter ,...phasesProjet});
          phasesProjetCorebeilleCounter++;
        }
      });

      this.setState({ phasesProjetCorebeille, phasesProjets });
    }
  }
 

  handleChangeTab = (tab) => {
    switch (tab) {
      case "pahsesProjets":
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
         
          tab: "pahsesProjets",
        });

        break;

      case "phasesProjetCorebeille":
        this.setState({
          delete_button_text: "Annuler Suppression",
          rowsSelected: [],
          tab: "phasesProjetCorebeille",
        });

        break;

     

      default:
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
          tab: "pahsesProjets",
        });
        break;
    }
  };
  getData = (rowsSelected) => {
    this.setState({ rowsSelected });
  };
  handleOpenCloseaddToCorbeilleDialog = () => {
    this.setState({ addToCorbeilleDialog: !this.state.addToCorbeilleDialog });
  };
  Supprimer = () => {
    if (this.state.rowsSelected.length === 0) {
      alert("Selectionnner des phase du projet");
    } else {
      if (this.state.tab !== "phasesProjetCorebeille") {
        this.handleOpenCloseaddToCorbeilleDialog();
      }
      if (this.state.tab === "phasesProjetCorebeille") {
        this.state.rowsSelected.map((phasesProjet) => {
          this.props.undoDeletePhasesProjet(phasesProjet);
        });
        this.setState({ rowsSelected: [] });
      }
    }
  };
  addToCorbeille = () => {
    const rowsSelected = [...this.state.rowsSelected];
    rowsSelected.map((phasesProjet) => {
      this.props.addToCorbeille(phasesProjet);
    });
    this.setState({ rowsSelected: [] });
  };


  render() {
    return (
      <div>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
          <Dialog
          open={this.state.addToCorbeilleDialog}
          onClose={this.handleOpenCloseaddToCorbeilleDialog}
        >
          <h2>Supprimer</h2>
          <button
            onClick={() => {
              this.addToCorbeille();
              this.handleOpenCloseaddToCorbeilleDialog();
            }}
          >
            Supprimer
          </button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>
            Cancel
          </button>
        </Dialog>
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
            onClick={() => this.handleChangeTab("pahsesProjets")}
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
            onClick={() => this.handleChangeTab("phasesProjetCorebeille")}
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
  loading: state.phases_projet.loading,
});
export default connect(mapStateToProps, mapActionToProps)(PhasesProjet);
