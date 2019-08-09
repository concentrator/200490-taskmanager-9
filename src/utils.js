export const render = (container, place, createTemplate, params = ``) => {
  container.insertAdjacentHTML(place, createTemplate(params));
};

export const renderMuliply = (container, place, createTemplate, defaultParams, data) => {
  data.forEach((item) => {
    let params = {};
    if (typeof item === `object`) {
      params = {...defaultParams, ...item};
    }
    render(container, place, createTemplate, params);
  });
};

export const renderWrapper = (elementType, classList) => {
  const wrapper = document.createElement(elementType);
  wrapper.className = classList;
  return wrapper;
};
