import React, { Component } from "react";



import { Tab, Tabs } from "react-tabs-css";

import { NavLink } from "react-router-dom";

//mui
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//util
import LoadingComponent from "../utils/loadingComponent";

import UserTable from "./tables/UserTable";

//redux

import { connect } from "react-redux";
import {
  getAllUser,
  addToCorbeille,
  undoDeleteUser,
  ajouterUser,
  removeUserCreated
} from "../store/actions/authAction";

class User extends Component {
  state = {
    delete_button_text: "Supprimer",
    users: [],
    userCorebeille: [],
    rowsSelected: [],
    tab: "users",
    addToCorbeilleDialog: false,
    ajouterDialog: false,
    user: {},
    nom :"",
    prenom  : "",
    username : "",
    password : "",
  };
  componentDidMount() {
    this.props.getAllUser();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users) {
     
      const userCorebeille = [];
      const users = [];
      let usersCounter = 1;
      let userCorebeilleCounter = 1;
      nextProps.users.map((user) => {
        if (user.status === "undo") {
          users.push({ number: usersCounter, ...user });
          usersCounter++;
        }
        if (user.status === "admin") {
          users.push({ number: usersCounter, ...user });
          usersCounter++;
        }

        if (user.status === "corbeille") {
          userCorebeille.push({ number: userCorebeilleCounter, ...user });
          userCorebeilleCounter++;
        }
      });

   

      this.setState({ userCorebeille, users });
    }

    if (nextProps.user) {
      this.setState({ user: { ...nextProps.user } });
    }

    if(nextProps.userCreated){
        this.setState({
            ajouterDialog  : false
        }, ()=>{
            this.props.removeUserCreated()
        })
    }
  }

  handleChangeTab = (tab) => {
    switch (tab) {
      case "users":
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],

          tab: "users",
        });

        break;

      case "userCorebeille":
        this.setState({
          delete_button_text: "Annuler Suppression",
          rowsSelected: [],
          tab: "userCorebeille",
        });

        break;

      default:
        this.setState({
          delete_button_text: "Supprimer",
          rowsSelected: [],
          tab: "users",
        });
        break;
    }
  };

  handleOpenCloseAjouterDialog = () => {
    this.setState({ ajouterDialog: !this.state.ajouterDialog });
  };

  handleChange = (e) =>{
      this.setState({
          [e.target.name] : e.target.value
      })
  }
  ajouter = (e) => {
      console.log(e);
      e.preventDefault()
      document.getElementById('ajouter-user-form').checkValidity()
    const d = {...this.state};
    const user = {
        nom : d.nom,
        prenom  : d.prenom,
        username : d.username,
        password : d.password
    }
    this.props.ajouterUser(user)
  }

  render() {
    return (
      <div>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />



        <Dialog
          open={this.state.addToCorbeilleDialog}
          onClose={this.handleOpenCloseaddToCorbeilleDialog}
        >
          <h2>Supprimer</h2>
          <button
            onClick={() => {
              this.addToCorbeille();
              this.handleOpenCloseaddToCorbeilleDialog();
            }}
          >
            Supprimer
          </button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>
            Cancel
          </button>
        </Dialog>

        <Dialog
          open={this.state.ajouterDialog}
          onClose={this.handleOpenCloseAjouterDialog}
          maxWidth="lg"
        >
          <h2>Ajouter</h2>
          <form  onSubmit={this.ajouter} id="ajouter-user-form">
          <span className="error" >{this.props.error}</span>
            <Grid container spacing={1} style={{ padding: 15 }}>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}>Nom * </h3>

                <TextField
                  placeholder="Nom *"
                  value={this.state.nom}
                  name="nom"
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}>Prénom * </h3>

                <TextField
                  placeholder="Prénom *"
                  value={this.state.prenom}
                  name="prenom"
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}>Nom d'utilisateur * </h3>

                <TextField
                  placeholder="Nom d'utilisateur *"
                  value={this.state.username}
                  name="username"
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}>Mot de passe * </h3>

                <TextField
                  placeholder="mot de passe "
                  value={this.state.password}
                  name="password"
                  variant="outlined"
                  onChange={this.handleChange}
                  fullWidth
                  type="password"
                  
                />
              </Grid>
              <Grid item xs={3}></Grid>

              <Grid item xs={6}>
                <Button type="submit" fullWidth color="primary" variant="contained"> Ajouter</Button>
              </Grid>
            </Grid>
          </form>
        </Dialog>

        <div className="sous-nav-container">
          <NavLink onClick={this.props.getAllUser} to="/user">
            <button className="btn btn-nav">Actualisé</button>
          </NavLink>

          {this.state.user.status === "admin" ? (
            <button
              className="btn btn-nav"
              onClick={this.handleOpenCloseAjouterDialog}
            >
              Ajouter
            </button>
          ) : null}

          {this.state.user.status === "admin" ? (
            <button className="btn btn-nav" onClick={this.Supprimer}>
              {this.state.delete_button_text}
            </button>
          ) : null}
        </div>

        <Tabs>
          <Tab
            index={0}
            title="Tous les Utilisateurs"
            onClick={() => this.handleChangeTab("users")}
          >
            <UserTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.users}
            />
          </Tab>

          <Tab
            index={1}
            title="Corbeille"
            onClick={() => this.handleChangeTab("userCorebeille")}
          >
            <UserTable
              checkBoxColumn
              IconsColumn
              rowsSelected={this.state.rowsSelected}
              sendData={this.getData}
              rows={this.state.userCorebeille}
              type={"corbeille"}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapActionToProps = (dispatch) => ({
  getAllUser: () => dispatch(getAllUser()),
  addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  undoDeleteUser: (id) => dispatch(undoDeleteUser(id)),
  ajouterUser : (user) => dispatch(ajouterUser(user)),
  removeUserCreated  : () => dispatch(removeUserCreated())
  
});
const mapStateToProps = (state) => ({
  users: state.auth.users,
  loading: state.auth.loading,
  user: state.auth.user,
  error : state.auth.error,
  userCreated :  state.auth.userCreated
});

export default connect(mapStateToProps, mapActionToProps)(User);
