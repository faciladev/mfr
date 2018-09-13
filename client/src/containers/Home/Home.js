import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import CountUp from "react-countup";
import Charts from "../../components/Data/Charts";
import Aux from "../../hoc/Aux/Aux";
import Table from "../../components/Table/Table";
import Map from "../../components/Map/Map";
import Filter from "../../components/Filter/Filter";
import Spinner from "../../components/Spinner/Spinner";
import Divider from "../../components/UI/Divider";
import * as actions from "../../store/actions/index";

import sprites from "../../assets/img/sprites.svg";

class Home extends Component {
  state = {
    data: null,
    display: "table"
  };

  toggleView = () => {
    this.setState(
      state =>
        (state.display = this.state.display === "table" ? "map" : "table")
    );
  };

  componentDidMount() {
    //scroll to top
    window.scrollTo(0, 0);
    //Reset filters applied
    this.props.onResetFilter();
    //Fetch facilities with no filters
    this.props.onFetchFacilities();
    //Construct admin hierarchies for tree menu
    if (!this.props.admin_hierarchies) {
      this.props.onFetchAdminHierarchies();
    }
    //Count total facilities
    if (!this.props.all_facility_count) {
      this.props.onFetchAllFacilityCount();
    }
    //Load home page digests if not yet loaded
    if (Object.keys(this.props.facility_type_digest).length === 0) {
      this.props.onFetchDigestFacilityType();
    }
    //Load home page digests if not yet loaded
    if (Object.keys(this.props.operational_status_digest).length === 0) {
      this.props.onFetchDigestOperationalStatus();
    }
    //Load home page digests if not yet loaded
    if (Object.keys(this.props.ownership_status_digest).length === 0) {
      this.props.onFetchDigestOwnershipStatus();
    }
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

    let countUp = (
      <span>
        <Spinner />
      </span>
    );

    if (this.props.all_facility_count) {
      countUp = <CountUp start={15000} end={this.props.all_facility_count} />;
    }
    return (
      <Aux>
        <div className="search-section">
          <h1>
            {countUp}
            Health Facilities Registered
          </h1>

          <form>
            <input type="search" placeholder="Search Facilities" />
            <a href="#">Search</a>
          </form>
        </div>
        <div className="digest">
          <div className="digest__title">DIGEST</div>
          <Divider />
          <div className="digest__content">
            <div className="digest__card">
              {this.props.facility_type_digest.datasets ? (
                <Charts
                  data={this.props.facility_type_digest}
                  label="Facilities By Type"
                  displayTitle="Facilities By Type"
                  legendPosition="bottom"
                  type="pie"
                  displayLegend
                />
              ) : (
                <Spinner />
              )}
            </div>
            <div className="digest__card">
              {this.props.operational_status_digest.datasets ? (
                <Charts
                  data={this.props.operational_status_digest}
                  label="Operational Status"
                  displayTitle="Operational Status"
                  legendPosition="bottom"
                  type="bar"
                  displayLegend
                />
              ) : (
                <Spinner />
              )}
            </div>
            <div className="digest__card">
              {this.props.ownership_status_digest.datasets ? (
                <Charts
                  data={this.props.ownership_status_digest}
                  label="Ownership Status"
                  displayTitle="Ownership Status"
                  legendPosition="bottom"
                  type="pie"
                  displayLegend
                />
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          <NavLink to="/digest" className="digest__more">
            Go to Digest to see all &rarr;
          </NavLink>
          {/* <a href="#" className="digest__more">
            Go to Digest to see all &rarr;
          </a> */}
        </div>
        {facility_view}
        {/* <Data display="table" /> */}
        <div className="geolocator-section">
          <h1>Locate Facilities on a map</h1>
          <h3>
            The Geolocator feature lets you locate health Facilities on a map
          </h3>
          <div>
            <a href="#" className="go-to-api">
              Go to Geolocator
            </a>
          </div>
        </div>
        <div className="api-section">
          <h1>API for developers</h1>
          <h3>Our API docs can be used to build amazing applications.</h3>
          <div>
            <a href="#" className="go-to-api">
              Go to API Docs
            </a>
          </div>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    facilities: state.facilityListingReducer.facilities,
    loading: state.facilityListingReducer.loading,
    node_index: state.adminHierarchiesReducer.node_index,
    all_facility_count: state.facilityListingReducer.all_facility_count,
    filter: state.facilityListingReducer.filter,
    facility_type_digest: state.chartReducer.facility_type_digest,
    operational_status_digest: state.chartReducer.operational_status_digest,
    ownership_status_digest: state.chartReducer.ownership_status_digest,
    admin_hierarchies: state.adminHierarchiesReducer.admin_hierarchies,
    page: state.facilityListingReducer.page
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchFacilities: filter => dispatch(actions.fetchFacilities(filter)),
    onFetchAdminHierarchies: () => dispatch(actions.fetchAdminHierarchies()),
    onFetchAllFacilityCount: () => dispatch(actions.fetchAllFacilityCount()),
    onFetchDigestFacilityType: () => dispatch(actions.digestFacilityType()),
    onFetchDigestOperationalStatus: () =>
      dispatch(actions.digestOperationalStatus()),
    onFetchDigestOwnershipStatus: () =>
      dispatch(actions.digestOwnershipStatus()),
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
)(Home);
