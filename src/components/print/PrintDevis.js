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
import { getDevis, printToPdf, print , search } from "../../store/actions/devisAction";
import Page from "./Page";

const head = [
  { access: "numero", value: "N°" },
  { access: "titre", value: "Désignation" },
  { access: "qte", value: "Quantité " },
  { access: "prix", value: "Prix" },
];



class PrintDevis extends Component {
  state = {
    open: true,
    devis: {},
    search :""

  };
  componentDidMount() {
    this.props.getDevis(this.props.match.params.id);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.devis) {
      this.setState({
        devis: { ...nextProps.devis },
      });
    }
    if(nextProps.found){
      //focus
     // this.searchInput.focus()
     
    }
  }
  


  searchInPage = ()=>{

    this.props.search({})
  }

  print = () => {
    const rows_to_print = this.calculRows();
    const pages = [];
    rows_to_print.map((row, index) => {
      pages.push({
        page: ReactDOMServer.renderToString(
          <Page
            entreprise={this.props.entreprise}
            head={head}
            index={index}
            row={row}
            key={index}
          />
        ),
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
          <Page
            entreprise={this.props.entreprise}
            head={head}
            index={index}
            row={row}
            key={index}
          />
        ),
      });
    });

    this.props.printToPdf({ pages });
  };

  calculRows = () => {
    const ROW_NUMBER = 8;
    let rows_to_print = [];
    const devis = this.state.devis;

    let prixTotale = 0;
    let phases = [];
    if (devis !== {}) {
      if (devis.phases !== undefined) {
        phases = [...devis.phases];
        if(phases.length !== 0){
          phases.map((p) => {
          prixTotale = prixTotale + Number.parseFloat(p.prix);
        });
        for (let i = 0; i < phases.length; i = i + ROW_NUMBER) {
          const r = [];
          for (let j = 0; j < ROW_NUMBER; j++) {
            if (phases[i + j] !== undefined) {
              r.push({
                devis: devis,
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
        }else{
          rows_to_print.push([{
            devis: devis,
            prixTotale,
            rows_to_print: {},
            numero: 0,
          }])
        }
        
      }
    }
   
    return rows_to_print;
  };
  render() {
    const rows_to_print = this.calculRows();

    return (
      <Dialog
        fullScreen
        open={this.state.open}
        style={{ backgroundColor: "gray" }}
      >
        <div style={{overflow : "hidden"}}>
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
              
              <button onClick={this.searchInPage} >Search</button>
              </div>
            </Toolbar>
          </AppBar>

          <div
            style={{
              backgroundColor: "gray",
              marginTop: 60,
              paddingTop: 70,
              height: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "auto",
            }}
          >
            {rows_to_print.map((row, index) => {
              return (
                <Page
                  head={head}
                  row={row}
                  index={index}
                  key={index}
                  entreprise={this.props.entreprise}
                />
              );
            })}
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    devis: state.devis.devis,
    loading: state.devis.loading,
    entreprise: state.entreprise.info,
    found : state.devis.found
  };
};
const mapActionToProps = (dispatch) => {
  return {
    getDevis: (id) => dispatch(getDevis(id)),
    printToPdf: (pages) => dispatch(printToPdf(pages)),
    print: (pages) => dispatch(print(pages)),
    search : (data) => dispatch(search(data))
  };
};
export default connect(mapStateToProps, mapActionToProps)(PrintDevis);
