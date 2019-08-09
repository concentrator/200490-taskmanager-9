import {renderMuliply} from '../utils';
import {renderWrapper} from '../utils';

const FILTER_WRAPPER_CLASS = `main__filter filter container`;

const filterWrapper = renderWrapper(`section`, FILTER_WRAPPER_CLASS);

const filterParams = {
  id: ``,
  count: 0,
  isChecked: false,
  isDisabled: false
};

const createFilterTemplate = ({id, count, isChecked, isDisabled}) => {
  const label = `${id.charAt(0).toUpperCase()}${id.slice(1)} `;
  return `
  <input
  type="radio"
  id="filter__${id}"
  class="filter__input visually-hidden"
  name="filter"
  ${isChecked ? `checked` : ``}
  ${isDisabled ? `disabled` : ``}/>
  <label for="filter__${id}" class="filter__label">${label}
    <span class="filter__${id}-count">${count}</span>
  </label>`;
};

export const createFilter = (params) => {
  renderMuliply(filterWrapper, `beforeend`, createFilterTemplate, filterParams, params);
  return filterWrapper;
};
