import React, { Component } from 'react'

export default class Page extends Component {
    state = {
        row : {}
    }

    componentDidMount(){
        console.log(this.props.row)
    }
    render() {
        return (
            <div className="print-page-container">
 <div className="print-page-head">
     head
    {this.props.row[0].devis.date_devis}
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
                        if(title.access === "numero" ){
                            return (
                          <td key={`tbody-td-${index}`}>{row[title.access]}</td>
                        );
                        }else
                        return (
                          <td key={`tbody-td-${index}`}>{row.rows_to_print[title.access]}</td>
                        );
                      })}
                    </tr>
                  );
                } else return null;
              })}
            </tbody>
          </table>

{
    this.props.row.map((r,index)=>{
        return (
            <h6 key={index}>{r.rows_to_print.titre}</h6>
        )
    })
}
 </div>
 <div className="print-page-footer">
 footer 
 </div>
           
            </div>
        )
    }
}
