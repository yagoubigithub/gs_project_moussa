import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";

import ReactTable from "react-table";
import "react-table/react-table.css";

//Mui
import IconButton from "@material-ui/core/IconButton";

import {
  Dialog,
 
  Checkbox,
} from "@material-ui/core";

//redux
import { connect } from "react-redux";
import {
  addToCorbeille,
  undoDeleteProjet

} from "../../store/actions/projetAction";

//icons

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import UndoIcon from "@material-ui/icons/Undo";
import SearchIcon from "@material-ui/icons/Search";

import LoadingComponent from "../../utils/loadingComponent";

class ProjetTable extends Component {
  state = {
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
      if(nextProps.rowsSelected.length === 0)
      this.setState({selectedAll : false})
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

  handleSelectOneChange = (maitreDouvrageSelected) => {
    this.setState({
      maitreDouvrageSelected,
    });
  };
  render() {
    const columns = [
      {
        Header: 'Référence',
        accessor: 'id',
        width : 100,
        filterMethod: (filter, row) =>
        {
          const regx =  `.*${filter.value}.*`;
         
          return ("P-"+row[filter.id].toString()).match(regx)
        },
        
        
        Cell: props =>
          (<div className="cell" >{props.value !== "undefined" ?"P-"  + props.value : ""}</div>)
          , 
          Filter: ({ filter, onChange }) =>
          <div className="searchtable-container">
          <label htmlFor="date-input-number">
            <SearchIcon className="searchtable-icon" />
          </label>
          
            <input type="text"
            id="date-input-number"
            className="searchtable-input"
           onChange={event => onChange(event.target.value)}
         
          value={filter ? filter.value : ""}/>
          </div>
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
        Header: "Objet",
        accessor: "objet",
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
            <label htmlFor="date-input-objet">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-objet"
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
        Header: "Maitre d'ouvrage Nom",
        accessor: "maitre_douvrage_nom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        width: 250,
        Cell: (props) => {
          return (
            <div className="cell">
              {props.value !== "undefined" ? props.value : ""}
            </div>
          );
        },

        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="maitre_douvrage_nom-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="maitre_douvrage_nom-input-rg"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Maitre d'ouvrage Prénom",
        accessor: "maitre_douvrage_prenom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },
        width: 250,
        Cell: (props) => (
          <div className="cell">
            {props.value !== "undefined" ? props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="maitre_douvrage_prenom-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="maitre_douvrage_prenom-input-rg"
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
                    this.props.undoDeleteProjet(props.value)
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
                  onClick={() => this.add_To_Corbeille(props.value)}
                >
                  <DeleteIcon className="red" fontSize="small"></DeleteIcon>
                </IconButton>
                <IconButton size="small">
                  <Link to={`/projet/modifier/${this.props.buttonReturn}/${props.value}`}>
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
       <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
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
            defaultPageSize={this.props.type === "choose-one" ? 5 : 5}
          />
        </div>
      </Fragment>
    );
  }
}

const mapActionToProps = (dispatch) => {
  return {
    addToCorbeille: (id) => dispatch(addToCorbeille(id)),
    undoDeleteProjet : (id) => dispatch(undoDeleteProjet(id))
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.projet.loading,
    projet: state.projet.projet,
  };
};
export default connect(mapStateToProps, mapActionToProps)(ProjetTable);
