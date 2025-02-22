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
import MuiSelect from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";


//icons
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import LoadingComponent from "../../utils/loadingComponent";

//redux
import { connect } from "react-redux";
import {
  getDevis,
  modifierDevis,
  removeDevisEdited,
} from "../../store/actions/devisAction";

import { getAllPhasesProjet } from "../../store/actions/pahsesProjetAction";

//tables
import MaitreDouvrageTable from "../tables/MaitreDouvrageTable";
import PhasesProjetTable from "../tables/PhasesProjetTable";
import { Checkbox, FormControlLabel } from "@material-ui/core";
class ModifierDevis extends Component {
  state = {
    open: true,
    message: "",
   
    maitreDouvrageDialog: false,
    phasesProjetDialog : false,

    buttonReturn: "devis",

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
    ht : true,
    prix_totale: 0,

    maitreDouvrages : [],
    phasesProjetsSelected: []
    
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    const buttonReturn = this.props.match.params.buttonReturn;
    
    this.setState({
      message: "",
      buttonReturn
    });
    this.props.getAllPhasesProjet()
    this.props.getDevis(id);
  }
  componentWillUnmount() {
    this.props.removeDevisEdited();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.devis) {
      this.setState({ ...nextProps.devis});
     const  phasesProjetsSelected = []
     
        let duree_phase = 0;
        let prix_totale = 0;
        
       
        this.setState({ phasesProjetsSelected : nextProps.devis.phases ?   nextProps.devis.phases :  nextProps.devis.phasesProjetsSelected}, () => {
          if (this.state.phasesProjetsSelected !== null &&  this.state.phasesProjetsSelected !== undefined) {
            this.state.phasesProjetsSelected.map((phase) => {
              duree_phase =
                Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
              prix_totale = prix_totale + Number.parseFloat(phase.prix)  ;
            });
          }
    
          this.setState({ duree_phase, prix_totale });
        });
      
    }
    if(nextProps.phasesProjets){
      this.setState({
        phasesProjets :  [...nextProps.phasesProjets].filter(item=>item.status === "undo")
      })
    }
    //maitreDouvrages
    if(nextProps.maitreDouvrages){
      this.setState({
        maitreDouvrages :  [...nextProps.maitreDouvrages].filter(item=>item.status === "undo")
      })
    }

