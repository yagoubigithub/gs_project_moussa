import React, { Component, Fragment } from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";

//Mui
import IconButton from "@material-ui/core/IconButton";

import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//redux
import { connect } from "react-redux";
import { addToCorbeille, undoDeleteUser } from "../../store/actions/authAction";

//icons

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import UndoIcon from "@material-ui/icons/Undo";
import SearchIcon from "@material-ui/icons/Search";

import LoadingComponent from "../../utils/loadingComponent";

class UserTable extends Component {
  state = {
    addToCorbeilleDialog: false,
    deletedId: null,
    rowsSelected: this.props.rowsSelected,
    selectedAll: false,
    modfierDialog: false,
    nom: "",
    prenom: "",
    id : 0,

    username: "",
    password : ""
  };

  handleOpenCloseaddToCorbeilleDialog = () => {
    this.setState({ addToCorbeilleDialog: !this.state.addToCorbeilleDialog });
  };
  add_To_Corbeille = (id) => {
    this.setState({ deletedId: id });
    //popup
    this.handleOpenCloseaddToCorbeilleDialog();
  };
  handeleCheckCheckboxRow = (e, id) => {
    const rowsSelected = [...this.state.rowsSelected];
    if (this.checkRowIsSelected(id)) {
      //unselect
      rowsSelected.splice(
        rowsSelected.findIndex((item) => id == item),
        1
      );
    } else {
      //select
      rowsSelected.push(id);
    }

    if (rowsSelected.length === 0) this.setState({ selectedAll: false });
    this.setState({ rowsSelected }, () => {
      this.props.sendData(rowsSelected);
    });
  };
  checkRowIsSelected = (id) => {
    const rowsSelected = [...this.state.rowsSelected];
    return rowsSelected.filter((row) => row == Number.parseInt(id)).length > 0;
  };

  handleSelectAllChange = () => {
    let selectedAll = this.state.selectedAll ? false : true;
    const rowsSelected = [];
    if (selectedAll) {
      this.props.rows.map((item) => {
        rowsSelected.push(item.id);
      });
    }
    this.setState({ selectedAll, rowsSelected }, () => {
      this.props.sendData(rowsSelected);
    });
  };

  handleCloseOpenGallerieVoiture = () => {
    this.setState({ openGallerie: !this.state.openGallerie, images: [] });
  };

  handleSelectOneChange = (maitreDouvrageSelected) => {
    this.setState({
      maitreDouvrageSelected,
    });
  };

  handleOpenCloseModifierDialog = (user) => {
    this.setState(
      {
        ...user,
      },
      () => {
        console.log(this.state);
      }
    );

    this.setState({ modfierDialog: !this.state.modfierDialog });
  };

  handleChange =( e ) =>{
  
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  render() {
let passWordRender =null;
    if(this.props.user){
       passWordRender = this.state.id === this.props.user.id ?
       <Grid item xs={6}>
       <h3 style={{ margin: 0 }}>Nom * </h3>

       <TextField
         placeholder="Mot de passe *"
         value={this.state.password}
         name="password"
         variant="outlined"
         onChange={this.handleChange}
         fullWidth
         required
       />
     </Grid>
       :  <Grid item xs={6}></Grid>
    }
   
    const columns = [
      {
        Header: "N°",
        accessor: "number",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].toString().match(regx);
        },

        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-nom">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-nom"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },

      {
        Header: "Nom d'utilisateur",
        accessor: "username",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-nom">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-nom"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Nom",
        accessor: "nom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-nom">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-nom"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Prénom",
        accessor: "prenom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },
        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-prenom">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-prenom"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
    ];

    if (this.props.IconsColumn) {
      columns.unshift({
        Header: "  ",
        accessor: "id",
        width: 100,
        sortable: false,
        filterable: false,
        Cell: (props) => {
          if (this.props.type === "corbeille") {
            return (
              <div className="cell">
                <IconButton
                  size="small"
                  onClick={() => this.props.undoDeleteUser(props.value)}
                >
                  <UndoIcon className="black" fontSize="small"></UndoIcon>
                </IconButton>
              </div>
            );
          } else {
            let render = null;
            if (this.props.user.status === "admin") {
              if (props.original.status === "admin") {
                render = (
                  <div>
                    <IconButton
                      onClick={() =>
                        this.handleOpenCloseModifierDialog(props.original)
                      }
                      size="small"
                    >
                      <EditIcon className="black" fontSize="small"></EditIcon>
                    </IconButton>
                  </div>
                );
              } else {
                render = (
                  <div>
                    <IconButton
                      size="small"
                      onClick={() => this.add_To_Corbeille(props.value)}
                    >
                      <DeleteIcon className="red" fontSize="small"></DeleteIcon>
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        this.handleOpenCloseModifierDialog(props.original)
                      }
                      size="small"
                    >
                      <EditIcon className="black" fontSize="small"></EditIcon>
                    </IconButton>
                  </div>
                );
              }
            } else {
              if(this.props.user.username === props.original.username ){
              render =(   <div>
                <IconButton
                  onClick={() =>
                    this.handleOpenCloseModifierDialog(props.original)
                  }
                  size="small"
                >
                  <EditIcon className="black" fontSize="small"></EditIcon>
                </IconButton>
              </div>
            );
              }
             
            }
            return <div className="cell">{render}</div>;
          }
        },
      });
    }

