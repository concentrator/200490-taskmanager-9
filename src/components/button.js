import AbstractComponent from './abstract-component';

const TEXT = `load more`;

class Button extends AbstractComponent {
  constructor() {
    super();
    this._title = TEXT;
  }

  getTemplate() {
    return `<button class="load-more" type="button">${this._title}</button>`;
  }
}

export default Button;
