import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React, { Component } from "react";
//util
import LoadingComponent from "../utils/loadingComponent";

//redux

import { connect } from "react-redux";
import { getKey, addKey } from "../store/actions/keyAction";
import { getCurrentDateTime } from "../utils/methods";
class Key extends Component {
  state = {
    key: [],
    key_end: false,
    have_key: false,
    keyForm: false,
    key_entred: "",
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps._key) {
      if (nextProps._key.length > 0) {
        this.setState({ key: [...nextProps._key] });
        const today = getCurrentDateTime(
          new Date().getTime() - 15 * 24 * 60 * 60 * 10000
        ).split("T")[0];
        if (
          today >= nextProps._key[0].date.split("T")[0] &&
          nextProps._key[0].key === ""
        ) {
          this.setState({ key_end: true });
        }

        if (nextProps._key[0].key !== "") {
          this.setState({
            have_key: true,
          });
        }
      } else {
        this.setState({
          have_key: false,
        });
      }
    }
    if (nextProps.keyCreated) {
      this.setState({
        keyForm: false,
        have_key : true,
        key_end : false
      });
    }
  }
  componentDidMount() {
    this.props.getKey();
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  showKeyForm = () => {
    this.setState({ keyForm: !this.state.keyForm });
  };
  addKey = (e) => {
    e.preventDefault();
    const key_entred = this.state.key_entred;
    this.props.addKey(key_entred);
  };
  render() {
    return (
      <div style={{display : "block",position : "fixed", bottom : 0, zIndex : 9999,width : "100vw"}}>
        <LoadingComponent
          loading={
            this.props.loading !== undefined ? this.props.loading : false
          }
        />
        <Dialog open={this.state.keyForm} onClose={this.showKeyForm}>
          <DialogTitle>Entrez la clé de licence</DialogTitle>

          <DialogContent>
            <span className="red">{this.props.error}</span>

            <form onSubmit={this.addKey}>
              <TextField
                placeholder="XXXXXXXXXXXXXXX "
                value={this.state.key_entred}
                name="key_entred"
                variant="outlined"
                onChange={this.handleChange}
                fullWidth
                margin="dense"
              />

              <Button type="submit" variant="contained" color="secondary">
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {this.state.key_end && (
          <Dialog open={true} fullScreen>
          
      <div style={{width : "50%", margin :  "auto", textAlign : "center"}}>
      <h1>Fin de l'essai gratuit</h1>

<br />
<h3>Entrez la clé de licence</h3>
<span className="red">{this.props.error}</span>

<form onSubmit={this.addKey}>
<TextField
placeholder="XXXXXXXXXXXXXXX "
value={this.state.key_entred}
name="key_entred"
variant="outlined"
onChange={this.handleChange}
fullWidth
margin="dense"
/>

<Button type="submit" variant="contained" color="secondary">
Submit
</Button>
</form>

      </div>
          </Dialog>
        )}

        {!this.state.have_key && (
          <div>
            <div>
              {this.state.key.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 5,
                    boxSizing: "border-box",
                    height : 50,
                    backgroundColor : "red",
                    color: "white"
                  }}
                >
                  <div>
                    {15 -
                      parseInt(
                        (new Date().getTime() -
                          new Date(
                            this.state.key[0].date.split("T")[0]
                          ).getTime()) /
                          1000 /
                          60 /
                          60 /
                          24
                      )}{" "}
                    jours après la fin de l'essai gratuit
                  </div>

                  <div>
                    <a
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={this.showKeyForm}
                    >
                      Entrez la clé de licence
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapActiontToProps = (dispatch) => {
  return {
    getKey: () => dispatch(getKey()),
    addKey: (key_entred) => dispatch(addKey(key_entred)),
  };
};
const mapStateToProps = (state) => {
  return {
    _key: state.key.key,
    loading: state.key.loading,
    error: state.key.error,
    keyCreated: state.key.keyCreated,
  };
};
export default connect(mapStateToProps, mapActiontToProps)(Key);
