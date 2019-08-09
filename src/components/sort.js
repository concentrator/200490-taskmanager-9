import {renderMuliply} from '../utils';
import {renderWrapper} from '../utils';

const SORT_WRAPPER_CLASS = `board__filter-list`;

const SORT_ITEMS = [
  {title: `DEFAULT`},
  {title: `DATE up`},
  {title: `DATE down`}
];

const sortWrapper = renderWrapper(`div`, SORT_WRAPPER_CLASS);

const sortParams = {
  title: ``,
  url: `#`,
};

const createSortItemTemplate = ({title, url}) => {
  return `<a href="${url}" class="board__filter">SORT BY ${title}</a> `;
};

export const createSort = () => {
  renderMuliply(sortWrapper, `beforeend`, createSortItemTemplate, sortParams, SORT_ITEMS);
  return sortWrapper;
};
