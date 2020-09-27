import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//MUI

//redux
import { connect } from "react-redux";
import {
  ajouterntreprise,
  getEtreprise,
  removeEntrepriseError
} from "../../store/actions/entrepriseAction";

import LoadingComponent from "../../utils/loadingComponent";

//Mui
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

class Entreprise extends Component {
  state = {
    open: true,
    nom_agence: "",
    telephone: "",
    adresse: "",
    email: "",
    nom: "",
    password: "",
    prenom: "",
    username: "",
    error: "",
    nis: "",
    nif: "",
    rc: "",
    na : "",
    key : ""
  };
  componentWillMount() {
    this.props.getEtreprise();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.entreprise) {
    

      this.props.sendData(false);
    } else this.props.sendData(true);

    if(nextProps.error ){

      if(this.state.error !== nextProps.error){
         console.log(nextProps.error)
      this.setState({
       error : nextProps.error 
      })
      }
      
     
    }
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  ajouter = () => {
    const data = { ...this.state };
    if (data.nom_agence === undefined || data.nom_agence.trim().length <= 0) {
      this.setState({ error: "Nom de l'agence obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.telephone === undefined || data.telephone.trim().length <= 0) {
      this.setState({ error: "Numero Télephone obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.email === undefined || data.email.trim().length <= 0) {
      this.setState({ error: "Email obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.adresse === undefined || data.adresse.trim().length <= 0) {
      this.setState({ error: "Adresse obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.username === undefined || data.username.trim().length <= 0) {
      this.setState({ error: "Nom d'utilisateur de l'admin   obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.nom === undefined || data.nom.trim().length <= 0) {
      this.setState({ error: "Nom de l'admin   obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.prenom === undefined || data.prenom.trim().length <= 0) {
      this.setState({ error: "prénom de l'admin   obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.key === undefined || data.key.trim().length <= 0) {
      this.setState({ error: "clé de licence obligatoire" });
      return;
    } else {
      this.setState({ error: "" });
    }
    this.props.ajouterntreprise({
      key : data.key,
      entreprise: {
        nom: data.nom_agence,
        telephone: data.telephone,
        email: data.email,
        adresse: data.adresse,
        rc: data.rc,
        nif: data.nif,
        nis: data.nis,
        na : data.na,
      },
      user: {
        nom: data.nom,
        prenom: data.prenom,
        username: data.username,
        password: data.password,
      },
    });
  };

  closeAlert = () => {
    this.props.removeEntrepriseError()
   this.setState({
     error : ""
   })
   
  };
  render() {
    return (
      <div style={{ backgroundColor: "#f2f2f2", padding : 15 }}>
 <LoadingComponent loading={this.props.loading !== undefined ? this.props.loading : false} />
<Dialog open={this.state.error !== "" && this.state.error !== null} onClose={this.closeAlert}>
          <DialogContent>
            <p>{this.state.error}</p>
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
      <Paper>
        <Grid container spacing={2}  style={{padding : 10}}>
       
          <Grid item xs={12}>
            <h1>Informations de Bureau</h1>
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Nom de l'agence *</h3>
            <TextField
              placeholder="Nom de l'agence *"
              
              value={this.state.nom_agence}
              name="nom_agence"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Télephone *</h3>
            <TextField
              placeholder="Télephone *"
              
              value={this.state.telephone}
              name="telephone"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Email *</h3>
            <TextField
              placeholder="Email * "
              value={this.state.email}
              
              name="email"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Adresse *</h3>
            <TextField
              placeholder="Adresse *"
              
              value={this.state.adresse}
              name="adresse"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>NA (numéro d'agrément) </h3>
            <TextField
              placeholder="NA (numéro d'agrément) "
              value={this.state.na}
              name="na"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>RC (Numero du registre de commerce) </h3>
            <TextField
              placeholder="RC (Numero du registre de commerce) "
              value={this.state.rc}
              name="rc"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>
              NIS (Numéro d’Identification Statistique){" "}
            </h3>
            <TextField
              placeholder="NIS (Numéro d’Identification Statistique) "
              value={this.state.nis}
              name="nis"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>
              NIF ( Numéro d'Immatriculation Fiscale){" "}
            </h3>
            <TextField
              placeholder="NIF ( Numéro d'Immatriculation Fiscale) "
              value={this.state.nif}
              name="nif"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
        
          <Grid item xs={12}>
            <Paper>
              <Grid item xs={12}>
                <h1>Informations de l'utilisateur</h1>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <h3 style={{ margin: 0 }}>Nom de l'admin *</h3>
                    <TextField
                      placeholder="Nom de l'admin *"
                      value={this.state.nom}
                      name="nom"
                      variant="outlined"
                      onChange={this.handleChange}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h3 style={{ margin: 0 }}>Prénom de l'admin *</h3>
                    <TextField
                      placeholder="Prénom de l'admin *"
                      value={this.state.prenom}
                      name="prenom"
                      variant="outlined"
                      onChange={this.handleChange}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h3 style={{ margin: 0 }}>Nom d'utilisateur de l'admin *</h3>
                    <TextField
                      placeholder="Nom d'utilisateur de l'admin *"
                      value={this.state.username}
                      name="username"
                      variant="outlined"
                      onChange={this.handleChange}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h3 style={{ margin: 0 }}>Mot de passe </h3>
                    <TextField
                      placeholder="Mot de passe  "
                      value={this.state.password}
                      name="password"
                      variant="outlined"
                      onChange={this.handleChange}
                      type="password"
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
         
         <Grid item xs={12}>

  <Paper>
              <Grid item xs={12}>
                <h1>clé de licence</h1>
              </Grid>
              <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      placeholder="XXXXXXXXXXXXXXX "
                      value={this.state.key}
                      name="key"
                      variant="outlined"
                      onChange={this.handleChange}
                      fullWidth
                      margin="dense"
                    />
                  </Grid>
                  </Grid>

              </Paper>
         </Grid>
         
         <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.ajouter}
            >
              Enregistrer
            </Button>
          </Grid>
        </Grid>

        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        </Paper>
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => {
  return {
    ajouterntreprise: (data) => dispatch(ajouterntreprise(data)),
    getEtreprise: () => dispatch(getEtreprise()),
    removeEntrepriseError: () => dispatch(removeEntrepriseError()),
  };
};
const mapStateToProps = (state) => {
  return {
    entreprise: state.entreprise.info,
    loading: state.auth.loading || state.entreprise.loading,
    error : state.entreprise.error
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(Entreprise));
