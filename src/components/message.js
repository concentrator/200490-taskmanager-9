import AbstractComponent from './abstract-component';

const MESSAGE = {
  'no-tasks': `Congratulations, all tasks were completed! To create a new click on
  «add new task» button.`
};


class Message extends AbstractComponent {
  constructor(type) {
    super();
    this._type = type;
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

  getTemplate() {
    return `<p class="${this._getCssClass()}">${MESSAGE[this._type]}</p>`;
  }
}

export default Message;
