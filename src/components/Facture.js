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
  getAllFacture,
  addToCorbeille,
  undoDeleteFacture,
} from "../store/actions/factureAction";
import { connect } from "react-redux";

import ProjetTable from "./tables/ProjetTable";
import AjouterFacture from "./ajouter/AjouterFacture";
import FactureTable from "./tables/FactureTable";
import PrintFacture from "./print/PrintFacture";




class Facture extends Component {
    state = {
        delete_button_text: "Supprimer",
        factures: [],
        factureCorebeille: [],
        rowsSelected: [],
        tab: "factures",
        addToCorbeilleDialog: false,
      };
      componentDidMount() {
        this.props.getAllFacture();
      }
      componentWillReceiveProps(nextProps) {
        
        if (nextProps.factures) {
          const factureCorebeille = [];
          const factures = [];
          let facturesCounter = 1 ;
          let  factureCorebeilleCounter = 1;
          nextProps.factures.map((facture) => {
            if (facture.status === "undo") {
              factures.push({number : facturesCounter ,...facture});
              facturesCounter++;
            }
    
            if (facture.status === "corbeille") {
              factureCorebeille.push({number : factureCorebeilleCounter,...facture});
              factureCorebeilleCounter++;
            }
          });
         
    
          this.setState({ factureCorebeille, factures });
        }
      }
    
    
      handleChangeTab = (tab) => {
        switch (tab) {
          case "factures":
            this.setState({
              delete_button_text: "Supprimer",
              rowsSelected: [],
             
              tab: "factures",
            });
    
            break;
    
          case "factureCorebeille":
            this.setState({
              delete_button_text: "Annuler Suppression",
              rowsSelected: [],
              tab: "factureCorebeille",
            });
    
            break;
    
         
    
          default:
            this.setState({
              delete_button_text: "Supprimer",
              rowsSelected: [],
              tab: "factures",
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
          if (this.state.tab !== "factureCorebeille") {
            this.handleOpenCloseaddToCorbeilleDialog();
          }
          if (this.state.tab === "factureCorebeille") {
            this.state.rowsSelected.map((facture) => {
              this.props.undoDeleteFacture(facture);
            });
            this.setState({ rowsSelected: [] });
          }
        }
      };
      addToCorbeille = () => {
        const rowsSelected = [...this.state.rowsSelected];
        rowsSelected.map((facture) => {
          this.props.addToCorbeille(facture);
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
              <NavLink onClick={this.props.getAllFacture} to="/facture">
                <button className="btn btn-nav">Actualisé</button>
              </NavLink>
    
              <NavLink to="/facture/ajouter/facture">
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
            <Route path="/facture/ajouter/:buttonReturn" component={AjouterFacture} />
            <Route   path="/facture/print/:id/:buttonReturn" component={PrintFacture} />
    
    
            <Tabs>
              <Tab
                index={0}
                title="Tous les factures"
                onClick={() => this.handleChangeTab("factures")}
              >
                <FactureTable
                  checkBoxColumn
                  IconsColumn
                  rowsSelected={this.state.rowsSelected}
                  sendData={this.getData}
                  rows={this.state.factures}
                />
              </Tab>
            
    
              <Tab
                index={1}
                title="Corbeille"
                onClick={() => this.handleChangeTab("factureCorebeille")}      
              >
                <FactureTable
                  checkBoxColumn
                  IconsColumn
                  rowsSelected={this.state.rowsSelected}
                  sendData={this.getData}
                  rows={this.state.factureCorebeille}
                  type={"corbeille"}
                />
              </Tab>
            </Tabs>
    
           </div>
        );
      }
}

const mapActionToProps = (dispatch) => ({
  getAllFacture: () => dispatch(getAllFacture()),
    addToCorbeille: (id) => dispatch(addToCorbeille(id)),
    undoDeleteFacture: (id) => dispatch(undoDeleteFacture(id)),
  });
  const mapStateToProps = (state) => ({
    factures: state.facture.factures,
    loading: state.facture.loading,
  });
  export default connect(mapStateToProps, mapActionToProps)(Facture);
  