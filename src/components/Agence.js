import React, { Component } from 'react'

//Mui
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'


import { Tab, Tabs } from "react-tabs-css";

import LoadingComponent from "../utils/loadingComponent";

import {connect} from 'react-redux';
import {getEtreprise , modifierAgence} from './../store/actions/entrepriseAction'
import { modifier_user} from './../store/actions/authAction'

import SaveIcon from "@material-ui/icons/Save";
 class Agence extends Component {
    state = {
        nom :  "",
        adresse : "",
        telephone : "",
        email : "",
        admin_nom : "",
        old_password : "",
        new_password : "",
        error : ""
    }
    componentWillMount(){
        this.props.getEtreprise();

    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.entreprise !== undefined){
            
         this.setState({...nextProps.entreprise})
        }
        if(nextProps.user){
          this.setState({admin_nom : nextProps.user.username, password : nextProps.user.password})
        }
    }
    modifier = () =>{
   
        const data = {...this.state}
        console.log(data);
       
        if(data.nom === undefined || !data.nom.trim().length > 0){
          this.setState({error : "le champ Nom de l'agence et obligatoire * "});
          return ;
        }else {
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
        
    }   
    modifier_user = ()=>{
      const data = {...this.state}
     
     
     
      if(this.state.password !== this.state.old_password){
        this.setState({error : "Mot de passe invalid"});
          return ;
      }
      
      
          
           this.props.modifier_user(data);
      
    }
    handleChange = e => {
        this.setState({
          [e.target.name]: e.target.value
        });
      };
    render() {
        return (
            <div style={{padding : 5}}>
                <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
           <Tabs>
          <Tab
            index={0}
            title="Informations de Bureau"
          
           
          >
          <div style={{padding : 25}}>
          <h1>Informations de Bureau</h1>
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

          <Tab  index={1}
            title="Utilisateur"
           > 

<div style={{padding : 25}}>
<Grid container spacing={2}>
           

           <Grid item xs={12}>
           <h3 style={{margin : 0}}>Nom de l'admin</h3>
             <TextField placeholder="Nom de l'admin *" value={this.state.admin_nom}  name="admin_nom" variant="outlined" onChange={this.handleChange} fullWidth margin="normal" />
             <h3 style={{margin : 0}}>Mot de passe</h3>
             <TextField placeholder="mot de passe" value={this.state.old_password} name="old_password" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" type="password" />
             <h3 style={{margin : 0}}>Nouveau Mot de passe</h3>
             <TextField placeholder="Nouveau mot de passe " value={this.state.new_password} name="new_password" type="password" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
             <br />
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
          </Tabs>
     
          
          
         
            </div>
        )
    }
}
const mapActionToProps = dispatch =>{
    return {
        modifierAgence : (data)=>dispatch(modifierAgence(data)),
        modifier_user : (data)=>dispatch(modifier_user(data)),
        getEtreprise :  ()=>dispatch(getEtreprise())
    }
}
const mapStateToProps = state =>{
    return {
        entreprise : state.entreprise.info,
        loading : state.entreprise.loading,
        loadingAuth :  state.auth.loading,
        user : state.auth.user
    }
}

export default connect(mapStateToProps,mapActionToProps)(Agence);
