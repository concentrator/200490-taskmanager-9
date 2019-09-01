import AbstractComponent from './abstract-component';

class Button extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return `<button class="load-more" type="button">${this._title}</button>`;
  }
}

export default Button;
