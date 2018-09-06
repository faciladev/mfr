import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import TreeMenu from "./TreeMenu";
import sprites from "../../../assets/img/sprites.svg";

class DataFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "units" //or "filter"
    };
    this.changeSelection = this.changeSelection.bind(this);
  }

  changeSelection({ node }) {
    this.props.onSelectionChange("Admin_health_hierarchy", node.id);
    this.props.onReloadFacilities();
  }

  toggleDisplay() {
    this.setState(
      state => (state.display = state.display === "units" ? "filter" : "units")
    );
  }

  render() {
    return (
      <div className="data-filter">
        <div className="data-filter__title">
          <h1>Filter Facilities</h1>
        </div>
        <div className="tab">
          <input
            id="admin_unit_tab"
            type="radio"
            name="tabs"
            className="tab-input"
            defaultChecked
          />
          <label htmlFor="admin_unit_tab" className="tab__menu">
            <svg>
              <use xlinkHref={sprites + "#icon-flow-tree"} />
            </svg>
          </label>

          <input
            id="controls_tab"
            type="radio"
            name="tabs"
            className="tab-input"
          />
          <label htmlFor="controls_tab" className="tab__menu">
            <svg>
              <use xlinkHref={sprites + "#icon-filter_list"} />
            </svg>
          </label>
          <div id="admin_units" className="tab-content tab__admin-units">
            <TreeMenu
              filter={this.props.filter}
              dataSource={this.props.admin_hierarchies}
              onSelectionChange={this.changeSelection}
            />
          </div>
          <div id="controls" className="tab-content tab__controls">
            <input type="search" placeholder="Search facility name, code" />
            <select name="type" className="filter__select">
              <option value="">Select Facility Type</option>
              <option value="">Health Post</option>
              <option value="">Health Center</option>
              <option value="">Clinic</option>
              <option value="">Hospital</option>
            </select>
            <select name="type" className="filter__select">
              <option value="">Select Ownership</option>
              <option value="">Government</option>
              <option value="">Private</option>
            </select>
            <select name="type" className="filter__select">
              <option value="">Select Construction Status</option>
              <option value="">Under Construction</option>
              <option value="">Construction Complete</option>
              <option value="">Planned Construction</option>
            </select>
            <select name="type" className="filter__select">
              <option value="">Select Operational Status</option>
              <option value="">Fully Functional</option>
              <option value="">Partially Functional</option>
              <option value="">Non Functional</option>
            </select>
          </div>
          <div className="tab__footer">
            <a href="#" className="btn" onClick={this.props.onResetFilter}>
              Clear
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    admin_hierarchies: state.adminHierarchiesReducer.admin_hierarchies,
    filter: state.facilityListingReducer.filter
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onSelectionChange: (field, node_id) => {
      dispatch(actions.filterData(field, node_id));
    },
    onReloadFacilities: () => {
      dispatch(actions.fetchFacilities());
    },
    onResetFilter: e => {
      e.preventDefault();
      dispatch(actions.resetFilter());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataFilter);
