import React, { Component } from 'react'
import { Grid, TextField, Button } from '@material-ui/core'



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
          this.setState({error : "le champ Nom de l'agence et obligatoire"});
          return ;
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
            <div style={{padding : 35}}>
                <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
           <LoadingComponent
          loading={
            this.props.loadingAuth !== undefined ? this.props.loadingAuth : false
          }
        />
            <Grid container >
            <span className="red">{this.state.error}</span>
                <h1>bureau d'étude Information</h1>
              <Grid item xs={12}>
              <h3 style={{margin : 0}}>Nom </h3>
                <TextField placeholder="Nom *" value={this.state.nom}  name="nom" variant="outlined" onChange={this.handleChange} fullWidth margin="normal" />
                <h3 style={{margin : 0}}>Email </h3>
                <TextField placeholder="Email" value={this.state.email} name="email" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <h3 style={{margin : 0}}>Adresse </h3>
                <TextField placeholder="Adresse" value={this.state.adresse} name="adresse" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <h3 style={{margin : 0}}>Télephone </h3>
                <TextField placeholder="Télephone" value={this.state.telephone} name="telephone" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
            
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
