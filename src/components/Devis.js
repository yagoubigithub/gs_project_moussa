import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//mui
import Dialog from '@material-ui/core/Dialog'

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
import AjouterDevis from "./ajouter/AjouterDevis.";



class Devis extends Component {
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
          let projetsCounter = 1 ;
          let  projetCorebeilleCounter = 1;
          nextProps.projets.map((projet) => {
            if (projet.status === "undo") {
              projets.push({number : projetsCounter ,...projet});
              projetsCounter++;
            }
    
            if (projet.status === "corbeille") {
              projetCorebeille.push({number : projetCorebeilleCounter,...projet});
              projetCorebeilleCounter++;
            }
          });
         
    
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
          alert("Selectionnner des projets");
        } else {
          if (this.state.tab !== "projetCorebeille") {
            this.handleOpenCloseaddToCorbeilleDialog();
          }
          if (this.state.tab === "projetCorebeille") {
            this.state.rowsSelected.map((projet) => {
              this.props.undoDeleteProjet(projet);
            });
            this.setState({ rowsSelected: [] });
          }
        }
      };
      addToCorbeille = () => {
        const rowsSelected = [...this.state.rowsSelected];
        rowsSelected.map((projet) => {
          this.props.addToCorbeille(projet);
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
            <div className="sous-nav-container">
              <NavLink onClick={this.props.getAllProjet} to="/projet">
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
  export default connect(mapStateToProps, mapActionToProps)(Devis);
  