    if (this.props.checkBoxColumn) {
      columns.unshift({
        Header: (
          <div
            style={{
              backgroundColor: "#E4E4E4",
              border: "1px solid rgba(0,0,0,0.45)",
            }}
          >
            <Checkbox
              key={"check-all-voiture-key"}
              id="check-all-voiture-id"
              style={{ padding: 3 }}
              checked={this.state.selectedAll}
              onChange={this.handleSelectAllChange}
              color="primary"
            />
          </div>
        ),
        sortable: false,
        filterable: false,
        accessor: "id",
        width: 50,

        Cell: (props) => (
          <div className="cell">
            <Checkbox
              value={props.value}
              key={`key-checkbox-table-voiture-${props.value}`}
              id={`id-checkbox-table-voiture-${props.value}`}
              onChange={(e) => this.handeleCheckCheckboxRow(e, props.value)}
              checked={this.checkRowIsSelected(props.value)}
              style={{ padding: 3 }}
            />
          </div>
        ),
      });
    }
    if (this.props.chooseOneColumn) {
      columns.unshift({
        Header: "  ",
        accessor: "id",
        width: 50,
        sortable: false,
        filterable: false,
        Cell: (props) => {
          return (
            <div className="cell">
              <input
                type="radio"
                name="select-voiture"
                checked={props.value === this.state.maitreDouvrageSelected.id}
                onChange={() => this.handleSelectOneChange(props.original)}
              />
            </div>
          );
        },
      });
    }

    return (
      <Fragment>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />

        {/* 
       Modfier user 

       */}
        <Dialog
          open={this.state.modfierDialog}
          onClose={this.handleOpenCloseModifierDialog}
          maxWidth="lg"
        >
          <div>
            <h2>Modifier</h2>
            <form onSubmit={this.modifier} id="modifier-user-form">
              <span className="error">{this.props.error}</span>
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
                {passWordRender}

               
                <Grid item xs={3}></Grid>

                <Grid item xs={6}>
                  <Button
                    type="submit"
                    fullWidth
                    color="primary"
                    variant="contained"
                  >
                    {" "}
                    Modfier
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Dialog>

        <Dialog
          open={this.state.addToCorbeilleDialog}
          onClose={this.handleOpenCloseaddToCorbeilleDialog}
        >
          <h2>Suprimer</h2>
          <button
            onClick={() => {
              this.props.addToCorbeille(this.state.deletedId);
              this.handleOpenCloseaddToCorbeilleDialog();
            }}
          >
            Suprimer
          </button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>
            Cancel
          </button>
        </Dialog>

        <div className="table-container">
          {/*
            recherche
            */}

          <ReactTable
            className="table"
            data={this.props.rows}
            filterable
            defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value
            }
            columns={columns}
            defaultPageSize={this.props.type === "choose-one" ? 5 : 8}
          />
        </div>
      </Fragment>
    );
  }
}

const mapActionToProps = (dispatch) => {
  return {
    addToCorbeille: (id) => dispatch(addToCorbeille(id)),
    undoDeleteUser: (id) => dispatch(undoDeleteUser(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user,
  };
};
export default connect(mapStateToProps, mapActionToProps)(UserTable);
