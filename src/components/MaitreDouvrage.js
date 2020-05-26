import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";


//util
import LoadingComponent from "../utils/loadingComponent";

import ModifierMaitreDouvrage from "./modifier/ModifierMaitreDouvrage";
import AjouterMaitreDouvrage from "./ajouter/AjouterMaitreDouvrage";
import MaitreDouvrageTable from "./tables/MaitreDouvrageTable";

//redux
import { connect } from "react-redux";
import { getAllMaitreDouvrage ,undoDeleteMaitreDouvrage,addToCorbeille} from "../store/actions/maitreDouvrageAction";
import { Dialog } from "@material-ui/core";

class MaitreDouvrage extends Component {
  state = {
    delete_button_text: "Suprimer",
    maitreDouvrages: [],
    maitreDouvrageCorebeille: [],
    rowsSelected: [],
    tab: "maitreDouvrages",
    addToCorbeilleDialog : false
  };
  componentDidMount() {
    this.props.getAllMaitreDouvrage();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.maitreDouvrages) {

      const maitreDouvrageCorebeille = [];
      const maitreDouvrages = [];
      nextProps.maitreDouvrages.map((maitreDouvrage) => {
        if (maitreDouvrage.status === "undo") {
          maitreDouvrages.push(maitreDouvrage);
        }

        if (maitreDouvrage.status === "corbeille") {
          maitreDouvrageCorebeille.push(maitreDouvrage);
        }

      })

      this.setState({ maitreDouvrageCorebeille,maitreDouvrages });
    }
  }

  Supprimer = () => {
    if (this.state.rowsSelected.length === 0) {
      alert("Selectionnner des maitreDouvrages");
    } else {
      if (this.state.tab !== "maitreDouvrageCorebeille") {
        this.handleOpenCloseaddToCorbeilleDialog();
      }
      if (this.state.tab === "maitreDouvrageCorebeille") {
        this.state.rowsSelected.map((maitreDouvrage) => {
          this.props.undoDeleteMaitreDouvrage(maitreDouvrage);
        });
        this.setState({ rowsSelected: [] });
      }
    }
  };
  addToCorbeille = () => {
    const rowsSelected = [...this.state.rowsSelected];
    rowsSelected.map((maitreDouvrage) => {
      this.props.addToCorbeille(maitreDouvrage);
    });
    this.setState({ rowsSelected: [] });
  };

  getData = (rowsSelected) => {
    this.setState({ rowsSelected });
  };
  handleOpenCloseaddToCorbeilleDialog = () => {
    this.setState({ addToCorbeilleDialog: !this.state.addToCorbeilleDialog });
  };
  handleChangeTab = (tab) => {
    switch (tab) {
      case "maitreDouvrages":
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
         
          tab: "maitreDouvrages",
        });

        break;

      case "maitreDouvrageCorebeille":
        this.setState({
          delete_button_text: "Annuler Suppression",
          rowsSelected: [],
          tab: "maitreDouvrageCorebeille",
        });

        break;

     

      default:
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
          tab: "maitreDouvrages",
        });
        break;
    }
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
          <h2>Deleted</h2>
          <button
            onClick={() => {
              this.addToCorbeille();
              this.handleOpenCloseaddToCorbeilleDialog();
            }}
          >
            Delete
          </button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>
            Cancel
          </button>
        </Dialog>
        <div className="sous-nav-container">
          <NavLink
            onClick={this.props.getAllMaitreDouvrage}
            to="/maitre_douvrage"
          >
            <button className="btn btn-nav">Actualisé</button>
          </NavLink>

          <NavLink to="/maitre_douvrage/ajouter">
            <button className="btn btn-nav">Ajouter</button>
          </NavLink>

          <button className="btn btn-nav" onClick={this.Supprimer}>
            {this.state.delete_button_text}
          </button>
        </div>

        <Route
          path="/maitre_douvrage/modifier/:id"
          component={ModifierMaitreDouvrage}
        />

        <Route
          path="/maitre_douvrage/ajouter"
          component={AjouterMaitreDouvrage}
        />

        <Tabs>
          <Tab
            index={0}
            title="Tous les Maitre d'ouvrage"
            onClick={() => this.handleChangeTab("maitreDouvrages")}
          >
            <MaitreDouvrageTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.maitreDouvrages}
            />
          </Tab>
          <Tab
            index={1}
            title="Corbeille"
            onClick={() => this.handleChangeTab("maitreDouvrageCorebeille")}
           
          >
            <MaitreDouvrageTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.maitreDouvrageCorebeille}
              type={"corbeille"}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => ({
  getAllMaitreDouvrage: () => dispatch(getAllMaitreDouvrage()),
  addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  undoDeleteMaitreDouvrage :  (id) => dispatch(undoDeleteMaitreDouvrage(id)),
});
const mapStateToProps = (state) => ({
  maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
  loading: state.maitre_douvrage.loading,
});

export default connect(mapStateToProps, mapActionToProps)(MaitreDouvrage);
