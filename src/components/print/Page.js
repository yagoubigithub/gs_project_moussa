import React, { Component } from "react";
import logo from "../../utils/logo";

export default class Page extends Component {
  state = {
    row: {},
  };

  componentDidMount() {
    console.log(this.props.row);
  }
  render() {
    const info = { ...this.props.entreprise };
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

            <div  className="page-col">
              <img className="logo-entreprise-page" src={logo} />
            </div>
          </div>

          <hr />
          <div className="page-row">
            <div  className="page-col">
              <h4>Devis :N° {this.props.row[0].devis.id}</h4>
              <p>Date : {this.props.row[0].devis.date_devis}</p>
              <p>Par : yagoubi moussa</p>
            </div>
            <div  className="page-col">
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
        </div>
        <div className="print-page-footer">{this.props.index + 1}</div>
      </div>
    );
  }
}
