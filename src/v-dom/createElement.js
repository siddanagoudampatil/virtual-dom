const createElement = (tagName, opts) => {
  const element = Object.create(null);

  Object.assign(element, {
    tagName,
    attrs: opts?.attrs || {},
    children: opts?.children || [],
  });

  return element;
};

export default createElement;
