import React, { Component } from "react";
import ReactMapGL from "react-map-gl";
import sprites from "../../../assets/img/sprites.svg";

class DataMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 910,
        height: 400,
        latitude: 9.145,
        longitude: 40.4897,
        zoom: 5
      }
    };
  }

  render() {
    return (
      <div className="data-map">
        <div className="data-table__title">
          <h2>Facility Locations</h2>
          <span className="data-table__header-icons">
            <svg
              className="header-icon header-icon__table"
              onClick={this.props.onToggleView}
            >
              <use xlinkHref={sprites + "#icon-grid_on"} />
            </svg>
            <svg className="header-icon header-icon__download">
              <use xlinkHref={sprites + "#icon-download"} />
            </svg>
            <svg className="header-icon header-icon__print">
              <use xlinkHref={sprites + "#icon-print"} />
            </svg>
          </span>
        </div>
        <ReactMapGL
          mapStyle="mapbox://styles/facilo/cjkxyfxkv2vdu2rny3z173eb5"
          mapboxApiAccessToken={
            "pk.eyJ1IjoiZmFjaWxvIiwiYSI6ImNqa3dwemFuODAwZ2gzcXAyN3Q2ZTdxODMifQ.AbRKiVlP6IeUm8aBnYm2FQ"
          }
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
        />
      </div>
    );
  }
}

export default DataMap;
