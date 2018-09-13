import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  facility_type_digest: {},
  operational_status_digest: {},
  ownership_status_digest: {},
  charts: null
};

const loadDigestByFacilityType = (state, action) => {
  return updateObject(state, {
    facility_type_digest: action.payload
  });
};

const loadDigestByOperationalStatus = (state, action) => {
  return updateObject(state, {
    operational_status_digest: action.payload
  });
};

const loadDigestByOwnershipStatus = (state, action) => {
  return updateObject(state, {
    ownership_status_digest: action.payload
  });
};

const loadAllChartsSuccess = (state, action) => {
  return updateObject(state, {
    charts: action.payload.charts
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DIGEST_BY_FACILITY_TYPE_LOADED:
      return loadDigestByFacilityType(state, action);
    case actionTypes.DIGEST_BY_OPERATIONAL_STATUS_LOADED:
      return loadDigestByOperationalStatus(state, action);
    case actionTypes.DIGEST_BY_OWNERSHIP_STATUS_LOADED:
      return loadDigestByOwnershipStatus(state, action);
    case actionTypes.LOAD_ALL_CHARTS:
      return loadAllChartsSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
