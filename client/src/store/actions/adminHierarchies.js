import * as actionTypes from "./actionTypes";
import axios from "../../axios-resmap";
import axios_restricted from "../../axios-resmap-restricted";

import { findNodeParent, prepareLink } from "../../shared/utility";

const fetchAdminHierarchiesSuccess = admin_hierarchies => {
  return {
    type: actionTypes.FETCH_ADMIN_HIERARCHIES_SUCCESS,
    payload: {
      admin_hierarchies
    }
  };
};

const buildNodeIndexSuccess = node_index => {
  return {
    type: actionTypes.BUILD_NODE_INDEX_SUCCESS,
    payload: {
      node_index
    }
  };
};

const transformHierarchiesSuccess = admin_hierarchies => {
  return {
    type: actionTypes.TRANSFORM_HIERARCHIES_FOR_TREE_VIEW,
    payload: {
      admin_hierarchies
    }
  };
};

const buildNodeIndex = hierarchy => {
  const tree = [...hierarchy];
  const node_index = {};
  while (tree.length) {
    const node = tree.shift();
    let parent_found = findNodeParent(hierarchy, node.id);
    const parent_hierarchy = [{ name: node.name, id: node.id }];

    //Build Parent Hierarchy
    while (parent_found) {
      //Root comes first
      parent_hierarchy.unshift({
        name: parent_found.name,
        id: parent_found.id
      });
      parent_found = findNodeParent(hierarchy, parent_found.id);
    }
    node_index[node.id] = {};
    //Build hierarchy in a single text
    node_index[node.id].hierarchy_text = parent_hierarchy.length
      ? parent_hierarchy.map(node => node.name).join(" > ")
      : "";
    node_index[node.id].hierarchy = parent_hierarchy;

    if (node.sub) {
      tree.unshift(...node.sub);
    }
  }

  return node_index;
};

export const transformTreeNodes = (tree, node_map) => {
  tree = Object.assign({}, tree);
  //Loop tree node index map
  for (const node_id in node_map) {
    //pointer to target tree node
    let target_node = tree;

    //Traverse to bottom of tree until the last parent
    for (let i = 0; i < node_map[node_id].hierarchy.length; i++) {
      //If sub field is deleted use nodes field
      const children = target_node.sub ? "sub" : "nodes";
      //Find node to target under the current hierarchy
      target_node = target_node[children].find(
        current_node => node_map[node_id].hierarchy[i].id === current_node.id
      );
    }

    //Add new fields
    target_node.label = target_node.name;
    target_node.nodes = target_node.sub;
    //Remove old fields
    delete target_node.name;
    delete target_node.sub;
  }

  return tree.sub;
};

export const fetchAdminHierarchies = () => {
  const ADMIN_HIERARCHY_LAYER_ID = 45;
  const ADMIN_HIERARCHY_FIELD_ID = 26;
  return dispatch => {
    axios_restricted
      .get(prepareLink("collections/3/layers.json"))
      .then(res => {
        let admin_hierarchies = res.data
          .find(layer => layer.id === ADMIN_HIERARCHY_LAYER_ID)
          .fields.find(field => field.id === ADMIN_HIERARCHY_FIELD_ID).config
          .hierarchy;

        dispatch(fetchAdminHierarchiesSuccess(admin_hierarchies));

        const node_index = buildNodeIndex(admin_hierarchies[0].sub);

        dispatch(buildNodeIndexSuccess(node_index));

        const transformedHierarchies = transformTreeNodes(
          admin_hierarchies[0],
          node_index
        );

        dispatch(transformHierarchiesSuccess(transformedHierarchies));
      })
      .catch(err => {
        console.error(err);
      });
  };
};