    if (nextProps.devisEdited) {
      this.setState({
        ...nextProps.devis,
        message: "devi a été modifier",
     
      });
    }
  }

 
  modifier = () => {
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

    const data = {
      id: d.id,

      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage.id,
      adresse: d.adresse,
      phasesProjetsSelected: [...this.state.phasesProjetsSelected],
      duree_phase: d.duree_phase,
      prix_totale: d.prix_totale ,
      remise: d.remise,
      projet_id : d.projet_id,
      tva: d.tva,  
      ht :d.ht,  
      status : d.status
    };

   
    
    this.props.modifierDevis(data);
  };

  handleChange = (e) => {
    if(e.target.name === "ht"){
      this.setState({
        [e.target.name]: e.target.value === "true" ? false : true,
        tva : 0
      });
    
    }else{
      this.setState({
      [e.target.name]: e.target.value,
    });
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
  handleUniteRemiseChange = (e) =>{

    this.setState({
      unite_remise : e.target.value
    })
  }
  getPhasesProjetData = (phasesProjet) => {
    if (phasesProjet.titre) {
      const phasesProjetsSelected = [...this.state.phasesProjetsSelected];
     

      phasesProjetsSelected.push(phasesProjet);
      this.setState({ phasesProjetsSelected }  , ()=>{
        let duree_phase = 0;
        let prix_totale = 0;
     if (phasesProjetsSelected !== null) {
            phasesProjetsSelected.map((phase) => {
              duree_phase =
                Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
              prix_totale =
                prix_totale +
              Number.parseFloat(phase.prix)
            });
          }
    
          this.setState({ duree_phase, prix_totale });
       });
    }
  };

  handleUniteRemiseChange = (e) => {
    this.setState({
      unite_remise: e.target.value,
    });
  };


  handlePhasesProjetOpenClose = () => {
    this.setState({
      phasesProjetDialog: !this.state.phasesProjetDialog,
    });
  };

  removePhaseProjet = (index) =>{
   const  phasesProjetsSelected = [...this.state.phasesProjetsSelected];
   phasesProjetsSelected.splice(index,1);
   this.setState({
     phasesProjetsSelected
   }, ()=>{
    let duree_phase = 0;
    let prix_totale = 0;
 if (phasesProjetsSelected !== null) {
        phasesProjetsSelected.map((phase) => {
          duree_phase =
            Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
          prix_totale =
            prix_totale +
            Number.parseFloat(phase.prix) 
              
        });
      }

      this.setState({ duree_phase, prix_totale });
   })
  }
  closeAlert = () => {
    this.setState({
      message: "",
    });
  };
  handlePhasesProjetDureeChange = (e,index) =>{

    const duree = e.target.value !== "" ? e.target.value  : 0;
    const phasesProjetsSelected = [...this.state.phasesProjetsSelected];
  
    phasesProjetsSelected[index].duree = duree;
    this.setState({ phasesProjetsSelected }  , ()=>{
      let duree_phase = 0;
      let prix_totale = 0;
   if (phasesProjetsSelected !== null) {
          phasesProjetsSelected.map((phase) => {
            duree_phase =
              Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
            prix_totale =
              prix_totale +
              (Number.parseFloat(phase.prix));
          });
        }
  
        this.setState({ duree_phase, prix_totale });
     });
    }
    handlePhasesProjetPrixChange = (e,index) =>{
  
      const prix = e.target.value !== "" ? e.target.value  : 0;
      const phasesProjetsSelected = [...this.state.phasesProjetsSelected];
    
      phasesProjetsSelected[index].prix = prix;
      this.setState({ phasesProjetsSelected }  , ()=>{
        let duree_phase = 0;
        let prix_totale = 0;
     if (phasesProjetsSelected !== null) {
            phasesProjetsSelected.map((phase) => {
              duree_phase =
                Number.parseInt(duree_phase) + Number.parseInt(phase.duree);
              prix_totale =
                prix_totale +
                (Number.parseFloat(phase.prix));
            });
          }
    
          this.setState({ duree_phase, prix_totale });
       });
      }
 
  render() {
   
   
    return (
      <Dialog maxWidth="xl" fullWidth open={this.state.open}>
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
        <Link
              to={
              "/"  + this.state.buttonReturn 
              }
            >
              <IconButton onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </Link>


        <h1 style={{ textAlign: "center" }}>Modifier Devi</h1>
        
        <Grid container spacing={2} style={{ padding: 10 }}>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Nom * </h3>

            <TextField
              placeholder="Nom *"
              value={this.state.nom}
              name="nom"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}> Objet </h3>
            <TextField
              placeholder="Objet"
              value={this.state.objet}
              name="objet"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
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
              margin="dense"
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Maitre d’ouvrage * </h3>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleMaitreDouvrageClose}
              margin="dense"
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
              margin="dense"
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

{
  this.state.phasesProjetsSelected && 

  <tbody>{

this.state.phasesProjetsSelected.map((phasesProjet,index)=>{
 
return  (<tr key={index}>
<td>{index + 1}</td>
<td>{phasesProjet.titre}</td>
<td><input type="number" value={ this.state.phasesProjetsSelected[index].duree} onChange={(e)=>this.handlePhasesProjetDureeChange(e,index)} /></td>
<td><input type="number" value={ this.state.phasesProjetsSelected[index].prix} onChange={(e)=>this.handlePhasesProjetPrixChange(e,index)} /></td>
<td>

<Button onClick={()=>this.removePhaseProjet(index)}>
<CloseIcon></CloseIcon>
</Button>
</td>
</tr>)
})
}</tbody>
}
            
            </table>
            <br />
            </Paper>
           
            <h3>La durée des phases : {this.state.duree_phase} (jours)</h3>
            <h3>Total net : {this.state.prix_totale} (DA)</h3>
            <h3>Total TVA : {round(this.state.prix_totale * (this.state.tva) / 100)} (DA)</h3>
            <h3>Total TTC : {round(round(this.state.prix_totale * (this.state.tva) / 100)  +  this.state.prix_totale)} (DA)</h3>

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
                margin="dense"
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
                margin="dense"
              />
            )}

            <MuiSelect
              value={this.state.unite_remise}
              onChange={this.handleUniteRemiseChange}
              margin="dense"
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
                      checked={this.state.ht ? true : false}
                      value={this.state.ht ? false : true}
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
                  disabled={this.state.ht ? true : false}
                  type="number"
                  variant="outlined"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
                  margin="dense"
                />
              </div>
            </div>
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
      </Dialog>
    );
  }
}

const mapActionToProps = (dispatch) => {
  return {
    getDevis: (id) => dispatch(getDevis(id)),
    modifierDevis: (data) => dispatch(modifierDevis(data)),
    removeDevisEdited: () => dispatch(removeDevisEdited()),
    getAllPhasesProjet :() => dispatch(getAllPhasesProjet())
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.devis.loading,
    devisEdited: state.devis.devisEdited,
    devis: state.devis.devis,
    phasesProjets : state.phases_projet.phasesProjets,
    maitreDouvrages: state.maitre_douvrage.maitreDouvrages,
  };
};
export default connect(mapStateToProps, mapActionToProps)(ModifierDevis);
