import React, { Component, Fragment } from "react";


//utils
import { round } from "../../utils/methods";

import ReactTable from "react-table";
import "react-table/react-table.css";

//Mui
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Dialog, Checkbox, Grid, DialogActions } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import MuiSelect from "@material-ui/core/Select";

//redux
import { connect } from "react-redux";

import {
  ajouterPaiement,
  removePaiementAdded,
} from "../../store/actions/factureAction";

//utils
import { getCurrentDateTime } from "../../utils/methods";

//icons

import SearchIcon from "@material-ui/icons/Search";

import LoadingComponent from "../../utils/loadingComponent";

class EtatDuFactureTable extends Component {
  state = {
    facture: null,

    paye: 0,
    unite_paye: "%",

    ajouterPaiement: false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.paiementAdded) {
      this.props.removePaiementAdded();
      this.handleOpenCloseAjouterPaiementDialog();
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  ajouter_paiement = (facture) => {
    this.setState({ facture });
    //popup
    this.handleOpenCloseAjouterPaiementDialog();
  };
  handleOpenCloseAjouterPaiementDialog = () => {
    this.setState({ ajouterPaiement: !this.state.ajouterPaiement });
  };
  ajouterPaiement = () => {
    const d = { ...this.state };

    const data = {
      facture_id: d.facture.id,
      paye: this.calculPaye(
        d.facture.prix_totale,
        d.facture.tva,
        d.facture.remise,
        d.paye,
        d.unite_paye
      ),
      date_paye: getCurrentDateTime(new Date().getTime()),
    };

    this.props.ajouterPaiement(data);
  };
  calculPaye = (total_net, tva, remise, paye, unite_paye) => {
    if (unite_paye === "%") {
      const result_paye = parseFloat(
        ((total_net +
          parseFloat(
            (tva * (total_net + parseFloat((tva * total_net) / 100))) / 100
          ) -
          remise) *
          paye) /
          100
      );
      return result_paye;
    } else {
      const result_paye = paye;
      return result_paye;
    }
  };

  isPaye = (paye, total_net, tva, remise) => {
    return paye >= (total_net * tva) / 100 + total_net - remise;
  };

  calculImpaye = (total_net, tva, remise, paye) => {
    return round(
      parseFloat((total_net * tva) / 100) + total_net - remise - paye
    );
  };
  render() {
    const columns = [
      {
        Header: "Référence du projet",
        accessor: "projet_id",
        width: 150,
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;

          return ("P-" + row[filter.id].toString()).match(regx);
        },

        Cell: (props) => (
          <div
            className={`cell ${
              this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              )
                ? "bg-green"
                : ""
            }`}
          >
            {props.value !== "undefined" ? "P-" + props.value : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-number">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="date-input-number"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Nom du projet",
        accessor: "nom",
        width: 150,
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div
            className={`cell ${
              this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              )
                ? "bg-green"
                : ""
            }`}
          >
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
        Header: "Maitre d'ouvrage Nom",
        accessor: "maitre_douvrage_nom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        width: 250,
        Cell: (props) => {
          return (
            <div
              className={`cell ${
                this.isPaye(
                  props.original.paye,
                  props.original.prix_totale,
                  props.original.tva,
                  props.original.remise
                )
                  ? "bg-green"
                  : ""
              }`}
            >
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
          <div
            className={`cell ${
              this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              )
                ? "bg-green"
                : ""
            }`}
          >
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

      {
        Header: "Payé",
        accessor: "paye",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div
            className={`cell ${
              this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              )
                ? "bg-green"
                : ""
            }`}
          >
            {props.value !== "undefined"
              ? round(Number.parseFloat(props.value)).toString()
              : ""}
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

      {
        Header: "imPayé",
        accessor: "id",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div
            className={`cell ${
              this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              )
                ? "bg-green"
                : ""
            }`}
          >
            {props.value !== "undefined"
              ? this.calculImpaye(
                  props.original.prix_totale,
                  props.original.tva,
                  props.original.remise,
                  props.original.paye
                )
              : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="impaye-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="impaye-input-rg"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },

      {
        Header: "Date de paiement",
        accessor: "date_paye",
        width: 250,
        filterMethod: (filter, row) => {
            const regx = `.*${filter.value}.*`;
            return row[filter.id].match(regx);
          },
        Cell: (props) => (
          <div  className={`cell ${
            this.isPaye(
              props.original.paye,
              props.original.prix_totale,
              props.original.tva,
              props.original.remise
            )
              ? "bg-green"
              : ""
          }`}>
            {props.value !== "undefined" ? props.value.toString().split('T')[0] : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="date-input-date_payement">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="date"
              id="date-input-date_payement"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : new Date().toDateString()}
            />
          </div>
        ),
      },
    ];

    if (this.props.IconsColumn) {
      columns.unshift({
        Header: "  ",
        accessor: "id",
        width: 150,
        sortable: false,
        filterable: false,
        Cell: (props) => {
          return (
            <div
              className={`cell ${
                this.isPaye(
                  props.original.paye,
                  props.original.prix_totale,
                  props.original.tva,
                  props.original.remise
                )
                  ? "bg-green"
                  : ""
              }`}
            >
              {this.isPaye(
                props.original.paye,
                props.original.prix_totale,
                props.original.tva,
                props.original.remise
              ) ? null : (
                <Button
                  size="small"
                  onClick={() => this.ajouter_paiement(props.original)}
                  color="primary"
                  variant="contained"
                  style={{
                    fontSize: 10,
                    textTransform: "capitalize",
                    margin: 2,
                  }}
                >
                  Ajouter un paiement
                </Button>
              )}
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
          open={this.state.ajouterPaiement}
          onClose={this.handleOpenCloseAjouterPaiementDialog}
        >
          <h3 style={{ margin: 0 }}>
            Ajouter paiement{" "}
            <small>
              <span className="red">(Unité : {this.state.unite_paye} )</span>
            </small>
          </h3>
          <br />
          <h4>
            A été payé {this.state.facture && round(this.state.facture.paye)} DA
          </h4>
          <h4>
            imPayé{" "}
            {this.state.facture &&
              this.calculImpaye(
                this.state.facture.prix_totale,
                this.state.facture.tva,
                this.state.facture.remise,
                this.state.facture.paye
              )}{" "}
            DA
          </h4>
          {this.state.unite_paye === "DA" ? (
            <TextField
              type="number"
              placeholder="Ajouter paiement"
              value={this.state.paye}
              name="paye"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
            />
          ) : (
            <TextField
              type="number"
              placeholder="Ajouter paiement"
              value={this.state.paye}
              name="paye"
              variant="outlined"
              onChange={this.handleChange}
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 1, max: 100 } }}
            />
          )}

          <MuiSelect
            value={this.state.unite_paye}
            name="unite_paye"
            onChange={this.handleChange}
          >
            <MenuItem value={"%"}>%</MenuItem>
            <MenuItem value={"DA"}>DA</MenuItem>
          </MuiSelect>
          <DialogActions>
            <Button
              onClick={this.ajouterPaiement}
              color="primary"
              variant="contained"
            >
              Ajouter
            </Button>
          </DialogActions>
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
    ajouterPaiement: (data) => dispatch(ajouterPaiement(data)),
    removePaiementAdded: () => dispatch(removePaiementAdded()),
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.facture.loading,
    paiementAdded: state.facture.paiementAdded,
  };
};
export default connect(mapStateToProps, mapActionToProps)(EtatDuFactureTable);
