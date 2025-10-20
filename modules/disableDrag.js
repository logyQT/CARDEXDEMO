/**
 * Disables drag-and-drop for the specified element and its children.
 * @param {*} el - The element or collection of elements to disable drag-and-drop for.
 * @returns {void}
 */

const disableDrag = (el) => {
  if (!el) return;
  if (el instanceof NodeList || Array.isArray(el)) {
    // NodeList or Array
    el.forEach((child) => disableDrag(child));
    return;
  } else {
    // Single element
    if (!(el instanceof HTMLElement)) return;
  }
  el.setAttribute("draggable", "false");
  if (el.hasChildNodes()) {
    el.childNodes.forEach((child) => disableDrag(child));
  }
};

export { disableDrag };
