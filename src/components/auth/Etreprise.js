import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

//MUI



//redux
import {connect} from "react-redux";
import {ajouterntreprise,getEtreprise} from '../../store/actions/entrepriseAction'


import LoadingComponent from "../../utils/loadingComponent";
import { Grid, TextField, Button } from '@material-ui/core';

 class Entreprise extends Component {
    state = {
        open : true,
        nom_agence : "",
        telephone :  "",
        adresse :  "",
        email : "",
        nom : "",
        password :  "",
       error : ""

    }
    componentWillMount(){
        this.props.getEtreprise();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.entreprise !== undefined){
            
           this.props.sendData(true)
        }
        this.props.sendData(false)
    }
    handleChange=(e) =>{
        this.setState({[e.target.name] : e.target.value})
    }
    ajouter = ()=>{
        const data = {...this.state};
        if(data.nom_agence === undefined || data.nom_agence.trim().length <= 0){
           this.setState({error :  "Nom de l'agence obligatoire"})
            return;
        }else{
            this.setState({error :  ""})
        }
        if(data.telephone === undefined || data.telephone.trim().length <= 0){
            this.setState({error :  "Numero Télephone obligatoire"})
            return;
        }else{
            this.setState({error :  ""})
        }
        if(data.email === undefined || data.email.trim().length <= 0){
            this.setState({error :  "Email obligatoire"})
            return;
        }else{
            this.setState({error :  ""})
        }
        if(data.adresse === undefined || data.adresse.trim().length <= 0){
            this.setState({error :  "Adresse obligatoire"})
            return;
        }else{
            this.setState({error :  ""})
        }
        this.props.ajouterntreprise({entreprise : {nom : data.nom_agence, telephone : data.telephone,email : data.email,adresse : data.adresse }
        ,user  : {username : data.nom, password : data.password}})
       

      
    }
    
    render() {
        return (
            
              <div>
            <Grid container >
                <Grid item xs={2}></Grid>
              <Grid item xs={6}>
              <h1>Agence Information</h1>
                <TextField
                 placeholder="Nom de l'agence *"
                 error={this.state.error !== ""}
                
                  value={this.state.nom_agence}  name="nom_agence" variant="outlined" onChange={this.handleChange} fullWidth margin="normal" />
                <TextField placeholder="Télephone *"
                error={this.state.error !== ""}
                 value={this.state.telephone} name="telephone" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <TextField
                
                 placeholder="Email * "
                 value={this.state.email}
                 error={this.state.error !== ""}
                  name="email" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <TextField placeholder="Adresse *"  error={this.state.error !== ""} value={this.state.adresse} name="adresse" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <TextField placeholder="Nom de l'admin "  value={this.state.nom} name="nom" variant="outlined"  onChange={this.handleChange} fullWidth margin="normal" />
                <TextField placeholder="Mot de passe  " value={this.state.password} name="password" variant="outlined"  onChange={this.handleChange} type="password" fullWidth margin="normal" />
                
               
                <br />
                <Button variant="contained" color="primary" size="large" onClick={this.ajouter} >Enregistrer</Button>
                <br />
              </Grid>
             
             
            </Grid>
          
                <LoadingComponent loading={this.props.loading !== undefined ? this.props.loading : false} />
            </div>
        )
    }
}
const mapActionToProps = dispatch =>{
    return {
        ajouterntreprise  : (data) => dispatch(ajouterntreprise(data)),
        getEtreprise :  ()=>dispatch(getEtreprise())
    }
}
const mapStateToProps = state =>{
    return {
        entreprise : state.entreprise.info,
        loading : state.auth.loading
    }
}

export default connect(mapStateToProps,mapActionToProps)(withRouter(Entreprise));













