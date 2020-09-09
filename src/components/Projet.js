import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//mui
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

//util
import LoadingComponent from "../utils/loadingComponent";

//redux
import {
  getAllProjet,
  addToCorbeilleMultiple,
  undoDeleteProjetMultiple,
  
} from "../store/actions/projetAction";
import { connect } from "react-redux";
import AjouterProjet from "./ajouter/AjouterProjet";
import ProjetTable from "./tables/ProjetTable";
import ModifierProjet from "./modifier/ModiferProjet";

class Projet extends Component {
  state = {
    delete_button_text: "Suprimer",
    projets: [],
    projetCorebeille: [],
    rowsSelected: [],
    tab: "projets",
    addToCorbeilleDialog: false,
    message : ""
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
          projets.push({number : projet.id,...projet});
         
        }

        if (projet.status === "corbeille") {
          projetCorebeille.push({number : projet.id,...projet});
         
        }
      });
      projetCorebeille.sort((a,b )=> parseInt(a.id) -  parseInt(b.id))
      projets.sort((a,b )=> parseInt(a.id) -  parseInt(b.id))
      projets.reverse();
      projetCorebeille.reverse()
     

      this.setState({ projetCorebeille, projets });
    }
  }


  handleChangeTab = (tab) => {
    switch (tab) {
      case "projets":
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
         
          tab: "projets",
        });

        break;

      case "projetCorebeille":
        this.setState({
          delete_button_text: "Annuler Suppression",
          rowsSelected: [],
          tab: "projetCorebeille",
        });

        break;

     

      default:
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
          tab: "projets",
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
      this.setState({message : "Selectionnner des projets"});
    } else {
      if (this.state.tab !== "projetCorebeille") {
        this.handleOpenCloseaddToCorbeilleDialog();
      }
      if (this.state.tab === "projetCorebeille") {
       
        this.props.undoDeleteProjetMultiple([...this.state.rowsSelected])
        
        this.setState({ rowsSelected: [] });
      }
    }
  };
  addToCorbeille = () => {
    const rowsSelected = [...this.state.rowsSelected];
    this.props.addToCorbeilleMultiple(rowsSelected);
   

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
        <div className="sous-nav-container">
        <h1 style={{color: "white", marginRight : 100}}>Projet</h1>
          <NavLink onClick={this.props.getAllProjet} to="/projet">
            <button className="btn ">Actualisé</button>
          </NavLink>

          <NavLink to="/projet/ajouter/projet">
            <button className="btn ">Ajouter</button>
          </NavLink>

          <button className="btn " onClick={this.Supprimer}>
            {this.state.delete_button_text}
          </button>
        </div>
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
        <Route path="/projet/ajouter/:buttonReturn" component={AjouterProjet} />

        <Route path="/projet/modifier/:buttonReturn/:id" component={ModifierProjet} />


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
              buttonReturn="projet"
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
              buttonReturn="projet"
            />
          </Tab>
        </Tabs>

       </div>
    );
  }
}
const mapActionToProps = (dispatch) => ({
  getAllProjet: () => dispatch(getAllProjet()),
  addToCorbeilleMultiple: (id) => dispatch(addToCorbeilleMultiple(id)),
  undoDeleteProjetMultiple: (id) => dispatch(undoDeleteProjetMultiple(id)),
});
const mapStateToProps = (state) => ({
  projets: state.projet.projets,
  loading: state.projet.loading,
});
export default connect(mapStateToProps, mapActionToProps)(Projet);
