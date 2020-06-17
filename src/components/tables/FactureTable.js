import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";

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
  getPhasesProjetDeDevis,
  addToCorbeille,
  transformDevisAProjet,
  removeDevisTransformProjet
} from "../../store/actions/devisAction";

import {ajouterPaiement , removePaiementAdded}  from '../../store/actions/factureAction'

//utils
import { getCurrentDateTime } from "../../utils/methods";

//icons

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import SearchIcon from "@material-ui/icons/Search";
import PrintIcon from "@material-ui/icons/Print";

import LoadingComponent from "../../utils/loadingComponent";
import PrintDevis from "../print/PrintDevis";

class FactureTable extends Component {
  state = {
    addToCorbeilleDialog: false,
    transformDialog: false,
    deletedId: null,
    facture: null,
    rowsSelected: this.props.rowsSelected,
    selectedAll: false,
    devis: {
      duree_phase: 0,
      delais: 0,
      date_debut: "",
      date_depot: "",
      prix_totale: 0,
    },

    maitreDouvrageSelected: {},
    devis_phases_projets: [],
    paye: 0,
    unite_paye: "%",
    selectedAll: false,
    printDialog: false,
    ajouterPaiement: false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.rowsSelected) {
      this.setState({ rowsSelected: nextProps.rowsSelected });
    }
    if (nextProps.rows.length !== this.props.rows.length) {
      this.setState({ selectedAll: false });
    }
    if (nextProps.devis_phases_projets) {
      this.setState({
        devis_phases_projets: nextProps.devis_phases_projets,
      });
    }
    if (nextProps.devisTransformProject) {
      this.setState({
        transformDialog: false,
        devis: {
          duree_phase: 0,
          delais: 0,
          date_debut: "",
          date_depot: "",
          prix_totale: 0,
        },
      });
      this.props.removeDevisTransformProjet();
    }

