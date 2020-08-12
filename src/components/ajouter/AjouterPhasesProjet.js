import React, { Component } from "react";

import { Link } from "react-router-dom";

//Mui
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";


//icons

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


import LoadingComponent from "../../utils/loadingComponent";


//redux
import { connect } from "react-redux";
import {removePhasesProjetCreated,ajouterPahsesProjet} from '../../store/actions/pahsesProjetAction'
 class AjouterPhaseProjet extends Component {
  state = {
    open: true,
    message  : "",  success : "",




    titre : "",
    description : "",
    duree : 0,
    prix : 0,
   
  };


  componentWillReceiveProps(nextProps){

    if(nextProps.phasesProjetCreated){
      this.setState({
       
        message : "Phase de projet a été ajouter",

        titre : "",
        description : "",
        duree : 0,
        prix : 0,
      })
    }
  }

  ajouter = () =>{
      const data  = {...this.state};
      delete data.open;
      if(data.titre.trim().length  === 0){
        this.setState({message : "le titre et obligatoire"});
        return;
      }
      
      this.props.ajouterPahsesProjet(data);

  }

 

    handleChange = (e) =>{
      this.setState({
          [e.target.name] : e.target.value
      })
  }
  closeAlert = () => {
    this.setState({
      message: "",
    });
  };

  render() {
    return (
      <Dialog fullScreen open={this.state.open}>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        <AppBar className="bg-dark">
          <Toolbar style={{ display: "flax", justifyContent: "space-between" }}>
            <Link to="/phases_projet/">
              <IconButton onClick={this.handleClose} style={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>

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
        <div style={{ marginTop: 30, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Ajouter Une Phase du projet</h1>
      
        <Grid container spacing={2} style={{ padding: 25 }}>
          <Grid item xs={12}>
            <h3 style={{ margin: 0 }}>Désignation * </h3>

            <TextField
              placeholder="Désignation *"
              value={this.state.titre}
              name="titre"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <h3 style={{ margin: 0 }}>Description </h3>
            <TextField
              placeholder="description"
              value={this.state.description}
              name="description"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <h3 style={{ margin: 0 }}>Durée</h3>
            <TextField
              placeholder="Durée"
              value={this.state.duree}
              name="duree"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              type="number"
              InputProps={{inputProps : {min  : 0, step : 1 }}}
            />
          </Grid>
          
          <Grid item xs={12}>
            <h3 style={{ margin: 0 }}>Prix</h3>
            <TextField
              placeholder="prix"
              value={this.state.prix}
              name="prix"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              type="number"
              InputProps={{inputProps : {min  : 0, step : 1 }}}
            />
          </Grid>
     
       

          <Grid item xs={12}>
            <br />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={this.ajouter}
            >
              <SaveIcon />
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

const mapActionToProps = dispatch => {
    return {
      ajouterPahsesProjet: data => dispatch(ajouterPahsesProjet(data)),
      removePhasesProjetCreated: () => dispatch(removePhasesProjetCreated())
    };
  };
  const mapStateToProps = state => {
    
    return {
      loading: state.phases_projet.loading,
      phasesProjetCreated: state.phases_projet.phasesProjetCreated
    };
  };
export default connect(mapStateToProps,mapActionToProps)(AjouterPhaseProjet);