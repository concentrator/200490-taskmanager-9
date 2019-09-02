import AbstractComponent from './abstract-component';

const SORT_ITEMS = [
  {title: `DEFAULT`},
  {title: `DATE up`},
  {title: `DATE down`}
];

class Sort extends AbstractComponent {
  constructor() {
    super();
    this._items = SORT_ITEMS;
  }

  getTemplate() {
    return `
    <div class="board__filter-list">
    ${this._items.map((item) => `
      <a href="${item.url ? item.url : `#`}" class="board__filter">SORT BY ${item.title}</a>`)
      .join(``)}
    </div>`;
  }
}

export default Sort;
