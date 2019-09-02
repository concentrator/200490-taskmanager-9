import AbstractComponent from './abstract-component';

const MENU_ITEMS = [
  {
    id: `new-task`,
    label: `+ ADD NEW TASK`
  },
  {
    id: `task`,
    label: `TASKS`,
    isChecked: true
  },
  {
    id: `statistic`,
    label: `STATISTICS`
  },
];

class Menu extends AbstractComponent {
  constructor() {
    super();
    this._items = MENU_ITEMS;
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
