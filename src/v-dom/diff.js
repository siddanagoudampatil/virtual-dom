import render from "./render";

const diffAttrs = (oldAttrs, newAttrs) => {
  const patches = [];

  for (const [attrName, attrValue] of Object.entries(newAttrs)) {
    patches.push((node) => {
      node.setAttribute(attrName, attrValue);
      return node;
    });
  }

  for (const attrName in oldAttrs) {
    if (!(attrName in newAttrs)) {
      patches.push((node) => {
        node.removeAttribute(attrName);
        return node;
      });
    }
  }

  return (node) => {
    for (const patch of patches) {
      patch(node);
    }
    return node;
  };
};

const zip = (arr1, arr2) => {
  const zipped = [];
  const length = Math.min(arr1.length, arr2.length);

  for (let i = 0; i < length; i++) {
    zipped.push([arr1[i], arr2[i]]);
  }

  return zipped;
};

const diffChildren = (oldChildren, newChildren) => {
  const childPatches = [];

  oldChildren.forEach((oldChild, i) => {
    childPatches.push(diff(oldChild, newChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalChild of newChildren.slice(oldChildren.length)) {
    additionalPatches.push((node) => {
      node.appendChild(render(additionalChild));
      return node;
    });
  }

  return (parentNode) => {
    for (const [patch, child] of zip(childPatches, parentNode.childNodes)) {
      patch(child);
    }

    for (const additionalPatch of additionalPatches) {
      additionalPatch(parentNode);
    }

    return parentNode;
  };
};

const diff = (oldTree, newTree) => {
  if (newTree === undefined) {
    return (node) => {
      node.remove();
      return undefined;
    };
  }

  if (typeof oldTree === "string" || typeof newTree === "string") {
    if (oldTree !== newTree) {
      return (node) => {
        const newNode = render(newTree);
        node.replaceWith(newNode);
        return newNode;
      };
    } else {
      return (node) => node;
    }
  }

  if (oldTree.tagName !== newTree.tagName) {
    return (node) => {
      const newNode = render(newTree);
      node.replaceWith(newNode);
      return newNode;
    };
  }

  const patchAttrs = diffAttrs(oldTree.attrs, newTree.attrs);
  const patchChildren = diffChildren(oldTree.children, newTree.children);

  return (node) => {
    patchAttrs(node);
    patchChildren(node);
    return node;
  };
};

export default diff;
