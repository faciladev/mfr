import * as actionTypes from "./actionTypes";
import axios from "../../axios-resmap";
import axios_restricted from "../../axios-resmap-restricted";
import { prepareLink } from "../../shared/utility";

export const fetchFacilitiesStart = () => {
  return {
    type: actionTypes.FETCH_FACILITIES_START
  };
};

export const fetchFacilitiesSuccess = facilities => {
  return {
    type: actionTypes.FETCH_FACILITIES_SUCCESS,
    payload: {
      facilities
    }
  };
};

export const fetchAllFacilityCountSuccess = all_facility_count => {
  return {
    type: actionTypes.FETCH_ALL_FACILITY_COUNT_SUCCESS,
    payload: {
      all_facility_count
    }
  };
};

export const updatePageNumber = url => {
  return {
    type: actionTypes.UPDATE_PAGE_NUMBER,
    payload: {
      page: url
        ? url.match(/page=([\d]*)/)
          ? url.match(/page=([\d]*)/)[1]
          : 1
        : 1
    }
  };
};

export const fetchAllFacilityCount = () => {
  return dispatch => {
    axios
      .get(prepareLink("collections/3/count.json"))
      .then(res => {
        dispatch(fetchAllFacilityCountSuccess(res.data));
      })
      .catch(err => {
        console.error(err);
      });
  };
};

const fetchFilterFieldsSuccess = fields_info => {
  return {
    type: actionTypes.FETCH_FILTER_FIELDS,
    payload: {
      filter_fields_info: fields_info
    }
  };
};

export const fetchFilterFields = fields => {
  return dispatch => {
    axios_restricted
      .get(prepareLink("collections/3/layers.json"))
      .then(res => {
        let fields_info = [];
        for (let field of fields) {
          let field_info = res.data
            .find(layer => layer.id === field.layer_id)
            .fields.find(item => item.id === field.id);
          field_info.value = "";
          //Add details of a filter field
          fields_info.push(field_info);
        }
        dispatch(fetchFilterFieldsSuccess(fields_info));
      })
      .catch(err => {
        console.error(err);
      });
  };
};

export const fetchFacilities = () => {
  return (dispatch, getState) => {
    //Get filter from updated state
    const filter = getState().facilityListingReducer.filter;

    let query_str = "";
    //If there are filters applied use them
    if (Object.keys(filter).length > 0) {
      let query = [];
      for (const field in filter) {
        query.push(filter[field]);
      }
      query_str = `?${query.join("&")}`;
    }
    dispatch(updatePageNumber());
    dispatch(fetchFacilitiesStart());

    axios
      .get(prepareLink(`collections/3.json${query_str}`))
      .then(res => {
        dispatch(fetchFacilitiesSuccess(res.data));
      })
      .catch(err => {
        console.error(err);
      });
  };
};

export const fetchPage = url => {
  return dispatch => {
    dispatch(fetchFacilitiesStart());
    axios
      .get(prepareLink(`collections/3.json${url.substring(url.indexOf("?"))}`))
      .then(res => {
        dispatch(updatePageNumber(url));
        dispatch(fetchFacilitiesSuccess(res.data));
      })
      .catch(err => {
        console.error(err);
      });
  };
};

const addFilterQuery = (field, query) => {
  return {
    type: actionTypes.FILTER_QUERY_ADDED,
    payload: {
      field,
      query
    }
  };
};

export const filterData = (field, value) => {
  return dispatch => {
    if (value === "") return dispatch(removeFilter(field.code));
    if (field.kind === "hierarchy") {
      dispatch(addFilterQuery(field.code, `${field.code}[under]=${value}`));
    } else if (field.kind === "select_one" || field.kind === "select_many") {
      dispatch(addFilterQuery(field.code, `${field.code}=${value}`));
    } else if (field.kind === "yes_no") {
      dispatch(addFilterQuery(field.code, `${field.code}=${value}`));
    }
  };
};

export const removeFilter = field_code => {
  return (dispatch, getState) => {
    const filter = getState().facilityListingReducer.filter;
    delete filter[field_code];
    dispatch({
      type: actionTypes.REMOVE_FILTER,
      payload: {
        filter
      }
    });
  };
};

const filterQueryReset = () => {
  return {
    type: actionTypes.FILTER_QUERY_RESET
  };
};

const filterFieldValueReset = filter_fields_values => {
  return {
    type: actionTypes.FILTER_FIELD_VALUE_RESET
  };
};

export const resetFilter = () => {
  return (dispatch, getState) => {
    const filter = getState().facilityListingReducer.filter;
    if (Object.keys(filter).length === 0) return;

    dispatch(filterFieldValueReset());

    dispatch(filterQueryReset());
    dispatch(fetchFacilities());
  };
};

export const setFilterFieldValue = (field_id, value) => {
  return (dispatch, getState) => {
    //get field from field id
    const field = getState().facilityListingReducer.filter_fields_info.find(
      field => field.id === field_id
    );
    //update data
    dispatch(filterData(field, value));
    //update ui
    dispatch({
      type: actionTypes.UPDATE_FILTER_FIELDS_VALUE,
      payload: {
        field_id,
        value
      }
    });
  };
};
