import React, { Component } from "react";
import { withRouter } from "react-router-dom";

//MUI

//redux
import { connect } from "react-redux";
import {
  ajouterntreprise,
  getEtreprise,
} from "../../store/actions/entrepriseAction";

import LoadingComponent from "../../utils/loadingComponent";

//Mui
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

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
    nis : "",
    nif : "",
    rc : ""
  };
  componentWillMount() {
    this.props.getEtreprise();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.entreprise) {
      console.log(nextProps.entreprise);

      this.props.sendData(false);
    } else this.props.sendData(true);
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
    this.props.ajouterntreprise({
      entreprise: {
        nom: data.nom_agence,
        telephone: data.telephone,
        email: data.email,
        adresse: data.adresse,
        rc : data.rc,
        nif : data.nif,
        nis :  data.nis
      },
      user: {
        nom: data.nom,
        prenom: data.prenom,
        username: data.username,
        password: data.password,
      },
    });
  };

  render() {
    return (
      <div>
      <h1>Informations de Bureau</h1>
        <Grid container spacing={2} style={{ padding: 25 }}>
          <Grid item xs={6}>
          
          <h3 style={{ margin: 0 }}>Nom de l'agence *</h3>
            <TextField
              placeholder="Nom de l'agence *"
              error={this.state.error !== ""}
              value={this.state.nom_agence}
              name="nom_agence"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
            </Grid>
            <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Télephone *</h3>
            <TextField
              placeholder="Télephone *"
              error={this.state.error !== ""}
              value={this.state.telephone}
              name="telephone"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
            </Grid>
            <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Email *</h3>
            <TextField
              placeholder="Email * "
              value={this.state.email}
              error={this.state.error !== ""}
              name="email"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
             </Grid>
        
            <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Adresse *</h3>
            <TextField
              placeholder="Adresse *"
              error={this.state.error !== ""}
              value={this.state.adresse}
              name="adresse"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
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
              margin="normal"
            />
             </Grid>


             <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>NIS (Numéro d’Identification Statistique) </h3>
            <TextField
              placeholder="NIS (Numéro d’Identification Statistique) "
              
              value={this.state.nis}
              name="nis"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
             </Grid>

             <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>NIF ( Numéro d'Immatriculation Fiscale) </h3>
            <TextField
              placeholder="NIF ( Numéro d'Immatriculation Fiscale) "
             
              value={this.state.nif}
              name="nif"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
             </Grid>

             <h1>informations de l'utilisateur</h1>
             <Grid item xs={12}>
             <Grid container spacing={2}>
             <Grid item xs={6} >
            <h3 style={{ margin: 0 }}>Nom de l'admin</h3>
            <TextField
              placeholder="Nom de l'admin "
              value={this.state.nom}
              name="nom"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
             </Grid>
            <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Prénom de l'admin</h3>
            <TextField
              placeholder="Prénom de l'admin "
              value={this.state.prenom}
              name="prenom"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
            />
 </Grid>
            <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Nom d'utilisateur de l'admin </h3>
            <TextField
              placeholder="Nom d'utilisateur de l'admin "
              value={this.state.username}
              name="username"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="normal"
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
              margin="normal"
            />
            </Grid>
           
             </Grid>
       
         
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
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => {
  return {
    ajouterntreprise: (data) => dispatch(ajouterntreprise(data)),
    getEtreprise: () => dispatch(getEtreprise()),
  };
};
const mapStateToProps = (state) => {
  return {
    entreprise: state.entreprise.info,
    loading: state.auth.loading,
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(Entreprise));
