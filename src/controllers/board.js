import {render} from '../utils';
import {unrender} from '../utils';
import {Position} from '../utils';

import Board from '../components/board';
import Sort from '../components/sort';
import TaskList from '../components/task-list';
import Task from '../components/task';
import TaskEdit from '../components/task-edit';
import Message from '../components/message';
import Button from '../components/button';


const TASKS_TO_LOAD = 8;

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sort = new Sort();
    this._button = new Button();
  }

  init() {
    const boardElement = this._board.getElement();
    render(this._container, boardElement, Position.BEFOREEND);

    const tasksWrapperElement = this._taskList.getElement();
    render(boardElement, tasksWrapperElement, Position.AFTERBEGIN);

    if (this._taskList.length === 0 || this.isAllArchive(this._taskList)) {

      const message = new Message(`no-tasks`);
      render(boardElement, message.getElement(), Position.AFTERBEGIN);
      unrender(tasksWrapperElement);

    } else {

      const sortElement = this._sort.getElement();
      render(boardElement, sortElement, Position.AFTERBEGIN);

      this.renderTaskList();

      render(this._board.getElement(), this._button.getElement(), Position.BEFOREEND);

      this._button.getElement().addEventListener(`click`, (e) => {
        e.preventDefault();
        const tasksCount = this._taskList.getElement().childElementCount;
        const tasksLeft = this._tasks.length - tasksCount;

        this.renderTaskList(tasksCount);

        if (tasksLeft < TASKS_TO_LOAD) {
          unrender(this._button.getElement());
        }
      });
    }

  }

  isAllArchive() {
    return this._tasks.filter((task) => task.isArchive).length === this._tasks.length;
  }

  renderTask(task) {
    const taskComponent = new Task(task);
    const taskEditComponent = new TaskEdit(task);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (evt.target !== taskEditComponent.getElement().querySelector(`.card__text`)) {
          this._taskList.getElement().replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      }
    };

    taskComponent.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._taskList.getElement().replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEditComponent.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (e) => {
        e.preventDefault();
        this._taskList.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._taskList.getElement(), taskComponent.getElement(), Position.BEFOREEND);
  }

  renderTaskList(startIndex = 0) {
    const endIndex = startIndex + TASKS_TO_LOAD;
    const tasks = this._tasks.slice(startIndex, endIndex);

    tasks.forEach((task) => {
      this.renderTask(task);
    });
  }
}


export default BoardController;
