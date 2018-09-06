import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import TreeMenu from "./TreeMenu";
import sprites from "../../assets/img/sprites.svg";
import Spinner from "../../components/Spinner/Spinner";
import Aux from "../../hoc/Aux/Aux";

//supported filter fields
const SUPPORTED_FILTER_FIELDS = [
  //Operational Status
  { layer_id: 52, id: 111 },
  //Ownership Type
  { layer_id: 45, id: 25 },
  //Facility Type
  { layer_id: 45, id: 30 },
  //24 hour service
  { layer_id: 50, id: 96 },
  //license
  { layer_id: 46, id: 38 }
];

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //or "filter"
      display: "units",
      tree_menu_search: ""
    };
  }

  componentDidMount() {
    this.props.onFetchFilterFields(SUPPORTED_FILTER_FIELDS);
  }

  changeSelection = ({ node }) => {
    this.props.onSelectionChange(
      { code: "Admin_health_hierarchy", kind: "hierarchy" },
      node.id
    );
    this.props.onReloadFacilities();
  };

  toggleDisplay = () => {
    this.setState(
      state => (state.display = state.display === "units" ? "filter" : "units")
    );
  };

  hierarchySelectBox = (
    field,
    options = [],
    has_sub = false,
    opt_group = ""
  ) => {
    let children;
    if (!has_sub) {
      children = field.config.hierarchy;
    } else {
      children = field.sub;
    }

    let option_view = children.map(option => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ));

    //If a nested hierarchy group with optgroup
    if (opt_group) {
      option_view = (
        <optgroup key={opt_group} label={opt_group}>
          {option_view}
        </optgroup>
      );
    }

    options.push(option_view);

    children.every(child => {
      if (child.sub) {
        return this.hierarchySelectBox(
          child,
          options,
          true,
          `Under ${child.name}`
        );
      }
      return child;
    });
    const select = (
      <Aux key={field.id}>
        <label htmlFor={field.id}>{field.name}</label>
        <select
          name={field.id}
          defaultValue=""
          className="filter__select"
          value={this.props.filter_fields_values[field.id]}
          onChange={e => this.filterInputHandler(e, field.id)}
        >
          <option value="" />
          {options}
        </select>
      </Aux>
    );

    return select;
  };

  createInputField = field => {
    //options with options array and their code as the value
    if (field.kind === "select_one" || field.kind === "select_many") {
      let options = field.config.options.map(option => (
        <option key={option.id} value={option.code}>
          {option.label}
        </option>
      ));

      return (
        <Aux key={field.id}>
          <label htmlFor={field.id}>{field.name}</label>
          <select
            name={field.id}
            defaultValue=""
            className="filter__select"
            value={this.props.filter_fields_values[field.id]}
            onChange={e => this.filterInputHandler(e, field.id)}
          >
            <option value="" />
            {options}
          </select>
        </Aux>
      );
    } else if (field.kind === "hierarchy") {
      return this.hierarchySelectBox(field);
    } else if (field.kind === "yes_no") {
      return (
        <Aux key={field.id}>
          <label htmlFor={field.id}>{field.name}</label>
          <input
            type="checkbox"
            value={this.props.filter_fields_values[field.id]}
            onChange={e => this.filterInputHandler(e, field.id)}
          />
        </Aux>
      );
    }
  };

  filterInputHandler = (e, field_id) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.props.onSetFilterFieldValue(field_id, value);
    this.props.onReloadFacilities();
  };

  onTreeMenuSearchChange = tree_menu_search => {
    this.setState({
      tree_menu_search
    });
  };

  render() {
    let filter_fields = [];
    //filter field info available
    if (this.props.filter_fields_info) {
      for (let field of this.props.filter_fields_info) {
        filter_fields.push(this.createInputField(field));
      }
    }
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
            defaultChecked={this.state.display === "units"}
            onClick={this.toggleDisplay}
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
            defaultChecked={this.state.display === "filter"}
            onClick={this.toggleDisplay}
          />
          <label htmlFor="controls_tab" className="tab__menu">
            <svg>
              <use xlinkHref={sprites + "#icon-filter_list"} />
            </svg>
          </label>
          <div id="admin_units" className="tab-content tab__admin-units">
            <TreeMenu
              tree_menu_search={this.state.tree_menu_search}
              onTreeMenuSearchChange={this.onTreeMenuSearchChange}
              filter={this.props.filter}
              dataSource={this.props.admin_hierarchies}
              onSelectionChange={this.changeSelection}
            />
          </div>
          <div id="controls" className="tab-content tab__controls">
            <label htmlFor="search">Search Term</label>
            <input
              name="search"
              type="search"
              placeholder="Search facility name, code, etc"
            />
            {filter_fields}
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
    filter: state.facilityListingReducer.filter,
    filter_fields_info: state.facilityListingReducer.filter_fields_info,
    filter_fields_values: state.facilityListingReducer.filter_fields_values
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
    },
    onFetchFilterFields: supported_filter_fields =>
      dispatch(actions.fetchFilterFields(supported_filter_fields)),
    onSetFilterFieldValue: (field_id, value) =>
      dispatch(actions.setFilterFieldValue(field_id, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
