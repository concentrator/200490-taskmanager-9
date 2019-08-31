import {createElement} from '../utils';


class Sort {
  constructor(items) {
    this._items = items;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
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
