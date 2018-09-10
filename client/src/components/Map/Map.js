import React, { Component } from "react";
import ReactMapGL, { Marker, StaticMap } from "react-map-gl";
import sizeMe from "react-sizeme";
import sprites from "../../assets/img/sprites.svg";

class Map extends Component {
  render() {
    const MapType = this.props.static_map ? StaticMap : ReactMapGL;
    return (
      <div className="map">
        <MapType
          mapStyle="mapbox://styles/facilo/cjkxyfxkv2vdu2rny3z173eb5"
          mapboxApiAccessToken={
            "pk.eyJ1IjoiZmFjaWxvIiwiYSI6ImNqa3dwemFuODAwZ2gzcXAyN3Q2ZTdxODMifQ.AbRKiVlP6IeUm8aBnYm2FQ"
          }
          {...this.props.size}
          {...this.props.viewport}
          // onViewportChange={viewport =>
          //   this.props.onViewportChangeHandler(viewport)
          // }
        >
          <Marker
            latitude={this.props.viewport.latitude}
            longitude={this.props.viewport.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <svg className="">
              <use xlinkHref={sprites + "#icon-location-pin"} />
            </svg>
          </Marker>
        </MapType>
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: true })(Map);
