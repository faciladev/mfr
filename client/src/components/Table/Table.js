import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as actions from "../../store/actions/index";
import sprites from "../../assets/img/sprites.svg";
import Spinner from "../Spinner/Spinner";
import axios from "../../axios-resmap";
import { prepareLink } from "../../shared/utility";

const DISPLAYED_FIELDS = {
  ethiopian_national_identifier: "National Id",
  name: "Name",
  "facility_type-1": "Facility Type",
  hmis_code: "HMIS Code",
  "ownership-1": "Ownership",
  // construction_status: "Construction",
  Admin_health_hierarchy: "Admin Unit"
};

class Table extends Component {
  selectFacilityHandler = site_id => {
    this.props.history.push(`/facilities/${site_id}`);
  };

  download = () => {
    const filter = this.props.filter;

    let query_str = "";
    //If there are filters applied use them
    if (Object.keys(filter).length > 0) {
      let query = [];
      for (const field in filter) {
        query.push(filter[field]);
      }
      query_str = `?${query.join("&")}`;
    }

    axios({
      url: prepareLink(`collections/3.csv${query_str}`),
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.csv"); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  render() {
    {
      let table = <Spinner />;

      if (!this.props.loading) {
        //Create table header
        const display_fields_arr = Object.keys(DISPLAYED_FIELDS);
        const table_heading = display_fields_arr.map((field, idx) => (
          <td key={idx}>{DISPLAYED_FIELDS[field]}</td>
        ));

        const table_body = this.props.facilitySites.map((row, idxAbove) => {
          const rowMarkup = display_fields_arr.map((field, idx) => {
            if (field === "name") {
              return <td key={idx}>{row[field]}</td>;
            } else if (field === "Admin_health_hierarchy") {
              return (
                this.props.node_index && (
                  <td key={idx}>
                    {this.props.node_index[row.properties[field]]
                      ? this.props.node_index[row.properties[field]]
                          .hierarchy_text
                      : ""}
                  </td>
                )
              );
            } else {
              return <td key={idx}>{row.properties[field]}</td>;
            }
          });

          return (
            <tr
              onClick={e => this.selectFacilityHandler(row["id"])}
              key={idxAbove}
            >
              {rowMarkup}
            </tr>
          );
        });

        table = (
          <div className="data-table">
            <div className="data-table__title">
              <h2>Facility Listing</h2>
              <span className="data-table__header-icons">
                {/* <svg
                  className="header-icon header-icon__map"
                  onClick={this.props.onToggleView}
                >
                  <use xlinkHref={sprites + "#icon-pin_drop"} />
                </svg> */}
                <svg
                  onClick={this.download}
                  className="header-icon header-icon__download"
                >
                  <use xlinkHref={sprites + "#icon-download"} />
                </svg>
                {/* <svg className="header-icon header-icon__print">
                  <use xlinkHref={sprites + "#icon-print"} />
                </svg> */}
              </span>
            </div>
            <table className="data-table__table">
              <thead className="data-table__thead">
                <tr>{table_heading}</tr>
              </thead>
              <tfoot className="data-table__tfoot">
                <tr>{table_heading}</tr>
              </tfoot>
              <tbody className="data-table__tbody">{table_body}</tbody>
            </table>
            <div className="data-table__pagination">
              <div className="result-info">
                <span>
                  Showing{" "}
                  {this.props.page > 1
                    ? (this.props.page - 1) * 50 + 1
                    : 1 * this.props.page}{" "}
                  to{" "}
                  {this.props.count > 50 &&
                  50 * this.props.page < this.props.count
                    ? 50 * this.props.page
                    : this.props.count}{" "}
                  of {this.props.count} health facilities.
                </span>
              </div>
              <div className="result-paginator">
                <ul className="result-paginator__ul">
                  <li>
                    <svg
                      className="pagination-icon pagination__first-page"
                      onClick={this.props.onFirstPage}
                    >
                      <use xlinkHref={`${sprites}#icon-first_page`} />
                    </svg>
                  </li>
                  <li>
                    <svg
                      className="pagination-icon pagination__prev-page"
                      onClick={this.props.onPrevPage}
                    >
                      <use xlinkHref={`${sprites}#icon-navigate_before`} />
                    </svg>
                  </li>
                  <li>
                    <svg
                      className="pagination-icon pagination__next-page"
                      onClick={this.props.onNextPage}
                    >
                      <use xlinkHref={`${sprites}#icon-navigate_next`} />
                    </svg>
                  </li>
                  <li>
                    <svg
                      className="pagination-icon pagination__last-page"
                      onClick={this.props.onLastPage}
                    >
                      <use xlinkHref={`${sprites}#icon-last_page`} />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }

      return table;
    }
  }
}

const sortDataTable = (field, [...data], direction = true /*ascending*/) => {
  // data.sort((prev, next) => {
  //   if (!direction) {
  //     let tmp = null;
  //     tmp = prev;
  //     prev = next;
  //     next = tmp;
  //   }
  //   if (prev[field] < next[field]) return -1;
  //   if (prev[field] > next[field]) return 1;
  //   return 0;
  // });
  // this.setState({ data });
};
const mapStateToProps = state => {
  return {
    filter: state.facilityListingReducer.filter
  };
};
export default withRouter(connect(mapStateToProps)(Table));
