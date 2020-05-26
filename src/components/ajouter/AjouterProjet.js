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
import CloseIcon from "@material-ui/icons/Close";

import AddIcon from "@material-ui/icons/Add";
import LoadingComponent from "../../utils/loadingComponent";

//redux
import { connect } from "react-redux";
import {
  removeProjetCreated,
  ajouterProjet,
} from "../../store/actions/projetAction";

//tables
import MaitreDouvrageTable from "../tables/MaitreDouvrageTable";
class AjouterProjet extends Component {
  state = {
    open: true,
    error: "",
    success: "",
    maitreDouvrageDialog: false,
    nom: "",
    objet: "",
    adresse: "",
    textareas: [],
    maitreDouvrages: [],
  };
  componentDidMount() {
    this.addTextArea();
  }
  componentWillUnmount(){
    this.props.removeProjetCreated()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projetCreated) {
      this.setState({
        error: "",
        success: "Projet a été ajouter",
        nom: "",
        objet: "",
        adresse: "",
        maitreDouvrage: undefined,
        textareas: [],
        
      });
      Object.keys(this.state).map((key) => {
        if (key.indexOf("textarea-") > -1) {
          this.setState({ [key]: undefined });
        }
      });
    }
  
  }

  addTextArea = () => {
    const textareas = [...this.state.textareas];
    const textarea = (
      <div key={`textarea-${textareas.length}`}>
        <IconButton onClick={() => this.removeTextArea(textareas.length)}>
          <CloseIcon />
        </IconButton>
        <textarea
          name={`textarea-${textareas.length}`}
          id={`textarea-${textareas.length}`}
          onChange={this.handleChange}
        />
      </div>
    );
    textareas.push(textarea);
    this.setState({ textareas });
  };
  removeTextArea = (index) => {
    const textareas = [...this.state.textareas];
    textareas[index - 1] = [];
    this.setState({ [`textarea-${index}`]: undefined });
    this.setState({ textareas });
  };

  handleAjouterPhasesDuProjet = () => {
    this.addTextArea();
  };
  ajouter = () => {
    const d = { ...this.state };
    if (d.nom.trim().length === 0) {
      this.setState({ error: "le champ nom et obligatoire *" });
      return;
    }
    if (d.maitreDouvrage=== undefined) {
      this.setState({ error: "le champ Maitre d'ouvrage et obligatoire *" });
      return;
    }
    const phase_du_projets = [];
    Object.keys(d).map((key) => {
      if (key.indexOf("textarea-") > -1) {
        phase_du_projets.push(d[key]);
      }
    });

    const data = {
      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage.id,
      adresse: d.adresse,
      phase_du_projets,
    };
    // this.setState({ success: "Projet a été ajouter" });
    this.props.ajouterProjet(data);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleMaitreDouvrageClose = () => {
    this.setState({
      maitreDouvrageDialog: !this.state.maitreDouvrageDialog,
    });
  };
  getmaitreDouvrageeData = (maitreDouvrage) => {
    if (maitreDouvrage.nom)
      this.setState({
        maitreDouvrage,
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

        <Dialog
          open={this.state.maitreDouvrageDialog}
          maxWidth="lg"
          onClose={this.handleMaitreDouvrageClose}
        >
          <MaitreDouvrageTable
            sendData={this.getmaitreDouvrageeData}
            type="choose-one"
            rows={this.props.maitreDouvrages}
            chooseOneColumn
          />

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleMaitreDouvrageClose}
          >
            Select
          </Button>
        </Dialog>

        <AppBar className="bg-dark">
          <Toolbar style={{ display: "flax", justifyContent: "space-between" }}>
            <Link to="/projet/">
              <IconButton onClick={this.handleClose} style={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: 50, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Ajouter Projet</h1>
        <div className="alert error">{this.state.error} </div>
        <div className="alert success">{this.state.success} </div>
        <Grid container spacing={2} style={{ padding: 25 }}>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Nom * </h3>

            <TextField
              placeholder="Nom *"
              value={this.state.nom}
              name="nom"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Objet </h3>
            <TextField
              placeholder="Objet"
              value={this.state.objet}
              name="objet"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Adresse</h3>
            <TextField
              placeholder="Adresse"
              value={this.state.adresse}
              name="adresse"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Maitre d’ouvrage * </h3>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleMaitreDouvrageClose}
            >
              <AddIcon />
            </Button>
            {this.state.maitreDouvrage !== undefined &&
            this.state.maitreDouvrage !== {} ? (
              <ul>
                <li>Nom : {this.state.maitreDouvrage.nom}</li>
                <li>Prénom : {this.state.maitreDouvrage.prenom}</li>
              </ul>
            ) : null}
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Phases du projet </h3>
            <div>{this.state.textareas}</div>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleAjouterPhasesDuProjet}
            >
              <AddIcon />
            </Button>
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

const mapActionToProps = (dispatch) => {
  return {
    ajouterProjet: (data) => dispatch(ajouterProjet(data)),
    removeProjetCreated: () => dispatch(removeProjetCreated()),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.projet.loading,
    projetCreated: state.projet.projetCreated,
    maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
  };
};
export default connect(mapStateToProps, mapActionToProps)(AjouterProjet);