import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";
import Table from "../../components/Table/Table";
import Map from "../../components/Map/Map";
import Filter from "../../components/Filter/Filter";
import Page from "../../hoc/Aux/Page";

class SearchFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "table"
    };
  }

  componentDidMount() {
    this.props.onResetFilter();
    if (!this.props.admin_hierarchies) {
      this.props.onFetchAdminHierarchies();
    }
    this.props.onFetchAllFacilityCount();
    this.props.onFetchFacilities();
  }

  toggleView = () => {
    this.setState(
      state =>
        (state.display = this.state.display === "table" ? "map" : "table")
    );
  };

  render() {
    let facilitySites = [];
    let count,
      page = null;
    if (this.props.facilities) {
      facilitySites = this.props.facilities.sites;
      count = this.props.facilities.count;
      page = this.props.page;
    }
    const facility_view =
      this.state.display === "table" ? (
        <div className="data">
          <Table
            onToggleView={this.toggleView}
            facilitySites={facilitySites}
            node_index={this.props.node_index}
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
          <Filter />
        </div>
      ) : (
        <div className="data">
          <Map
            onToggleView={this.toggleView}
            data={facilitySites}
            isMarkerShown
          />
          <Filter />
        </div>
      );
    return (
      <Page
        title="Search Facilities"
        description="Search facilities using the filter aside."
      >
        {facility_view}
      </Page>
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
    onFetchFacilities: filter => dispatch(actions.fetchFacilities(filter)),
    onFetchAllFacilityCount: () => dispatch(actions.fetchAllFacilityCount()),
    onFetchAdminHierarchies: () => dispatch(actions.fetchAdminHierarchies()),
    onFetchNextPage: next_url => dispatch(actions.fetchPage(next_url)),
    onFetchPrevPage: prev_url => dispatch(actions.fetchPage(prev_url)),
    onFetchFirstPage: first_url => dispatch(actions.fetchPage(first_url)),
    onFetchLastPage: last_url => dispatch(actions.fetchPage(last_url)),
    onResetFilter: () => dispatch(actions.resetFilter())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchFacility);
