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
  getAllEtatFacture
} from "../store/actions/factureAction";
import { connect } from "react-redux";


import AjouterFacture from "./ajouter/AjouterFacture";
import FactureTable from "./tables/FactureTable";
import PrintFacture from "./print/PrintFacture";




class EtatDuFacture extends Component {
    state = {
        delete_button_text: "Supprimer",
        etat_factures: [],
        factureCorebeille: [],
        rowsSelected: [],
       
        addToCorbeilleDialog: false,
      };
      componentDidMount() {
        this.props.getAllEtatFacture();
      }
      componentWillReceiveProps(nextProps) {
        
        if (nextProps.etat_factures) {
        
            console.log(nextProps.etat_factures)
     
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
          
            </div>
    
    
            <Tabs>
              <Tab
                index={0}
                title="Tous les factures"
               
              >
                <FactureTable
                  checkBoxColumn
                  IconsColumn
                  rowsSelected={this.state.rowsSelected}
                  sendData={this.getData}
                  rows={this.state.factures}
                />
              
              </Tab>
            
    
             
            </Tabs>
    
           </div>
        );
      }
}

const mapActionToProps = (dispatch) => ({
  getAllEtatFacture: () => dispatch(getAllEtatFacture())
  });
  const mapStateToProps = (state) => ({
    etat_factures: state.facture.etat_factures,
    loading: state.facture.loading,
  });
  export default connect(mapStateToProps, mapActionToProps)(EtatDuFacture);
  