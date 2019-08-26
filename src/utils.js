const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

// export const render = (container, place, createTemplate, params = ``) => {
//   container.insertAdjacentHTML(place, createTemplate(params));
// };

const unrender = (element) => {
  if (element) {
    element.remove();
  }
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
