import React, { Component } from "react";

import { Link } from "react-router-dom";

//utils
import { getCurrentDateTime } from "../../utils/methods";
import { round } from "../../utils/methods";

//Mui
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import MuiSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//icons
import AddIcon from "@material-ui/icons/Add";

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import LoadingComponent from "../../utils/loadingComponent";

//redux
import { connect } from "react-redux";
import {
  getProjet,
  modifierProjet,
  removeProjetEdited,
} from "../../store/actions/projetAction";

import { getAllPhasesProjet } from "../../store/actions/pahsesProjetAction";

//tables
import MaitreDouvrageTable from "../tables/MaitreDouvrageTable";
class ModifierProjet extends Component {
  state = {
    open: true,
    error: "",
    success: "",
    maitreDouvrageDialog: false,

    buttonReturn: "projet",

    nom: "",
    objet: "",
    adresse: "",
    duree_phase: 0,
    delais: 0,
    date_debut: "",
    date_depot: "",
    prix_totale: 0,
    unite_remise: "DA",
    remise: 0,
    tva: 0,
    prix_totale: 0,

    maitreDouvrages : [],
    phasesProjetsSelected: [],
    
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    const buttonReturn = this.props.match.params.buttonReturn;
    
    this.setState({
      success: "",
      error: "",
      buttonReturn
    });
    this.props.getAllPhasesProjet()
    this.props.getProjet(id);
  }
  componentWillUnmount() {
    this.props.removeProjetEdited();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projet) {
      this.setState({ ...nextProps.projet});
     const  phasesProjetsSelected = []
      nextProps.projet.phasesProjets.map((phase) => {
        phasesProjetsSelected.push({
            value: { ...phase },
            label: phase.titre,
            className: "react-select-option",
          });
        });

        let duree_phase = 0;
        let prix_totale = 0;
        
        this.setState({ phasesProjetsSelected }, () => {
          if (phasesProjetsSelected !== null) {
            phasesProjetsSelected.map((phase) => {
              duree_phase =
                Number.parseInt(duree_phase) + Number.parseInt(phase.value.duree);
              prix_totale = prix_totale + (Number.parseFloat(phase.value.prix)  + (Number.parseFloat(phase.value.prix) * this.state.tva)/100);
            });
          }
    
          this.setState({ duree_phase, prix_totale });
        });
      
    }
    if(nextProps.phasesProjets){
      this.setState({
        phasesProjets :  [...nextProps.phasesProjets]
      })
    }

    if (nextProps.projetEdited) {
      this.setState({
        ...nextProps.projet,
        success: "projet a été modifier",
        error: null,
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
          prix_totale = prix_totale + (Number.parseFloat(phase.value.prix)  + (Number.parseFloat(phase.value.prix) * this.state.tva)/100);
        });
      }

      this.setState({ duree_phase, prix_totale });
    });
  };
  modifier = () => {
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
    if (d.unite_remise === "%" && d.remise > 100) {
      this.setState({ error: "le champ Remise et superieur de 100%" });
      return;
    }

    const data = {
      id: d.id,

      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage.id,
      adresse: d.adresse,
      phasesProjetsSelected: [...this.state.phasesProjetsSelected],
      duree_phase: d.duree_phase,
      delais: d.delais,
      date_debut: d.date_debut,
      date_depot: d.date_depot,
      prix_totale: d.prix_totale - d.remise,
      remise: d.remise,
      unite_remise: d.unite_remise,
      tva: d.tva,
      date_projet: getCurrentDateTime(new Date().getTime()),
    };

    this.props.modifierProjet(data);
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "date_debut") {
      
      this.calculDateDepotWithDateDebut(e.target.value !== "" ? e.target.value : 
      getCurrentDateTime(new Date().getTime()).split("T")[0]
      );
    }
    if (e.target.name === "delais") {
      console.log(e.target.value)
      this.calculDateDepotWithDelais(
        e.target.value !== "" ? e.target.value : 
        0
      );
    }
  };
  calculDateDepotWithDelais = (delais) => {
    const delais_milis = Number.parseInt(delais) * 24 * 60 * 60 * 1000;
    const date_debut_milis =
      this.state.date_debut === ""
        ? new Date().getTime()
        : new Date(this.state.date_debut).getTime();
    const date_depot_milis = date_debut_milis + delais_milis;
    const date_depot = getCurrentDateTime(date_depot_milis).split("T")[0];

    this.setState({ date_depot });
  };
  calculDateDepotWithDateDebut = (date_debut) => {
    const delais_milis =
      Number.parseInt(this.state.delais) * 24 * 60 * 60 * 1000;
    const date_debut_milis = new Date(date_debut).getTime();
    const date_depot_milis = date_debut_milis + delais_milis;
    const date_depot = getCurrentDateTime(date_depot_milis).split("T")[0];

    this.setState({ date_depot });
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
  handleUniteRemiseChange = (e) =>{

    this.setState({
      unite_remise : e.target.value
    })
  }

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
              "/"  + this.state.buttonReturn 
              }
            >
              <IconButton onClick={this.handleClose} style={{ color: "white" }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          </Toolbar>
        </AppBar>
        <div style={{ marginTop: 50, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Modifier Projet</h1>
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
            <h3>Total net : {this.state.prix_totale} (DA)</h3>
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>
              Remise Sur le Totale{" "}
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
                value={ round(Number.parseFloat(this.state.remise))}
                name="remise"
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
              />
            ) : (
              <TextField
                type="number"
                placeholder="Remise"
                value={ round(Number.parseFloat(this.state.remise))}
                name="remise"
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
              />
            )}

            <MuiSelect
              value={this.state.unite_remise}
              onChange={this.handleUniteRemiseChange}
            >
              <MenuItem value={"%"}>%</MenuItem>
              <MenuItem value={"DA"}>DA</MenuItem>
            </MuiSelect>
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}> TVA (%)</h3>

            <TextField
              name="tva"
              value={this.state.tva}
              onChange={this.handleChange}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}> délais de Maitre d’ouvrage (jours)</h3>

            <TextField
              name="delais"
              value={this.state.delais}
              onChange={this.handleChange}
              type="number"
              variant="outlined"
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 1 } }}
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}> date de début </h3>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              name="date_debut"
              onChange={this.handleChange}
              value={
                this.state.date_debut === ""
                  ? getCurrentDateTime(new Date().getTime()).split("T")[0]
                  : getCurrentDateTime(
                      new Date(this.state.date_debut).getTime()
                    ).split("T")[0]
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}> Date de dépôt </h3>
            <p>{this.state.date_depot}</p>
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

const mapActionToProps = (dispatch) => {
  return {
    getProjet: (id) => dispatch(getProjet(id)),
    modifierProjet: (data) => dispatch(modifierProjet(data)),
    removeProjetEdited: () => dispatch(removeProjetEdited()),
    getAllPhasesProjet :() => dispatch(getAllPhasesProjet())
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.projet.loading,
    projetEdited: state.projet.projetEdited,
    projet: state.projet.projet,
    phasesProjets : state.phases_projet.phasesProjets,
    maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
  };
};
export default connect(mapStateToProps, mapActionToProps)(ModifierProjet);
