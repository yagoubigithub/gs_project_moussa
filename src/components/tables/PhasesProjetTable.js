import React, { Component, Fragment } from 'react'

import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import ReactTable from 'react-table'
import 'react-table/react-table.css'



//Mui
import IconButton from "@material-ui/core/IconButton";

import { Dialog, Checkbox } from '@material-ui/core';

//redux
import { connect } from 'react-redux';
import { addToCorbeille, getPhasesProjet , getLogo , undoDeletePhasesProjet } from '../../store/actions/pahsesProjetAction';

//icons

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import UndoIcon from '@material-ui/icons/Undo';
import SearchIcon from '@material-ui/icons/Search';


import LoadingComponent from '../../utils/loadingComponent';




class PhasesProjetTable extends Component {
  state = {
   
    addToCorbeilleDialog: false,
    deletedId: null,
    rowsSelected: this.props.rowsSelected,
    selectedAll: false,
    
    PhasesProjetSelected :{},
    selectedAll : false,
    logo : ""

  }
  componentWillReceiveProps(nextProps){
    if (nextProps.PhasesProjet) {
      this.setState({ ...nextProps.PhasesProjet });
    }
  
    if (nextProps.rowsSelected) {
      this.setState({ rowsSelected : nextProps.rowsSelected });
    }
    if(nextProps.rows.length !== this.props.rows.length)
    {
      this.setState({selectedAll  : false})

    }
    
  }

 
  componentWillUnmount = () =>{
    switch(this.props.type){
      case "choose-one":
          const PhasesProjetSelected = {...this.state.PhasesProjetSelected};
          this.props.sendData(PhasesProjetSelected);
      break;
      default :
      break;
    }
  }

  

 

  
  handleOpenCloseaddToCorbeilleDialog = () => {
    this.setState({ addToCorbeilleDialog: !this.state.addToCorbeilleDialog })
  }
  add_To_Corbeille = (id) => {
    this.setState({ deletedId: id })
    //popup
    this.handleOpenCloseaddToCorbeilleDialog();

  }
  handeleCheckCheckboxRow = (e, id) => {
    const rowsSelected = [...this.state.rowsSelected];
    if (this.checkRowIsSelected(id)) {
      //unselect
      rowsSelected.splice(rowsSelected.findIndex(item => id == item), 1)

    } else {
      //select
      rowsSelected.push(id);
    }

    if(rowsSelected.length === 0) this.setState({selectedAll : false})
    this.setState({ rowsSelected }, ()=>{
      this.props.sendData(rowsSelected)
    })

  }
  checkRowIsSelected = (id) => {
    const rowsSelected = [...this.state.rowsSelected];
    return rowsSelected.filter(row => row == Number.parseInt(id)).length > 0
  }

