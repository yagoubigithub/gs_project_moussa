import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

//redux
import {connect} from "react-redux";
import {connexion} from '../../store/actions/authAction'



import LoadingComponent from "../../utils/loadingComponent";
import logo from "../../utils/logo";
//Mui

import  Dialog   from '@material-ui/core/Dialog'
import Entreprise from './Etreprise';

 class Connexion extends Component {
     state = {
         openEntrepriseDialog :  true

     }
     getData = (openEntrepriseDialog)=>{        
         this.setState({openEntrepriseDialog})
     }
     componentWillReceiveProps(nextProps){
        if(nextProps.auth.user !== undefined){
            
            const { history } = this.props;
            if (history) history.push('/maitre_douvrage');
        }
    }
    handleChange=(e) =>{
        this.setState({[e.target.name] : e.target.value})
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        const  username = this.state.username ? this.state.username : "";
        const password = this.state.password ? this.state.password : "";
        this.props.connexion({ username,password});
    }
    render() {
        return (
            <div> 
              <Dialog open={this.state.openEntrepriseDialog}  fullScreen>
            <Entreprise sendData={this.getData}   />

            </Dialog>
             { !this.state.openEntrepriseDialog   && <div className="container-auth">
             <img src={logo} width="200" />
                <form onSubmit={this.handleSubmit} className="form-auth">
                    <span className="error-auth">{this.props.auth.error}</span>
                    <input className="input-auth" onChange={this.handleChange} name="username" type="text" placeholder="Username" />
                    <input className="input-auth"   onChange={this.handleChange} name="password" type="password" placeholder="Mot de passe" />
                    <input type="submit" className="button-auth" value="Connexion"/>
                    
                </form>  
                 
            </div>}
         
            <LoadingComponent loading={this.props.loading !== undefined ? this.props.loading : false} />
            </div>
        )
    }

}
const mapActionToProps = dispatch =>{
    return {
        connexion  : (data) => dispatch(connexion(data))
    }
}
const mapStateToProps = state =>{
    return {
        auth : state.auth,
        loading : state.auth.loading
    }
}

export default connect(mapStateToProps,mapActionToProps)(withRouter(Connexion));

