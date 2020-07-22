import React, { Component } from "react";
import logo from "../../utils/logo";
import { floatToDrahem } from "drahem";

//utils
import { round } from "../../utils/methods";

export default class Page extends Component {
  state = {
    row: {},
  };

  render() {
    const info = { ...this.props.entreprise };
    const totalReporter =
      this.props.row.reduce((total, r) => {
        return (
          total +
          (Number.parseFloat(r.rows_to_print.prix) +
            Number.parseFloat(r.rows_to_print.prix * r.devis.tva) / 100)
        );
      }, 0) || 0;
    return (
      <div className="print-page-container" id={`page-${this.props.id}`} >
        <div className="print-page-head">
          <div className="page-row">
            <div className="page-col bureau-info">
              <h4>Bureau d'etudes d'architecture & d'urbanisme {info.nom}</h4>
              <p>Adresse : {info.adresse}</p>
              <p>Télephpne : {info.telephone}</p>
              <p>Email : {info.email}</p>
            </div>

            <div className="page-col  entreprise-info">
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
              <h2>
                Devis : N° {this.props.row[0].devis.id} /{" "}
                {new Date(this.props.row[0].devis.date_devis).getFullYear()}
              </h2>
              <p>Date : {this.props.row[0].devis.date_devis.split("T")[0]}</p>
              <p>Par : yagoubi moussa</p>
              <p>Objet : {this.props.row[0].devis.objet}</p>
              <p>Projet : {this.props.row[0].devis.nom}</p>
            </div>
            <div className="page-col">
              <h5>
                Maitre d'ouvrage{" "}
                {this.props.row[0].devis.maitre_douvrage_prenom}{" "}
                {this.props.row[0].devis.maitre_douvrage_nom}
              </h5>

              <p>
                raison social :{" "}
                {this.props.row[0].devis.maitre_douvrage_raison_social}
              </p>
              <p>Adresse : {this.props.row[0].devis.maitre_douvrage_adresse}</p>
              <p>numero de RC : {this.props.row[0].devis.maitre_douvrage_rg}</p>
              <p>
                {" "}
                numero de tel :{" "}
                {this.props.row[0].devis.maitre_douvrage_telephone}{" "}
              </p>
              <p>email : {this.props.row[0].devis.maitre_douvrage_email}</p>
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
                        if (title.access === "numero") {
                          return (
                            <td key={`tbody-td-${index}`}>
                              {row[title.access]}
                            </td>
                          );
                        }

                        if (title.access === "qte") {
                          return <td key={`tbody-td-${index}`}>{1}</td>;
                        }

                        return (
                          <td key={`tbody-td-${index}`}>
                            {row.rows_to_print[title.access]}
                          </td>
                        );
                      })}
                      <td>
                        {row.rows_to_print["prix"] +
                          (row.rows_to_print["prix"] * row.devis["tva"]) /
                            100}{" "}
                        DA
                      </td>
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

          <div className="page-row pt-1">
            <div className="page-col" style={{ flex: 6 }}>
              <small>
                {" "}
                <h5>Total à reporter : {totalReporter} DA</h5>
                {<h6>Total à reporter : {floatToDrahem(totalReporter)} </h6>}
              </small>
            </div>
            <div className="page-col " style={{ flex: 4 }}>
              <h5>Total net : {this.props.row[0].prixTotale} DA</h5>
              <h5>TVA : {this.props.row[0].devis.tva} %</h5>

              <h5>
                Total TVA :{" "}
                {round(
                  (Number.parseFloat(this.props.row[0].prixTotale) *
                    this.props.row[0].devis["tva"]) /
                    100
                )}{" "}
                DA
              </h5>

              <h5>
                Total TTC :{" "}
                {round(
                  Number.parseFloat(this.props.row[0].prixTotale) +
                    (Number.parseFloat(this.props.row[0].prixTotale) *
                      this.props.row[0].devis["tva"]) /
                      100
                )}{" "}
                DA
              </h5>

              <h5>
                Remise sur le Total : {round(this.props.row[0].devis.remise)} DA
              </h5>

              <hr />

              <h5>
                Total a Payer :{" "}
                {round(
                  Number.parseFloat(this.props.row[0].prixTotale) +
                    (Number.parseFloat(this.props.row[0].prixTotale) *
                      this.props.row[0].devis["tva"]) /
                      100 -
                    Number.parseFloat(this.props.row[0].devis.remise)
                )}
                DA
              </h5>

              <h6>
                Total a Payer :{" "}
                {floatToDrahem(
                  Number.parseFloat(this.props.row[0].prixTotale) +
                    (Number.parseFloat(this.props.row[0].prixTotale) *
                      this.props.row[0].devis["tva"]) /
                      100 -
                    Number.parseFloat(this.props.row[0].devis.remise)
                )}
              </h6>
            </div>
          </div>
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
