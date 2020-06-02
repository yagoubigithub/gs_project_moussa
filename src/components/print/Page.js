import React, { Component } from 'react'

export default class Page extends Component {
    state = {
        row : {}
    }

    componentDidMount(){
        this.setState({row :  this.props.row})
    }
    render() {
        return (
            <div className="print-page-container">
 <div className="print-page-head">
     head
    {this.props.row[0].devis.date_devis}
 </div>
 
 <div className="print-page-content">

content
 </div>
 <div className="print-page-footer">
 footer 
 </div>
           
            </div>
        )
    }
}
