import React, { Component } from "react";
import logo from "../../utils/logo";
import { floatToDrahem } from "drahem";

//utils
import { round } from "../../utils/methods";

export default class PageContrat extends Component {
  state = {
    row: {},
    rows_to_print: [],
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.rows_to_print) {
      if (nextProps.rows_to_print.length > 0) {
        this.setState({
          rows_to_print: nextProps.rows_to_print,
        });
       
      }
    }
  }

  render() {
    const info = { ...this.props.entreprise };
    const user = { ...this.props.user };

    return (
      <div className="print-page-container" id={`page-${this.props.id}`}>
        <div className="print-page-head">
          <div className="page-row">
            <div className="page-col entreprise-info-1">
              <h4>Bureau d'etudes d'architecture & d'urbanisme {info.nom}</h4>
              <p>Adresse : {info.adresse}</p>
              <p>Télephpne : {info.telephone}</p>
              <p>Email : {info.email}</p>
            </div>

            <div className="page-col  entreprise-info-2">
              <img className="logo-entreprise-page" src={logo} />
              <div className="entreprise-fiscaux">
                {info.rc !== "" ? <p>RC :{info.rc}</p> : null}
                {info.nis !== "" ? <p>NIS : {info.nis}</p> : null}
                {info.nif !== "" ? <p>NIF : {info.nif}</p> : null}
              </div>
            </div>
          </div>

          <hr />

          {this.props.rows_to_print.length > 0 && (
            <div className="page-row">
              <div className="page-col">
                <h2>
                  Devis : N° {this.props.rows_to_print[0][0].devis.id} /{" "}
                  {new Date(
                    this.props.rows_to_print[0][0].devis.date_devis
                  ).getFullYear()}
                </h2>
                <p>
                  Date :{" "}
                  {
                    this.props.rows_to_print[0][0].devis.date_devis.split(
                      "T"
                    )[0]
                  }
                </p>
                <p>Par : {this.props.rows_to_print[0][0].devis.user_nom + " " + this.props.rows_to_print[0][0].devis.user_prenom}</p>
                <p>Objet : {this.props.rows_to_print[0][0].devis.objet}</p>
                <p>Projet : {this.props.rows_to_print[0][0].devis.nom}</p>
              </div>
              <div className="page-col">
                <h5>
                  Maitre d'ouvrage{" "}
                  {this.props.rows_to_print[0][0].devis.maitre_douvrage_prenom}{" "}
                  {this.props.rows_to_print[0][0].devis.maitre_douvrage_nom}
                </h5>

                <p>
                  raison social :{" "}
                  {
                    this.props.rows_to_print[0][0].devis
                      .maitre_douvrage_raison_social
                  }
                </p>
                <p>
                  Adresse :{" "}
                  {this.props.rows_to_print[0][0].devis.maitre_douvrage_adresse}
                </p>
                <p>
                  numero de RC :{" "}
                  {this.props.rows_to_print[0][0].devis.maitre_douvrage_rg}
                </p>
                <p>
                  {" "}
                  numero de tel :{" "}
                  {
                    this.props.rows_to_print[0][0].devis
                      .maitre_douvrage_telephone
                  }{" "}
                </p>
                <p>
                  email :{" "}
                  {this.props.rows_to_print[0][0].devis.maitre_douvrage_email}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="print-page-content" style={{height : "45%"}}>
        
         
          <div>
          <div>
         { this.props.rows_to_print.length > 0 &&   <h4 style={{textAlign : "center"}}>Arrête le Montant du présent offre a la somme {this.props.rows_to_print[0][0].devis.ht  ? "en HT" : null}  </h4>}
          
            {this.props.rows_to_print.length > 0 &&   <h4 style={{textAlign : "center"}}>{   floatToDrahem(Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        )  -  Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          ) )}</h4>}
          </div>
  <div className="nb">
          <p>NB : il est demandé au client de payer 30 % du devis âpres la validation de l’offre.</p>
          </div>
  {this.props.rows_to_print.length > 0 && (
              <div>
                <table>
                <tbody>

                <tr>
                    <th>Montan  du projet</th>
                    <td>
                      {round(
                        Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          )
                      )}
                    </td>
                    <td>
                      {floatToDrahem(
                        Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th> Avance : {30} %</th>
                    <td>
                      {round(
                        ((Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          )) *
                          30) /
                          100
                      )}
                    </td>
                    <td>
                      {floatToDrahem(
                        ((Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          )) *
                          30) /
                          100
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th> Total a Payer : </th>
                    <td>
                      {round(
                        Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          ) -
                          ((Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) +
                            (Number.parseFloat(
                              this.props.rows_to_print[0][0].prixTotale
                            ) *
                              this.props.rows_to_print[0][0].devis["tva"]) /
                              100 -
                            Number.parseFloat(
                              this.props.rows_to_print[0][0].devis.remise
                            )) *
                            30) /
                            100
                      )}
                    </td>
                    <td>
                      {" "}
                      {floatToDrahem(
                        Number.parseFloat(
                          this.props.rows_to_print[0][0].prixTotale
                        ) +
                          (Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) *
                            this.props.rows_to_print[0][0].devis["tva"]) /
                            100 -
                          Number.parseFloat(
                            this.props.rows_to_print[0][0].devis.remise
                          ) -
                          ((Number.parseFloat(
                            this.props.rows_to_print[0][0].prixTotale
                          ) +
                            (Number.parseFloat(
                              this.props.rows_to_print[0][0].prixTotale
                            ) *
                              this.props.rows_to_print[0][0].devis["tva"]) /
                              100 -
                            Number.parseFloat(
                              this.props.rows_to_print[0][0].devis.remise
                            )) *
                            30) /
                            100
                      )}
                    </td>
                  </tr>
              
                </tbody>
         </table>
              </div>
            )}

          </div>
        
          
          

            
         
        </div>
        <div className="print-page-sign" style={{height : "18.33%"}}>
        <div className="sign">
                <div className="sign-col">
                Le maitre d’ouvrage
                </div>
                <div className="sign-col">
                Le Bureau d’étude 
</div>
            </div>
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
