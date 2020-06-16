import React, { Component } from 'react'

import { Link } from "react-router-dom";
import ReactDOMServer from 'react-dom/server';

//print



//Mui
import  Dialog  from '@material-ui/core/Dialog'
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import Button from "@material-ui/core/Button";


//icons

import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";



//redux
import {connect} from "react-redux"
import {getFacture, print} from "../../store/actions/factureAction"
import PageFacture from './PageFacture';

const head = [{ access : "numero", value: "N°" },
{ access : "titre", value: "Désignation" },
{ access : "qte", value: "Quantité " }
,{ access : "tva", value: "TVA" } , 
{ access : "prix", value: "Prix" }]

 class  PrintFacture extends Component {
    state = {
        open: true,
        facture : {}
      } 
      componentDidMount(){

        this.props.getFacture(this.props.match.params.id)
      }
      componentWillReceiveProps(nextProps){

        if(nextProps.facture){
            console.log(nextProps.facture)
          this.setState({
            facture : {...nextProps.facture}
          })

        }

      }

      print = () =>{
        const rows_to_print = this.calculRows()
        const pages = []
        rows_to_print.map((row,index)=>{
          pages.push({page : ReactDOMServer.renderToString(<PageFacture entreprise={this.props.entreprise} head={head} index={index}  row={row} key={index}  />)})

        
         
            })
           
           
            this.props.print({pages});
            
            
           
          

      }

      calculRows = () =>{
        const ROW_NUMBER  = 8;
        let rows_to_print = [];
        const facture = this.state.facture;
        
        let prixTotale = 0;
        let phases = [];
        if(facture !== {}){
          if(facture.phases !== undefined){
              phases = [...facture.phases];
           phases.map(p=>{
            prixTotale = prixTotale + Number.parseFloat(p.prix) ;
          })
          for (let i = 0; i < phases.length; i = i + ROW_NUMBER) {
            const r = [];
            for (let j = 0; j < ROW_NUMBER; j++) {
              
              if(phases[i + j  ] !== undefined){
                 r.push({
                   facture : facture,
                prixTotale,
                rows_to_print  : phases[i + j],
                numero : phases[ i + j  ] !== undefined ? i+j+1 : 0
              })
              }
             
              
              //  r.push(phases[i + j] );
              //  if(phases[i + j  ] !== undefined)
              //  phases[i+j].numero =  i+j+1;
            }
            rows_to_print.push(r)
         
          }
  
          }
         
         
  
      }
      return rows_to_print;
        
      }
    render() {
      const rows_to_print = this.calculRows()
    
        return (
            <Dialog fullScreen open={this.state.open} style={{backgroundColor : "gray"}}>
            <div>
                  <AppBar className="bg-dark">
          <Toolbar style={{display : "flax", justifyContent : "space-between"}}>
            <Link to={`/${this.props.match.params.buttonReturn}/`}>
              <IconButton onClick={this.handleClose}  style={{color : "white"}}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
           
            <Button
              color="primary"
              variant="contained"
            
              onClick={this.print}

            >
              <PrintIcon />
            </Button>
           

           
          </Toolbar>
        </AppBar>

        <div style={{backgroundColor :  "gray", marginTop : 70, paddingTop : 70, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto" }}>
        {
  
   
  rows_to_print.map((row,index)=>{

  

return (<PageFacture head={head} row={row} index={index} key={index} entreprise={this.props.entreprise}  />)
  })
  }
                </div>
            </div>
           </Dialog>
        )
    }
}

const mapStateToProps = state =>{
    return {
  
      facture :  state.facture.facture,
      loading :  state.facture.loading,
      entreprise : state.entreprise.info
    }
  }
  const mapActionToProps = dispatch =>{
    return {
      getFacture : (id)=>dispatch(getFacture(id)),
      print : (pages) =>dispatch(print(pages))
  
    }
  }
  export default  connect (mapStateToProps, mapActionToProps )( PrintFacture );