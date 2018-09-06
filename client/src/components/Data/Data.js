import React, { Component } from "react";
import { connect } from "react-redux";

import DataTable from "./DataTable/DataTable";
import DataMap from "./DataMap/DataMap";
import DataFilter from "./DataFilter/DataFilter";
import * as actions from "../../store/actions/index";

import { display_fields } from "./tempDataLoader";
const data = [];
class Data extends Component {
  state = {
    display: this.props.display || "table",
    data,
    display_fields
  };

  componentDidMount() {
    if (!this.props.admin_hierarchies) {
      this.props.onFetchAdminHierarchies();
    }
  }

  toggleView() {
    this.setState(
      state =>
        (state.display = this.state.display === "table" ? "map" : "table")
    );
  }

  render() {
    let facilitySites = [];
    let count,
      page = null;
    if (this.props.facilities) {
      facilitySites = this.props.facilities.sites;
      count = this.props.facilities.count;
      page = this.props.page;
    }
    return this.state.display === "table" ? (
      <div className="data">
        <DataTable
          onToggleView={this.toggleView.bind(this)}
          facilitySites={facilitySites}
          node_index={this.props.node_index}
          display_fields={this.state.display_fields}
          loading={this.props.loading}
          count={count}
          page={page}
          onNextPage={() => {
            this.props.facilities.nextPage &&
              this.props.onFetchNextPage(this.props.facilities.nextPage);
          }}
          onPrevPage={() => {
            this.props.facilities.previousPage &&
              this.props.onFetchPrevPage(this.props.facilities.previousPage);
          }}
          onFirstPage={() => {
            this.props.facilities.previousPage &&
              this.props.onFetchFirstPage(
                this.props.facilities.previousPage.replace(
                  /page=[\d]*/,
                  "page=1"
                )
              );
          }}
          onLastPage={() => {
            this.props.facilities.nextPage &&
              this.props.onFetchFirstPage(
                this.props.facilities.nextPage.replace(
                  /page=[\d]*/,
                  `page=${this.props.facilities.totalPages}`
                )
              );
          }}
        />
        <DataFilter />
      </div>
    ) : (
      <div className="data">
        <DataMap
          onToggleView={this.toggleView.bind(this)}
          data={data}
          isMarkerShown
        />
        <DataFilter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    admin_hierarchies: state.adminHierarchiesReducer.admin_hierarchies,
    facilities: state.facilityListingReducer.facilities,
    node_index: state.adminHierarchiesReducer.node_index,
    loading: state.facilityListingReducer.loading,
    page: state.facilityListingReducer.page
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchAdminHierarchies: () => dispatch(actions.fetchAdminHierarchies()),
    onFetchNextPage: next_url => dispatch(actions.fetchPage(next_url)),
    onFetchPrevPage: prev_url => dispatch(actions.fetchPage(prev_url)),
    onFetchFirstPage: first_url => dispatch(actions.fetchPage(first_url)),
    onFetchLastPage: last_url => dispatch(actions.fetchPage(last_url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Data);
