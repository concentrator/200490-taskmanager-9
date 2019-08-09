import {renderMuliply} from '../utils';
import {renderWrapper} from '../utils';

const FILTER_WRAPPER_CLASS = `main__filter filter container`;

const FILTER_ITEMS = [
  {
    id: `all`,
    count: 13,
    isChecked: true
  },
  {
    id: `overdue`,
    isDisabled: true
  },
  {
    id: `today`,
    isDisabled: true
  },
  {
    id: `favorites`,
    count: 1,
  },
  {
    id: `repeating`,
    count: 1,
  },
  {
    id: `tags`,
    count: 1,
  },
  {
    id: `archive`,
    count: 115,
  }
];

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

export const createFilter = () => {
  renderMuliply(filterWrapper, `beforeend`, createFilterTemplate, filterParams, FILTER_ITEMS);
  return filterWrapper;
};