    if(nextProps.paiementAdded){
      this.props.removePaiementAdded()
      this.handleOpenCloseAjouterPaiementDialog()
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
  handleOpenCloseatransformDialog = () => {
    this.setState({ transformDialog: !this.state.transformDialog });
  };
  add_To_Corbeille = (id) => {
    this.setState({ deletedId: id });
    //popup
    this.handleOpenCloseaddToCorbeilleDialog();
  };

  transform = (devis) => {
    this.props.getPhasesProjetDeDevis(devis.devis_phases_projets);
    this.setState(
      {
        devis: { ...this.state.devis, ...devis },
      },
      () => {
        this.handleOpenCloseatransformDialog();
      }
    );
  };
  ajouter = () => {
    const d = { ...this.state.devis };

    const data = {
      id: d.id,
      projet_id: d.projet_id,
      nom: d.nom,
      objet: d.objet,
      maitreDouvrage_id: d.maitreDouvrage_id,
      adresse: d.adresse,
      phasesProjetsSelected: [...d.devis_phases_projets],
      duree_phase: d.duree_phase,
      delais: d.delais,
      date_debut: d.date_debut,
      date_depot: d.date_depot,
    };

    this.props.transformDevisAProjet(data);
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
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handeleDevisChange = (e) => {
    const devis = { ...this.state.devis };
    devis[e.target.name] = e.target.value;

    if (e.target.name === "date_debut") {
      const date_debut =
        e.target.value !== ""
          ? e.target.value
          : getCurrentDateTime(new Date().getTime()).split("T")[0];

      const delais_milis = Number.parseInt(devis.delais) * 24 * 60 * 60 * 1000;
      const date_debut_milis = new Date(date_debut).getTime();
      const date_depot_milis = date_debut_milis + delais_milis;
      const date_depot = getCurrentDateTime(date_depot_milis).split("T")[0];
      devis.date_depot = date_depot;
    }
    if (e.target.name === "delais") {
      const delais = e.target.value !== "" ? e.target.value : 0;

      const delais_milis = Number.parseInt(delais) * 24 * 60 * 60 * 1000;
      const date_debut_milis =
        devis.date_debut === ""
          ? new Date().getTime()
          : new Date(devis.date_debut).getTime();
      const date_depot_milis = date_debut_milis + delais_milis;
      const date_depot = getCurrentDateTime(date_depot_milis).split("T")[0];
      devis.date_depot = date_depot;
    }
    this.setState({ devis });
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
      )
    };
   
    this.props.ajouterPaiement(data)
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

  isPaye  = (paye , total_net , tva ,remise) =>{

    return paye >= (total_net * tva /100) + total_net - remise;

  }

  render() {
    const columns = [
      {
        Header: "Référence",
        accessor: "id",
        width: 100,
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;

          return ("D-" + row[filter.id].toString()).match(regx);
        },

        Cell: (props) => (
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
            {props.value !== "undefined" ? "D-" + props.value : ""}
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
        Header: "Nom",
        accessor: "nom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
        Header: "Maitre d'ouvrage Nom",
        accessor: "maitre_douvrage_nom",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        width: 250,
        Cell: (props) => {
          return (
            <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
        Header: "Montant Net",
        accessor: "prix_totale",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return round(Number.parseFloat(row["prix_totale"]))
            .toString()
            .match(regx);
        },

        Cell: (props) => {
          return (
            <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
              {props.value !== "undefined"
                ? round(Number.parseFloat(props.original.prix_totale))
                : ""}
            </div>
          );
        },
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="remise-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="remise-input-rg"
              className="searchtable-input"
              onChange={(event) => onChange(event.target.value)}
              value={filter ? filter.value : ""}
            />
          </div>
        ),
      },
      {
        Header: "Remise",
        accessor: "remise",
        filterMethod: (filter, row) => {
          const regx = `.*${filter.value}.*`;
          return row[filter.id].match(regx);
        },

        Cell: (props) => (
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
            {props.value !== "undefined"
              ? round(Number.parseFloat(props.value)).toString()
              : ""}
          </div>
        ),
        Filter: ({ filter, onChange }) => (
          <div className="searchtable-container">
            <label htmlFor="remise-input-rg">
              <SearchIcon className="searchtable-icon" />
            </label>

            <input
              type="text"
              id="remise-input-rg"
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
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
    ];

    if (this.props.IconsColumn) {
      columns.unshift({
        Header: "  ",
        accessor: "id",
        width: 200,
        sortable: false,
        filterable: false,
        Cell: (props) => {
          if (this.props.type === "corbeille") {
            return (
              <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
              <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
                <IconButton
                  size="small"
                  onClick={() => this.add_To_Corbeille(props.value)}
                >
                  <DeleteIcon className="red" fontSize="small"></DeleteIcon>
                </IconButton>
                <IconButton size="small">
                  <Link to={`/projet/modifier/${props.value}`}>
                    <EditIcon className="black" fontSize="small"></EditIcon>
                  </Link>
                </IconButton>

                <IconButton size="small">
                  <Link to={`/facture/print/${props.value}/facture`}>
                    <PrintIcon className="black" fontSize="small"></PrintIcon>
                  </Link>
                </IconButton>

                {props.original.projet_id == 0 ? (
                  <Button
                    size="small"
                    onClick={() => this.transform(props.original)}
                    style={{ fontSize: 10, textTransform: "capitalize" }}
                    color="primary"
                    variant="contained"
                  >
                    Transformez-le en projet
                  </Button>
                ) : null}

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
          <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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
            <div className={`cell ${this.isPaye(props.original.paye,props.original.prix_totale, props.original.tva,props.original.remise) ? "bg-green" :  ""}`}>
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

        <Dialog
          maxWidth="xl"
          open={this.state.transformDialog}
          onClose={this.handleOpenCloseatransformDialog}
        >
          <h2>Transformez-le en projet</h2>

          <ul>
            <li>Nom du projet : </li>
            <li>Adresse du projet : </li>
            <li>Objet du projet : </li>
            <li>
              Maitre d'ouvrage :
              <ul>
                <li>Nom du Maitre d'ouvrage : </li>
                <li>Prénom du Maitre d'ouvrage : </li>
              </ul>
            </li>

            <li>les phases du projet </li>

            {this.props.loading ? (
              <LoadingComponent loading={true} />
            ) : (
              <ul>
                {this.state.devis_phases_projets.map((phase) => {
                  return <li key={phase.id}>{phase.titre}</li>;
                })}
              </ul>
            )}

            <Grid container>
              <Grid item xs={6}>
                <h3>
                  La durée des phases : {this.state.devis.duree_phase} (jours)
                </h3>
              </Grid>

              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}>
                  {" "}
                  délais de Maitre d’ouvrage (jours)
                </h3>

                <TextField
                  name="delais"
                  value={this.state.devis.delais}
                  onChange={this.handeleDevisChange}
                  type="number"
                  variant="outlined"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, step: 1 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}> date de début </h3>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="date"
                  name="date_debut"
                  onChange={this.handeleDevisChange}
                  value={
                    this.state.devis.date_debut === ""
                      ? getCurrentDateTime(new Date().getTime()).split("T")[0]
                      : getCurrentDateTime(
                          new Date(this.state.devis.date_debut).getTime()
                        ).split("T")[0]
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 style={{ margin: 0 }}> Date de dépôt </h3>
                <p>{this.state.devis.date_depot}</p>
              </Grid>
              <Grid item xs={12}>
                <br />
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={this.ajouter}
                >
                  <SaveIcon />
                </Button>
              </Grid>
            </Grid>
          </ul>

          <h1> {this.state.devis && this.state.devis.nom}</h1>
          <button onClick={this.handleOpenCloseatransformDialog}>Cancel</button>
        </Dialog>

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
    addToCorbeille: (id) => dispatch(addToCorbeille(id)),
    getPhasesProjetDeDevis: (data) => dispatch(getPhasesProjetDeDevis(data)),
    transformDevisAProjet: (data) => dispatch(transformDevisAProjet(data)),
    removeDevisTransformProjet: () => dispatch(removeDevisTransformProjet()),
    ajouterPaiement : (data) => dispatch(ajouterPaiement(data)),
    removePaiementAdded : () => dispatch(removePaiementAdded())
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.devis.loading,
    devis: state.devis.devis,
    devis_phases_projets: state.devis.devis_phases_projets,
    devisTransformProject: state.devis.devisTransformProject,
    paiementAdded : state.facture.paiementAdded
  };
};
export default connect(mapStateToProps, mapActionToProps)(FactureTable);
