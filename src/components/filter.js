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

const makeFilter = ({title, count, isChecked, isDisabled}) => {
  const label = `${title.charAt(0).toUpperCase()}${title.slice(1)} `;
  return `
  <input
  type="radio"
  id="filter__${title}"
  class="filter__input visually-hidden"
  name="filter"
  ${isChecked ? `checked` : ``}
  ${isDisabled ? `disabled` : ``}/>
  <label for="filter__${title}" class="filter__label">${label}
    <span class="filter__${title}-count">${count}</span>
  </label>`;
};

export const renderFilter = (filterItems, taskList) => {

  const filterMap = {
    all: taskList.length,
    overdue: 0,
    today: 0,
    get favorites() {
      return taskList.filter((item) => item.isFavorite).length;
    },
    get repeating() {
      return taskList.filter((item) => Object.keys(item.repeatingDays).some((day) => item.repeatingDays[day])).length;
    },
    get tags() {
      return taskList.filter((item) => item.tags.size > 0).length;
    },
    get archive() {
      return taskList.filter((item) => item.isArchive).length;
    }
  };

  filterItems.forEach((item) => {
    item.count = filterMap[item.title];
  });

  renderMuliply(filterWrapper, `beforeend`, makeFilter, filterParams, filterItems);
  return filterWrapper;
};
