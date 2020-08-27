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
import MenuItem from "@material-ui/core/MenuItem";

import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import MuiSelect from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
//icons

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
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
import PhasesProjetTable from "../tables/PhasesProjetTable";
import { FormControlLabel, Checkbox } from "@material-ui/core";

class AjouterDevis extends Component {
  state = {
    open: true,
    message: "",

    maitreDouvrageDialog: false,

    buttonReturn: "/projet/",

    nom: "",
    objet: "",
    adresse: "",
    duree_phase: 0,
    unite_remise: "%",
    remise: 0,
    prix_totale: 0,
    tva: 0,
    ht: true,
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
        message: "Devis a été ajouter",
        nom: "",
        objet: "",
        adresse: "",
        prix_totale: 0,
        unite_remise: "%",
        remise: 0,
        tva: 0,
        ht: true,
        maitreDouvrage: undefined,
        duree_phase: 0,
        phasesProjetsSelected: [],
      });
    }
    if (nextProps.phasesProjets) {
      const phasesProjets = [];
      nextProps.phasesProjets.map((phase) => {
        if (phase.status === "undo") {
          phasesProjets.push(phase);
        }
      });
      this.setState({
        phasesProjets,
      });
    }

    if (nextProps.maitreDouvrages) {
      const maitreDouvrages = [];
      nextProps.maitreDouvrages.map((maiterDouvrage) => {
        if (maiterDouvrage.status === "undo") {
          maitreDouvrages.push(maiterDouvrage);
        }
      });
      this.setState({
        maitreDouvrages,
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
          prix_totale = prix_totale + Number.parseFloat(phase.value.prix);
        });
      }

      this.setState({ duree_phase, prix_totale });
    });
  };
  ajouter = () => {
    const d = { ...this.state };
    if (d.nom.trim().length === 0) {
      this.setState({ message: "le champ nom et obligatoire *" });
      return;
    }
    if (d.maitreDouvrage === undefined) {
      this.setState({ message: "le champ Maitre d'ouvrage et obligatoire *" });
      return;
    }
    if (d.phasesProjetsSelected.length === 0) {
      this.setState({ message: "le champ Phase du projet et obligatoire *" });
      return;
    }

    if (d.unite_remise === "%" && d.remise > 100) {
      this.setState({ message: "le champ Remise et superieur de 100%" });
      return;
    }
    const remise = this.calculRemise(d.prix_totale,d.tva ,d.remise, d.unite_remise);
    const data = {
      projet_id: 0,
      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage.id,
      user_id: this.props.user.id,
      adresse: d.adresse,
      phasesProjetsSelected: [...this.state.phasesProjetsSelected],
      duree_phase: d.duree_phase,

      prix_totale: d.prix_totale,
      remise: remise,
      unite_remise: d.unite_remise,
      tva: d.tva,
      ht : d.ht,
      date_devis: getCurrentDateTime(new Date().getTime()),
    };

    this.props.ajouterDevis(data);
  };
  calculRemise = (total_net, tva,remise, unite_remise) =>{

    if(unite_remise === "%"){
      return parseFloat(remise*(total_net  + parseFloat(tva*total_net/100))/100)
    }else{

      return remise
    }

  }

  handleChange = (e) => {
    if(e.target.name === "ht"){
      this.setState({
        [e.target.name]: e.target.value === "true" ? false : true,
        tva : 0
      });
      return;
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handlePhasesProjetDureeChange = (e, index) => {
    const duree = e.target.value !== "" ? e.target.value : 0;
    const phasesProjetsSelected = [...this.state.phasesProjetsSelected];

    phasesProjetsSelected[index].duree = duree;
    this.setState({ phasesProjetsSelected }, () => {
      let duree_phase = 0;
      let prix_totale = 0;
      if (phasesProjetsSelected !== null) {
        phasesProjetsSelected.map((phase) => {
          duree_phase =
            Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
          prix_totale = prix_totale + Number.parseFloat(phase.prix);
        });
      }

      this.setState({ duree_phase, prix_totale });
    });
  };
  handlePhasesProjetPrixChange = (e, index) => {
    const prix = e.target.value !== "" ? e.target.value : 0;
    const phasesProjetsSelected = [...this.state.phasesProjetsSelected];

    phasesProjetsSelected[index].prix = prix;
    this.setState({ phasesProjetsSelected }, () => {
      let duree_phase = 0;
      let prix_totale = 0;
      if (phasesProjetsSelected !== null) {
        phasesProjetsSelected.map((phase) => {
          duree_phase =
            Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
          prix_totale = prix_totale + Number.parseFloat(phase.prix);
        });
      }

      this.setState({ duree_phase, prix_totale });
    });
  };

  closeAlert = () => {
    this.setState({
      message: "",
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

  handlePhasesProjetOpenClose = () => {
    this.setState({
      phasesProjetDialog: !this.state.phasesProjetDialog,
    });
  };

  removePhaseProjet = (index) => {
    const phasesProjetsSelected = [...this.state.phasesProjetsSelected];
    phasesProjetsSelected.splice(index, 1);
    this.setState(
      {
        phasesProjetsSelected,
      },
      () => {
        let duree_phase = 0;
        let prix_totale = 0;
        if (phasesProjetsSelected !== null) {
          phasesProjetsSelected.map((phase) => {
            duree_phase =
              Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
            prix_totale = prix_totale + Number.parseFloat(phase.prix);
          });
        }

        this.setState({ duree_phase, prix_totale });
      }
    );
  };
  getPhasesProjetData = (phasesProjet) => {
    if (phasesProjet.titre) {
      const phasesProjetsSelected = [...this.state.phasesProjetsSelected];

      phasesProjetsSelected.push(phasesProjet);
      this.setState({ phasesProjetsSelected }, () => {
        let duree_phase = 0;
        let prix_totale = 0;
        if (phasesProjetsSelected !== null) {
          phasesProjetsSelected.map((phase) => {
            duree_phase =
              Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
            prix_totale = prix_totale + Number.parseFloat(phase.prix);
          });
        }

        this.setState({ duree_phase, prix_totale });
      });
    }
  };

  render() {
    return (
      <Dialog fullScreen open={this.state.open}>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />

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
          open={this.state.maitreDouvrageDialog}
          maxWidth="lg"
          onClose={this.handleMaitreDouvrageClose}
        >
          <MaitreDouvrageTable
            sendData={this.getmaitreDouvrageeData}
            type="choose-one"
            rows={this.state.maitreDouvrages}
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

        <Dialog
          open={this.state.phasesProjetDialog}
          maxWidth="lg"
          onClose={this.handlePhasesProjetOpenClose}
        >
          <PhasesProjetTable
            type="choose-one"
            sendData={this.getPhasesProjetData}
            rows={this.state.phasesProjets}
            chooseOneColumn
          />

          <Button
            variant="contained"
            color="primary"
            onClick={this.handlePhasesProjetOpenClose}
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

          <Grid item xs={12}>
            <h3 style={{ margin: 0 }}>Phases du projet * </h3>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handlePhasesProjetOpenClose}
            >
              <AddIcon />
            </Button>
            <br />
            <Paper>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Désignation</th>

                    <th>Durée</th>
                    <th>Prix</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.phasesProjetsSelected.map(
                    (phasesProjet, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{phasesProjet.titre}</td>

                          <td>
                            <input
                              type="number"
                              value={
                                this.state.phasesProjetsSelected[index].duree
                              }
                              onChange={(e) =>
                                this.handlePhasesProjetDureeChange(e, index)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={
                                this.state.phasesProjetsSelected[index].prix
                              }
                              onChange={(e) =>
                                this.handlePhasesProjetPrixChange(e, index)
                              }
                            />
                          </td>
                          <td>
                            <Button
                              onClick={() => this.removePhaseProjet(index)}
                            >
                              <CloseIcon></CloseIcon>
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              <br />
            </Paper>

            <h3>La durée des phases : {this.state.duree_phase} (jours)</h3>
            <h3>Total net : {this.state.prix_totale} (DA)</h3>
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>
              Remise Sur le Total{" "}
              <small>
                <span className="red">
                  (Unité : {this.state.unite_remise} )
                </span>
              </small>
            </h3>
            {this.state.unite_remise === "DA" ? (
              <TextField
                type="number"
                placeholder="Remise"
                value={this.state.remise}
                name="remise"
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
              />
            ) : (
              <TextField
                type="number"
                placeholder="Remise"
                value={this.state.remise}
                name="remise"
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
              />
            )}

            <MuiSelect
              value={this.state.unite_remise}
              name="unite_remise"
              onChange={this.handleChange}
            >
              <MenuItem value={"%"}>%</MenuItem>
              <MenuItem value={"DA"}>DA</MenuItem>
            </MuiSelect>
          </Grid>

          <Grid item xs={6}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}> Hors taxes</h3>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.ht}
                      value={this.state.ht}
                      onChange={this.handleChange}
                      name="ht"
                    />
                  }
                  label=" Hors taxes"
                />
              </div>
              <div style={{ flex: 2 }}>
                <h3 style={{ margin: 0 , color : this.state.ht ? "gray" : "black" }}> TVA (%)</h3>

                <TextField
                  name="tva"
                  value={this.state.tva}
                  onChange={this.handleChange}
                  disabled={this.state.ht}
                  type="number"
                  variant="outlined"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
                />
              </div>
            </div>
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
    user: state.auth.user,
    devisCreated: state.devis.devisCreated,
    maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
    phasesProjets: state.phases_projet.phasesProjets,
  };
};
export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(AjouterDevis));
