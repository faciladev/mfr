import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as actions from "../../store/actions/index";

import Page from "../../hoc/Aux/Page";
import Spinner from "../Spinner/Spinner";
import Map from "../Map/Map";
import Card, { CardContainer } from "../UI/Card";
import Aux from "../../hoc/Aux/Aux";

//Tasks
//1 - fetch layers and fields
//2 - loop through all layers and display fields with values

//Set up
//1 - make layers and fields available in the store
//2 -
class SingleFacilityPage extends Component {
  componentDidMount() {
    //Load single facility
    this.props.onSingleFacilitySelect(this.props.match.params.id);
    //Load facility layer metadata
    this.props.onFetchLayersMetadata();
  }

  componentWillUnmount() {
    //Remove selected facility
    this.props.onSingleFacilityDeselect();
  }

  getHierarchyNodeName = (hierarchy, node_id) => {
    const tree = [...hierarchy];
    while (tree.length) {
      const node = tree.shift();
      if (node.id === node_id) {
        return node.name;
      }
      if (node.sub) {
        tree.unshift(...node.sub);
      }
    }

    return null;
  };

  render() {
    let page = <Page title="" description="" header={<Spinner />} />;

    if (
      this.props.selected_facility &&
      this.props.selected_facility.sites.length === 1
    ) {
      page = (
        <Page
          title={this.props.selected_facility.sites[0].name}
          description="This page has all the available information about this health facility."
        >
          {/* If facility has a location */}
          {this.props.selected_facility.sites[0].lat &&
            this.props.selected_facility.sites[0].long && (
              <Map
                static_type
                viewport={this.props.selected_facility_viewport}
              />
            )}

          <CardContainer>
            {/* If layers_metadata is loaded */}
            {this.props.layers_metadata ? (
              this.props.layers_metadata.map((layer, layer_index) => {
                const fields_with_values = layer.fields.filter(field => {
                  return this.props.selected_facility.sites[0].properties[
                    field.code
                  ];
                });

                return (
                  <Card key={layer.id}>
                    <div className="card__header">
                      <h2>{layer.name}</h2>
                    </div>
                    <ul className="card__body">
                      {fields_with_values.length > 0 ? (
                        fields_with_values.map(field_with_val => {
                          let field_value = null;
                          if (field_with_val.kind === "select_many") {
                            let selects = [];
                            field_with_val.config.options.map(item => {
                              const found = this.props.selected_facility.sites[0].properties[
                                field_with_val.code
                              ].find(code => code === item.code);

                              if (found) {
                                selects.push(item.label);
                              }
                            });

                            field_value = selects.join(", ");
                          } else if (field_with_val.kind === "select_one") {
                            field_value = field_with_val.config.options.find(
                              item => {
                                return (
                                  item.code ===
                                  this.props.selected_facility.sites[0]
                                    .properties[field_with_val.code]
                                );
                              }
                            ).label;
                          } else if (field_with_val.kind === "hierarchy") {
                            console.log(field_with_val);
                            console.log(
                              this.props.selected_facility.sites[0].properties[
                                field_with_val.code
                              ]
                            );
                            const node_id = this.props.selected_facility
                              .sites[0].properties[field_with_val.code];
                            field_value = this.getHierarchyNodeName(
                              field_with_val.config.hierarchy,
                              node_id
                            );
                          } else {
                            field_value = this.props.selected_facility.sites[0]
                              .properties[field_with_val.code];
                          }
                          return (
                            <li key={field_with_val.id}>
                              <strong>{field_with_val.name}</strong>:{" "}
                              {field_value}
                            </li>
                          );
                        })
                      ) : (
                        <li>No content available.</li>
                      )}
                    </ul>
                  </Card>
                );
              })
            ) : (
              <Spinner />
            )}
          </CardContainer>
        </Page>
      );
    } else if (
      this.props.selected_facility &&
      this.props.selected_facility.sites.length !== 1
    ) {
      //Facility not found
      page = (
        <Page
          title="Facility Not Found"
          description="Sorry we couldn't find this facility."
        />
      );
    }

    return page;
  }
}
const mapStateToProps = state => {
  return {
    selected_facility: state.facilityListingReducer.selected_facility,
    selected_facility_viewport:
      state.facilityListingReducer.selected_facility_viewport,
    layers_metadata: state.facilityListingReducer.layers_metadata
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onSingleFacilitySelect: site_id => {
      dispatch(actions.fetchSingleFacility(site_id));
    },
    onSingleFacilityDeselect: () => {
      dispatch(actions.deselectSingleFacility());
    },
    onUpdateSingleFacilityViewport: () => {
      dispatch(actions.updateSingleFacilityViewport());
    },
    onFetchLayersMetadata: () => {
      dispatch(actions.fetchLayersMetadata());
    }
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleFacilityPage)
);
