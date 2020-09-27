import React, { Component } from "react";
import logo from "../../utils/logo";
import {floatToDrahem} from 'drahem'


//utils
import { round } from "../../utils/methods";

export default class PageFacture extends Component {
  state = {
    row: {},
  };


  render() {
    const info = { ...this.props.entreprise };
    const user = {...this.props.user}
    const totalReporter = this.props.row.reduce((total,r)=>{
      return total + (Number.parseFloat(r.rows_to_print.prix) + Number.parseFloat((r.rows_to_print.prix)* r.facture.tva) /100)
    },0)
    return (
      <div className="print-page-container" id={`page-${this.props.id}`}>
        <div className="print-page-head">
          <div className="page-row">
            <div className="page-col entreprise-info-1">
              <h4>Bureau d'etudes d'architecture  & d'urbanisme :  {info.nom}</h4>
              <p>Adresse : {info.adresse}</p>
              <p>Télephpne : {info.telephone}</p>
              <p>Email : {info.email}</p>
             
            </div>

            <div className="page-col  entreprise-info-2">
              <img className="logo-entreprise-page" src={logo} />
              <div className="entreprise-fiscaux">
              {info.na !== "" ?   <p><small>Numéro d'agrément :{info.na}</small></p> : null}

              {info.rc !== "" ?   <p><small>RC :{info.rc}</small></p> : null}
              {
                info.nis !== "" ? 
                <p><small>NIS : {info.nis}</small></p>
                : null
              }
              {
                info.nif !== "" ? 
                <p><small>NIF : {info.nif }</small></p>
                : null
              }
               
              </div>
            </div>
          </div>

          <hr />
          <div className="page-row">
            <div className="page-col">
              <h2>Facture : N° {this.props.row[0].facture.id} / {new Date(this.props.row[0].facture.date_facture).getFullYear()}</h2>
              <p>Date : {this.props.row[0].facture.date_facture.split('T')[0]}</p>
              <p>Par : {this.props.row[0].facture.user_nom + " " + this.props.row[0].facture.user_prenom}</p>
              <p>Objet :  {this.props.row[0].facture.objet}</p>
              <p>Projet  : {this.props.row[0].facture.nom}</p>
            </div>
            <div className="page-col">
              <h5>Maitre d'ouvrage  {this.props.row[0].facture.maitre_douvrage_nom} {" "} {this.props.row[0].facture.maitre_douvrage_prenom}</h5>
              
              <p>Raison social  : {this.props.row[0].facture.maitre_douvrage_raison_social}</p>
              <p>Adresse : {this.props.row[0].facture.maitre_douvrage_adresse}</p>
              <p>Numero de  RC ou agrément : {this.props.row[0].facture.maitre_douvrage_rg}</p>
             <p> Numero de tel : {this.props.row[0].facture.maitre_douvrage_telephone} </p>
<p>Email : {this.props.row[0].facture.maitre_douvrage_email}</p>

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
                {this.props.row[0].facture.ht ? <th>Motant HT</th> : <th>Total</th>
                }
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


                         
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row.rows_to_print[title.access]}
                            </td>
                          );
                      })}
                      <td>
                      {this.props.row[0].facture.ht ? `${(row.rows_to_print["prix"] +
                          (row.rows_to_print["prix"] * row.facture["tva"]) / 100 )} `  : `${row.rows_to_print["prix"]} ` }
              
                        
                      </td>
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

          

          {!this.props.row[0].facture.ht ? 
          <div className="page-row pt-1">
            <div className="page-col pt-2" style={{flex : 6}}>
            <small>  <h5>Total à reporter : {totalReporter} DA</h5> 
            { <h6>Total à reporter : {floatToDrahem(totalReporter)} </h6> }
</small>
           
          
            </div>
            <div className="page-col pt-2" style={{flex : 4}}>
          
              <h5>Total net : {round(this.props.row[0].prixTotale)} DA</h5>
              <h5>TVA : {this.props.row[0].facture.tva} %</h5>

              <h5>Total TVA : {round((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100)} DA</h5>
            
            
              <h5>Total TTC : {round((Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100))} DA</h5>

              
              
              <h5>Remise sur le Total : {round(this.props.row[0].facture.remise)} DA
           </h5>
              
           <hr />
           <h5>
           Avance  :{" "}
                {round(Number.parseFloat(this.props.row[0].facture.paye))}
                DA
              </h5>

  <h5>
                Total a Payer :{" "}
                {round((Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  Number.parseFloat(this.props.row[0].facture.remise))}
                DA
              </h5>
  


  <h6>
                Total a Payer :{" "}
                {floatToDrahem((Number.parseFloat(this.props.row[0].prixTotale))  + ((Number.parseFloat(this.props.row[0].prixTotale) * this.props.row[0].facture["tva"]) / 100) -
                  Number.parseFloat(this.props.row[0].facture.remise))}
                
              </h6>
 
             
   
            </div>
            </div>
         
          : 
          
          <div className="page-row pt-1">
          <div className="page-col pt-2" style={{ flex: 6 }}>
              <small>
                {" "}
                <h5>Total à reporter : {totalReporter} DA</h5>
                {<h6>Total à reporter : {floatToDrahem(totalReporter)} </h6>}
              </small>
            </div>
          <div className="page-col pt-2 " style={{ flex: 4 }}>
              <h5>Total  : {this.props.row[0].prixTotale} DA</h5>
             
              <h5>
                Remise sur le Total : {round(this.props.row[0].facture.remise)} DA
              </h5>

<hr />
              <h5>Total HT : {round(this.props.row[0].prixTotale - this.props.row[0].facture.remise)} DA</h5>


              </div>
          </div>
          }

          
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
