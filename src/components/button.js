import {createElement} from '../utils';

class Button {
  constructor(title) {
    this._title = title;
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
    return `<button class="load-more" type="button">${this._title}</button>`;
  }
}

export default Button;
