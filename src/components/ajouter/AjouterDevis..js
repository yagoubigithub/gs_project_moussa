import React, { Component } from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

//utils
import { getCurrentDateTime } from "../../utils/methods";

//Mui
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";

//icons

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CloseIcon from "@material-ui/icons/Close";

import AddIcon from "@material-ui/icons/Add";
import LoadingComponent from "../../utils/loadingComponent";

//redux
import { connect } from "react-redux";
import {
  removeDevisCreated,
  ajouterDevis,
} from "../../store/actions/devisAction";

import { getAllPhasesProjet } from "../../store/actions/pahsesProjetAction";

//tables
import MaitreDouvrageTable from "../tables/MaitreDouvrageTable";

class AjouterProjet extends Component {
  state = {
    open: true,
    error: "",
    success: "",
    maitreDouvrageDialog: false,

    buttonReturn: "/projet/",

    nom: "",
    objet: "",
    adresse: "",
    duree_phase: 0,
    remise :0,

    prix_totale: 0,

    maitreDouvrages: [],
    phasesProjetsSelected: [],
  };
  componentDidMount() {
    this.props.getAllPhasesProjet();
    const buttonReturn = "/" + this.props.match.params.buttonReturn + "/";
    this.setState({ buttonReturn });
  }
  componentWillUnmount() {
    this.props.removeDevisCreated();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.devisCreated) {
      this.setState({
        error : "",
        success : "Devis a été ajouter",
        nom : "",
        objet : "",
        adresse : "",
        prix_totale : 0,
        remise :0,
        maitreDouvrage : undefined,
        duree_phase : 0,
        phasesProjetsSelected : [],
      });
    }
    if (nextProps.phasesProjets) {
      this.setState({
        phasesProjets: nextProps.phasesProjets,
      });
    }
  }

  handleSelectChange = (phasesProjetsSelected) => {
    let duree_phase = 0;
    let prix_totale = 0;
    this.setState({ phasesProjetsSelected }, () => {
      if (phasesProjetsSelected !== null) {
        phasesProjetsSelected.map((phase) => {
          duree_phase =
            Number.parseInt(duree_phase) + Number.parseInt(phase.value.duree);
          prix_totale = prix_totale + Number.parseInt(phase.value.prix);
        });
      }

      this.setState({ duree_phase, prix_totale });
    });
  };
  ajouter = () => {
    const d = { ...this.state };
    if (d.nom.trim().length === 0) {
      this.setState({ error: "le champ nom et obligatoire *" });
      return;
    }
    if (d.maitreDouvrage === undefined) {
      this.setState({ error: "le champ Maitre d'ouvrage et obligatoire *" });
      return;
    }
    if (d.phasesProjetsSelected.length === 0) {
      this.setState({ error: "le champ Phase du projet et obligatoire *" });
      return;
    }

    const data = {
      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage.id,
      adresse: d.adresse,
      phasesProjetsSelected: [...this.state.phasesProjetsSelected],
      duree_phase: d.duree_phase,
     
      prix_totale : d.prix_totale - d.remise,
      remise : d.remise,
      date_devis : getCurrentDateTime(new Date().getTime())
    };

    this.props.ajouterDevis(data);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "date_debut") {
      this.calculDateDepotWithDateDebut(
        e.target.value !== ""
          ? e.target.value
          : getCurrentDateTime(new Date().getTime()).split("T")[0]
      );
    }
    if (e.target.name === "delais") {
      console.log(e.target.value);
      this.calculDateDepotWithDelais(
        e.target.value !== "" ? e.target.value : 0
      );
    }
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
    const options = [];
    if (this.state.phasesProjets) {
      this.state.phasesProjets.map((phase) => {
        options.push({
          value: { ...phase },
          label: phase.titre,
          className: "react-select-option",
        });
      });
    }

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
            <Link
              to={
                this.state.buttonReturn !== undefined
                  ? this.state.buttonReturn
                  : "/projet/"
              }
            >
              <IconButton onClick={this.handleClose} style={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: 50, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Créer une Devis</h1>
        <div className="alert error">{this.state.error} </div>
        <div className="alert success">{this.state.success} </div>
        <Grid container spacing={2} style={{ padding: 25 }}>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Nom de projet * </h3>

            <TextField
              placeholder="Nom de projet *"
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
            <h3 style={{ margin: 0 }}>Adresse </h3>
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
            <Select
              onChange={this.handleSelectChange}
              getOptionValue={(option) => option.value.id}
              classNamePrefix="react-select"
              value={this.state.phasesProjetsSelected}
              options={options}
              fullWidth
              isMulti
            />

            <h3>La durée des phases : {this.state.duree_phase} (jours)</h3>
            <h3>Prix Totale : {this.state.prix_totale} (DA)</h3>
            <h3>Prix a Payer : {this.state.prix_totale - this.state.remise} (DA)</h3>
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Remise Sur le Totale</h3>
            <TextField
              type="number"
              placeholder="Remise"
              value={this.state.remise}
              name="remise"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
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

const mapActionToProps = (dispatch) => {
  return {
    ajouterDevis: (data) => dispatch(ajouterDevis(data)),
    removeDevisCreated: () => dispatch(removeDevisCreated()),
    getAllPhasesProjet: () => dispatch(getAllPhasesProjet()),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.devis.loading,
    devisCreated: state.devis.devisCreated,
    maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
    phasesProjets: state.phases_projet.phasesProjets,
  };
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(AjouterProjet));
