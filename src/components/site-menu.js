import {renderMuliply} from '../utils';
import {renderWrapper} from '../utils';

const MENU_WRAPPER_CLASS = `control__btn-wrap`;

const MENU_ITEMS = [
  {
    id: `new-task`,
    label: `+ ADD NEW TASK`
  },
  {
    id: `task`,
    label: `TASKS`,
    isChecked: true
  },
  {
    id: `statistic`,
    label: `STATISTICS`
  },
];

const menuWrapper = renderWrapper(`section`, MENU_WRAPPER_CLASS);

const menuParams = {
  id: ``,
  label: ``,
  isChecked: false
};

const createMenuItemTemplate = ({id, label, isChecked}) => {
  return `
  <input
    type="radio"
    name="control"
    id="control__${id}"
    class="control__input visually-hidden"
    ${isChecked ? `checked` : ``}/>
  <label for="control__${id}" class="control__label control__label--${id}"
    >${label}</label>`;
};

export const createSiteMenu = () => {
  renderMuliply(menuWrapper, `beforeend`, createMenuItemTemplate, menuParams, MENU_ITEMS);
  return menuWrapper;
};
