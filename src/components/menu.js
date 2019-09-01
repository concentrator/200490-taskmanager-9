import AbstractComponent from './abstract-component';


class Menu extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
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
