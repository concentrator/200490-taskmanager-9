export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const getFormattedDate = (date) => {
  if (!date) {
    return ``;
  }
  let f = new Date(date)
    .toLocaleDateString(`en-US`, {month: `long`, day: `numeric`})
    .split(` `);
  [f[0], f[1]] = [f[1], f[0]];
  return f.join(` `);
};
