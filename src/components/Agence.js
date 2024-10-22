import React, { Component } from "react";

//Mui
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Tab, Tabs } from "react-tabs-css";

import LoadingComponent from "../utils/loadingComponent";

import { connect } from "react-redux";
import {
  getEtreprise,
  modifierAgence,
  _export,
  _import,
} from "./../store/actions/entrepriseAction";

import { modifier_user, getUser } from "./../store/actions/authAction";

import SaveIcon from "@material-ui/icons/Save";
class Agence extends Component {
  state = {
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    username: "",
    password: "",
    user_nom: "",
    user_prenom: "",
    user_id: 0,
    error: "",
    user_error: "",
    user_status: "undo",
  };
  componentDidMount() {
    this.props.getEtreprise();
    this.props.getUser(this.props.user.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entreprise !== undefined) {
      this.setState({ ...nextProps.entreprise });
    }
    if (nextProps.user) {
      this.setState({
        username: nextProps.user.username,
        password: nextProps.user.password,
        user_prenom: nextProps.user.prenom,
        user_id: nextProps.user.id,
        user_nom: nextProps.user.nom,
        user_status: nextProps.user.status,
      });
    }
    if (nextProps.user_2) {
      console.log(nextProps.user_2);
      this.setState({
        username: nextProps.user_2.username,
        password: nextProps.user_2.password,
        user_prenom: nextProps.user_2.prenom,
        user_id: nextProps.user_2.id,
        user_nom: nextProps.user_2.nom,
      });
    }

    if (nextProps.userEdited) {
      this.setState({
        user_error: "",
      });
    }
  }
  modifier = () => {
    const data = { ...this.state };
    console.log(data);

    if (data.nom === undefined || !data.nom.trim().length > 0) {
      this.setState({ error: "le champ Nom de l'agence et obligatoire * " });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.telephone === undefined || data.telephone.trim().length <= 0) {
      this.setState({ error: "Numero Télephone obligatoire *" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.email === undefined || data.email.trim().length <= 0) {
      this.setState({ error: "Email obligatoire *" });
      return;
    } else {
      this.setState({ error: "" });
    }
    if (data.adresse === undefined || data.adresse.trim().length <= 0) {
      this.setState({ error: "Adresse obligatoire *" });
      return;
    } else {
      this.setState({ error: "" });
    }

    this.props.modifierAgence(data);
  };
  modifier_user = () => {
    const d = { ...this.state };

    if (d.username.trim().length === 0) {
      this.setState({
        user_error: "Nom d'utilisateur est obligatoire",
      });
      return;
    }

    if (d.user_nom.trim().length === 0) {
      this.setState({
        user_error: "Le nom et le prénom sont obligatoire",
      });
      return;
    }

    if (d.user_prenom.trim().length === 0) {
      this.setState({
        user_error: "Le nom et le prénom sont obligatoire",
      });
      return;
    }

    const user = {
      id: d.id,
      admin_nom: d.user_nom,
      nom: d.user_nom,
      prenom: d.user_prenom,
      username: d.username,
      password: d.password,
    };

    this.props.modifier_user(user);
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  _export = () => {
    this.props._export();
  };
  _import = () => {
    this.props._import();
  };
  render() {
    return (
      <div>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        <LoadingComponent
          loading={
            this.props.loadingAuth !== undefined
              ? this.props.loadingAuth
              : false
          }
        />
        <div className="sous-nav-container" style={{ paddingBottom: 15 }}>
          <h1 style={{ color: "white", marginRight: 100 }}>Bureau d'étude</h1>
        </div>
        <Tabs>
          <Tab index={0} title="Informations du Bureau">
            <div style={{ padding: 25 }}>
              <h1>Informations du Bureau</h1>
              <span className="red">{this.state.error}</span>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h3 style={{ margin: 0 }}>Nom de l'agence *</h3>
                  <TextField
                    placeholder="Nom de l'agence *"
                    error={this.state.error !== ""}
                    value={this.state.nom}
                    name="nom"
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
                  <h3 style={{ margin: 0 }}>
                    NA (numéro d'agrément){" "}
                  </h3>
                  <TextField
                    placeholder="NA (numéro d'agrément) "
                    value={this.state.na}
                    name="na"
                    variant="outlined"
                    onChange={this.handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={6}>
                  <h3 style={{ margin: 0 }}>
                    RC (Numero du registre de commerce){" "}
                  </h3>
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
                    margin="normal"
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
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
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
            </div>
          </Tab>
          <Tab index={1} title="Utilisateur">
            <div style={{ padding: 25 }}>
              <Grid container spacing={2}>
                <h1>Profile</h1>
                <span className="red">{this.state.user_error}</span>

                <Grid item xs={12}>
                  <h3 style={{ margin: 0 }}>Nom *</h3>
                  <TextField
                    placeholder="Nom  *"
                    value={this.state.user_nom}
                    name="user_nom"
                    variant="outlined"
                    onChange={this.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <h3 style={{ margin: 0 }}>Prénom *</h3>
                  <TextField
                    placeholder="Prénom  *"
                    value={this.state.user_prenom}
                    name="user_prenom"
                    variant="outlined"
                    onChange={this.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <hr />
                  <h3 style={{ margin: 0 }}>Nom d'utlisateur *</h3>
                  <TextField
                    placeholder="Nom d'utlisateur  *"
                    value={this.state.username}
                    name="username"
                    variant="outlined"
                    onChange={this.handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <h3 style={{ margin: 0 }}>Mot de passe</h3>
                  <TextField
                    placeholder="mot de passe"
                    value={this.state.password}
                    name="password"
                    variant="outlined"
                    onChange={this.handleChange}
                    fullWidth
                    margin="normal"
                    type="text"
                  />

                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={this.modifier_user}
                  >
                    <SaveIcon />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Tab>

          {this.state.user_status === "admin" && (
            <Tab index={2} title="Données">
              <div style={{ padding: 25 }}>
                <h1>Données</h1>

                <Button
                  onClick={this._export}
                  style={{ margin: 15 }}
                  color="primary"
                  variant="contained"
                  margin="normal"
                >
                  Sauvgarder les données
                </Button>
                <Button
                  onClick={this._import}
                  style={{ margin: 15 }}
                  color="primary"
                  variant="contained"
                  margin="normal"
                >
                  Importer
                </Button>
              </div>
            </Tab>
          )}

          {}
        </Tabs>
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => {
  return {
    modifierAgence: (data) => dispatch(modifierAgence(data)),
    modifier_user: (data) => dispatch(modifier_user(data)),
    getEtreprise: () => dispatch(getEtreprise()),
    getUser: (id) => dispatch(getUser(id)),
    _export: () => dispatch(_export()),
    _import: () => dispatch(_import()),
  };
};
const mapStateToProps = (state) => {
  return {
    entreprise: state.entreprise.info,
    loading: state.entreprise.loading,
    loadingAuth: state.auth.loading,
    user_2: state.auth.user_2,
    user: state.auth.user,
    userEdited: state.auth.userEdited,
  };
};

export default connect(mapStateToProps, mapActionToProps)(Agence);
