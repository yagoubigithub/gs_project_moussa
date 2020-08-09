import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//mui
import Dialog from "@material-ui/core/Dialog";

//util
import LoadingComponent from "../utils/loadingComponent";

//redux
import {
  getAllDevis,
  addToCorbeille,
  undoDeleteDevis,
  undoDeleteDevisMultiple,
  addToCorbeilleMultiple
} from "../store/actions/devisAction";
import { connect } from "react-redux";


import AjouterDevis from "./ajouter/AjouterDevis.";
import DevisTable from "./tables/DevisTable";
import PrintDevis from "./print/PrintDevis";
import ModifierDevis from "./modifier/ModifierDevis";

class Devis extends Component {
  state = {
    delete_button_text: "Supprimer",
    deviss: [],
    devisCorebeille: [],
    rowsSelected: [],
    tab: "deviss",
    addToCorbeilleDialog: false,
  };
  componentDidMount() {
    this.props.getAllDevis();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.deviss) {
      const devisCorebeille = [];
      const deviss = [];
      let devissCounter = 1;
      let devisCorebeilleCounter = 1;
      nextProps.deviss.map((devis) => {
        if (devis.status === "undo") {
          deviss.push({ number: devissCounter, ...devis });
          devissCounter++;
        }

        if (devis.status === "corbeille") {
          devisCorebeille.push({ number: devisCorebeilleCounter, ...devis });
          devisCorebeilleCounter++;
        }
      });

      deviss.sort(
        (a, b) =>
          new Date(a.date_devis).getTime() - new Date(b.date_devis).getTime()
      );
      deviss.reverse();

      devisCorebeille.sort(
        (a, b) =>
          new Date(a.date_devis).getTime() - new Date(b.date_devis).getTime()
      );
      devisCorebeille.reverse();

      this.setState({ devisCorebeille, deviss });
    }
  }

  handleChangeTab = (tab) => {
    switch (tab) {
      case "deviss":
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],

          tab: "deviss",
        });

        break;

      case "devisCorebeille":
        this.setState({
          delete_button_text: "Annuler Suppression",
          rowsSelected: [],
          tab: "devisCorebeille",
        });

        break;

      default:
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
          tab: "deviss",
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
      alert("Selectionnner des devis");
    } else {
      if (this.state.tab !== "devisCorebeille") {
        this.handleOpenCloseaddToCorbeilleDialog();
      }
      if (this.state.tab === "devisCorebeille") {
        this.props.undoDeleteDevisMultiple({deviss : [...this.state.rowsSelected]})
        this.setState({ rowsSelected: [] });
      }
    }
  };
  addToCorbeille = () => {
    const rowsSelected = [...this.state.rowsSelected];
    this.props.addToCorbeilleMultiple({deviss : rowsSelected})
   
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
        <div className="sous-nav-container">
          <NavLink onClick={this.props.getAllProjet} to="/devis">
            <button className="btn btn-nav">Actualisé</button>
          </NavLink>

          <NavLink to="/devis/ajouter/devis">
            <button className="btn btn-nav">Ajouter</button>
          </NavLink>

          <button className="btn btn-nav" onClick={this.Supprimer}>
            {this.state.delete_button_text}
          </button>
        </div>

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
        <Route path="/devis/ajouter/:buttonReturn" component={AjouterDevis} />
        <Route path="/devis/print/:id/:buttonReturn" component={PrintDevis} />

        <Route path="/devis/modifier/:id/:buttonReturn" component={ModifierDevis} />

        <Tabs>
          <Tab
            index={0}
            title="Tous les devis"
            onClick={() => this.handleChangeTab("deviss")}
          >
            <DevisTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.deviss}
            />
          </Tab>

          <Tab
            index={1}
            title="Corbeille"
            onClick={() => this.handleChangeTab("devisCorebeille")}
          >
            <DevisTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.devisCorebeille}
              type={"corbeille"}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapActionToProps = (dispatch) => ({
  getAllDevis: () => dispatch(getAllDevis()),
  addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  undoDeleteDevis: (id) => dispatch(undoDeleteDevis(id)),
  undoDeleteDevisMultiple : (data) => dispatch(undoDeleteDevisMultiple(data)),
  addToCorbeilleMultiple : (data) => dispatch(addToCorbeilleMultiple(data)),
});
const mapStateToProps = (state) => ({
  deviss: state.devis.deviss,
  loading: state.devis.loading,
});
export default connect(mapStateToProps, mapActionToProps)(Devis);
