import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";

//Mui
import IconButton from "@material-ui/core/IconButton";

import {
  Dialog,
  Collapse,
  Grid,
  DialogContent,
  Checkbox,
} from "@material-ui/core";

//redux
import { connect } from "react-redux";
import {
  addToCorbeille,
  getMaitreDouvrage,
  getLogo,
  undoDeleteMaitreDouvrage,
} from "../../store/actions/maitreDouvrageAction";

//icons

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import UndoIcon from "@material-ui/icons/Undo";
import SearchIcon from "@material-ui/icons/Search";

import LoadingComponent from "../../utils/loadingComponent";

class MaitreDouvrageTable extends Component {
  state = {
    openGallerie: false,
    addToCorbeilleDialog: false,
    deletedId: null,
    rowsSelected: this.props.rowsSelected,
    selectedAll: false,

    maitreDouvrageSelected: {},
    selectedAll: false,
    logo: "",
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.voiture) {
      this.setState({ ...nextProps.voiture });
    }
    if (nextProps.logo) {
      this.setState({ logo: nextProps.logo });
    }
    if (nextProps.rowsSelected) {
      this.setState({ rowsSelected: nextProps.rowsSelected });
    }
    if (nextProps.rows.length !== this.props.rows.length) {
      this.setState({ selectedAll: false });
    }
  }

  componentWillUnmount() {
    switch (this.props.type) {
      case "choose-one":
        const maitreDouvrageSelected = { ...this.state.maitreDouvrageSelected };
        this.props.sendData(maitreDouvrageSelected);
        break;
      default:
        break;
    }
  }

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
  render() {
    const columns = [
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
      {
        Header: "Raison social",
        accessor: "raison_social",
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
            <label htmlFor="date-input-raison_social">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-raison_social"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Télephone",
        accessor: "telephone",
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
            <label htmlFor="date-input-telephone">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-telephone"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Adresse",
        accessor: "adresse",
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
            <label htmlFor="date-input-adresse">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-adresse"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
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
            <label htmlFor="date-input-email">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-email"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Numéro de RC ou agrément",
        accessor: "rg",
        width: 250,
        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-rg"
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
                  onClick={() =>
                    this.props.undoDeleteMaitreDouvrage(props.value)
                  }
                >
                  <UndoIcon className="black" fontSize="small"></UndoIcon>
                </IconButton>
              </div>
            );
          } else {
            return (
              <div className="cell">
                <IconButton
                  size="small"
                  onClick={() => {
                    this.handleCloseOpenGallerieVoiture();
                    this.props.getLogo(props.value);
                  }}
                >
                  <PermMediaIcon
                    className="black"
                    fontSize="small"
                  ></PermMediaIcon>
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => this.add_To_Corbeille(props.value)}
                >
                  <DeleteIcon className="red" fontSize="small"></DeleteIcon>
                </IconButton>
                <IconButton size="small">
                  <Link to={`/maitre_douvrage/modifier/${props.value}`}>
                    <EditIcon className="black" fontSize="small"></EditIcon>
                  </Link>
                </IconButton>
              </div>
            );
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
        <Dialog
          open={this.state.addToCorbeilleDialog}
          onClose={this.handleOpenCloseaddToCorbeilleDialog}
        >
          <h2>Deleted</h2>
          <button
            onClick={() => {
              this.props.addToCorbeille(this.state.deletedId);
              this.handleOpenCloseaddToCorbeilleDialog();
            }}
          >
            Delete
          </button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>
            Cancel
          </button>
        </Dialog>

        <Dialog
          scroll="paper"
          open={this.state.openGallerie}
          onClose={this.handleCloseOpenGallerieVoiture}
        >
          <DialogContent dividers={true}>
            <LoadingComponent
              loading={
                this.props.loading !== undefined ? this.props.loading : false
              }
            />
            <div>
              <Grid container>
                {this.state.logo !== "" ? (
                  <img
                    src={this.state.logo}
                    style={{ width: "100%", maxHeight: 200, height: "100%" }}
                  />
                ) : (
                  <p>No logo</p>
                )}
              </Grid>
            </div>
          </DialogContent>
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
    getLogo: (id) => dispatch(getLogo(id)),
    undoDeleteMaitreDouvrage: (id) => dispatch(undoDeleteMaitreDouvrage(id)),
    getMaitreDouvrage: (id) => dispatch(getMaitreDouvrage(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.maitre_douvrage.loading,
    maitre_douvrage: state.maitre_douvrage.maitre_douvrage,
    direname: state.maitre_douvrage.direname,
    logo: state.maitre_douvrage.logo,
  };
};
export default connect(mapStateToProps, mapActionToProps)(MaitreDouvrageTable);
