import React, { Component } from "react";
import {} from "react-redux";
import { Bar, Pie } from "react-chartjs-2";
import Spinner from "../Spinner/Spinner";

class Chart extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    let chart_view = <Spinner />;
    if (this.props.data) {
      chart_view =
        this.props.type === "pie" ? (
          <Pie {...this.props} />
        ) : this.props.type === "bar" ? (
          <Bar {...this.props} />
        ) : null;
    }
    return <div className="chart">{chart_view}</div>;
  }
}

export default Chart;
