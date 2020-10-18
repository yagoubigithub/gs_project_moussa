import { Dialog } from "@material-ui/core";
import React, { Component } from "react";

//redux

import { connect } from "react-redux";
import { getKey } from "../store/actions/keyAction";
import { getCurrentDateTime } from "../utils/methods";
class Key extends Component {
  state = {
    key: [],
    key_end : false,
    have_key : false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps._key) {
      this.setState({ key: [...nextProps._key] });
      const today = getCurrentDateTime(new Date().getTime() - (15 * 24 * 60 *60 *100)).split("T")[0];
      if(today === nextProps._key[0].date.split("T")[0] && nextProps._key[0].key === "" ){
       
        this.setState({key_end : true})
        
      }

      if(nextProps._key[0].key !== ""){
          this.setState({
            have_key : true
          })


      }
      
    }
  }
  componentDidMount() {
    this.props.getKey();
  }
  render() {
     

    return (
      <div>
     
     {this.state.key_end && 
     <Dialog open={true} fullScreen>

fin
     </Dialog>}

     {!this.state.have_key && <div>
         <h1>Enter key</h1>
     </div>}
      </div>
    );
  }
}

const mapActiontToProps = (dispatch) => {
  return {
    getKey: () => dispatch(getKey()),
  };
};
const mapStateToProps = (state) => {
  return {
    _key: state.key.key,
  };
};
export default connect(mapStateToProps, mapActiontToProps)(Key);
