const renderElement = (ElementNode) => {
  const { tagName, attrs, children } = ElementNode;

  const element = document.createElement(tagName);

  for (const [attrName, attrValue] of Object.entries(attrs)) {
    element.setAttribute(attrName, attrValue);
  }

  for (const child of children) {
    element.appendChild(render(child));
  }

  return element;
};

const render = (node) => {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }

  return renderElement(node);
};

export default render;
