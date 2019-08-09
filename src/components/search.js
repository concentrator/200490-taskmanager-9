import {render} from '../utils';
import {renderWrapper} from '../utils';

const SEARCH_WRAPPER_CLASS = `main__search search container`;

const SEARCH = {
  placeholder: `START TYPING — SEARCH BY WORD, #HASHTAG OR DATE`,
  label: `Search`
};

const searchWrapper = renderWrapper(`section`, SEARCH_WRAPPER_CLASS);

const createSearchTemplate = ({placeholder, label}) => {
  return `
  <input
    type="text"
    id="search__input"
    class="search__input"
    placeholder="${placeholder}"
    />
  <label class="visually-hidden" for="search__input">${label}</label>`;
};

export const createSearch = () => {
  render(searchWrapper, `beforeend`, createSearchTemplate, SEARCH);
  return searchWrapper;
};
