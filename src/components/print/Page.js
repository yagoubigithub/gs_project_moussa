import React, { Component } from "react";
import logo from "../../utils/logo";
import {NumberToLetter} from 'convertir-nombre-chiffre'

export default class Page extends Component {
  state = {
    row: {},
  };

  componentDidMount() {
    console.log(this.props.row);
  }
  render() {
    const info = { ...this.props.entreprise };
    const totalReporter = this.props.row.reduce((total,r)=>{
      return total + Number.parseFloat(r.rows_to_print.prix)
    },0)
    return (
      <div className="print-page-container">
        <div className="print-page-head">
          <div className="page-row">
            <div className="page-col">
              <h5>{info.nom}</h5>
              <p>Adresse : {info.adresse}</p>
              <p>Télephpne : {info.telephone}</p>
              <p>Email : {info.email}</p>
              <p>Adresse : {info.adresse}</p>
            </div>

            <div className="page-col entreprise-info">
              <img className="logo-entreprise-page" src={logo} />
              <p>RC :**********************</p>
              <p>AI :**********************</p>
              <p>NIF :**********************</p>
              <p>NIS :**********************</p>
            </div>
          </div>

          <hr />
          <div className="page-row">
            <div className="page-col">
              <h4>Devis :N° {this.props.row[0].devis.id}</h4>
              <p>Date : {this.props.row[0].devis.date_devis}</p>
              <p>Par : yagoubi moussa</p>
            </div>
            <div className="page-col">
              <h5>Maitre d'ouvrage </h5>
              <p>Adresse : {this.props.row[0].devis.maitre_douvrage_adresse}</p>
            </div>
          </div>
        </div>

        <div className="print-page-content">
          <table>
            <thead>
              <tr>
                {this.props.head.map((title, index) => {
                  return <th key={index}>{title.value}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {this.props.row.map((row, index) => {
                if (row !== undefined) {
                  return (
                    <tr key={`tbody-tr-${index}`}>
                      {this.props.head.map((title, index) => {
                        if (title.access === "numero") {
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row[title.access]}
                            </td>
                          );
                        } else
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row.rows_to_print[title.access]}
                            </td>
                          );
                      })}
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

          <div className="page-row pt-1">
            <div className="page-col" style={{flex : 6}}>
            <small>  <h5>Total à reporter : {totalReporter} DA</h5> 
             <h5>Total à reporter : {NumberToLetter(totalReporter)} Dinars</h5>
</small>
           
          
            </div>
            <div className="page-col " style={{flex : 4}}>
          
              <h5>Total net : {this.props.row[0].prixTotale} DA</h5>
              <h5>
                Remise sur le Total : {this.props.row[0].devis.remise} DA
              </h5>
              <h5>
                Total a Payer :{" "}
                {Number.parseFloat(this.props.row[0].prixTotale) -
                  Number.parseFloat(this.props.row[0].devis.remise)}{" "}
                DA
              </h5>
              <h6>Total a payer : {NumberToLetter(
                Number.parseFloat(this.props.row[0].prixTotale) -
                  Number.parseFloat(this.props.row[0].devis.remise)
              )} Dinars</h6>
            </div>
          </div>
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
