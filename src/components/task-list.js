import AbstractComponent from './abstract-component';


class TaskList extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}

export default TaskList;
