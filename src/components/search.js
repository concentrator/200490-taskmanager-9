import {createElement} from '../utils';

class Search {
  constructor({placeholder, label}) {
    this._placeholder = placeholder;
    this._label = label;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
    <section class="main__search search container">
      <input
        type="text"
        id="search__input"
        class="search__input"
        placeholder="${this._placeholder}"
        />
      <label class="visually-hidden" for="search__input">${this._label}</label>
    <section>`;
  }
}

export default Search;
