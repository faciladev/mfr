import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  all_facility_count: null,
  facilities: null,
  loading: false,
  page: 1,
  filter: {},
  filter_fields_info: null,
  filter_fields_values: {},
  selected_facility: null,
  selected_facility_viewport: {
    height: 200,
    zoom: 5,
    longitude: null,
    latitude: null
  },
  layers_metadata: null
};

const facilityLoading = (state, action) => {
  return updateObject(state, { loading: true });
};

const facilityLoaded = (state, action) => {
  return updateObject(state, {
    facilities: action.payload.facilities,
    loading: false
  });
};

const allFacilityCountLoaded = (state, action) => {
  return updateObject(state, {
    all_facility_count: action.payload.all_facility_count
  });
};

const pageNumberUpdated = (state, action) => {
  return updateObject(state, {
    page: action.payload.page
  });
};

const filterQueryAdded = (state, action) => {
  const filter = Object.assign({}, state.filter);
  filter[action.payload.field] = action.payload.query;
  return updateObject(state, {
    filter
  });
};

const filterResetRequested = (state, action) => {
  return updateObject(state, {
    filter: {}
  });
};

const filterFieldValueReset = (state, action) => {
  let filter_fields_values = Object.assign({}, state.filter_fields_values);
  Object.keys(filter_fields_values).map(
    key => (filter_fields_values[key] = "")
  );
  return updateObject(state, {
    filter_fields_values
  });
};

const fetchFilterFields = (state, action) => {
  return updateObject(state, {
    filter_fields_info: action.payload.filter_fields_info
  });
};

const setFilterFieldValue = (state, action) => {
  const filter_fields_values = Object.assign({}, state.filter_fields_values);
  filter_fields_values[action.payload.field_id] = action.payload.value;
  return updateObject(state, {
    filter_fields_values
  });
};

const removeFilter = (state, action) => {
  return updateObject(state, {
    filter: action.payload.filter
  });
};

const fetchSingleFacility = (state, action) => {
  return updateObject(state, {
    selected_facility: action.payload.site
  });
};

const deselectSingleFacility = (state, action) => {
  return updateObject(state, {
    selected_facility: null
  });
};

const updateSingleFacilityViewport = (state, action) => {
  return updateObject(state, {
    selected_facility_viewport: action.payload.selected_facility_viewport
  });
};

const fetchLayersMetadata = (state, action) => {
  return updateObject(state, {
    layers_metadata: action.payload.layers_metadata
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_FACILITY_COUNT_SUCCESS:
      return allFacilityCountLoaded(state, action);
    case actionTypes.FETCH_FACILITIES_SUCCESS:
      return facilityLoaded(state, action);
    case actionTypes.FETCH_FACILITIES_START:
      return facilityLoading(state, action);
    case actionTypes.UPDATE_PAGE_NUMBER:
      return pageNumberUpdated(state, action);
    case actionTypes.FILTER_QUERY_ADDED:
      return filterQueryAdded(state, action);
    case actionTypes.FILTER_QUERY_RESET:
      return filterResetRequested(state, action);
    case actionTypes.FILTER_FIELD_VALUE_RESET:
      return filterFieldValueReset(state, action);
    case actionTypes.FETCH_FILTER_FIELDS:
      return fetchFilterFields(state, action);
    case actionTypes.UPDATE_FILTER_FIELDS_VALUE:
      return setFilterFieldValue(state, action);
    case actionTypes.REMOVE_FILTER:
      return removeFilter(state, action);
    case actionTypes.FETCH_SINGLE_FACILITY:
      return fetchSingleFacility(state, action);
    case actionTypes.DESELECT_SINGLE_FACILITY:
      return deselectSingleFacility(state, action);
    case actionTypes.UPDATE_SINGLE_FACILITY_VIEWPORT:
      return updateSingleFacilityViewport(state, action);
    case actionTypes.FETCH_LAYERS_METADATA:
      return fetchLayersMetadata(state, action);

    default:
      return state;
  }
};

export default reducer;