  handleSelectAllChange = () => {
    let selectedAll = this.state.selectedAll ? false : true;
    const rowsSelected = [];
    if (selectedAll) {
      this.props.rows.map(item => {
        rowsSelected.push(item.id)
      })
    }
    this.setState({ selectedAll, rowsSelected },()=>{
      this.props.sendData(rowsSelected)
    })
  }



handleSelectOneChange =  (PhasesProjetSelected) =>{
  this.setState({
    PhasesProjetSelected

  })
}
  render() {
    
    

    const columns = [
     
      {
        Header: 'N°',
        accessor: 'number',
        width : 100,
        filterMethod: (filter, row) =>
        {
          const regx =  `.*${filter.value}.*`;
          return row[filter.id].toString().match(regx)
        },
        
        
        Cell: props =>
          (<div className="cell" >{props.value !== "undefined" ? props.value : ""}</div>)
          , 
          Filter: ({ filter, onChange }) =>
          <div className="searchtable-container">
          <label htmlFor="date-input-phase">
            <SearchIcon className="searchtable-icon" />
          </label>
          
            <input type="text"
            id="date-input-phase"
            className="searchtable-input"
           onChange={event => onChange(event.target.value)}
         
          value={filter ? filter.value : ""}/>
          </div>
      }, 
      {
        Header: 'Désignation',
        accessor: 'titre',
        filterMethod: (filter, row) =>
        {
          const regx =  `.*${filter.value}.*`;
          return row[filter.id].toString().match(regx)
        },
        Cell: props =>
          (<div className="cell" >{props.value !== "undefined" ? props.value : ""}</div>)
          ,
          Filter: ({ filter, onChange }) =>
          <div className="searchtable-container">
          <label htmlFor="date-input-titre">
            <SearchIcon className="searchtable-icon" />
          </label>
          
            <input type="text"
            id="date-input-titre"
            className="searchtable-input"
           onChange={event => onChange(event.target.value)}
         
          value={filter ? filter.value : ""}/>
          </div>
      }
    ,
    {
      Header: 'Description',
      accessor: 'description',
      filterMethod: (filter, row) =>
      {
        const regx =  `.*${filter.value}.*`;
        return row[filter.id].toString().match(regx)
      },
      Cell: props =>
        (<div className="cell" >{props.value !== "undefined" ? props.value : ""}</div>)
        ,
        Filter: ({ filter, onChange }) =>
        <div className="searchtable-container">
        <label htmlFor="date-input-description">
          <SearchIcon className="searchtable-icon" />
        </label>
        
          <input type="text"
          id="date-input-description"
          className="searchtable-input"
         onChange={event => onChange(event.target.value)}
       
        value={filter ? filter.value : ""}/>
        </div>
    }
  ,
  {
    Header: 'Durée',
    accessor: 'duree',
    filterMethod: (filter, row) =>
    {
      const regx =  `.*${filter.value}.*`;
      return row[filter.id].toString().match(regx)
    },
    Cell: props =>
      (<div className="cell" >{props.value !== "undefined" ? props.value : ""}</div>)
      ,
      Filter: ({ filter, onChange }) =>
      <div className="searchtable-container">
      <label htmlFor="date-input-duree">
        <SearchIcon className="searchtable-icon" />
      </label>
      
        <input type="text"
        id="date-input-duree"
        className="searchtable-input"
       onChange={event => onChange(event.target.value)}
     
      value={filter ? filter.value : ""}/>
      </div>
  }
,
{
  Header: 'Prix',
  accessor: 'prix',
  filterMethod: (filter, row) =>
  {
    const regx =  `.*${filter.value}.*`;
    return row[filter.id].toString().match(regx)
  },
  Cell: props =>
    (<div className="cell" >{props.value !== "undefined" ? props.value : ""}</div>)
    ,
    Filter: ({ filter, onChange }) =>
    <div className="searchtable-container">
    <label htmlFor="date-input-prix">
      <SearchIcon className="searchtable-icon" />
    </label>
    
      <input type="text"
      id="date-input-prix"
      className="searchtable-input"
     onChange={event => onChange(event.target.value)}
   
    value={filter ? filter.value : ""}/>
    </div>
}
]

      
    
      if( this.props.IconsColumn ){
        columns.unshift(
        
          {
    
            Header: '  ',
            accessor: 'id',
            width: 100,
            sortable: false,
            filterable: false,
            Cell: props => 
            {
              if (this.props.type === "corbeille") {
                return  <div className="cell"><IconButton
                size="small"
                onClick={() => this.props.undoDeletePhasesProjet(props.value)}
              >
                <UndoIcon className="black" fontSize="small"></UndoIcon>
              </IconButton></div> ;
              }else{
                return( <div className="cell">
               
      
                <IconButton size="small" onClick={() => this.add_To_Corbeille(props.value)}>
                  <DeleteIcon className="red" fontSize="small"></DeleteIcon>
                </IconButton>
                <IconButton size="small">
                  <Link to={`/phases_projet/modifier/${props.value}`}><EditIcon className="black" fontSize="small"></EditIcon></Link>
                </IconButton>
      
              </div>)
              }
            }
           
          }
        )
      }

      if(this.props.checkBoxColumn){
        columns.unshift(
          {
            Header:<div style={{backgroundColor :'#E4E4E4',border : "1px solid rgba(0,0,0,0.45)"}}>
    <Checkbox 
            key={"check-all-voiture-key"}
             id="check-all-voiture-id"   
             style={{padding : 3}}
             checked={this.state.selectedAll }
             onChange={this.handleSelectAllChange}
             color="primary"
          />
            </div> ,
          sortable: false,
          filterable: false,
            accessor: 'id',
            width: 50,
    
            Cell: props => <div className="cell">
              <Checkbox 
                value={props.value}
                key={`key-checkbox-table-voiture-${props.value}`}
                id={`id-checkbox-table-voiture-${props.value}`}
                onChange={e => this.handeleCheckCheckboxRow(e, props.value)}
                checked={this.checkRowIsSelected(props.value)}
                style={{padding : 3}}
                
              />
            </div>
          }
        )
      }
      if(this.props.chooseOneColumn){
        columns.unshift(
          {
            Header: "  ",
            accessor: "id",
            width: 50,
            sortable: false,
            filterable: false,
            Cell: props => {
            return (  <div className="cell"><input type="radio" name="select-voiture" checked={props.value === this.state.PhasesProjetSelected.id} onChange={()=>this.handleSelectOneChange(props.original)} /></div>)
            }
          }
        )
      }
  


    return (
      <Fragment>



        <Dialog open={this.state.addToCorbeilleDialog} onClose={this.handleOpenCloseaddToCorbeilleDialog}>
          <h2>Suprimer</h2>
          <button onClick={() => { this.props.addToCorbeille(this.state.deletedId); this.handleOpenCloseaddToCorbeilleDialog() }}>Delete</button>
          <button onClick={this.handleOpenCloseaddToCorbeilleDialog}>Cancel</button>

        </Dialog>


        <div className="table-container">

          {/*
            recherche
            */}

         

          
          <ReactTable
            className="table"
            data={this.props.rows}
            filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
            columns={columns}
            defaultPageSize={this.props.type=== "choose-one" ? 5 : 8}

          />
        </div>

      </Fragment>
    )
  }
}

const mapActionToProps = dispatch => {
  return {
    
    addToCorbeille: (id) => dispatch(addToCorbeille(id)),
  
    undoDeletePhasesProjet :  (id) => dispatch(undoDeletePhasesProjet(id)),
    getPhasesProjet: id => dispatch(getPhasesProjet(id))
  }
}

const mapStateToProps = state => {
  return {
    loading: state.phases_projet.loading,
    projet: state.phases_projet.phases_projet,
   
    
  };
};
export default connect(mapStateToProps, mapActionToProps)(PhasesProjetTable);