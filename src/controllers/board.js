import {render} from '../utils';
import {unrender} from '../utils';
import {Position} from '../utils';

import Board from '../components/board';
import Sort from '../components/sort';
import TaskList from '../components/task-list';
import Message from '../components/message';
import Button from '../components/button';

import TaskController from './task';


const TASKS_TO_LOAD = 8;

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks.slice().sort((a, b) => a.createdDate - b.createdDate);
    this._tasksCount = TASKS_TO_LOAD;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sort = new Sort();
    this._button = new Button();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    const boardElement = this._board.getElement();
    render(this._container, boardElement, Position.BEFOREEND);

    const tasksWrapperElement = this._taskList.getElement();
    render(boardElement, tasksWrapperElement, Position.AFTERBEGIN);

    if (this._taskList.length === 0 || this._isAllArchive(this._taskList)) {

      const message = new Message(`no-tasks`);
      render(boardElement, message.getElement(), Position.AFTERBEGIN);
      unrender(tasksWrapperElement);

    } else {

      const sortElement = this._sort.getElement();

      sortElement.addEventListener(`click`, (e) => this._onSortLinkClick(e));

      render(boardElement, sortElement, Position.AFTERBEGIN);

      this._renderTaskList();

      render(this._board.getElement(), this._button.getElement(), Position.BEFOREEND);

      this._button.getElement().addEventListener(`click`, (e) => {
        e.preventDefault();
        this._tasksCount = this._taskList.getElement().childElementCount;
        const tasksLeft = this._tasks.length - this._tasksCount;

        this._renderTaskList(this._tasks, this._tasksCount, TASKS_TO_LOAD);
        this._tasksCount += TASKS_TO_LOAD;

        if (tasksLeft < TASKS_TO_LOAD) {
          unrender(this._button.getElement());
        }
      });
    }
  }

  _onSortLinkClick(e) {

    e.preventDefault();
    if (e.target.nodeName !== `A`) {
      return;
    }

    this._taskList.getElement().innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.sort((a, b) => a.dueDate - b.dueDate);
        this._renderTaskList(sortedByDateUpTasks, 0, this._tasksCount);
        break;

      case `date-down`:
        const sortedByDateDownTasks = this._tasks.sort((a, b) => b.dueDate - a.dueDate);
        this._renderTaskList(sortedByDateDownTasks, 0, this._tasksCount);
        break;

      case `default`:
        const sortedByDefaultTasks = this._tasks.sort((a, b) => a.createdDate - b.createdDate);
        this._renderTaskList(sortedByDefaultTasks, 0, this._tasksCount);
        break;
    }
  }

  _isAllArchive() {
    return this._tasks.filter((task) => task.isArchive).length === this._tasks.length;
  }

  _renderTask(task) {
    const taskController = new TaskController(this._taskList, task, this._onDataChange, this._onChangeView);

    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    this._tasks[this._tasks.findIndex((it) => it === oldData)] = newData;

  }

  _renderTaskList(tasks = this._tasks, startIndex = 0, count = this._tasksCount) {
    const endIndex = startIndex + count;
    const tasksToRender = tasks.slice(startIndex, endIndex);

    tasksToRender.forEach((task) => {
      this._renderTask(task);
    });
  }
}


export default BoardController;
