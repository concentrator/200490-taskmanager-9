import {createElement} from '../utils';

class Menu {
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
    <section class="control__btn-wrap">
      ${this._items.map((item) => (`
      <input
        type="radio"
        name="control"
        id="control__${item.id}"
        class="control__input visually-hidden"
        ${item.isChecked ? `checked` : ``}/>
      <label for="control__${item.id}" class="control__label control__label--${item.id}"
        >${item.label}</label>`.trim())).join(``)}
    </section>`;
  }
}

export default Menu;
