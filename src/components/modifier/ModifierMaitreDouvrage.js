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
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";



//icons

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import LoadingComponent from "../../utils/loadingComponent";


//redux
import { connect } from "react-redux";
import { getMaitreDouvrage,modifierMaitreDouvrage} from '../../store/actions/maitreDouvrageAction'
 class ModifierMaitreDouvrage extends Component {
  state = {
    open: true,
    message  : "",
    nom : "",
    prenom : "",
    telephone : "",
    adresse : "",
    email : "",
    raison_social : "",
    rg : "",
    logo: "",
  };



  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getMaitreDouvrage(id)
   
  }

  componentWillReceiveProps(nextProps){

    if (nextProps.maitreDouvrage) {
        this.setState({ ...nextProps.maitreDouvrage });
      }
  }

  modifier = () =>{
      const data  = {...this.state};
      delete data.open;
      if(data.nom.trim().length  === 0){
        this.setState({message : "le Nom et obligatoire *"});
        return;
      }
      
      this.props.modifierMaitreDouvrage(data);

  }

  
 
  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    handleChange = (e) =>{
      this.setState({
          [e.target.name] : e.target.value
      })
  }
  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.toBase64(file).then((image64) => {
        const logo = image64;

        this.setState({ logo });
      });
    }
  };
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
            <Link to="/maitre_douvrage/">
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
        <div style={{ marginTop: 50, padding: 15 }}></div>
        <h1 style={{ textAlign: "center" }}>Modifier Maître d'ouvrage</h1>
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
            <h3 style={{ margin: 0 }}>Prénom </h3>
            <TextField
              placeholder="Prénom"
              value={this.state.prenom}
              name="prenom"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Raison social</h3>
            <TextField
              placeholder="Raison social"
              value={this.state.raison_social}
              name="raison_social"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Télephone</h3>
            <TextField
              placeholder="Télephone"
              value={this.state.telephone}
              name="telephone"
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
            <h3 style={{ margin: 0 }}>Email</h3>
            <TextField
              placeholder="Email"
              value={this.state.email}
              name="email"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <h3 style={{ margin: 0 }}>Numéro de rg ou agrément</h3>
            <TextField
              placeholder="Numéro de rg ou agrément"
              value={this.state.rg}
              name="rg"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <input
              type={"file"}
              accept="image/*"
              id="image_input"
              hidden

              multiple={false}
              onChange={this.handleImageChange}
            />
            <label htmlFor="image_input">
              <Button
                style={{ margin: "auto" }}
                variant="contained"
                color="primary"
                component="span"
              >
                Ajouter Logo <PhotoCameraIcon />
              </Button>
            </label>

            {this.state.logo !== "" ? (
              <img style={{ height: 100, width: 100 }} src={this.state.logo} />
            ) : null}

         
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
      getMaitreDouvrage: id => dispatch(getMaitreDouvrage(id)),
      modifierMaitreDouvrage: data => dispatch(modifierMaitreDouvrage(data)),   
    };
  };
  const mapStateToProps = state => {
    
    return {
      loading: state.maitre_douvrage.loading,
      maitreDouvrageEdited: state.maitre_douvrage.maitreDouvrageEdited,
      maitreDouvrage: state.maitre_douvrage.maitreDouvrage,
      
    };
  };
export default connect(mapStateToProps,mapActionToProps)(ModifierMaitreDouvrage);