import React, { Component } from "react";

import { Link } from "react-router-dom";

//Mui
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//icons

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";


import LoadingComponent from "../../utils/loadingComponent";


//redux
import { connect } from "react-redux";
import { getPhasesProjet,modifierPhasesProjet ,removePhasesProjetEdited} from '../../store/actions/pahsesProjetAction'
 class ModifierPhaseProjet extends Component {
  state = {
    open: true,
    error  : "",
    success : "",
   
    titre : "",
    description : "",
    duree : 0,
    prix : 0,
  };



  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({
        success :"",
        error : ""
    })
    this.props.getPhasesProjet(id)
   
  }
  componentWillUnmount(){
      this.props.removePhasesProjetEdited()
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.phasesProjet) {
        this.setState({ ...nextProps.phasesProjet });
      }

      if(nextProps.phasesProjetEdited){
          this.setState({
            ...nextProps.phasesProjet,
            success :"Phase de projet a été modifier",
            error : null,
          })
      }

  }

  modifier = () =>{
      const data  = {...this.state};
      delete data.open;
      if(data.titre.trim().length  === 0){
        this.setState({error : "le Désignation et obligatoire"});
        return;
      }
      
      this.props.modifierPhasesProjet(data);

  }

  
 
 
    handleChange = (e) =>{
      this.setState({
          [e.target.name] : e.target.value
      })
  }
  
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
        <div style={{ marginTop: 50, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Modifier Phase du projet</h1>
        <div className="alert error">{this.state.error} </div>
        <div className="alert success">{this.state.success} </div>
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
              onClick={this.modifier}
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
      getPhasesProjet: id => dispatch(getPhasesProjet(id)),
      modifierPhasesProjet: data => dispatch(modifierPhasesProjet(data)),   
      removePhasesProjetEdited : () => dispatch(removePhasesProjetEdited())
    };
  };
  const mapStateToProps = state => {
    
    return {
      loading: state.phases_projet.loading,
      phasesProjetEdited: state.phases_projet.phasesProjetEdited,
      phasesProjet: state.phases_projet.phasesProjet,
      
    };
  };
export default connect(mapStateToProps,mapActionToProps)(ModifierPhaseProjet);