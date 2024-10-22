import React, { Component } from "react";

import { Route } from "react-router-dom";

import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//mui
import Dialog from '@material-ui/core/Dialog'
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
//util
import LoadingComponent from "../utils/loadingComponent";

//redux
import {
  getAllFacture,
  addToCorbeille,
  undoDeleteFacture,
  addToCorbeilleMultiple,
  undoDeleteFactureMultiple
} from "../store/actions/factureAction";
import { connect } from "react-redux";


import AjouterFacture from "./ajouter/AjouterFacture";
import FactureTable from "./tables/FactureTable";
import PrintFacture from "./print/PrintFacture";
import ModifierFacture from "./modifier/ModifierFacture";




class Facture extends Component {
    state = {
        delete_button_text: "Supprimer",
        factures: [],
        factureCorebeille: [],
        rowsSelected: [],
        tab: "factures",
        addToCorbeilleDialog: false,
        message : ""
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
         

       


          factureCorebeille.sort((a,b )=> parseInt(a.id) -  parseInt(b.id))
          factures.sort((a,b )=> parseInt(a.id) -  parseInt(b.id))
          factures.reverse();
          factureCorebeille.reverse()
    
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
          this.setState({message : "Selectionnner des devis"});
        } else {
          if (this.state.tab !== "factureCorebeille") {
            this.handleOpenCloseaddToCorbeilleDialog();
          }
          if (this.state.tab === "factureCorebeille") {
            this.props.undoDeleteFactureMultiple({factures : [...this.state.rowsSelected] });
            this.setState({ rowsSelected: [] });
          }
        }
      };
      addToCorbeille = () => {
        const rowsSelected = [...this.state.rowsSelected];
        this.props.addToCorbeilleMultiple({factures : rowsSelected });
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
            <h1 style={{color: "white", marginRight : 100}}>Facture</h1>
              <NavLink onClick={this.props.getAllFacture} to="/facture">
                <button className="btn">Actualisé</button>
              </NavLink>
    
              <NavLink to="/facture/ajouter/facture">
                <button className="btn">Ajouter</button>
              </NavLink>
    
              <button className="btn" onClick={this.Supprimer}>
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
          
            <Route path="/facture/ajouter/:buttonReturn" component={AjouterFacture} />
            <Route   path="/facture/print/:id/:buttonReturn" component={PrintFacture} />
            <Route path="/facture/modifier/:id/:buttonReturn" component={ModifierFacture} />
    
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
    undoDeleteFactureMultiple: (data) => dispatch(undoDeleteFactureMultiple(data)),
    addToCorbeilleMultiple: (data) => dispatch(addToCorbeilleMultiple(data)),
  });
  const mapStateToProps = (state) => ({
    factures: state.facture.factures,
    loading: state.facture.loading,
  });
  export default connect(mapStateToProps, mapActionToProps)(Facture);
  