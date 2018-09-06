import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  admin_hierarchies: null,
  node_index: null
};

const adminHierarchiesLoaded = (state, action) => {
  return updateObject(state, {
    admin_hierarchies: action.payload.admin_hierarchies
  });
};

const buildNodeIndexFinished = (state, action) => {
  return updateObject(state, {
    node_index: action.payload.node_index
  });
};

const transformedHierarchyForTreeView = (state, action) => {
  return updateObject(state, {
    admin_hierarchies: action.payload.admin_hierarchies
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ADMIN_HIERARCHIES_SUCCESS:
      return adminHierarchiesLoaded(state, action);
    case actionTypes.BUILD_NODE_INDEX_SUCCESS:
      return buildNodeIndexFinished(state, action);
    case actionTypes.TRANSFORM_HIERARCHIES_FOR_TREE_VIEW:
      return transformedHierarchyForTreeView(state, action);
    default:
      return state;
  }
};

export default reducer;
