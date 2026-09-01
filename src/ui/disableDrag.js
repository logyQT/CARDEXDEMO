const disableDrag = (el) => {
  if (!el) return;
  if (el instanceof NodeList || Array.isArray(el)) {
    el.forEach((child) => disableDrag(child));
    return;
  }
  if (!(el instanceof HTMLElement)) return;
  el.setAttribute("draggable", "false");
  if (el.hasChildNodes()) {
    el.childNodes.forEach((child) => disableDrag(child));
  }
};

export { disableDrag };
