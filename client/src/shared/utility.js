export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const findNodeParent = (hierarchy, nodeId) => {
  const tree = [...hierarchy];
  while (tree.length) {
    const parent = tree.shift();
    if (parent.sub) {
      for (let child of parent.sub) {
        //If node is found in parent's children
        if (child.id === nodeId) {
          return { id: parent.id, name: parent.name };
        }
      }
      tree.unshift(...parent.sub);
    }
  }
  //No parent found for this node
  return false;
};

export const prepareLink = url => `?url=${encodeURIComponent(url)}`;
