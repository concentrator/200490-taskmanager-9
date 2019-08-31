import {createElement} from '../utils';

const MESSAGE = {
  'no-tasks': `Congratulations, all tasks were completed! To create a new click on
  «add new task» button.`
};


class Message {
  constructor(type) {
    this._type = type;
    this._element = null;
  }

  _getCssClass() {
    let cssClass = ``;
    switch (this._type) {
      case `no-tasks`:
        cssClass = `board__no-tasks`;
        break;
    }
    return cssClass;
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
    return `<p class="${this._getCssClass()}">${MESSAGE[this._type]}</p>`;
  }
}

export default Message;
