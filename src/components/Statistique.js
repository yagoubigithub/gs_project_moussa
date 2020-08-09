import React, { Component } from "react";

import randomColor from "randomcolor";

import { connect } from "react-redux";
import { getAllStatistique } from "../store/actions/factureAction";

import { LineChart, Line } from "recharts";
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
class Statistique extends Component {
  state = {
    statistique: [],
  };
  componentWillMount() {
    this.props.getAllStatistique();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.statistique) {
      const statistique = [];

      nextProps.statistique.map((s) => {
        const color = randomColor();
        statistique.push({
          annee: s.annee,
          revenu: s.revenu,
        });
      });
      console.log(statistique);
      this.setState({ statistique });
    }
  }
  render() {
    return (
      <div style={{ backgroundColor: "#fff", paddingBottom: 200 }}>
        <div className="sous-nav-container">
          <h1 style={{ color: "white", marginRight: 100 }}>Statistique</h1>
        </div>
        <h1>Revenu</h1>

        <BarChart width={800} height={550} data={this.state.statistique}>
          <XAxis dataKey="annee" />
          <YAxis dataKey="revenu" />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend />
          <Bar dataKey="revenu" fill="#8384d8" />
        </BarChart>
      </div>
    );
  }
}
const mapActionToProps = (dispatch) => {
  return {
    getAllStatistique: () => dispatch(getAllStatistique()),
  };
};
const mapStateToProps = (state) => {
  return {
    statistique: state.facture.statistique,
  };
};
export default connect(mapStateToProps, mapActionToProps)(Statistique);
