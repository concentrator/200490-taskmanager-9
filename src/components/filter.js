import AbstractComponent from './abstract-component';


class Filter extends AbstractComponent {
  constructor(items) {
    super();
    this._items = items;
  }

  getTemplate() {
    return `
    <section class="main__filter filter container">
    ${this._items.map((item) => (`
      <input
        type="radio"
        id="filter__${item.title}"
        class="filter__input visually-hidden"
        name="filter"
        ${item.isChecked ? `checked` : ``}
        ${item.isDisabled ? `disabled` : ``}/>
      <label for="filter__${item.title}" class="filter__label">${item.title.charAt(0).toUpperCase()}${item.title.slice(1)}
        <span class="filter__${item.title}-count"> ${item.count}</span>
      </label>`.trim())).join(``)}
    </section>`;
  }
}

export default Filter;
