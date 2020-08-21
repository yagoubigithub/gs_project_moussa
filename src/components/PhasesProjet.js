import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//util
import LoadingComponent from "../utils/loadingComponent";


//Mui
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

//redux
import {
  getAllPhasesProjet,
  addToCorbeilleMultiple,
  undoDeleteProjetMultiple,
} from "../store/actions/pahsesProjetAction";
import { connect } from "react-redux";
import AjouterPhasesProjet from "./ajouter/AjouterPhasesProjet";
import PhasesProjetTable from "./tables/PhasesProjetTable";
import ModfierPhaseProjet from "./modifier/ModfierPhaseProjet";

class PhasesProjet extends Component {
  state = {
    delete_button_text: "Supprimer",
    phasesProjets: [],
    phasesProjetCorebeille: [],
    rowsSelected: [],
    tab: "pahsesProjets",
    addToCorbeilleDialog: false,
    message : ""
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
      this.setState({message : "Selectionnner des phase du projet"});
    } else {
      if (this.state.tab !== "phasesProjetCorebeille") {
        this.handleOpenCloseaddToCorbeilleDialog();
      }
      if (this.state.tab === "phasesProjetCorebeille") {
        this.props.undoDeleteProjetMultiple(this.state.rowsSelected);
        this.setState({ rowsSelected: [] });
      }
    }
  };
  addToCorbeille = () => {
    const rowsSelected = [...this.state.rowsSelected];
    this.props.addToCorbeilleMultiple(rowsSelected)
 
    this.setState({ rowsSelected: [] });
  };

  closeAlert = () => {
    this.setState({
      message: "",
    });
  };
  render() {
    return (
      <div>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        <Dialog open={this.state.message !== ""} onClose={this.closeAlert}>
          <DialogContent>
            <p>{this.state.message}</p>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.closeAlert}
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
        <h1 style={{color: "white", marginRight : 100}}>Phases du projet</h1>
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
        <Route path="/phases_projet/modifier/:id" component={ModfierPhaseProjet} />

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
  addToCorbeilleMultiple: (id) => dispatch(addToCorbeilleMultiple(id)),
  undoDeleteProjetMultiple: (id) => dispatch(undoDeleteProjetMultiple(id)),
});
const mapStateToProps = (state) => ({
  phasesProjets: state.phases_projet.phasesProjets,
  loading: state.phases_projet.loading,
});
export default connect(mapStateToProps, mapActionToProps)(PhasesProjet);
