import AbstractComponent from './abstract-component';

class Search extends AbstractComponent {
  constructor({placeholder, label}) {
    super();
    this._placeholder = placeholder;
    this._label = label;
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
