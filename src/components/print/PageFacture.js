import React, { Component } from "react";
import logo from "../../utils/logo";
import {floatToDrahem} from 'drahem'

export default class PageFacture extends Component {
  state = {
    row: {},
  };

  
  render() {
    const info = { ...this.props.entreprise };
    const totalReporter = this.props.row.reduce((total,r)=>{
      return total + (Number.parseFloat(r.rows_to_print.prix) + Number.parseFloat((r.rows_to_print.prix)* r.facture.tva) /100)
    },0)
    return (
      <div className="print-page-container">
        <div className="print-page-head">
          <div className="page-row">
            <div className="page-col">
              <h4>Bureau d'etudes d'architecture  & d'urbanisme {info.nom}</h4>
              <p>Adresse : {info.adresse}</p>
              <p>Télephpne : {info.telephone}</p>
              <p>Email : {info.email}</p>
             
            </div>

            <div className="page-col entreprise-info">
              <img className="logo-entreprise-page" src={logo} />
              <div className="entreprise-fiscaux">
                  <p>RC :**********************</p>
              <p>AI :**********************</p>
              <p>NIF :**********************</p>
              <p>NIS :**********************</p>
              </div>
            
            </div>
          </div>

          <hr />
          <div className="page-row">
            <div className="page-col">
              <h2>Facture : N° {this.props.row[0].facture.id} / {new Date(this.props.row[0].facture.date_facture).getFullYear()}</h2>
              <p>Date : {this.props.row[0].facture.date_facture.split('T')[0]}</p>
              <p>Par : yagoubi moussa</p>
              <p>Objet :  {this.props.row[0].facture.objet}</p>
              <p>Projet  : {this.props.row[0].facture.nom}</p>
            </div>
            <div className="page-col">
              <h5>Maitre d'ouvrage  {this.props.row[0].facture.maitre_douvrage_nom} {" "} {this.props.row[0].facture.maitre_douvrage_prenom}</h5>
              
              <p>raison social  : {this.props.row[0].facture.maitre_douvrage_raison_social}</p>
              <p>Adresse : {this.props.row[0].facture.maitre_douvrage_adresse}</p>
              <p>numero de  RC : {this.props.row[0].facture.maitre_douvrage_rg}</p>
             <p> numero de tel : {this.props.row[0].facture.maitre_douvrage_telephone} </p>
<p>email : {this.props.row[0].facture.maitre_douvrage_email}</p>

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
                <th>Motant HT</th>
              </tr>
            </thead>
            <tbody>
              {this.props.row.map((row, index) => {
                if (row !== undefined) {
                  return (
                    <tr key={`tbody-tr-${index}`}>
                      {this.props.head.map((title, index) => {
                        if (title.access === "numero"   ) {
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row[title.access]}
                            </td>
                          );
                        } 

                        if (title.access === "qte"   ) {
                          return (
                            <td key={`tbody-td-${index}`}>
                              {1}
                            </td>
                          );
                        } 


                        if (title.access === "tva"   ) {
                          
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row.facture[title.access]}%
                            </td>
                          );
                        } 
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row.rows_to_print[title.access]}
                            </td>
                          );
                      })}
                    <td>
                      {row.rows_to_print["prix"] + (row.rows_to_print["prix"] * row.facture["tva"]) /100} DA
                    </td>
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

          <div className="page-row pt-1">
            <div className="page-col" style={{flex : 6}}>
            <small>  <h5>Total à reporter : {totalReporter} DA</h5> 
            { <h6>Total à reporter : {floatToDrahem(totalReporter)} </h6> }
</small>
           
          
            </div>
            <div className="page-col " style={{flex : 4}}>
          
              <h5>Total net : {this.props.row[0].prixTotale} DA</h5>

              <h5>Total TVA : {(Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100} DA</h5>
            
            
              <h5>Total TTC : {(Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100)} DA</h5>

              {this.props.row[0].facture.unite_remise === "DA" ?
              
              <h5>Remise sur le Total : {this.props.row[0].facture.remise} DA
           </h5>
               : <h5>Remise sur le Total : {(Number.parseFloat(this.props.row[0].prixTotale) * 
                Number.parseFloat(this.props.row[0].facture.remise) / 100)} DA
           </h5>}
           <hr />

{
  this.props.row[0].facture.unite_remise === "DA"
  ?
  <h5>
                Total a Payer :{" "}
                {(Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  Number.parseFloat(this.props.row[0].facture.remise)}{" "}
                DA
              </h5>
  :

  <h5>
                Total a Payer :{" "}
                {(Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  (Number.parseFloat(this.props.row[0].prixTotale) * 
                Number.parseFloat(this.props.row[0].facture.remise) / 100)}{" "}
                DA
              </h5>
}

{
  this.props.row[0].facture.unite_remise === "DA"
  ?
  <h6>
                Total a Payer :{" "}
                {floatToDrahem((Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  Number.parseFloat(this.props.row[0].facture.remise))}
                
              </h6>
  :

  <h6>
                Total a Payer :{" "}
                {floatToDrahem((Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  (Number.parseFloat(this.props.row[0].prixTotale) * 
                Number.parseFloat(this.props.row[0].facture.remise) / 100))}
                
              </h6>
}

             
   
            </div>
          </div>
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
