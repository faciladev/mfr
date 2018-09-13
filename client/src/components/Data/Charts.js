import React, { Component } from "react";
import {} from "react-redux";
import { Bar, Pie } from "react-chartjs-2";

class Chart extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    console.log(this.props);
    return (
      <div className="chart">
        {this.props.type === "pie" ? (
          <Pie
            data={this.props.data}
            height={300}
            options={{
              title: {
                display: this.props.displayTitle,
                text: this.props.label,
                fontSize: 25
              },
              legend: {
                display: this.props.displayLegend,
                position: this.props.legendPosition
              }
            }}
          />
        ) : this.props.type === "bar" ? (
          <Bar
            height={300}
            data={this.props.data}
            options={{
              title: {
                display: this.props.displayTitle,
                text: this.props.label,
                fontSize: 25
              },
              legend: {
                display: this.props.displayLegend,
                position: this.props.legendPosition
              }
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default Chart;
