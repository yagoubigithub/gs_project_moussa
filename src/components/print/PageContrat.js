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
      
      
   

        {this.props.rows_to_print.length > 0 && (
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
                {info.na !== "" ? (
                  <p>
                    <small>Numéro d'agrément :{info.na}</small>
                  </p>
                ) : null}

                {info.rc !== "" ? (
                  <p>
                    <small>RC :{info.rc}</small>
                  </p>
                ) : null}
                {info.nis !== "" ? (
                  <p>
                    <small>NIS : {info.nis}</small>
                  </p>
                ) : null}
                {info.nif !== "" ? (
                  <p>
                    <small>NIF : {info.nif}</small>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <hr />
          <div className="page-row">
            <div className="page-col">
              <h2>
                Devis : N° {this.props.rows_to_print[0][0].devis.id} /{" "}
                {new Date(this.props.rows_to_print[0][0].devis.date_devis).getFullYear()}
              </h2>
              <table className="table-info-1">
                <tbody>
                  <tr>
                    <td>
                      <b>Date </b>
                    </td>
                    <td>{this.props.rows_to_print[0][0].devis.date_devis.split("T")[0]}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Par</b>
                    </td>
                    <td>
                      {this.props.rows_to_print[0][0].devis.user_nom +
                        " " +
                        this.props.rows_to_print[0][0].devis.user_prenom}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Objet </b>
                    </td>
                    <td>{this.props.rows_to_print[0][0].devis.objet}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Projet </b>
                    </td>

                    <td>{this.props.rows_to_print[0][0].devis.nom}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="page-col">
              <table className="table-info-2">
                <tbody>
                  <tr>
                    <td>
                      <b>Maitre d'ouvrage</b>
                    </td>
                    <td>
                      {this.props.rows_to_print[0][0].devis.maitre_douvrage_prenom}{" "}
                      {this.props.rows_to_print[0][0].devis.maitre_douvrage_nom}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Raison social</b>
                    </td>

                    <td>
                      {this.props.rows_to_print[0][0].devis.maitre_douvrage_raison_social}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Adresse</b>
                    </td>

                    <td>{this.props.rows_to_print[0][0].devis.maitre_douvrage_adresse}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Numero de RC ou agrément</b>
                    </td>

                    <td>{this.props.rows_to_print[0][0].devis.maitre_douvrage_rg}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Numero de tel</b>
                    </td>

                    <td>{this.props.rows_to_print[0][0].devis.maitre_douvrage_telephone}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Email </b>
                    </td>

                    <td>{this.props.rows_to_print[0][0].devis.maitre_douvrage_email}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        )}
        <div className="print-page-content"  style={{height : this.props.type === "print"  ? "45%" : "133.65mm",minHeight :this.props.type === "print"  ? "45%" : "133.65mm" }}>
        
         
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
        <div className="print-page-sign" style={{height :this.props.type === "print"  ? "18.33%" : "54.44mm" , minHeight :this.props.type === "print"  ? "18.33%" : "54.44mm"  }}>
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
