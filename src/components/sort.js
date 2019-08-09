import {renderMuliply} from '../utils';
import {renderWrapper} from '../utils';

const SORT_WRAPPER_CLASS = `board__filter-list`;

const sortWrapper = renderWrapper(`div`, SORT_WRAPPER_CLASS);

const sortParams = {
  title: ``,
  url: `#`,
};

const createSortItemTemplate = ({title, url}) => {
  return `<a href="${url}" class="board__filter">SORT BY ${title}</a> `;
};

export const createSort = (params) => {
  renderMuliply(sortWrapper, `beforeend`, createSortItemTemplate, sortParams, params);
  return sortWrapper;
};
