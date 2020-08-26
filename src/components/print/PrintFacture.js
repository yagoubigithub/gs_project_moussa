import React, { Component } from "react";

import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server";

//print

//Mui
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import Button from "@material-ui/core/Button";

//icons

import PrintIcon from "@material-ui/icons/Print";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

//redux
import { connect } from "react-redux";
import {
  getFacture,
  printToPdf,
  print,
} from "../../store/actions/factureAction";

import PageFacture from "./PageFacture";

const head = [
  { access: "numero", value: "N°" },
  { access: "titre", value: "Désignation" },
  { access: "qte", value: "Quantité " },
  { access: "prix", value: "Prix" },
];

class PrintFacture extends Component {
  state = {
    open: true,
    facture: {},
    search: "",
    pagesNumber: 1,
    rows_to_print: [],
    entreprise : {},
    user : {}
  };
  componentDidMount() {
    this.props.getFacture(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.facture) {
      console.log(nextProps.facture);
      this.setState(
        {
          facture: { ...nextProps.facture },
        },
        () => {
          const rows_to_print = this.calculRows();
          this.setState({ rows_to_print });
        }
      );
    }

    if(nextProps.entreprise){
      this.setState({
        entreprise : nextProps.entreprise
      })
    }
    
    if(nextProps.user){
      this.setState({
        user : nextProps.user
      })
    }
  }

  handlePageChange = (e) => {
    const number = e.target.value;
    console.log(number);
    const page = document.getElementById(`page-${number}`);
    page.scrollIntoView();
  };

  searchInPage = () => {
    this.props.search({});
  };
  print = () => {
    const rows_to_print = this.calculRows();
    const pages = [];
    rows_to_print.map((row, index) => {
      pages.push({
        page: ReactDOMServer.renderToString(
          <PageFacture
            entreprise={this.state.entreprise}
            head={head}
            index={index}
            row={row}
            key={index}
            id={index + 1}
          />
        ),
        id: row[0].facture.id,
      });
    });

    this.props.print({ pages });
  };

  printToPdf = () => {
    const rows_to_print = this.calculRows();
    const pages = [];
    rows_to_print.map((row, index) => {
      pages.push({
        page: ReactDOMServer.renderToString(
          <PageFacture
            entreprise={this.state.entreprise}
            head={head}
            index={index}
            row={row}
            key={index}
            user={this.state.user}
          />
        )
        ,
        id : row[0].facture.id
      });
    });

    this.props.printToPdf({ pages });
  };

  calculRows = () => {
    const ROW_NUMBER = 8;
    let rows_to_print = [];
    const facture = this.state.facture;

    let prixTotale = 0;
    let phases = [];
    if (facture !== {}) {
      if (facture.phases !== undefined) {
        phases = [...facture.phases];
        phases.map((p) => {
          prixTotale = prixTotale + Number.parseFloat(p.prix);
        });
        for (let i = 0; i < phases.length; i = i + ROW_NUMBER) {
          const r = [];
          for (let j = 0; j < ROW_NUMBER; j++) {
            if (phases[i + j] !== undefined) {
              r.push({
                facture: facture,
                prixTotale,
                rows_to_print: phases[i + j],
                numero: phases[i + j] !== undefined ? i + j + 1 : 0,
              });
            }

            //  r.push(phases[i + j] );
            //  if(phases[i + j  ] !== undefined)
            //  phases[i+j].numero =  i+j+1;
          }

          rows_to_print.push(r);
        }
      }
    }
    this.setState({ pagesNumber: rows_to_print.length });
    return rows_to_print;
  };
  render() {
    const rows_to_print = [...this.state.rows_to_print];

    return (
      <Dialog
        fullScreen
        open={this.state.open}
        style={{ backgroundColor: "gray" }}
      >
        <div style={{ overflow: "hidden" }}>
          <AppBar className="bg-dark">
            <Toolbar
              style={{ display: "flax", justifyContent: "space-between" }}
            >
              <Link to={`/${this.props.match.params.buttonReturn}/`}>
                <IconButton
                  onClick={this.handleClose}
                  style={{ color: "white" }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <div>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.print}
                  style={{ margin: 4 }}
                >
                  <PrintIcon />
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.printToPdf}
                >
                  <PictureAsPdfIcon />
                </Button>

                {/* <button onClick={this.searchInPage} >Search</button>  */}
              </div>

              <div
                style={{
                  display: "inline",
                }}
              >
                <input
                  style={{ width: 30 }}
                  type="number"
                  onChange={this.handlePageChange}
                  max={this.state.pagesNumber}
                  defaultValue={1}
                  min={1}
                />
                /{this.state.pagesNumber}
              </div>
            </Toolbar>
          </AppBar>

          <div
            style={{
              marginTop: 60,
              overflowY: "scroll",
              height: 622,
              backgroundColor: "gray",
            }}
          >
            <div
              style={{
                paddingTop: 70,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 100,
                paddingBottom: 100,
              }}
            >
              {rows_to_print.map((row, index) => {
                return (
                  <PageFacture
                    head={head}
                    row={row}
                    index={index}
                    key={index}
                    entreprise={this.state.entreprise}
                    id={index + 1}
                    user={this.state.user}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    facture: state.facture.facture,
    loading: state.facture.loading,
    entreprise: state.entreprise.info,
    user : state.auth.user
  };
};
const mapActionToProps = (dispatch) => {
  return {
    getFacture: (id) => dispatch(getFacture(id)),
    printToPdf: (pages) => dispatch(printToPdf(pages)),
    print: (pages) => dispatch(print(pages)),
  };
};
export default connect(mapStateToProps, mapActionToProps)(PrintFacture);
