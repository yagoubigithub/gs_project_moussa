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
    const user = { ...this.props.user };
    const totalReporter =
      this.props.row.reduce((total, r) => {
        return (
          total +
          (Number.parseFloat(r.rows_to_print.prix) +
            Number.parseFloat(r.rows_to_print.prix * r.devis.tva) / 100)
        );
      }, 0) || 0;
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
                Devis : N° {this.props.row[0].devis.id} /{" "}
                {new Date(this.props.row[0].devis.date_devis).getFullYear()}
              </h2>
              <table className="table-info-1">
                <tbody>
                  <tr>
                    <td>
                      <b>Date </b>
                    </td>
                    <td>{this.props.row[0].devis.date_devis.split("T")[0]}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Par</b>
                    </td>
                    <td>
                      {this.props.row[0].devis.user_nom +
                        " " +
                        this.props.row[0].devis.user_prenom}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Objet </b>
                    </td>
                    <td>{this.props.row[0].devis.objet}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Projet </b>
                    </td>

                    <td>{this.props.row[0].devis.nom}</td>
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
                      {this.props.row[0].devis.maitre_douvrage_prenom}{" "}
                      {this.props.row[0].devis.maitre_douvrage_nom}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Raison social</b>
                    </td>

                    <td>
                      {this.props.row[0].devis.maitre_douvrage_raison_social}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <b>Adresse</b>
                    </td>

                    <td>{this.props.row[0].devis.maitre_douvrage_adresse}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Numero de RC ou agrément</b>
                    </td>

                    <td>{this.props.row[0].devis.maitre_douvrage_rg}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Numero de tel</b>
                    </td>

                    <td>{this.props.row[0].devis.maitre_douvrage_telephone}</td>
                  </tr>

                  <tr>
                    <td>
                      <b>Email </b>
                    </td>

                    <td>{this.props.row[0].devis.maitre_douvrage_email}</td>
                  </tr>
                </tbody>
              </table>
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
                {this.props.row[0].devis.ht ? (
                  <th>Motant HT</th>
                ) : (
                  <th>Total</th>
                )}
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
                        {this.props.row[0].devis.ht
                          ? `${
                              row.rows_to_print["prix"] +
                              (row.rows_to_print["prix"] * row.devis["tva"]) /
                                100
                            } `
                          : `${row.rows_to_print["prix"]} `}
                      </td>
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

          {!this.props.row[0].devis.ht ? (
            <div className="page-row">
              <div className="page-col">
                <small>
                  {" "}
                  <h5>Total à reporter : {totalReporter} DA</h5>
                  {<h6>Total à reporter : {floatToDrahem(totalReporter)} </h6>}
                </small>
              </div>
              <div className="page-col ">
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
                  Remise sur le Total : {round(this.props.row[0].devis.remise)}{" "}
                  DA
                </h5>

                <hr />

                <h5>
                  Total :{" "}
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
                  Total :{" "}
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
          ) : (
            <div className="page-row">
              <div className="page-col">
                <small>
                  {" "}
                  <h5>Total à reporter : {totalReporter} DA</h5>
                  {<h6>Total à reporter : {floatToDrahem(totalReporter)} </h6>}
                </small>
              </div>
              <div className="page-col ">
                <h5>Total : {this.props.row[0].prixTotale} DA</h5>

                <h5>
                  Remise sur le Total : {round(this.props.row[0].devis.remise)}{" "}
                  DA
                </h5>

                <hr />
                <h5>
                  Total HT :{" "}
                  {round(
                    this.props.row[0].prixTotale -
                      this.props.row[0].devis.remise
                  )}{" "}
                  DA
                </h5>
              </div>
            </div>
          )}
        </div>

        <div className="print-page-footer">
        
        
        {this.props.index + 1}</div>
      </div>
    );
  }
}
