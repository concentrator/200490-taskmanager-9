import AbstractComponent from './abstract-component';


class Sort extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
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
